function HealthStatusCard({ icon: Icon, label, value, subtext, tone = "teal" }) {
  const toneClass = {
    teal: "bg-ht-green-soft text-ht-teal-dark",
    blue: "bg-ht-info-bg text-ht-info",
    softBlue: "bg-ht-blue/20 text-ht-blue-dark",
    success: "bg-ht-success-bg text-ht-success",
  }[tone]

  return (
    <article className="group rounded-3xl border border-ht-border bg-white/90 p-4 text-left shadow-[0_14px_45px_rgba(5,31,32,0.07)] backdrop-blur transition md:hover:-translate-y-1 md:hover:shadow-[0_20px_60px_rgba(5,31,32,0.10)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-ht-muted">{label}</p>
          <p className="mt-2 font-display text-2xl font-semibold leading-none text-ht-ink">
            {value}
          </p>
          <p className="mt-2 text-sm leading-5 text-ht-muted">{subtext}</p>
        </div>
        <div className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${toneClass}`}>
          <Icon className="size-5" aria-hidden="true" />
        </div>
      </div>
    </article>
  )
}

export default HealthStatusCard
