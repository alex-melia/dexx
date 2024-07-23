import { auth } from "@/auth"
import DashboardNav from "@/components/layout/DashboardNav"
import Navbar from "@/components/layout/Navbar"
import { dashboardConfig } from "@/config/dashboard"
import { redirect } from "next/navigation"
import React from "react"

interface DashboardLayoutProps {
  children?: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await auth()

  if (!session?.user) {
    redirect("/")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar currentUser={session?.user} />
      <div className="container grid md:grid-cols-[100px_1fr] lg:grid-cols-[200px_1fr] md:gap-6 lg:gap-12 flex-1">
        <aside className="hidden w-[200px] md:flex">
          <DashboardNav links={dashboardConfig.navLinks} />
        </aside>
        <main className="flex w-full flex-1 flex-col">{children}</main>
      </div>
    </div>
  )
}
