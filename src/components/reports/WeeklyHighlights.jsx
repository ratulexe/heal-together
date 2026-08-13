import { Sparkles } from "lucide-react"

function WeeklyHighlights({ highlights }) {
  return (
    <section className="rounded-2xl border border-ht-border bg-white p-5 shadow-[0_14px_36px_rgba(5,31,32,0.05)]">
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-ht-green-soft text-ht-teal-dark">
          <Sparkles className="size-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold">Weekly Highlights</h2>
          <p className="mt-2 text-sm leading-6 text-ht-muted">
            Factual notes based only on your saved routine data.
          </p>
        </div>
      </div>

      <ul className="mt-5 grid gap-3">
        {highlights.map((highlight) => (
          <li
            key={highlight}
            className="rounded-2xl border border-ht-border bg-ht-background px-4 py-3 text-sm font-medium leading-6 text-ht-ink"
          >
            {highlight}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default WeeklyHighlights
