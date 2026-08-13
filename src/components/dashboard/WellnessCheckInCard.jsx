import { CheckCircle2, Droplets, Heart, Moon, StickyNote, Zap } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { energyOptions, moodOptions } from "@/lib/wellness"

function formatMood(value) {
  return moodOptions.find((option) => option.value === value)?.label || "Not recorded"
}

function formatEnergy(value) {
  const option = energyOptions.find((item) => item.value === Number(value))
  return option ? `${option.value} / 5` : "Not recorded"
}

function formatSleep(value) {
  if (value == null || value === "") return "Not recorded"
  const number = Number(value)
  if (!Number.isFinite(number)) return "Not recorded"

  return `${number.toFixed(Number.isInteger(number) ? 0 : 1)} h`
}

function SummaryItem({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-white/80 px-4 py-3">
      <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-ht-muted">
        <Icon className="size-4 text-ht-teal-dark" aria-hidden="true" />
        {label}
      </dt>
      <dd className="mt-2 text-base font-semibold text-ht-ink">{value}</dd>
    </div>
  )
}

function WellnessCheckInSkeleton() {
  return (
    <section className="rounded-2xl border border-ht-border bg-white p-5 shadow-[0_14px_36px_rgba(5,31,32,0.05)]">
      <div className="h-10 w-10 animate-pulse rounded-full bg-ht-green-soft" />
      <div className="mt-4 h-8 w-56 max-w-full animate-pulse rounded-full bg-ht-green-soft" />
      <div className="mt-3 h-4 w-64 max-w-full animate-pulse rounded-full bg-ht-background" />
      <div className="mt-5 h-11 w-32 animate-pulse rounded-full bg-ht-background" />
    </section>
  )
}

function WellnessCheckInCard({ log, loading, error, onRetry }) {
  if (loading) return <WellnessCheckInSkeleton />

  if (error) {
    return (
      <section className="rounded-2xl border border-ht-border bg-white p-5 shadow-[0_14px_36px_rgba(5,31,32,0.05)]">
        <div className="flex size-11 items-center justify-center rounded-full bg-ht-info-bg text-ht-info">
          <Heart className="size-5" aria-hidden="true" />
        </div>
        <h2 className="mt-4 font-display text-2xl font-semibold">Wellness check-in</h2>
        <p className="mt-2 text-sm leading-6 text-ht-muted">
          We couldn&apos;t load today&apos;s wellness check-in.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-full border-ht-border bg-white"
            onClick={onRetry}
          >
            Try again
          </Button>
          <Button
            nativeButton={false}
            className="h-11 rounded-full bg-ht-teal px-5 text-white hover:bg-ht-teal-dark"
            render={<Link to="/wellness" />}
          >
            Open Wellness
          </Button>
        </div>
      </section>
    )
  }

  if (!log) {
    return (
      <section className="rounded-2xl border border-ht-border bg-ht-green-soft/45 p-5 shadow-[0_14px_36px_rgba(5,31,32,0.05)]">
        <div className="flex size-11 items-center justify-center rounded-full bg-white text-ht-teal-dark">
          <Heart className="size-5" aria-hidden="true" />
        </div>
        <h2 className="mt-4 font-display text-2xl font-semibold">How are you feeling today?</h2>
        <p className="mt-2 text-sm leading-6 text-ht-muted">
          A quick check-in takes less than a minute.
        </p>
        <Button
          nativeButton={false}
          className="mt-5 h-11 rounded-full bg-ht-teal px-5 text-white hover:bg-ht-teal-dark"
          render={<Link to="/wellness" aria-label="Check in on today's wellness" />}
        >
          Check in
        </Button>
      </section>
    )
  }

  const hydration = log.hydration || { glasses: 0, goal: 8 }
  const notesAdded = Boolean(log.symptomNotes?.trim())

  return (
    <section className="rounded-2xl border border-ht-border bg-ht-green-soft/35 p-5 shadow-[0_14px_36px_rgba(5,31,32,0.05)]">
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-ht-teal-dark">
          <CheckCircle2 className="size-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h2 className="font-display text-2xl font-semibold">Today&apos;s check-in is saved</h2>
          <p className="mt-1 text-sm leading-6 text-ht-muted">
            You can update today&apos;s check-in anytime.
          </p>
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        <SummaryItem
          icon={Droplets}
          label="Hydration"
          value={`${Number(hydration.glasses ?? 0)} / ${Number(hydration.goal ?? 8)}`}
        />
        <SummaryItem icon={Heart} label="Mood" value={formatMood(log.mood)} />
        <SummaryItem icon={Moon} label="Sleep" value={formatSleep(log.sleepHours)} />
        <SummaryItem icon={Zap} label="Energy" value={formatEnergy(log.energyLevel)} />
        {notesAdded ? <SummaryItem icon={StickyNote} label="Notes" value="Notes added" /> : null}
      </dl>

      <Button
        nativeButton={false}
        className="mt-5 h-11 rounded-full bg-ht-teal px-5 text-white hover:bg-ht-teal-dark"
        render={<Link to="/wellness" aria-label="View or update today's wellness check-in" />}
      >
        View or update
      </Button>
    </section>
  )
}

export default WellnessCheckInCard
