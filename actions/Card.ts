"use server"

import { prisma } from "@/lib/prisma"
import { Rating } from "@prisma/client"

export async function addCard(
  deck_id: string,
  question: string,
  answer: string
) {
  try {
    const card = await prisma.card.create({
      data: {
        deck_id: deck_id,
        question: question,
        answer: answer,
      },
    })

    return card
  } catch (error) {
    console.log(error)

    return null
  }
}

export async function updateCard(
  card_id: string,
  question: string,
  answer: string
) {
  try {
    const updatedCard = await prisma.card.update({
      where: {
        id: card_id,
      },
      data: {
        question: question,
        answer: answer,
        nextReviewDate: new Date(),
      },
    })

    return updatedCard
  } catch (error) {
    return null
  }
}

export async function deleteCard(card_id: string) {
  try {
    const deletedCard = await prisma.card.delete({
      where: {
        id: card_id,
      },
    })

    return deletedCard
  } catch (error) {
    return null
  }
}

export async function addReview(card_id: string, rating: Rating) {
  try {
    const now = new Date()

    const card = await prisma.card.findUnique({
      where: {
        id: card_id,
      },
    })

    if (!card) return

    const nextReviewDate = new Date(now)

    switch (rating) {
      case Rating.VERY_EASY:
        nextReviewDate.setDate(now.getDate() + 7) // +1 week
        break
      case Rating.EASY:
        nextReviewDate.setDate(now.getDate() + 1) // +1 day
        break
      case Rating.HARD:
        nextReviewDate.setHours(now.getHours() + 1) // +1 hour
        break
      case Rating.VERY_HARD:
        nextReviewDate.setMinutes(now.getMinutes() + 1) // +1 minute
        break
      default:
        throw new Error("Invalid rating")
    }

    await prisma.card.update({
      where: { id: card_id },
      data: { nextReviewDate: nextReviewDate, rating: rating },
    })

    return
  } catch (error) {
    console.log(error)

    return null
  }
}
