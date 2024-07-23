import { Check } from "lucide-react"
import Link from "next/link"
import React from "react"

export default function HowItWorks() {
  return (
    <section className="flex flex-col gap-12 items-center justify-center max-w-[1300px] w-full container p-12">
      <div className="flex flex-col sm:grid grid-cols-2 md:gap-12 lg:gap-32 mt-12 w-full place-items-center">
        <div className="space-y-6">
          <p className="font-semibold text-4xl text-blue-500">
            Dexx customers learn topics twice as fast
          </p>
          <p className="text-lg leading-relaxed">
            Specify the title, enter a prompt and let Dexx do the rest! Dexx
            generates numerous topics and resources pointing you in exactly the
            right direction!
          </p>

          <div className="flex gap-4 items-center mx-4">
            <Check className="w-8 h-8" color="green" />
            <p className="text-lg text-gray-500">
              Work through up to 10 varying topics per generated Roadmap
            </p>
          </div>
          <div className="flex gap-4 items-center mx-4">
            <Check className="w-8 h-8" color="green" />
            <p className="text-lg text-gray-500">
              Get links to descriptive resources that are packed with content
            </p>
          </div>
          <div className="flex gap-4 items-center mx-4">
            <Check className="w-8 h-8" color="green" />
            <p className="text-lg text-gray-500">
              Easily keep track of your learning progress with our intuitive
              interface
            </p>
          </div>
          <Link href="/register">
            <p className="mt-6 w-[200px] text-md text-center text-white bg-blue-500 hover:bg-blue-600 transition ease-in-out p-3 rounded-lg">
              Get started for free
            </p>
          </Link>
        </div>
        <img
          className="mt-12 md:mt-0 border rounded-lg shadow-lg p-2"
          src={"/marketing/roadmap.png"}
        />
      </div>
      <div className="flex flex-col sm:grid grid-cols-2 lg:gap-32 mt-12 w-full place-items-center">
        <img
          className="hidden md:flex items-center"
          src={"/marketing/deck.png"}
        />
        <div className="space-y-6">
          <p className="font-semibold text-4xl text-blue-500">
            Go paperless and revise flashcards any time, anywhere, anyplace
          </p>
          <p className="text-lg leading-relaxed">
            Powered by GPT-4, Dexx has the capacity to produce up-to-date and
            high quality flashcards to be revised with. Dexx does the writing so
            you don&apos;t have to!
          </p>

          <div className="flex gap-4 items-center mx-4">
            <Check className="w-8 h-8" color="green" />
            <p className="text-lg text-gray-500">
              Up to 10 high-quality generated flashcards per deck
            </p>
          </div>
          <div className="flex gap-4 items-center mx-4">
            <Check className="w-8 h-8" color="green" />
            <p className="text-lg text-gray-500">
              Fully customisable cards that can be edited to suit
            </p>
          </div>
          <div className="flex gap-4 items-center mx-4">
            <Check className="w-8 h-8" color="green" />
            <p className="text-lg text-gray-500">
              Interactive decks that gauge your level of understanding
            </p>
          </div>
          <Link href="/register">
            <p className="mt-6 w-[200px] text-md text-center text-white bg-blue-500 hover:bg-blue-600 transition ease-in-out p-3 rounded-lg">
              Get started for free
            </p>
          </Link>
        </div>
        <img
          className="mt-12 md:mt-0 flex md:hidden items-center border rounded-lg shadow-lg p-2"
          src={"/marketing/deck.png"}
        />
      </div>
    </section>
  )
}
