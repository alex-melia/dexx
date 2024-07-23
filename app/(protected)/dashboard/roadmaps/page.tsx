import { getUserRoadmaps } from "@/actions/Roadmap"
import RoadmapCard from "@/components/roadmap/RoadmapCard"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import RoadmapForm from "@/forms/RoadmapForm"
import { Roadmap } from "@/types"

export default async function RoadmapsPage() {
  const roadmaps = await getUserRoadmaps()

  return (
    <>
      <div className="flex items-center justify-between border-y p-4">
        <p className="font-light text-2xl">My Roadmaps</p>
        <Dialog>
          <DialogTrigger>
            <p className="bg-blue-500 p-2 rounded-lg text-white font-semibold">
              Add Roadmap
            </p>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="items-center">
              <DialogTitle className="text-3xl">Generate Roadmap</DialogTitle>
              <DialogDescription>Enter a prompt</DialogDescription>
            </DialogHeader>
            <RoadmapForm />
          </DialogContent>
        </Dialog>
      </div>
      {roadmaps?.length ? (
        <div className="my-4 flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {roadmaps?.map((roadmap: Roadmap) => (
            <RoadmapCard roadmap={roadmap} key={roadmap.id} />
          ))}
        </div>
      ) : (
        <div className="w-full flex flex-col space-y-4 items-center justify-center mt-12">
          <div className="flex flex-col items-center gap-2">
            <p className="text-4xl font-semibold">You have no roadmaps!</p>
            <p className="text-xl font-light">
              Create a roadmap and start learning
            </p>
          </div>
          <Dialog>
            <DialogTrigger>
              <p className="bg-blue-500 p-2 rounded-lg text-white font-semibold">
                Add Roadmap
              </p>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="items-center">
                <DialogTitle className="text-3xl">Generate Roadmap</DialogTitle>
                <DialogDescription>Enter a prompt</DialogDescription>
              </DialogHeader>
              <RoadmapForm />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  )
}
