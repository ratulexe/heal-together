import { CheckCircle2 } from "lucide-react"

import { energyOptions, moodOptions } from "@/lib/wellness"

function formatMood(value) {
  return moodOptions.find((option) => option.value === value)?.label || "Not recorded"
}

function formatEnergy(value) {
  const option = energyOptions.find((item) => item.value === value)
  return option ? `${option.value} / 5 - ${option.label}` : "Not recorded"
}

function formatSleep(value) {
  if (value == null || value === "") return "Not recorded"
  return `${Number(value).toFixed(Number.isInteger(Number(value)) ? 0 : 1)} hours`
}

function WellnessSummary({ log }) {
  if (!log) return null

  const summaryItems = [
    {
      label: "Hydration",
      value: `${log.hydration.glasses} / ${log.hydration.goal} glasses`,
    },
    { label: "Mood", value: formatMood(log.mood) },
    { label: "Sleep", value: formatSleep(log.sleepHours) },
    { label: "Energy", value: formatEnergy(log.energyLevel) },
  ]

  return (
    <section className="rounded-2xl border border-ht-border bg-white p-5 shadow-[0_14px_36px_rgba(5,31,32,0.05)]">
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-ht-success-bg text-ht-success">
          <CheckCircle2 className="size-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold">Today&apos;s check-in</h2>
          <p className="mt-1 text-sm leading-6 text-ht-muted">Your saved notes for today.</p>
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        {summaryItems.map((item) => (
          <div key={item.label} className="rounded-2xl bg-ht-background px-4 py-3">
            <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-ht-muted">{item.label}</dt>
            <dd className="mt-1 text-base font-semibold text-ht-ink">{item.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-3 rounded-2xl bg-ht-background px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ht-muted">Notes</p>
        <p className="mt-1 whitespace-pre-wrap text-base leading-7 text-ht-ink">
          {log.symptomNotes || "No notes recorded."}
        </p>
      </div>
    </section>
  )
}

export default WellnessSummary
