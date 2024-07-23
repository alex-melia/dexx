import { User } from "next-auth"
import { signOut } from "next-auth/react"
import Link from "next/link"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { UserAvatar } from "../shared/Avatar"
import { Box, Diamond, Home, LogOut, User as UserIcon } from "lucide-react"

interface AccountNavProps {
  currentUser: User
}

export default function AccountNav({ currentUser }: AccountNavProps) {
  if (!currentUser) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          user={{
            email: currentUser.email as string,
            image: currentUser.image as string,
          }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link href="/account" className="flex items-center space-x-2.5">
            <UserIcon />
            <p className="text-sm">Account</p>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="md:hidden" asChild>
          <Link href="/dashboard" className="flex items-center space-x-2.5">
            <Home />
            <p className="text-sm">Home</p>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="md:hidden" asChild>
          <Link
            href="/dashboard/decks"
            className="flex items-center space-x-2.5"
          >
            <Box />
            <p className="text-sm">Decks</p>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="md:hidden" asChild>
          <Link
            href="/dashboard/roadmaps"
            className="flex items-center space-x-2.5"
          >
            <Diamond />
            <p className="text-sm">Roadmaps</p>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="md:hidden" />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault()
            signOut({
              callbackUrl: `${window.location.origin}/`,
            })
          }}
        >
          <div className="flex items-center space-x-2.5">
            <LogOut />
            <p className="text-sm">Log Out</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
