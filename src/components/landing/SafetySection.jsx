import { BrainCircuit, Eye, LockKeyhole, ShieldCheck } from "lucide-react"

const principles = [
  {
    title: "User control",
    description: "You decide what information is stored and shared.",
    icon: ShieldCheck,
  },
  {
    title: "Minimal data",
    description: "Only collect information needed for the features you use.",
    icon: LockKeyhole,
  },
  {
    title: "Responsible AI",
    description:
      "AI-assisted summaries never replace professional medical advice.",
    icon: BrainCircuit,
  },
  {
    title: "No diagnosis",
    description:
      "HealTogether does not diagnose conditions or prescribe treatments.",
    icon: Eye,
  },
]

function SafetySection() {
  return (
    <section
      id="safety"
      className="scroll-mt-28 px-4 py-14 sm:px-6 lg:py-20"
      aria-labelledby="safety-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-sm font-medium text-ht-teal-dark">
              Designed responsibly
            </p>
            <h2
              id="safety-heading"
              className="mt-3 text-balance font-display text-3xl font-semibold leading-tight text-ht-ink sm:text-4xl md:text-5xl"
            >
              Your health routine stays yours.
            </h2>
          </div>
          <div className="rounded-[1.75rem] border border-ht-border bg-white p-5 shadow-[0_16px_55px_rgba(5,31,32,0.06)]">
            <p className="text-base font-semibold leading-7 text-ht-ink">
              HealTogether supports organization and routine tracking - not
              medical decision-making.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((principle) => (
            <article
              key={principle.title}
              className="rounded-3xl border border-ht-border bg-white/85 p-5 shadow-[0_12px_45px_rgba(5,31,32,0.05)]"
            >
              <div className="flex size-11 items-center justify-center rounded-2xl bg-ht-green-soft text-ht-teal-dark">
                <principle.icon className="size-5" aria-hidden="true" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-ht-ink">
                {principle.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-ht-muted">
                {principle.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SafetySection
