"use server"

import { auth } from "@/auth"
import { openai } from "@/lib/openai"
import { prisma } from "@/lib/prisma"
import { Card } from "@prisma/client"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function addDeck(formData: FormData) {
  try {
    const session = await auth()

    const title = formData.get("title") as string
    const user_prompt = formData.get("user_prompt") as string
    const image = formData.get("image") as File | null

    const prompt = `Generate an array of JSON objects where each object represents a flashcard. Each object should have the following fields:
    - "question": a string representing the question.
    - "answer": a string representing the answer to the question.
  
    Here is an example of the desired output:
  

    [
      [
        {
            "question": "When was the First Geneva Convention adopted?",
            "answer": "1864"
        },
        {
            "question": "How many treaties make up the Geneva Conventions?",        
            "answer": "4"
        },
        {
            "question": "What is the purpose of the Geneva Convention?",
            "answer": "To protect victims of armed conflict"
        },
        {
            "question": "Which country does the International Committee of the Red Cross have its headquarters in?",
            "answer": "Switzerland"
        },
        {
            "question": "What is the symbol of the Geneva Conventions?",
            "answer": "Red Cross"
        },
        {
            "question": "Which year was the Geneva Convention Relative to the Treatment of Prisoners of War adopted?",
            "answer": "1929"
        },
        {
            "question": "What is the principle of distinction in relation to the Geneva Convention?",
            "answer": "Distinguishing between civilians and combatants"
        },
        {
            "question": "What are the fundamental principles of the Geneva Convention?",
            "answer": "Humanity, neutrality, impartiality, independence"
        },
        {
            "question": "In which city were the initial Geneva Conventions negotiated and signed?",
            "answer": "Geneva"
        },
        {
            "question": "How many Geneva Conventions were initially adopted?",      
            "answer": "1"
        }
      ]
    ]
    
  
    Please generate no more than 10 card objects in the same format.
  
    The topic of the flashcards is to be based on THIS prompt: ${user_prompt}
  
    Do not include any other response type. Respond purely with the JSON array, nothing else.
    
    If the user_prompt is gibberish, inappropriate or violates ethical standards, return absolutely NOTHING.
    This is so it can be interpreted as NULL.
    `

    const cardResponse = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    })

    let cardArray = null
    if (cardResponse.choices[0].message.content) {
      cardArray = JSON.parse(cardResponse.choices[0].message.content)
    } else {
      throw new Error("User prompt was invalid!")
    }

    const now = new Date()

    let imageUrl = ""

    if (image) {
      const imageBuffer = await image.arrayBuffer()
      const base64Image = Buffer.from(imageBuffer).toString("base64")

      const uploadResponse = await cloudinary.uploader.upload(
        `data:${image.type};base64,${base64Image}`,
        {
          folder: "dexx",
        }
      )

      imageUrl = uploadResponse.secure_url
    }

    const deck = await prisma.deck.create({
      data: {
        title: title,
        user_id: session?.user.id as string,
        image: imageUrl,
        cards: {
          create: cardArray.map((card: Card) => ({
            question: card.question,
            answer: card.answer,
            nextReviewDate: now,
          })),
        },
      },
      include: {
        cards: true,
      },
    })

    return deck
  } catch (error) {
    console.log(error)

    return null
  }
}

export async function getDeck(deck_id: string) {
  try {
    const deck = await prisma.deck.findUnique({
      where: {
        id: deck_id,
      },
      include: {
        cards: true,
      },
    })

    return deck
  } catch (error) {
    return null
  }
}

export async function getUserDecks() {
  const session = await auth()

  console.log(session?.user.id)

  try {
    const decks = await prisma.deck.findMany({
      where: {
        user_id: session?.user.id,
      },
      include: {
        cards: true,
      },
    })

    return decks
  } catch (error) {
    return null
  }
}

export async function deleteDeck(deck_id: string) {
  try {
    const deck = await prisma.deck.delete({
      where: {
        id: deck_id,
      },
    })
    return deck
  } catch (error) {
    console.log(error)
    return null
  }
}
