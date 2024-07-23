"use client"

import { useState } from "react"
import { User } from "next-auth"
import { z } from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"

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
import { updateUser } from "@/actions/User"

type UpdateUserFormProps = {
  user: User
}

const formSchema = z.object({
  name: z.string(),
  email: z.string(),
  image: z.instanceof(File).optional(),
})

export default function UpdateUserForm({ user }: UpdateUserFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name as string,
      email: user.email as string,
      image: undefined,
    },
  })

  const router = useRouter()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData()
    formData.append("name", values.name)
    formData.append("email", values.email)
    if (values.image) {
      formData.append("image", values.image)
    }
    const data = await updateUser(formData)

    if (!data) {
      toast({
        title: "User Update Failed",
      })
    } else {
      toast({
        title: "User Updated",
      })
      router.refresh()
    }
  }

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="border-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>
            )}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={user.name as string}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={user.email as string}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
