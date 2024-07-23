import type { Icon } from "lucide-react"

import { Icons } from "@/components/shared/Icons"
import { Card } from "@prisma/client"

export type NavLink = {
  title: string
  href: string
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
