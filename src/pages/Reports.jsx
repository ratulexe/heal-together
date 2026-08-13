import { useEffect, useMemo, useState } from "react"
import { BatteryCharging, CalendarDays, Droplets, HeartPulse, Moon, Pill } from "lucide-react"

import MoodSummary from "@/components/reports/MoodSummary"
import ReportSummaryCard from "@/components/reports/ReportSummaryCard"
import ReportsEmptyState from "@/components/reports/ReportsEmptyState"
import TrendChartCard from "@/components/reports/TrendChartCard"
import WeeklyHighlights from "@/components/reports/WeeklyHighlights"
import { useAuth } from "@/hooks/useAuth"
import { buildLastSevenDays, formatReportRange } from "@/lib/reports"
import { getWeeklyReport } from "@/services/reportService"

function formatAverage(value, unit) {
  if (value == null) return "Not recorded"
  return `${value} ${unit}`
}

function formatHydrationAverage(wellness) {
  if (wellness.averageHydration == null) return "Not recorded"
  if (wellness.averageHydrationGoal == null) return `${wellness.averageHydration} glasses`

  return `${wellness.averageHydration} / ${wellness.averageHydrationGoal} glasses`
}

function formatMedicineValue(medicine, hasError) {
  if (hasError) return "Unavailable"
  if (medicine.adherencePercent == null) return "No doses"
  return `${medicine.adherencePercent}%`
}

function formatMedicineSupporting(medicine, hasError) {
  if (hasError) return "We couldn't load medicine report data."
  if (medicine.scheduledDoses === 0) return "No scheduled doses in this range"

  const parts = [`${medicine.takenDoses} of ${medicine.scheduledDoses} doses taken`]
  if (medicine.missedDoses > 0) parts.push(`${medicine.missedDoses} missed`)
  if (medicine.unmarkedDoses > 0) parts.push(`${medicine.unmarkedDoses} not marked yet`)

  return parts.join(" | ")
}

function ReportsLoading() {
  return (
    <div className="grid gap-6">
      <section className="rounded-2xl border border-ht-border bg-white p-6 shadow-[0_14px_36px_rgba(5,31,32,0.05)]">
        <div className="h-5 w-28 animate-pulse rounded-full bg-ht-green-soft" />
        <div className="mt-4 h-11 w-64 max-w-full animate-pulse rounded-full bg-ht-green-soft" />
        <div className="mt-4 h-6 w-96 max-w-full animate-pulse rounded-full bg-ht-background" />
      </section>
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[0, 1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-40 animate-pulse rounded-2xl border border-ht-border bg-white shadow-[0_14px_36px_rgba(5,31,32,0.05)]"
          />
        ))}
      </section>
      <section className="grid gap-6 xl:grid-cols-2">
        {[0, 1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-96 animate-pulse rounded-2xl border border-ht-border bg-white shadow-[0_14px_36px_rgba(5,31,32,0.05)]"
          />
        ))}
      </section>
    </div>
  )
}

