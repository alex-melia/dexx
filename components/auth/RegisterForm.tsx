"use client"

import { z } from "zod"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { Form } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { toast } from "../ui/use-toast"
import { signUp } from "@/actions/User"

const formSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  image: z.instanceof(File).optional(),
})

export default function RegisterForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      image: undefined,
    },
  })

  const router = useRouter()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData()
    formData.append("name", values.name)
    formData.append("email", values.email)
    formData.append("password", values.password)
    if (values.image) {
      formData.append("image", values.image)
    }
    const result = await signUp(formData)

    if (!result) {
      toast({
        title: "Sign Up Unsuccessful",
      })
    } else {
      router.push("/login")
    }
  }

  return (
    <Card className="max-w-[400px] w-full">
      <CardHeader className="space-y-2">
        <CardTitle className="text-center">Create an Account</CardTitle>
        <CardDescription className="text-md text-center">
          Enter a username, email and password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input type="name" placeholder="johndoe123" {...field} />
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
                      type="email"
                      placeholder="example@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
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
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>
            )}
            <div className="w-full flex justify-center">
              <Button className="bg-blue-500 hover:bg-blue-600" type="submit">
                Create Account
              </Button>
            </div>
            <Link href="/login">
              <p className="mt-4 text-center">
                Already have an account?{" "}
                <strong className="text-blue-500 hover:text-blue-600">
                  Log In
                </strong>
              </p>
            </Link>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
