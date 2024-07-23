"use client"

import { useEffect, useState, useTransition } from "react"

import { useRouter } from "next/navigation"
import { Card, Deck, Rating } from "@prisma/client"

import { Button } from "@radix-ui/themes"
import { Progress } from "../ui/progress"
import { addReview } from "@/actions/Card"

interface ReviewDeckProps {
  deck: Deck
  reviewCards: Card[]
}

export default function ReviewDeck({ deck, reviewCards }: ReviewDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [cards, setCards] = useState(reviewCards)
  const [cardsAnswered, setCardsAnswered] = useState(0)
  const [isPending, startTransition] = useTransition()

  const router = useRouter()

  async function handleReview(card_id: string, rating: Rating) {
    startTransition(async () => {
      await addReview(card_id, rating)
      router.refresh()
      setCards(cards.slice(1))
      setIsFlipped(!isFlipped)
      setCardsAnswered((prevCount) => prevCount + 1)
    })
  }

  useEffect(() => {
    if (!cards.length) {
      router.refresh()
      router.push(`/dashboard/deck/${deck.id}`)
    }
  }, [cards.length, router])

  return cards.length ? (
    <div className="min-w-[800px]">
      <div className="flex flex-col items-center w-full h-full">
        <Progress
          color="blue"
          className="my-4 max-w-[1/2]"
          value={Math.round((cardsAnswered / cards.length) * 100)}
        />
        <div className="flex flex-col items-center w-full h-full relative">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="flex justify-center items-center border rounded-xl shadow-md border-lg max-w-[800px] min-h-[200px] w-full"
          >
            <p className="font-semibold text-center text-2xl">
              {!isFlipped
                ? cards[currentIndex].question
                : cards[currentIndex].answer}
            </p>
          </div>
        </div>
        {isFlipped && (
          <div className="flex gap-2 mt-4">
            <Button
              color="blue"
              onClick={() => {
                const newCards = [...cards]
                newCards.splice(currentIndex, 1)
                setCards(cards.splice(0, 1))

                if (currentIndex >= newCards.length) {
                  setCurrentIndex(0)
                }

                handleReview(cards[currentIndex].id, Rating.VERY_EASY)
                setIsFlipped(!isFlipped)
              }}
            >
              Very Easy
            </Button>
            <Button
              color="blue"
              onClick={async () => {
                await handleReview(cards[currentIndex].id, Rating.EASY)
              }}
            >
              Easy
            </Button>
            <Button
              color="blue"
              onClick={() => {
                const newCards = [...cards]
                newCards.splice(currentIndex, 1)
                setCards(newCards)

                if (currentIndex >= newCards.length) {
                  setCurrentIndex(0)
                }

                handleReview(cards[currentIndex].id, Rating.HARD)
                setIsFlipped(!isFlipped)
              }}
            >
              Hard
            </Button>
            <Button
              color="blue"
              onClick={() => {
                const newCards = [...cards]
                newCards.splice(currentIndex, 1)
                setCards(newCards)

                if (currentIndex >= newCards.length) {
                  setCurrentIndex(0)
                }

                handleReview(cards[currentIndex].id, Rating.VERY_HARD)
                setIsFlipped(!isFlipped)
              }}
            >
              Very Hard
            </Button>
          </div>
        )}
      </div>
    </div>
  ) : null
}