function Reports() {
  const { user } = useAuth()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const now = useMemo(() => new Date(), [])
  const days = useMemo(() => buildLastSevenDays(now), [now])
  const dateRange = useMemo(() => formatReportRange(days), [days])
  const userId = user?.uid

  useEffect(() => {
    let ignore = false

    async function loadReport() {
      if (!userId) {
        await Promise.resolve()
        if (!ignore) setLoading(false)
        return
      }

      await Promise.resolve()
      if (ignore) return

      setLoading(true)
      setError("")

      try {
        const weeklyReport = await getWeeklyReport(userId, days, now)

        if (!ignore) {
          setReport(weeklyReport)
        }
      } catch {
        if (!ignore) {
          setReport(null)
          setError("We couldn't load your weekly report. Please try again.")
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadReport()

    return () => {
      ignore = true
    }
  }, [days, now, userId])

  if (loading) return <ReportsLoading />

  if (error) {
    return (
      <div className="grid gap-6">
        <ReportsHeader dateRange={dateRange} />
        <div
          role="alert"
          className="rounded-2xl border border-ht-danger/20 bg-ht-danger-bg/70 px-4 py-3 text-sm font-medium text-ht-danger"
        >
          {error}
        </div>
      </div>
    )
  }

  const sourceErrors = report?.sourceErrors || {}
  const medicine = report?.medicine || {}
  const wellness = report?.wellness || {}
  const hasSourceError = sourceErrors.medicine || sourceErrors.wellness

  return (
    <div className="grid gap-6">
      <ReportsHeader dateRange={dateRange} />

      {hasSourceError ? (
        <div
          role="status"
          className="rounded-2xl border border-ht-border bg-white px-4 py-3 text-sm font-medium text-ht-muted shadow-[0_14px_36px_rgba(5,31,32,0.05)]"
        >
          Some weekly data could not be loaded. Available sections are shown below.
        </div>
      ) : null}

      {!report?.hasAnyData && !hasSourceError ? (
        <ReportsEmptyState />
      ) : (
        <>
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5" aria-label="Weekly report summary">
            <ReportSummaryCard
              icon={Pill}
              label="Medicine Adherence"
              value={formatMedicineValue(medicine, sourceErrors.medicine)}
              supporting={formatMedicineSupporting(medicine, sourceErrors.medicine)}
            />
            <ReportSummaryCard
              icon={HeartPulse}
              label="Wellness Check-ins"
              value={sourceErrors.wellness ? "Unavailable" : `${wellness.checkInCount} / 7 days`}
              supporting={
                sourceErrors.wellness
                  ? "We couldn't load wellness report data."
                  : wellness.checkInCount === 0
                    ? "No check-ins yet this week"
                    : "Wellness check-ins completed"
              }
            />
            <ReportSummaryCard
              icon={Droplets}
              label="Hydration Average"
              value={sourceErrors.wellness ? "Unavailable" : formatHydrationAverage(wellness)}
              supporting="Recorded hydration entries only"
            />
            <ReportSummaryCard
              icon={Moon}
              label="Sleep Average"
              value={sourceErrors.wellness ? "Unavailable" : formatAverage(wellness.averageSleep, "hours")}
              supporting="Recorded sleep entries only"
            />
            <ReportSummaryCard
              icon={BatteryCharging}
              label="Energy Average"
              value={
                sourceErrors.wellness
                  ? "Unavailable"
                  : wellness.averageEnergy == null
                    ? "Not recorded"
                    : `${wellness.averageEnergy} / 5`
              }
              supporting={sourceErrors.wellness ? "We couldn't load wellness report data." : "Recorded energy entries only"}
            />
          </section>

          <section className="grid gap-6 xl:grid-cols-2" aria-label="Weekly wellness trends">
            <TrendChartCard
              title="Hydration Trend"
              summary={
                sourceErrors.wellness
                  ? "Hydration trend is unavailable right now."
                  : `Hydration was logged on ${wellness.hydrationDays} of 7 days. Average hydration: ${
                      wellness.averageHydration ?? "not recorded"
                    } glasses.`
              }
              data={report.chartData}
              dataKey="hydration"
              unit="glasses"
              color="#0FA3A0"
              kind="bar"
              emptyMessage="No hydration entries recorded this week."
            />
            <TrendChartCard
              title="Sleep Trend"
              summary={
                sourceErrors.wellness
                  ? "Sleep trend is unavailable right now."
                  : `Sleep was recorded on ${wellness.sleepDays} of 7 days. Average sleep: ${
                      wellness.averageSleep ?? "not recorded"
                    } hours.`
              }
              data={report.chartData}
              dataKey="sleep"
              unit="hours"
              color="#3B82C4"
              kind="line"
              emptyMessage="No sleep entries recorded this week."
            />
            <MoodSummary
              distribution={wellness.moodDistribution || []}
              mostCommonMood={wellness.mostCommonMood}
              recordedDays={wellness.moodDays || 0}
              error={sourceErrors.wellness}
            />
            <TrendChartCard
              title="Energy Trend"
              summary={
                sourceErrors.wellness
                  ? "Energy trend is unavailable right now."
                  : `Energy was recorded on ${wellness.energyDays} of 7 days. Average energy: ${
                      wellness.averageEnergy == null ? "not recorded" : `${wellness.averageEnergy} / 5`
                    }.`
              }
              data={report.chartData}
              dataKey="energy"
              unit="/ 5"
              color="#16A34A"
              kind="line"
              yDomain={[1, 5]}
              emptyMessage="No energy entries recorded this week."
            />
          </section>

          <WeeklyHighlights highlights={report.highlights} />
        </>
      )}
    </div>
  )
}

function ReportsHeader({ dateRange }) {
  return (
    <section className="rounded-2xl border border-ht-border bg-white p-6 shadow-[0_14px_36px_rgba(5,31,32,0.05)] sm:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-ht-green-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-ht-teal-dark">
            <CalendarDays className="size-4" aria-hidden="true" />
            Last 7 days
          </div>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">
            Weekly Report
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-ht-muted">
            See how your daily routines looked over the last 7 days.
          </p>
        </div>
        <p className="rounded-full border border-ht-border bg-ht-background px-4 py-2 text-sm font-semibold text-ht-teal-dark">
          {dateRange}
        </p>
      </div>
    </section>
  )
}

export default Reports
