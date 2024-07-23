import React from "react"
import Navbar from "@/components/layout/Navbar"
import { homeConfig } from "@/config/home"
import { auth } from "@/auth"

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  const session = await auth()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        currentUser={!session?.user ? null : session?.user}
        links={homeConfig.navLinks}
      />
      <main className="flex-1">{children}</main>
    </div>
  )
}
