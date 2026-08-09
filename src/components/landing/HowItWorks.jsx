import { CheckCircle2, Circle, Sparkles } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Create your space",
    description: "Set up your account and choose what you want to manage.",
  },
  {
    number: "02",
    title: "Add your routine",
    description: "Add your existing medicines and simple wellness check-ins.",
  },
  {
    number: "03",
    title: "Stay connected",
    description:
      "Review your progress and optionally connect a trusted caregiver.",
  },
]

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-28 px-4 py-14 sm:px-6 lg:py-20"
      aria-labelledby="how-heading"
    >
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-medium text-ht-teal-dark">
            Simple from day one
          </p>
          <h2
            id="how-heading"
            className="mt-3 text-balance font-display text-3xl font-semibold leading-tight text-ht-ink sm:text-4xl md:text-5xl"
          >
            Start with one routine.
            <span className="block">Build from there.</span>
          </h2>
          <div className="mt-8 space-y-4">
            {steps.map((step) => (
              <article
                key={step.number}
                className="rounded-3xl border border-ht-border bg-white/85 p-5 shadow-[0_12px_45px_rgba(5,31,32,0.05)]"
              >
                <div className="flex gap-4">
                  <span className="font-display text-xl font-semibold text-ht-teal">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-ht-ink">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-ht-muted">
                      {step.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-ht-border bg-white/80 p-5 shadow-[0_24px_80px_rgba(5,31,32,0.08)] backdrop-blur sm:p-6">
          <div className="rounded-[1.5rem] bg-ht-background p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ht-muted">Setup path</p>
                <h3 className="mt-1 font-display text-2xl font-semibold text-ht-ink">
                  Your first routine
                </h3>
              </div>
              <span className="flex size-11 items-center justify-center rounded-2xl bg-white text-ht-teal shadow-sm">
                <Sparkles className="size-5" aria-hidden="true" />
              </span>
            </div>

            <div className="space-y-3">
              {["Account created", "Morning medicine added", "Caregiver invite optional"].map(
                (item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-ht-border bg-white p-4"
                  >
                    {index < 2 ? (
                      <CheckCircle2 className="size-5 text-ht-success" aria-hidden="true" />
                    ) : (
                      <Circle className="size-5 text-ht-blue-dark" aria-hidden="true" />
                    )}
                    <span className="text-sm font-medium text-ht-ink">{item}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
