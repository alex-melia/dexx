"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { v2 as cloudinary } from "cloudinary"
import { extractPublicId } from "cloudinary-build-url"
import { hash } from "bcryptjs"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function signUp(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const image = formData.get("image") as File | null

  try {
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

    const hashedPassword = await hash(password.trim(), 10)

    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        image: imageUrl,
      },
    })

    return newUser
  } catch (error) {
    console.log(error)

    return null
  }
}

export async function updateUser(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const image = formData.get("image") as File | null

  try {
    const session = await auth()

    if (!session?.user) {
      throw new Error("No user")
    }

    let imageUrl = ""

    if (image) {
      if (session?.user.image) {
        const publicId = extractPublicId(session?.user.image)
        await cloudinary.uploader.destroy(publicId)
      }
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

    const updatedUser = await prisma.user.update({
      where: {
        id: session?.user.id,
      },
      data: {
        name: name,
        email: email,
        image: imageUrl,
      },
    })

    return updatedUser
  } catch (error) {
    return null
  }
}
