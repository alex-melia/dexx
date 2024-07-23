"use client"

import "reactflow/dist/style.css"
import { useMemo } from "react"
import ReactFlow, { Edge, Node } from "reactflow"
import { TopicNode, SubtopicNodeLeft, SubtopicNodeRight } from "./CustomNode"
import { Roadmap, Subtopic, Topic } from "@/types"

interface RoadmapFlowProps {
  roadmap: Roadmap
}

export default function RoadmapFlow({ roadmap }: RoadmapFlowProps) {
  console.log(roadmap)

  const nodeTypes = useMemo(
    () => ({
      topicNode: TopicNode,
      subtopicNodeLeft: SubtopicNodeLeft,
      subtopicNodeRight: SubtopicNodeRight,
    }),
    []
  )

  const generateNodesAndEdges = (roadmap: Roadmap) => {
    let nodes: Node[] = []
    let edges: Edge[] = []
    let yPos = 0
    let prevTopicId: string | null = null

    roadmap.topics.forEach((topic: Topic, topicIndex: number) => {
      const topicNode: Node = {
        id: topic.id,
        type: "topicNode",
        position: { x: 0, y: yPos },
        data: { title: topic.title },
      }
      nodes.push(topicNode)

      topic.subtopics.forEach((subtopic: Subtopic, subtopicIndex: number) => {
        const subtopicNode: Node = {
          id: subtopic.id,
          type: topicIndex % 2 === 0 ? "subtopicNodeLeft" : "subtopicNodeRight",
          position: {
            x: topicIndex % 2 === 0 ? 300 : -300,
            y: yPos + subtopicIndex * 100 - 50,
          },
          data: {
            id: subtopic.id,
            title: subtopic.title,
            resources: subtopic.resources,
            isCompleted: subtopic.isCompleted,
          },
        }
        nodes.push(subtopicNode)

        edges.push({
          id: `e-${topic.id}-${subtopic.id}`,
          source: topic.id,
          sourceHandle: topicIndex % 2 === 0 ? "right" : "left",
          target: subtopic.id,
          targetHandle: topicIndex % 2 === 0 ? "left" : "right",
        })
      })

      if (prevTopicId) {
        edges.push({
          id: `e-${prevTopicId}-${topic.id}`,
          source: prevTopicId,
          sourceHandle: "bottom",
          target: topic.id,
          targetHandle: "top",
        })
      }

      prevTopicId = topic.id
      yPos += (topic.subtopics.length + 1) * 100
    })

    return { nodes, edges }
  }

  const { nodes, edges } = useMemo(
    () => generateNodesAndEdges(roadmap),
    [roadmap]
  )

  return <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} />
}
