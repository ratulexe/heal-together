function ReportSummaryCard({ icon: Icon, label, value, supporting }) {
  return (
    <article className="rounded-2xl border border-ht-border bg-white p-5 shadow-[0_14px_36px_rgba(5,31,32,0.05)]">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold text-ht-muted">{label}</h2>
        <div className="flex size-10 items-center justify-center rounded-full bg-ht-green-soft text-ht-teal-dark">
          <Icon className="size-5" aria-hidden="true" />
        </div>
      </div>
      <p className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl">{value}</p>
      <p className="mt-2 text-sm leading-6 text-ht-muted">{supporting}</p>
    </article>
  )
}

export default ReportSummaryCard
