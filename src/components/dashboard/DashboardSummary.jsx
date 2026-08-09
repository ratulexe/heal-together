import { CalendarCheck, CheckCircle2, Clock3, CircleDashed } from "lucide-react"

const summaryItems = [
  { label: "Medicines Today", key: "medicinesToday", icon: CalendarCheck },
  { label: "Completed", key: "completed", icon: CheckCircle2 },
  { label: "Upcoming", key: "upcoming", icon: Clock3 },
  { label: "Missed", key: "missed", icon: CircleDashed },
]

function DashboardSummary({ summary }) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Today's routine summary">
      {summaryItems.map((item) => {
        const Icon = item.icon

        return (
          <div
            key={item.key}
            className="rounded-2xl border border-ht-border bg-white p-5 shadow-[0_14px_36px_rgba(5,31,32,0.05)]"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-ht-muted">{item.label}</p>
              <div className="flex size-10 items-center justify-center rounded-full bg-ht-green-soft text-ht-teal-dark">
                <Icon className="size-5" aria-hidden="true" />
              </div>
            </div>
            <p className="mt-4 font-display text-4xl font-semibold">{summary[item.key] ?? 0}</p>
          </div>
        )
      })}
    </section>
  )
}

export default DashboardSummary
