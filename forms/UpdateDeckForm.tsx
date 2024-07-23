"use client"

import { updateCard } from "@/actions/Card"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card } from "@prisma/client"

import { Button } from "@/components/ui/button"
import { Card as ShadcnCard, CardContent } from "@/components/ui/card"
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

type UpdateDeckFormProps = {
  card: Card
}

const formSchema = z.object({
  question: z.string(),
  answer: z.string(),
})

export default function UpdateDeckForm({ card }: UpdateDeckFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: card.question,
      answer: card.answer,
    },
  })

  const router = useRouter()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await updateCard(card.id, values.question, values.answer)

    if (!res) {
      toast({
        title: "Card Update Failed",
      })
    } else {
      toast({
        title: "Card Updated",
      })
      router.refresh()
    }
  }

  return (
    <ShadcnCard className="border-0 shadow-none">
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
                    <Input type="text" placeholder={card.question} {...field} />
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
                    <Input type="text" placeholder={card.answer} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="w-full flex justify-center">
              <Button className="bg-blue-500 hover:bg-blue-600" type="submit">
                Update
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </ShadcnCard>
  )
}
