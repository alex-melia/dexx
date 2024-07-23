import { getUserDecks } from "@/actions/Deck"
import { Deck } from "@/types"

import DeckCard from "@/components/decks/DeckCard"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import DeckForm from "@/forms/DeckForm"

export default async function DecksPage() {
  const decks = await getUserDecks()

  return (
    <div>
      <div className="flex items-center justify-between border-y p-4">
        <p className="font-light text-2xl">My Decks</p>
        <Dialog>
          <DialogTrigger>
            <p className="bg-blue-500 p-2 rounded-lg text-white font-semibold">
              Add Deck
            </p>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="items-center">
              <DialogTitle className="text-3xl">Generate Deck</DialogTitle>
              <DialogDescription>Enter a prompt</DialogDescription>
            </DialogHeader>
            <DeckForm />
          </DialogContent>
        </Dialog>
      </div>
      {decks?.length ? (
        <div className="my-4 flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {decks?.map((deck: Deck) => (
            <DeckCard deck={deck} key={deck.id} />
          ))}
        </div>
      ) : (
        <div className="w-full flex flex-col space-y-4 items-center justify-center mt-12">
          <div className="flex flex-col items-center gap-2">
            <p className="text-4xl font-semibold">You have no decks!</p>
            <p className="text-xl font-light">
              Create a deck and start learning
            </p>
          </div>
          <Dialog>
            <DialogTrigger>
              <p className="bg-blue-500 p-2 rounded-lg text-white font-semibold">
                Add Deck
              </p>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="items-center">
                <DialogTitle className="text-3xl">Generate Deck</DialogTitle>
                <DialogDescription>Enter a prompt</DialogDescription>
              </DialogHeader>
              <DeckForm />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
}
