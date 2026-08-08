import { Check, Droplets, Heart, Pill, QrCode, Users } from "lucide-react"

import HealthStatusCard from "@/components/landing/HealthStatusCard"

const cards = [
  {
    label: "Medicine",
    value: "Taken",
    subtext: "8:30 AM",
    icon: Pill,
    tone: "success",
  },
  {
    label: "Water",
    value: "6 / 8",
    subtext: "glasses today",
    icon: Droplets,
    tone: "blue",
  },
  {
    label: "Mood",
    value: "Calm",
    subtext: "today",
    icon: Heart,
    tone: "softBlue",
  },
  {
    label: "Caregiver",
    value: "Connected",
    subtext: "support active",
    icon: Users,
    tone: "teal",
  },
  {
    label: "Emergency Card",
    value: "Ready",
    subtext: "quick access",
    icon: QrCode,
    tone: "success",
  },
]

function HealthStatusCards() {
  return (
    <section
      id="features"
      className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-10"
      aria-labelledby="features-heading"
    >
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-ht-teal-dark">Small wins</p>
          <h2
            id="features-heading"
            className="mt-2 font-display text-2xl font-semibold leading-tight text-ht-ink sm:text-3xl"
          >
            A clearer day, one routine at a time.
          </h2>
        </div>
        <Check className="hidden size-6 text-ht-success sm:block" aria-hidden="true" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
          <HealthStatusCard key={card.label} {...card} />
        ))}
      </div>
    </section>
  )
}

export default HealthStatusCards
