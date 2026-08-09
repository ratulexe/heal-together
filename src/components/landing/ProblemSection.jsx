import { Clock3, Files, Layers3, Users } from "lucide-react"

const problemItems = [
  {
    title: "Missed routines",
    description: "Busy days make important health routines easy to miss.",
    icon: Clock3,
  },
  {
    title: "Scattered information",
    description:
      "Medicine and emergency details are often spread across notes and messages.",
    icon: Files,
  },
  {
    title: "Family uncertainty",
    description:
      "Loved ones may not know whether an important routine was completed.",
    icon: Users,
  },
  {
    title: "Too much complexity",
    description:
      "Health tools can become another complicated system to manage.",
    icon: Layers3,
  },
]

function ProblemSection() {
  return (
    <section
      className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:py-20"
      aria-labelledby="problem-heading"
    >
      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-ht-teal-dark">
            Everyday care gets complicated
          </p>
          <h2
            id="problem-heading"
            className="mt-3 text-balance font-display text-3xl font-semibold leading-tight text-ht-ink sm:text-4xl md:text-5xl"
          >
            Health routines are easy to forget.
            <span className="block">Support shouldn’t be.</span>
          </h2>
          <p className="mt-5 text-base leading-7 text-ht-muted sm:text-lg">
            Medicines, hydration, wellness check-ins and important health
            information often live in different places. HealTogether brings the
            routine together without making daily care feel overwhelming.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {problemItems.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-ht-border bg-white/80 p-5 shadow-[0_12px_45px_rgba(5,31,32,0.05)] backdrop-blur"
            >
              <div className="flex size-11 items-center justify-center rounded-2xl bg-ht-green-soft/70 text-ht-teal-dark">
                <item.icon className="size-5" aria-hidden="true" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-ht-ink">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-ht-muted">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProblemSection
