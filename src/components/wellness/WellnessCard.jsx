function WellnessCard({ icon: Icon, title, description, children }) {
  return (
    <section className="rounded-2xl border border-ht-border bg-white p-5 shadow-[0_14px_36px_rgba(5,31,32,0.05)]">
      <div className="flex items-start gap-3">
        {Icon ? (
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-ht-green-soft text-ht-teal-dark">
            <Icon className="size-5" aria-hidden="true" />
          </div>
        ) : null}
        <div>
          <h2 className="font-display text-2xl font-semibold">{title}</h2>
          {description ? <p className="mt-1 text-sm leading-6 text-ht-muted">{description}</p> : null}
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  )
}

export default WellnessCard
