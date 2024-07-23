"use client"

import { addRoadmap } from "@/actions/Roadmap"
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
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  prompt: z.string().min(1, { message: "Prompt cannot be empty" }),
  image: z.instanceof(File).optional(),
})

export default function RoadmapForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      image: undefined,
    },
  })

  const router = useRouter()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData()
    formData.append("user_prompt", values.prompt)
    if (values.image) {
      formData.append("image", values.image)
    }
    const result = await addRoadmap(formData)

    if (!result) {
      toast({
        title: "Roadmap Created",
      })
    } else {
      router.refresh()
    }
  }

  return (
    <Card className="border-0 shadow-none">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt</FormLabel>
                  <FormControl>
                    <Input
                      type="name"
                      placeholder="I want to be a ML Engineer"
                      {...field}
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
              <Button className="bg-blue-500 hover:bg-blue-600" type="submit">
                Generate
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
