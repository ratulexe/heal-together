import { Heart } from "lucide-react"

function MoodSummary({ distribution, mostCommonMood, recordedDays, error = false }) {
  const maxCount = Math.max(...distribution.map((item) => item.count), 1)

  return (
    <section className="rounded-2xl border border-ht-border bg-white p-5 shadow-[0_14px_36px_rgba(5,31,32,0.05)]">
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-ht-green-soft text-ht-teal-dark">
          <Heart className="size-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold">Mood Summary</h2>
          <p className="mt-2 text-sm leading-6 text-ht-muted">
            {error
              ? "Mood summary is unavailable right now."
              : recordedDays > 0
              ? `Mood was recorded on ${recordedDays} ${recordedDays === 1 ? "day" : "days"}.`
              : "No mood check-ins recorded this week."}
          </p>
        </div>
      </div>

      {!error && recordedDays > 0 ? (
        <>
          <p className="mt-5 rounded-2xl bg-ht-background px-4 py-3 text-sm font-semibold text-ht-ink">
            Most common mood: {mostCommonMood?.label || "Not available"}
          </p>
          <dl className="mt-4 grid gap-3">
            {distribution.map((item) => {
              const width = `${Math.round((item.count / maxCount) * 100)}%`

              return (
                <div key={item.value} className="grid gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-sm font-semibold text-ht-ink">{item.label}</dt>
                    <dd className="text-sm font-semibold text-ht-muted">{item.count}</dd>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-ht-background" aria-hidden="true">
                    <div className="h-full rounded-full bg-ht-teal" style={{ width }} />
                  </div>
                </div>
              )
            })}
          </dl>
        </>
      ) : null}
    </section>
  )
}

export default MoodSummary
