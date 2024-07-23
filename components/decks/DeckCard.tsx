import { Deck } from "@/types"
import { Card } from "@prisma/client"
import Link from "next/link"

interface DeckCardProps {
  deck: Deck
}

export default function DeckCard({ deck }: DeckCardProps) {
  return (
    <Link
      key={deck.id}
      href={`/dashboard/deck/${deck.id}`}
      className="grid grid-rows-3 border text-center rounded-lg h-[400px] shadow-md transition ease-in-out duration-300 hover:-translate-y-1.5 hover:shadow-xl"
    >
      <div className="row-span-2">
        {deck.image && (
          <img src={deck.image} className="rounded-t-lg w-full h-full" />
        )}
      </div>
      <div className="relative row-span-1 p-2">
        <span className="font-bold text-center text-2xl">{deck.title}</span>
        <div className="flex justify-between gap-2 absolute bottom-0 left-0 w-full p-4">
          <div className="flex flex-col">
            <span className="font-bold text-xl">{deck.cards.length}</span>
            <span className="text-xs uppercase font-semibold text-blue-500">
              Total Cards
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl">
              {
                deck?.cards.filter((card: Card) => {
                  return (
                    card.nextReviewDate && card.nextReviewDate <= new Date()
                  )
                }).length
              }
            </span>
            <span className="text-xs uppercase font-semibold text-blue-500">
              Cards To Review
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
