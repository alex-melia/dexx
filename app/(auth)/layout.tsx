import React from "react"
import { auth } from "@/auth"

import Navbar from "@/components/layout/Navbar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function AuthLayout({ children }: DashboardLayoutProps) {
  const session = await auth()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar currentUser={!session?.user ? null : session?.user} />
      <div className="container flex-1">
        <main className="flex w-full flex-1 flex-col">{children}</main>
      </div>
    </div>
  )
}
