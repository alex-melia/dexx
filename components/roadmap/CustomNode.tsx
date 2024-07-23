"use client"

import "./nodeStyles.css"

import { Handle, Position } from "reactflow"

import { setComplete } from "@/actions/Roadmap"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

import { Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Button } from "../ui/button"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu"
import { Subtopic, Topic } from "@/types"
import { Resource } from "@prisma/client"

interface TopicNodeProps {
  data: Topic
}

export async function TopicNode({ data }: TopicNodeProps) {
  return (
    <Button color="yellow" className="border-2 border-black rounded-md p-1">
      <p className="text-xs">{data.title}</p>
      <Handle
        className="custom-handle"
        type="source"
        isConnectable={false}
        position={Position.Right}
        id="right"
      />
      <Handle
        className="custom-handle"
        type="source"
        position={Position.Left}
        id="left"
      />
      <Handle
        className="custom-handle"
        type="source"
        isConnectable={false}
        position={Position.Bottom}
        id="bottom"
      />
      <Handle
        className="custom-handle"
        type="target"
        isConnectable={false}
        position={Position.Top}
        id="top"
      />
    </Button>
  )
}

interface SubtopicNodeProps {
  data: Subtopic
}

export async function SubtopicNodeLeft({ data }: SubtopicNodeProps) {
  const router = useRouter()

  const handleComplete = async () => {
    if (data) {
      try {
        const response = await setComplete(data.id)

        if (response) {
          router.refresh()
        } else {
          console.error("Failed to update topic")
        }
      } catch (error) {
        console.error("An error occurred", error)
      }
    }
  }

  return (
    <div className="relative">
      <ContextMenu>
        <Dialog>
          <DialogTrigger>
            <ContextMenuTrigger>
              <Button
                className={cn(
                  "bg-blue-500 hover:bg-blue-600",
                  data.isCompleted && "bg-gray-500 hover:bg-gray-600"
                )}
              >
                <span className="absolute right-0 transform translate-x-1/2">
                  {data.isCompleted && (
                    <div className="flex items-center justify-center bg-green-500 rounded-full w-3 h-3">
                      <Check />
                    </div>
                  )}
                </span>
                <p
                  className={cn(
                    "text-xs px-2 py-2",
                    data.isCompleted && "line-through"
                  )}
                >
                  {data.title}
                </p>
                <Handle
                  className="custom-handle"
                  type="target"
                  isConnectableEnd={false}
                  position={Position.Left}
                  id="left"
                />
              </Button>
            </ContextMenuTrigger>
          </DialogTrigger>
          <DialogContent>
            <div>
              <DialogTitle>{data.title}</DialogTitle>
              <DialogDescription>
                This is a test description which will be updated later.
              </DialogDescription>

              <div className="flex flex-col gap-2 mt-4">
                {data.resources.map((resource: any) => (
                  <a key={resource.id} href={resource.url}>
                    {resource.name}
                  </a>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => handleComplete()} inset>
            {!data.isCompleted ? "Mark as Completed" : "Mark as Uncompleted"}
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}

export async function SubtopicNodeRight({ data }: SubtopicNodeProps) {
  const router = useRouter()

  const handleComplete = async () => {
    if (data) {
      try {
        const response = await setComplete(data.id)

        if (response) {
          router.refresh()
        } else {
          console.error("Failed to update topic")
        }
      } catch (error) {
        console.error("An error occurred", error)
      }
    }
  }

  return (
    <div className="relative">
      <ContextMenu>
        <Dialog>
          <DialogTrigger>
            <ContextMenuTrigger>
              <Button
                className={cn(
                  "bg-blue-500 hover:bg-blue-600",
                  data.isCompleted && "bg-gray-500 hover:bg-gray-600"
                )}
              >
                <span className="absolute right-0 transform translate-x-1/2">
                  {data.isCompleted && (
                    <div className="flex items-center justify-center bg-green-500 rounded-full w-3 h-3">
                      <Check />
                    </div>
                  )}
                </span>
                <p
                  className={cn(
                    "text-xs px-2 py-2",
                    data.isCompleted && "line-through"
                  )}
                >
                  {data.title}
                </p>
                <Handle
                  className="custom-handle"
                  type="target"
                  isConnectableEnd={false}
                  position={Position.Right}
                  id="right"
                />
              </Button>
            </ContextMenuTrigger>
          </DialogTrigger>
          <DialogContent>
            <div>
              <DialogTitle>{data.title}</DialogTitle>
              <DialogDescription>
                This is a test description which will be updated later.
              </DialogDescription>

              <div className="flex flex-col gap-2 mt-4">
                {data.resources.map((resource: Resource) => (
                  <a key={resource.id} href={resource.url}>
                    {resource.name}
                  </a>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => handleComplete()} inset>
            {!data.isCompleted ? "Mark as Completed" : "Mark as Uncompleted"}
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}
