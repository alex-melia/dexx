"use client"

import { useTransition } from "react"
import { deleteCard } from "@/actions/Card"
import { Card } from "@prisma/client"

import { Spinner } from "@radix-ui/themes"
import { Button } from "@/components/ui/button"
import { Card as ShadcnCard, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

type DeleteCardFormProps = {
  card: Card
}

export default function DeleteCardForm({ card }: DeleteCardFormProps) {
  const [isPending, startTransition] = useTransition()

  async function onSubmit() {
    startTransition(async () => {
      const data = await deleteCard(card.id)

      if (!data) {
        toast({
          title: "Card Deletion Failed",
        })
      } else {
        toast({
          title: "Card Deleted",
        })
      }
    })
  }

  return (
    <ShadcnCard className="border-0 shadow-none">
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="flex justify-center">
            <Button variant={"destructive"} type="submit">
              {isPending ? <Spinner /> : "Delete"}
            </Button>
          </div>
        </form>
      </CardContent>
    </ShadcnCard>
  )
}
