import { CheckCircle2, Droplets, Heart, Moon, Pill } from "lucide-react"
import { Link } from "react-router-dom"

import { moodOptions } from "@/lib/wellness"

function SummarySkeleton() {
  return (
    <div className="rounded-2xl border border-ht-border bg-white p-5 shadow-[0_14px_36px_rgba(5,31,32,0.05)]">
      <div className="flex items-center justify-between gap-4">
        <div className="h-4 w-24 animate-pulse rounded-full bg-ht-green-soft" />
        <div className="size-10 animate-pulse rounded-full bg-ht-green-soft" />
      </div>
      <div className="mt-5 h-9 w-32 animate-pulse rounded-full bg-ht-background" />
      <div className="mt-4 h-3 w-36 animate-pulse rounded-full bg-ht-background" />
    </div>
  )
}

function ProgressBar({ value, max, label }) {
  const safeMax = Math.max(Number(max) || 1, 1)
  const safeValue = Math.min(Math.max(Number(value) || 0, 0), safeMax)
  const percentage = Math.round((safeValue / safeMax) * 100)

  return (
    <div
      className="mt-4 h-2 overflow-hidden rounded-full bg-ht-background"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={safeValue}
      aria-valuetext={`${safeValue} of ${safeMax}`}
    >
      <div className="h-full rounded-full bg-ht-teal" style={{ width: `${percentage}%` }} />
    </div>
  )
}

function SummaryCard({ to, icon: Icon, label, value, supporting, children, ariaLabel }) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-ht-border bg-white p-5 shadow-[0_14px_36px_rgba(5,31,32,0.05)] transition hover:-translate-y-0.5 hover:border-ht-teal/40 hover:shadow-[0_18px_42px_rgba(5,31,32,0.08)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ht-teal/20"
      aria-label={ariaLabel || `${label}: ${value}`}
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-ht-muted">{label}</p>
        <div className="flex size-10 items-center justify-center rounded-full bg-ht-green-soft text-ht-teal-dark transition group-hover:bg-ht-teal group-hover:text-white">
          <Icon className="size-5" aria-hidden="true" />
        </div>
      </div>
      <p className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl">{value}</p>
      {supporting ? <p className="mt-2 text-sm font-medium text-ht-muted">{supporting}</p> : null}
      {children}
    </Link>
  )
}

function formatMood(value) {
  return moodOptions.find((option) => option.value === value)?.label || ""
}

function formatSleep(value) {
  if (value == null || value === "") return ""
  const number = Number(value)
  if (!Number.isFinite(number)) return ""

  return `${number.toFixed(Number.isInteger(number) ? 0 : 1)} h`
}

function getMedicineValue(summary) {
  if (!summary.totalDoses) return "No doses"
  return `${summary.completed} / ${summary.totalDoses} taken`
}

function getMedicineSupporting(summary) {
  if (!summary.totalDoses) return "Add medicines to build today"
  if (summary.upcoming > 0) return `${summary.upcoming} upcoming`
  if (summary.pending > 0) return `${summary.pending} ready to mark`
  if (summary.missed > 0) return `${summary.missed} marked missed`
  return "Routine complete"
}

function DashboardSummary({ medicineSummary, wellnessLog, medicineLoading, wellnessLoading, wellnessError }) {
  const hydration = wellnessLog?.hydration
  const hydrationValue = hydration
    ? `${Number(hydration.glasses ?? 0)} / ${Number(hydration.goal ?? 8)} glasses`
    : wellnessError
      ? "Unavailable"
      : "Not checked in yet"
  const moodValue = wellnessLog?.mood
    ? formatMood(wellnessLog.mood) || "Not recorded"
    : wellnessError
      ? "Unavailable"
      : "Not checked in yet"
  const sleepValue = wellnessLog
    ? formatSleep(wellnessLog.sleepHours) || "Not recorded"
    : wellnessError
      ? "Unavailable"
      : "Not checked in yet"

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Today's health summary">
      {medicineLoading ? (
        <SummarySkeleton />
      ) : (
        <SummaryCard
          to="/medicines"
          icon={medicineSummary.completed === medicineSummary.totalDoses && medicineSummary.totalDoses > 0 ? CheckCircle2 : Pill}
          label="Medicines"
          value={getMedicineValue(medicineSummary)}
          supporting={getMedicineSupporting(medicineSummary)}
          ariaLabel={`Medicines: ${getMedicineValue(medicineSummary)}. ${getMedicineSupporting(medicineSummary)}.`}
        />
      )}

      {wellnessLoading ? (
        <SummarySkeleton />
      ) : (
        <SummaryCard
          to="/wellness"
          icon={Droplets}
          label="Hydration"
          value={hydrationValue}
          supporting={hydration ? "Small steps count." : "A quick check-in takes less than a minute."}
          ariaLabel={`Hydration: ${hydrationValue}`}
        >
          {hydration ? (
            <ProgressBar
              value={hydration.glasses}
              max={hydration.goal}
              label="Today's hydration progress"
            />
          ) : null}
        </SummaryCard>
      )}

      {wellnessLoading ? (
        <SummarySkeleton />
      ) : (
        <SummaryCard
          to="/wellness"
          icon={Heart}
          label="Mood"
          value={moodValue}
          supporting={wellnessLog ? "You can update this anytime." : "Check in when you're ready."}
          ariaLabel={`Mood: ${moodValue}`}
        />
      )}

      {wellnessLoading ? (
        <SummarySkeleton />
      ) : (
        <SummaryCard
          to="/wellness"
          icon={Moon}
          label="Sleep"
          value={sleepValue}
          supporting={wellnessLog ? "Saved for today." : "No sleep check-in yet."}
          ariaLabel={`Sleep: ${sleepValue}`}
        />
      )}

      {wellnessError ? (
        <div className="sr-only" role="status">
          We couldn't load today's wellness check-in.
        </div>
      ) : null}
    </section>
  )
}

export default DashboardSummary
