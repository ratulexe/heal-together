import {
  CircleCheck,
  Droplets,
  Heart,
  Pill,
  QrCode,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"

const cards = [
  {
    title: "Medicine",
    detail: "Morning dose taken",
    meta: "8:30 AM",
    icon: Pill,
    tone: "success",
  },
  {
    title: "Hydration",
    detail: "6 / 8 glasses",
    meta: "75% complete",
    icon: Droplets,
    tone: "info",
    progress: 75,
  },
  {
    title: "Mood",
    detail: "Feeling calm",
    meta: "Checked in",
    icon: Heart,
    tone: "softBlue",
  },
  {
    title: "Caregiver",
    detail: "Connected",
    meta: "Support active",
    icon: Users,
    tone: "teal",
  },
  {
    title: "Emergency Card",
    detail: "QR ready",
    meta: "Quick access",
    icon: QrCode,
    tone: "success",
  },
]

const toneClasses = {
  success: {
    icon: "bg-ht-success-bg text-ht-success",
    dot: "bg-ht-success",
  },
  info: {
    icon: "bg-ht-info-bg text-ht-info",
    dot: "bg-ht-info",
  },
  softBlue: {
    icon: "bg-ht-blue/20 text-ht-blue-dark",
    dot: "bg-ht-blue-dark",
  },
  teal: {
    icon: "bg-ht-green-soft text-ht-teal-dark",
    dot: "bg-ht-teal",
  },
}

function HealthFloatingCard({
  title,
  detail,
  meta,
  icon: Icon,
  tone,
  progress,
}) {
  const colors = toneClasses[tone]

  return (
    <article
      className={cn(
        "group flex min-h-32 flex-col justify-between rounded-3xl border border-ht-border bg-white/90 p-4 text-left shadow-[0_16px_50px_rgba(5,31,32,0.08)] backdrop-blur transition duration-200",
        "motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-[0_22px_70px_rgba(5,31,32,0.11)]"
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-2xl",
            colors.icon
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-ht-muted">{title}</p>
            <span className={cn("size-2 rounded-full", colors.dot)} />
          </div>
          <p className="mt-1 font-display text-lg font-semibold leading-6 text-ht-ink">
            {detail}
          </p>
          <p className="mt-1 text-sm leading-5 text-ht-muted">{meta}</p>
        </div>
        {tone === "success" ? (
          <CircleCheck className="size-4 shrink-0 text-ht-success" aria-hidden="true" />
        ) : null}
      </div>

      {typeof progress === "number" ? (
        <div
          className="mt-4 h-2 overflow-hidden rounded-full bg-ht-green-soft"
          aria-label={`${title} progress ${progress}%`}
        >
          <span
            className="block h-full rounded-full bg-ht-info"
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : null}
    </article>
  )
}

function HealthFloatingCards() {
  return (
    <section
      className="relative mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6 lg:pb-2"
      aria-label="HealTogether feature highlights"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:items-stretch lg:gap-4">
        {cards.map((card) => (
          <HealthFloatingCard key={card.title} {...card} />
        ))}
      </div>
    </section>
  )
}

export default HealthFloatingCards
