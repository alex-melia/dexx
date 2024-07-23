import React from "react"
import { redirect } from "next/navigation"
import { accountConfig } from "@/config/account"
import { auth } from "@/auth"

import DashboardNav from "@/components/layout/DashboardNav"
import Navbar from "@/components/layout/Navbar"

interface AccountLayoutProps {
  children: React.ReactNode
}

export default async function AccountLayout({ children }: AccountLayoutProps) {
  const session = await auth()

  if (!session?.user) {
    redirect("/")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar currentUser={session?.user} />
      <div className="container grid md:grid-cols-[200px_1fr] gap-12 flex-1">
        <aside className="hidden w-[200px] md:flex">
          <DashboardNav links={accountConfig.navLinks} />
        </aside>
        <main className="flex w-full flex-1 flex-col">{children}</main>
      </div>
    </div>
  )
}
