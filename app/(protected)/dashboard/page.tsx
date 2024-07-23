import { getUserDecks } from "@/actions/Deck"
import { getUserRoadmaps } from "@/actions/Roadmap"
import { auth } from "@/auth"
import DeckCard from "@/components/decks/DeckCard"
import RoadmapCard from "@/components/roadmap/RoadmapCard"
import { Deck, Roadmap } from "@/types"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await auth()

  const decks = await getUserDecks()
  const roadmaps = await getUserRoadmaps()
  return (
    <main className="flex flex-col md:container">
      <span className="font-bold text-2xl md:text-4xl">
        Welcome, {session?.user.name}.
      </span>

      <div className="flex flex-col mt-12">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-2xl">Your Decks</p>
          {decks && decks.length > 3 && (
            <Link
              href="/dashboard/decks"
              className="flex items-center bg-blue-500 p-2 text-white font-semibold rounded-lg gap-2"
            >
              <p>See more</p>
              <ArrowRight />
            </Link>
          )}
        </div>
        {decks?.length ? (
          <div className="my-4 flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {decks?.slice(0, 3).map((deck: Deck) => (
              <DeckCard deck={deck} key={deck.id} />
            ))}
          </div>
        ) : (
          <div className="w-full flex flex-col space-y-4 items-center justify-center mt-12">
            <div className="flex flex-col items-center gap-4">
              <p className="text-4xl font-semibold">You have no decks!</p>
              <Link href="/dashboard/decks">
                <p className="font-light text-lg bg-blue-500 p-2 text-white rounded-lg">
                  Create a Deck
                </p>
              </Link>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col mt-12">
        <div className="flex justify-between">
          <p className="font-semibold text-2xl">Your Roadmaps</p>

          {roadmaps && roadmaps.length > 3 && (
            <Link
              href="/dashboard/roadmaps"
              className="flex items-center bg-blue-500 p-2 text-white font-semibold rounded-lg gap-2"
            >
              <p>See more</p>
              <ArrowRight />
            </Link>
          )}
        </div>
        {roadmaps?.length ? (
          <div className="my-4 flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {roadmaps?.slice(0, 3).map((roadmap: Roadmap) => (
              <RoadmapCard roadmap={roadmap} key={roadmap.id} />
            ))}
          </div>
        ) : (
          <div className="w-full flex flex-col space-y-4 items-center justify-center mt-12">
            <div className="flex flex-col items-center gap-4">
              <p className="text-4xl font-semibold">You have no roadmaps!</p>
              <Link href="/dashboard/roadmaps">
                <p className="font-light text-lg bg-blue-500 p-2 text-white rounded-lg">
                  Create a Roadmap
                </p>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
