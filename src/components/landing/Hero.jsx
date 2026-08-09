import { ArrowRight, PlayCircle, ShieldCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

function Hero() {
  return (
    <section
      id="top"
      className="relative isolate px-4 pb-8 pt-28 sm:px-6 sm:pb-10 sm:pt-36 lg:pt-40"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-10 -z-10 mx-auto h-[36rem] max-w-6xl overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-[85%] rounded-full bg-ht-green-soft/80 blur-3xl sm:h-96 sm:w-96" />
        <div className="absolute right-1/2 top-24 h-72 w-72 translate-x-[85%] rounded-full bg-ht-blue/35 blur-3xl sm:h-96 sm:w-96" />
        <div className="absolute inset-x-0 top-14 mx-auto h-80 max-w-3xl rounded-full bg-white/55 blur-3xl" />
      </div>

      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <Badge
          variant="outline"
          className="mb-6 h-auto rounded-full border-ht-border bg-white/75 px-4 py-2 text-sm font-medium text-ht-teal-dark shadow-[0_8px_30px_rgba(5,31,32,0.06)] backdrop-blur"
        >
          <ShieldCheck className="size-4" aria-hidden="true" />
          <span>Daily health, made easier together</span>
        </Badge>

        <h1 className="max-w-5xl text-balance font-display text-5xl font-semibold leading-[1.03] text-ht-ink sm:text-6xl md:text-7xl lg:text-[5.75rem]">
          Your health routine,
          <span className="block text-ht-teal">connected with care.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-ht-muted sm:text-xl">
          Track medicines, wellness habits, emergency health information, and
          caregiver support from one calm, connected space.
        </p>

        <div className="mt-9 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-center">
          <Button
            nativeButton={false}
            className="h-12 rounded-full bg-ht-teal px-6 text-base font-semibold text-white shadow-[0_16px_40px_rgba(15,163,160,0.28)] hover:bg-ht-teal-dark"
            render={<a href="#product-preview" />}
          >
            Start Your Routine
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            nativeButton={false}
            className="h-12 rounded-full border-ht-border bg-white/75 px-6 text-base font-semibold text-ht-ink shadow-[0_10px_35px_rgba(5,31,32,0.06)] hover:bg-white"
            render={<a href="#how-it-works" />}
          >
            <PlayCircle className="size-4 text-ht-teal" aria-hidden="true" />
            See How It Works
          </Button>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm font-medium text-ht-muted">
          <span>Privacy-first</span>
          <span aria-hidden="true">|</span>
          <span>No diagnosis</span>
          <span aria-hidden="true">|</span>
          <span>You stay in control</span>
        </div>
      </div>
    </section>
  )
}

export default Hero
