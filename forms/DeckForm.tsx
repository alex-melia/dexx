"use client"

import { useState, useTransition } from "react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { addDeck } from "@/actions/Deck"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  title: z
    .string()
    .min(4, { message: "Title must be between 4 and 32 characters" })
    .max(32, { message: "Title must be between 4 and 32 characters" }),
  prompt: z.string().min(1, { message: "Prompt cannot be empty" }),
  image: z.instanceof(File).optional(),
})

export default function DeckForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      prompt: "",
      image: undefined,
    },
  })

  const router = useRouter()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData()
    formData.append("title", values.title)
    formData.append("user_prompt", values.prompt)
    if (values.image) {
      formData.append("image", values.image)
    }
    startTransition(async () => {
      const result = await addDeck(formData)

      if (!result) {
        toast({
          title: "Failed Deck Create",
        })
      } else {
        toast({
          title: "Deck Created",
        })
        router.refresh()
      }
    })
  }
  return (
    <Card className="border-0 shadow-none">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      type="name"
                      placeholder="e.g Cell Terminology"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt</FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="e.g I want to know about human cell anatomy"
                      {...field}
                      className="w-full p-2 border rounded-md"
                      style={{ resize: "none" }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Controller
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={(e: any) => {
                        field.onChange(e.target.files[0])
                        const file = e.target.files?.[0]
                        if (file) {
                          field.onChange(file)
                          const reader = new FileReader()
                          reader.onloadend = () => {
                            setImagePreview(reader.result as string)
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {imagePreview && (
              <div className="flex justify-center mb-4">
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="w-24 h-24 object-cover"
                />
              </div>
            )}
            <div className="w-full flex justify-center">
              <Button
                className="bg-blue-500 text-center hover:bg-blue-600 w-[200px]"
                type="submit"
              >
                {isPending ? "Generating..." : "Generate"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
