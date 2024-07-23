import { getDeck } from "@/actions/Deck"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import AddCardForm from "@/forms/AddCardForm"
import DeleteCardForm from "@/forms/DeleteCardForm"
import UpdateDeckForm from "@/forms/UpdateDeckForm"
import { timeUntilReview } from "@/lib/utils"
import { Card } from "@prisma/client"
import { Separator } from "@radix-ui/themes"
import { Droplet, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

type DeckPageParams = {
  params: {
    id: string
  }
}

export default async function DeckPage({ params }: DeckPageParams) {
  if (!params.id) {
    redirect("/dashboard")
  }

  const deck = await getDeck(params.id)

  if (!deck) {
    redirect("/dashboard")
  }

  const cardsToReview = deck?.cards.filter((card: Card) => {
    return card.nextReviewDate && card.nextReviewDate <= new Date()
  })

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-4 items-center my-4">
        <div className="flex flex-col text-center">
          <span className="font-bold text-3xl">{deck?.title}</span>
          <span className="font-light">Last reviewed: 1d ago</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-medium">
            Total questions: {deck?.cards.length}
          </span>
          <Separator orientation="vertical" />
          <span className="font-medium">
            To Review: {cardsToReview?.length}
          </span>
        </div>
        <Link href={`/dashboard/review/${params.id}`}>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white font-bold p-2 rounded-lg w-fit">
            Review
          </Button>
        </Link>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead className="text-center">Next Review</TableHead>
              <TableHead className="text-right">Edit/Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deck?.cards.map((card) => (
              <TableRow key={card.id}>
                <TableCell>{card.question}</TableCell>
                <TableCell className="flex justify-center items-center gap-1">
                  <Droplet />
                  {card.nextReviewDate && new Date() >= card.nextReviewDate ? (
                    <p>now</p>
                  ) : (
                    <p>
                      {card.nextReviewDate &&
                        timeUntilReview(card.nextReviewDate)}
                    </p>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2 text-right">
                    <Dialog>
                      <DialogTrigger>
                        <Pencil color="green" />
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader className="items-center">
                          <DialogTitle className="text-3xl">
                            Update Question
                          </DialogTitle>
                          <DialogDescription>
                            Specify question and answer
                          </DialogDescription>
                        </DialogHeader>
                        <UpdateDeckForm card={card} />
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger>
                        <Trash2 color="red" />
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader className="items-center">
                          <DialogTitle className="text-3xl">
                            Delete Question
                          </DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete this question?
                          </DialogDescription>
                        </DialogHeader>
                        <DeleteCardForm card={card} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell className="text-right" colSpan={3}>
                <Dialog>
                  <DialogTrigger>
                    <p className="bg-blue-500 p-2 rounded-lg text-white font-bold">
                      Add Card
                    </p>
                  </DialogTrigger>
                  <DialogContent>
                    <AddCardForm deck={deck} />
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
