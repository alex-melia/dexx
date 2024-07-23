import { Roadmap, Topic } from "@/types"
import { Subtopic } from "@prisma/client"
import Link from "next/link"

interface DeckCardProps {
  roadmap: Roadmap
}

export default function RoadmapCard({ roadmap }: DeckCardProps) {
  const TOTAL_SUBTOPICS = roadmap.topics.reduce(
    (acc: number, topic: Topic) => acc + topic.subtopics.length,
    0
  )

  const TOTAL_COMPLETED = roadmap.topics.reduce(
    (acc: number, topic: Topic) =>
      acc +
      topic.subtopics.filter((subtopic: Subtopic) => subtopic.isCompleted)
        .length,
    0
  )

  const TOTAL_REMAINING = TOTAL_SUBTOPICS - TOTAL_COMPLETED
  const TOTAL_PERCENTAGE = Math.round((TOTAL_COMPLETED / TOTAL_SUBTOPICS) * 100)

  return (
    <Link
      href={`/dashboard/roadmap/${roadmap.id}`}
      key={roadmap.id}
      className="grid grid-rows-3 border text-center rounded-lg h-[400px] shadow-md transition ease-in-out duration-300 hover:-translate-y-1.5 hover:shadow-xl"
    >
      <div className="row-span-2">
        {roadmap.image && (
          <img src={roadmap.image} className="rounded-t-lg w-full h-full" />
        )}
      </div>
      <div className="relative row-span-1 p-2">
        <span className="font-bold text-center text-lg">{roadmap.title}</span>
        <div className="flex justify-between gap-2 absolute bottom-0 left-0 w-full p-4">
          <div className="flex flex-col">
            <span className="font-bold text-xl">{TOTAL_REMAINING}</span>
            <span className="text-xs uppercase font-semibold text-blue-500">
              Total Subtopics
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl">{TOTAL_PERCENTAGE}%</span>
            <span className="text-xs uppercase font-semibold text-blue-500">
              Percentage Complete
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
