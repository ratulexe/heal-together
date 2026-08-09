import {
  BrainCircuit,
  CalendarCheck2,
  HeartPulse,
  Pill,
  QrCode,
  Users,
} from "lucide-react"

const features = [
  {
    title: "Medicine routines",
    description:
      "Organize existing medicine schedules and keep track of what’s taken, upcoming or missed.",
    icon: Pill,
    className: "lg:col-span-2",
  },
  {
    title: "Wellness check-ins",
    description:
      "Keep simple daily notes for hydration, mood, sleep and general wellbeing.",
    icon: HeartPulse,
    className: "lg:col-span-2",
  },
  {
    title: "Emergency Health Card",
    description:
      "Keep important health information organized for quicker access when needed.",
    icon: QrCode,
    className: "",
  },
  {
    title: "Caregiver support",
    description:
      "Share selected routine information with trusted family members or caregivers.",
    icon: Users,
    className: "",
  },
  {
    title: "Weekly overview",
    description:
      "See a simple view of how your routine went throughout the week.",
    icon: CalendarCheck2,
    className: "",
  },
  {
    title: "Responsible insights",
    description:
      "Receive supportive routine summaries without diagnosis or prescription advice.",
    icon: BrainCircuit,
    className: "",
  },
]

function FeaturesSection() {
  return (
    <section
      id="features"
      className="scroll-mt-28 px-4 py-14 sm:px-6 lg:py-20"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium text-ht-teal-dark">
            One calm space
          </p>
          <h2
            id="features-heading"
            className="mt-3 text-balance font-display text-3xl font-semibold leading-tight text-ht-ink sm:text-4xl md:text-5xl"
          >
            Everything you need for a more connected health routine.
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className={`rounded-[1.75rem] border border-ht-border bg-white/85 p-6 shadow-[0_16px_55px_rgba(5,31,32,0.06)] backdrop-blur ${feature.className}`}
            >
              <div className="flex items-start justify-between gap-4">
                <span
                  className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${
                    index < 2
                      ? "bg-ht-blue/20 text-ht-blue-dark"
                      : "bg-ht-green-soft text-ht-teal-dark"
                  }`}
                >
                  <feature.icon className="size-5" aria-hidden="true" />
                </span>
                {index < 2 && (
                  <span className="rounded-full bg-ht-background px-3 py-1 text-xs font-medium text-ht-muted">
                    Core
                  </span>
                )}
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold text-ht-ink">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-ht-muted">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
