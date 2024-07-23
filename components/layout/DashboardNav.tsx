"use client"

import { SidebarNavLink } from "@/types"
import { Icons } from "../shared/Icons"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

interface DashboardNavProps {
  links?: SidebarNavLink[]
}

export default function DashboardNav({ links }: DashboardNavProps) {
  const path = usePathname()
  return (
    <nav className="fixed flex flex-col gap-8">
      {links?.map((link, index) => {
        const Icon = Icons[link.icon || "home"]
        return (
          link.href && (
            <Link key={index} href={link.disabled ? "/" : link.href}>
              <span
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-blue-500",
                  link.disabled && "cursor-not-allowed opacity-80",
                  path === link.href && "text-blue-500"
                )}
              >
                <Icon className="mr-2 size-4" />
                <span>{link.title}</span>
              </span>
            </Link>
          )
        )
      })}
    </nav>
  )
}
