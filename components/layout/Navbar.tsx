"use client"

import { User } from "next-auth"
import { NavLink } from "@/types"
import { cn } from "@/lib/utils"
import Link from "next/link"

import AccountNav from "./AccountNav"

interface NavbarProps {
  currentUser: User | null
  links?: NavLink[]
}

export default function Navbar({ currentUser, links }: NavbarProps) {
  return (
    <header
      className={cn(
        "max-w-[1400px] flex w-full items-center justify-between mx-auto p-8",
        currentUser && "sticky top-0 bg-white z-40"
      )}
    >
      <Link href={currentUser ? "/dashboard" : "/"}>
        <p className="font-extrabold text-2xl text-blue-500">Dexx</p>
      </Link>
      <nav>
        <ul className="flex justify-between items-center gap-8">
          {links?.map((link, i) => (
            <li
              className="hidden md:block hover:cursor-pointer font-bold hover:text-blue-500"
              key={i}
            >
              {link.title}
            </li>
          ))}
          {!currentUser ? (
            <Link href="/register">
              <p className="font-light text-white bg-blue-500 p-2 rounded-full">
                Get started for free
              </p>
            </Link>
          ) : (
            <AccountNav currentUser={currentUser} />
          )}
        </ul>
      </nav>
    </header>
  )
}
