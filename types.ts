import { Icons } from "./components/shared/Icons"
import { Card, Resource } from "@prisma/client"

export type NavLink = {
  title: string
  href: string
  disabled?: boolean
}

export type SidebarNavLink = {
  title: string
  href: string
  disabled?: boolean
  icon?: keyof typeof Icons
}

export type DashboardConfig = {
  navLinks: SidebarNavLink[]
}

export type AccountConfig = {
  navLinks: SidebarNavLink[]
}

export type Deck = {
  id: string
  image: string | null
  title: string
  cards: Card[]
}

export type Subtopic = {
  id: string
  title: string
  topicId: string
  isCompleted: boolean

  resources: Resource[]
}

export type Topic = {
  id: string
  title: string
  roadmapId: string
  isCompleted: boolean

  subtopics: Subtopic[]
}

export type Roadmap = {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  user_id: string
  image?: string | null

  topics: Topic[]
}
