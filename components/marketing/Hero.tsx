import Link from "next/link"

export default function Hero() {
  return (
    <section className="flex items-center justify-center w-full container p-12">
      <div className="flex sm:grid grid-cols-2 gap-8 max-w-[1200px] my-12">
        <div className="flex flex-col space-y-6 sm:space-y-8">
          <span className="font-bold text-4xl sm:text-6xl text-center sm:text-left">
            Dexx: Your AI Study Pal
          </span>
          <span className="font-light text-lg sm:text-2xl text-blue-500 text-center sm:text-left">
            Supercharge your studying with AI generated flashcards and roadmaps
          </span>

          <Link
            className="flex justify-center sm:justify-start"
            href="/register"
          >
            <p className="w-[200px] sm:w-[300px] text-md sm:text-xl text-center text-white bg-blue-500 p-3 rounded-lg">
              Get started for free
            </p>
          </Link>

          <div className="flex flex-col md:flex-row items-center gap-1">
            <div className="flex">
              <img
                className="border-2 border-gray-200 bg-white rounded-full w-12 h-12"
                src="/headshots/headshot1.png"
              />
              <img
                className="border-2 border-gray-200 bg-white rounded-full w-12 h-12 -ml-4"
                src="/headshots/headshot2.png"
              />
              <img
                className="border-2 border-gray-200 bg-white rounded-full w-12 h-12 -ml-4"
                src="/headshots/headshot3.png"
              />
              <img
                className="border-2 border-gray-200 bg-white rounded-full w-12 h-12 -ml-4"
                src="/headshots/headshot4.png"
              />
              <img
                className="border-2 border-gray-200 bg-white rounded-full w-12 h-12 -ml-4"
                src="/headshots/headshot1.png"
              />
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="text-sm max-w-44 text-center">
                Loved by over 1000+ customers
              </p>
              <p>⭐⭐⭐⭐⭐</p>
            </div>
          </div>
        </div>
        <div className="hidden sm:flex items-center justify-center">
          <img src={"/marketing/decks.png"} />
        </div>
      </div>
    </section>
  )
}
