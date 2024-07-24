"use server"

import { auth } from "@/auth"
import { openai } from "@/lib/openai"
import { prisma } from "@/lib/prisma"
import { Subtopic, Topic } from "@/types"
import { Resource } from "@prisma/client"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function addRoadmap(formData: FormData) {
  try {
    const session = await auth()

    if (!session?.user) {
      return null
    }

    const user_prompt = formData.get("user_prompt") as string
    const image = formData.get("image") as File | null

    const prompt = `Generate a JSON object that represents a roadmap. Each object should have the following fields:
    - "title": a string representing the question.
    - "topics": an array of json objects that represent topics within the roadmap.
  
    Here is an example of the desired output:
  
    {
      "title": "GCSE Mathematics",
      "topics": [
        {
          "title": "Algebra",
          "subtopics": [
            {
              "title": "Solving Equations",
              "resources": [
                {
                  "name": "BBC Bitesize - Solving Equations",
                  "url": "https://www.bbc.co.uk/bitesize/guides/zp48w6f/revision/1"
                },
                {
                  "name": "Khan Academy - Solving Linear Equations",
                  "url": "https://www.khanacademy.org/math/algebra/x2f8bb4f830c9fb89:solving-linear-equations-x2f8bb4f830c9fb89"
                }
              ]
            },
            {
              "title": "Quadratic Equations",
              "resources": [
                {
                  "name": "BBC Bitesize - Quadratic Equations",
                  "url": "https://www.bbc.co.uk/bitesize/guides/zgvt4j6/revision/1"
                },
                {
                  "name": "Khan Academy - Quadratic Formula",
                  "url": "https://www.khanacademy.org/math/algebra/x2f8bb4f830c9fb89:quadratic-equations-functions"
                }
              ]
            }
          ]
        },
        {
          "title": "Geometry",
          "subtopics": [
            {
              "title": "Area and Perimeter",
              "resources": [
                {
                  "name": "BBC Bitesize - Area and Perimeter",
                  "url": "https://www.bbc.co.uk/bitesize/guides/zgg4xfr/revision/1"
                },
                {
                  "name": "Khan Academy - Area and Perimeter",
                  "url": "https://www.khanacademy.org/math/geometry-basic-geo/basic-geo-area-and-perimeter"
                }
              ]
            },
            {
              "title": "Pythagorean Theorem",
              "resources": [
                {
                  "name": "BBC Bitesize - Pythagorean Theorem",
                  "url": "https://www.bbc.co.uk/bitesize/guides/zfpsfg8/revision/1"
                },
                {
                  "name": "Khan Academy - Pythagorean Theorem",
                  "url": "https://www.khanacademy.org/math/basic-geo/basic-geo-pythagorean-theorem"
                }
              ]
            }
          ]
        }
      ]
    }
  
    Please generate as many topics and subtopics as is necessary.
    
    The topics, subtopics and resources of the roadmap is to be based on THIS prompt: ${user_prompt}
  
    Generate AS MANY topics and subtopics and resources as is necessary to cover the content of the prompt.
    Despite the example prompt only containing two topics, two subtopics and two resources, you should generate as many as is necessary to cover the content of the prompt.
    Make sure there is a considerable amount of variety in the topics and subtopics and resources you generate.
    The amount of topics and subtopics should ensure that the roadmap is comprehensive and covers the content of the prompt in a detailed manner.
    The resources should be up-to-date and relevant to the topics and subtopics they are associated with.
    Ensure that the links are correct and not broken.
    Please do not simplify the roadmap.
    The roadmap should be detailed and comprehensive.
    The resources should be YouTube videos and articles. Do not include any resources that must be paid for (e.g Courses).
    Ensure that the resources are only from the latest possible year that you are trained on. If the article is dated for a previous year, do not include it.
  
    Ensure that the amount of tokens in the output is BELOW 4000. If you must sacrifice some detail to ensure this, please do so.
  
    DO NOT INCLUDE TRIPLE BACKTICKS IN THE RESPONSE.
  
    Do not include any other response type. Respond purely with the JSON array, nothing else.
    Do not include any formatting.
    `

    let roadmapData = null

    const response = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o",
      max_tokens: 4000,
    })

    if (response.choices[0].message.content) {
      console.log("c: ", response.choices[0].message.content)
      roadmapData = JSON.parse(response.choices[0].message.content)
    }

    if (!roadmapData || !roadmapData.topics) {
      console.error("Invalid roadmap data structure:", roadmapData)
      throw new Error("Invalid roadmap data")
    }

    roadmapData.topics.forEach((topic: Topic) => {
      if (!topic.subtopics) {
        console.error(`Topic ${topic.title} is missing subtopics`, topic)
        throw new Error(`Topic ${topic.title} is missing subtopics`)
      }
      topic.subtopics.forEach((subtopic: Subtopic) => {
        if (!subtopic.resources) {
          console.error(
            `Subtopic ${subtopic.title} is missing resources`,
            subtopic
          )
          throw new Error(`Subtopic ${subtopic.title} is missing resources`)
        }
      })
    })

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

    const roadmap = await prisma.roadmap.create({
      data: {
        title: roadmapData.title,
        image: imageUrl,
        user_id: session.user.id as string,
        topics: {
          create: roadmapData.topics.map((topic: Topic) => ({
            title: topic.title,
            subtopics: {
              create: topic.subtopics.map((subtopic: Subtopic) => ({
                title: subtopic.title,
                resources: {
                  create: subtopic.resources.map((resource: Resource) => ({
                    name: resource.name,
                    url: resource.url,
                  })),
                },
              })),
            },
          })),
        },
      },
    })

    return roadmap
  } catch (error) {
    console.log(error)

    return null
  }
}

export async function getRoadmap(roadmap_id: string) {
  try {
    const roadmap = await prisma.roadmap.findUnique({
      where: {
        id: roadmap_id,
      },
      include: {
        topics: {
          include: {
            subtopics: {
              include: {
                resources: true,
              },
            },
          },
        },
      },
    })

    return roadmap
  } catch (error) {
    return null
  }
}

export async function getUserRoadmaps() {
  const session = await auth()

  console.log(session?.user.id)

  if (!session?.user) {
    return null
  }

  try {
    const roadmaps = await prisma.roadmap.findMany({
      where: {
        user_id: session?.user.id,
      },
      include: {
        topics: {
          include: {
            subtopics: {
              include: {
                resources: true,
              },
            },
          },
        },
      },
    })

    console.log(roadmaps)

    return roadmaps
  } catch (error) {
    return null
  }
}

export async function setComplete(topicId: string) {
  try {
    if (!topicId) {
      throw new Error("No roadmap id provided")
    }

    const topic = await prisma.subtopic.findUnique({
      where: {
        id: topicId,
      },
    })

    if (!topic) {
      return null
    }

    const updatedTopic = await prisma.subtopic.update({
      where: {
        id: topicId,
      },
      data: {
        isCompleted: !topic.isCompleted,
      },
    })

    return updatedTopic
  } catch (error) {
    return null
  }
}
