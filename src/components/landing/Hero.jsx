import { ArrowRight, PlayCircle, ShieldCheck } from "lucide-react"
import { Link } from "react-router-dom"

function Hero() {
  return (
    <section className="relative isolate px-4 pb-8 pt-28 sm:px-6 sm:pb-10 sm:pt-36 lg:pt-40">
      <div
        className="pointer-events-none absolute inset-x-0 top-10 -z-10 mx-auto h-[36rem] max-w-6xl overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-[85%] rounded-full bg-ht-green-soft/80 blur-3xl sm:h-96 sm:w-96" />
        <div className="absolute right-1/2 top-24 h-72 w-72 translate-x-[85%] rounded-full bg-ht-blue/35 blur-3xl sm:h-96 sm:w-96" />
        <div className="absolute inset-x-0 top-14 mx-auto h-80 max-w-3xl rounded-full bg-white/55 blur-3xl" />
      </div>

      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-ht-border bg-white/75 px-4 py-2 text-sm font-medium text-ht-teal-dark shadow-[0_8px_30px_rgba(5,31,32,0.06)] backdrop-blur">
          <ShieldCheck className="size-4" aria-hidden="true" />
          <span>Daily health, made easier together</span>
        </div>

        <h1 className="max-w-5xl text-balance font-display text-5xl font-semibold leading-[1.03] text-ht-ink sm:text-6xl md:text-7xl lg:text-8xl">
          Your health routine,
          <span className="block text-ht-teal">connected with care.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-ht-muted sm:text-xl">
          Track medicines, wellness habits, emergency health information, and
          caregiver support from one calm, connected space.
        </p>

        <div className="mt-9 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-center">
          <Link
            to="/signup"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ht-teal px-6 text-base font-semibold text-white shadow-[0_16px_40px_rgba(15,163,160,0.28)] transition hover:bg-ht-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ht-teal/40 focus-visible:ring-offset-2 focus-visible:ring-offset-ht-background"
          >
            Start Your Routine
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-ht-border bg-white/75 px-6 text-base font-semibold text-ht-ink shadow-[0_10px_35px_rgba(5,31,32,0.06)] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ht-teal/40 focus-visible:ring-offset-2 focus-visible:ring-offset-ht-background"
          >
            <PlayCircle className="size-4 text-ht-teal" aria-hidden="true" />
            See How It Works
          </a>
        </div>

        <p className="mt-5 text-sm font-medium text-ht-muted">
          Privacy-first • No diagnosis • You stay in control
        </p>
      </div>
    </section>
  )
}

export default Hero
