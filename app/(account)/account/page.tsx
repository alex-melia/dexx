import { auth } from "@/auth"
import { UserAvatar } from "@/components/shared/Avatar"
import { Icons } from "@/components/shared/Icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import DeckForm from "@/forms/DeckForm"
import UpdateUserForm from "@/forms/UpdateUserForm"
import { redirect } from "next/navigation"
import React from "react"

export default async function AccountPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/")
  }

  return (
    <>
      <div className="flex items-center justify-between border-y p-4">
        <p className="font-bold text-2xl">My Details</p>
        <Dialog>
          <DialogTrigger>
            <p className="bg-blue-500 hover:bg-blue-600 p-2 text-white font-semibold rounded-lg">
              Edit Details
            </p>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="items-center">
              <DialogTitle className="text-3xl">Update User</DialogTitle>
              <DialogDescription>Specify user details</DialogDescription>
            </DialogHeader>
            <UpdateUserForm user={session?.user} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col space-y-6 items-center justify-center mt-12">
        <Avatar className="w-40 h-40">
          {session?.user.image ? (
            <AvatarImage
              alt="Picture"
              src={session.user.image}
              referrerPolicy="no-referrer"
            />
          ) : (
            <AvatarFallback>
              <Icons.user className="size-24" />
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col gap-2 items-center">
          <h1 className="font-bold text-5xl">{session?.user.name}</h1>
          <p className="font-light text-xl">{session?.user.email}</p>
        </div>
      </div>
    </>
  )
}
