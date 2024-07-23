import { getDeck } from "@/actions/Deck"
import { Card } from "@prisma/client"
import { redirect } from "next/navigation"

import ReviewDeck from "@/components/review/ReviewDeck"

type ReviewPageParams = {
  params: {
    id: string
  }
}

export default async function ReviewPage({ params }: ReviewPageParams) {
  if (!params.id) {
    redirect("/dashboard")
  }

  const deck = await getDeck(params.id)

  const cards = deck?.cards.filter((card: Card) => {
    return card.nextReviewDate && card.nextReviewDate <= new Date()
  })

  if (!cards || !deck) {
    redirect("/dashboard")
  }

  return (
    <div className="flex flex-col items-center pt-12">
      <p>Progress</p>
      <ReviewDeck deck={deck} reviewCards={cards} />
    </div>
  )
}
