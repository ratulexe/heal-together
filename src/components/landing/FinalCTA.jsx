import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

function FinalCTA() {
  return (
    <section
      className="px-4 py-14 sm:px-6 lg:py-20"
      aria-labelledby="final-cta-heading"
    >
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2.25rem] border border-ht-border bg-white shadow-[0_24px_90px_rgba(5,31,32,0.09)]">
        <div className="relative isolate px-6 py-12 text-center sm:px-8 lg:px-12 lg:py-16">
          <div
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_25%_20%,rgba(218,241,222,0.9),transparent_32%),radial-gradient(circle_at_78%_10%,rgba(125,183,232,0.32),transparent_28%)]"
            aria-hidden="true"
          />
          <h2
            id="final-cta-heading"
            className="mx-auto max-w-3xl text-balance font-display text-3xl font-semibold leading-tight text-ht-ink sm:text-4xl md:text-5xl"
          >
            Better routines begin with one small step.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-ht-muted sm:text-lg">
            Bring your daily health routine and the people who support you into
            one connected space.
          </p>

          <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/signup"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ht-teal px-6 text-base font-semibold text-white shadow-[0_16px_40px_rgba(15,163,160,0.28)] transition hover:bg-ht-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ht-teal/40 focus-visible:ring-offset-2"
            >
              Start Your Routine
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <a
              href="#features"
              className="inline-flex h-12 items-center justify-center rounded-full border border-ht-border bg-white/80 px-6 text-base font-semibold text-ht-ink transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ht-teal/40 focus-visible:ring-offset-2"
            >
              Explore Features
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FinalCTA
