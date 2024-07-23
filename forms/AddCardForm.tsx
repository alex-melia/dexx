"use client"

import { addCard } from "@/actions/Card"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DialogClose } from "@/components/ui/dialog"
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
import { Deck } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"

type UpdateDeckFormProps = {
  deck: Deck
}

const formSchema = z.object({
  question: z.string(),
  answer: z.string(),
})

export default function AddCardForm({ deck }: UpdateDeckFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      answer: "",
    },
  })

  const router = useRouter()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const data = await addCard(deck.id, values.question, values.answer)

    if (!data) {
      toast({
        title: "Fail Question Created",
      })
      toast({
        title: "Question Created",
      })
    } else {
      router.refresh()
    }
  }
  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="flex flex-col items-center space-y-2">
        <CardTitle className="text-center">Add Question</CardTitle>
        <CardDescription className="text-[15px]">
          Specify question and answer
        </CardDescription>
      </CardHeader>
      <CardContent className="border-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="
                    Question"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Answer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogClose>
              <Button type="submit">Submit</Button>
            </DialogClose>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
