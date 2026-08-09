import { CheckCircle2, HeartHandshake, ShieldCheck, Users } from "lucide-react"

const caregiverRows = [
  ["Medicine", "3 of 4 complete"],
  ["Water", "6 of 8 glasses"],
  ["Mood", "Calm"],
  ["Next routine", "9:00 PM"],
]

function CaregiverSection() {
  return (
    <section
      id="for-caregivers"
      className="scroll-mt-28 px-4 py-14 sm:px-6 lg:py-20"
      aria-labelledby="caregiver-heading"
    >
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2.25rem] border border-ht-border bg-ht-green-soft/45 shadow-[0_24px_80px_rgba(5,31,32,0.07)]">
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_0.9fr] lg:p-10">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-medium text-ht-teal-dark">
              Care feels better connected
            </p>
            <h2
              id="caregiver-heading"
              className="mt-3 text-balance font-display text-3xl font-semibold leading-tight text-ht-ink sm:text-4xl md:text-5xl"
            >
              Keep loved ones informed without constant checking.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-ht-muted sm:text-lg">
              HealTogether gives users control over what trusted caregivers can
              see, helping families stay informed while respecting independence
              and privacy.
            </p>
            <div className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-ht-teal-dark">
              <HeartHandshake className="size-4" aria-hidden="true" />
              Support without taking away control.
            </div>
          </div>

          <article className="rounded-[2rem] border border-ht-border bg-white p-5 shadow-[0_18px_60px_rgba(5,31,32,0.08)]">
            <div className="flex items-start justify-between gap-4 border-b border-ht-border pb-5">
              <div>
                <p className="text-sm font-medium text-ht-muted">Alex’s routine</p>
                <h3 className="mt-1 font-display text-2xl font-semibold text-ht-ink">
                  Today
                </h3>
              </div>
              <span className="flex size-11 items-center justify-center rounded-2xl bg-ht-info-bg text-ht-info">
                <Users className="size-5" aria-hidden="true" />
              </span>
            </div>

            <div className="divide-y divide-ht-border">
              {caregiverRows.map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4 py-4">
                  <span className="text-sm font-medium text-ht-muted">{label}</span>
                  <span className="text-right text-sm font-semibold text-ht-ink">{value}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-ht-background p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-5 text-ht-success" aria-hidden="true" />
                <span className="text-sm font-semibold text-ht-ink">
                  Caregiver status: Connected
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-ht-muted">
                <ShieldCheck className="size-4 text-ht-teal" aria-hidden="true" />
                User controlled
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

export default CaregiverSection
