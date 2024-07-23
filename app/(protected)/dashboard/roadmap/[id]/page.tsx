import { getRoadmap } from "@/actions/Roadmap"
import { redirect } from "next/navigation"

import RoadmapFlow from "@/components/roadmap/RoadmapFlow"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

type DeckPageParams = {
  params: {
    id: string
  }
}

export default async function RoadmapPage({ params }: DeckPageParams) {
  if (!params.id) {
    redirect("/dashboard")
  }

  const roadmap = await getRoadmap(params.id)

  if (!roadmap) {
    redirect("/dashboard")
  }

  const TOTAL_SUBTOPICS = roadmap.topics.reduce(
    (acc, topic) => acc + topic.subtopics.length,
    0
  )

  const TOTAL_COMPLETED = roadmap.topics.reduce(
    (acc, topic) =>
      acc + topic.subtopics.filter((subtopic) => subtopic.isCompleted).length,
    0
  )

  const TOTAL_REMAINING = TOTAL_SUBTOPICS - TOTAL_COMPLETED

  const TOTAL_PERCENTAGE = Math.round((TOTAL_COMPLETED / TOTAL_SUBTOPICS) * 100)

  return (
    <div className="flex flex-col min-h-screen h-full w-full">
      <div className="flex flex-col gap-4">
        <p className="text-2xl font-bold">{roadmap.title}</p>
        <div className="flex gap-4">
          <p className="font-bold">{TOTAL_PERCENTAGE}% Done</p>
          <Separator orientation="vertical" />
          <p className="font-bold">{TOTAL_COMPLETED} completed</p>
          <Separator orientation="vertical" />

          <p className="font-bold">{TOTAL_REMAINING} to complete</p>
          <Separator orientation="vertical" />

          <p className="font-bold">{TOTAL_SUBTOPICS} total</p>
        </div>

        <Progress className="my-4" value={TOTAL_PERCENTAGE} />
      </div>
      <div className="border h-full w-full">
        <RoadmapFlow roadmap={roadmap} />
      </div>
    </div>
  )
}
