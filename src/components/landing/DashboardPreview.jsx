import {
  Bell,
  CheckCircle2,
  Clock3,
  Droplets,
  HeartPulse,
  Moon,
  Pill,
  QrCode,
  ShieldCheck,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

const summaryItems = [
  { label: "Medicines", value: "3 / 4", icon: Pill, color: "text-ht-teal" },
  { label: "Water", value: "6 / 8", icon: Droplets, color: "text-ht-info" },
  { label: "Mood", value: "Calm", icon: HeartPulse, color: "text-ht-blue-dark" },
  { label: "Sleep", value: "7.5h", icon: Moon, color: "text-ht-teal-dark" },
]

const medicines = [
  { name: "Morning Medicine", time: "8:30 AM", status: "Taken", tone: "success" },
  { name: "Afternoon Medicine", time: "2:00 PM", status: "Upcoming", tone: "info" },
  { name: "Evening Medicine", time: "9:00 PM", status: "Pending", tone: "warning" },
]

const weeklyProgress = ["done", "done", "done", "today", "rest", "rest", "rest"]

function statusClasses(tone) {
  return {
    success: "bg-ht-success-bg text-ht-success",
    info: "bg-ht-info-bg text-ht-info",
    warning: "bg-ht-warning-bg text-amber-700",
  }[tone]
}

function DashboardPreview() {
  return (
    <section
      id="how-it-works"
      className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-16"
      aria-labelledby="preview-heading"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium text-ht-teal-dark">How it works</p>
        <h2
          id="preview-heading"
          className="mt-3 font-display text-3xl font-semibold leading-tight text-ht-ink sm:text-4xl md:text-5xl"
        >
          One calm dashboard for the routines that matter.
        </h2>
        <p className="mt-4 text-base leading-7 text-ht-muted sm:text-lg">
          See today’s medicines, wellness signals, emergency details, and
          caregiver support in one organized view.
        </p>
      </div>

      <div className="relative mt-10">
        <div className="absolute -left-8 top-20 hidden rounded-3xl border border-ht-border bg-white/90 p-4 shadow-[0_18px_55px_rgba(5,31,32,0.10)] backdrop-blur lg:block">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-ht-green-soft text-ht-teal-dark">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ht-ink">Emergency Card</p>
              <p className="text-xs text-ht-muted">Ready for quick access</p>
            </div>
          </div>
        </div>

        <div className="absolute -right-7 bottom-16 hidden rounded-3xl border border-ht-border bg-white/90 p-4 shadow-[0_18px_55px_rgba(5,31,32,0.10)] backdrop-blur lg:block">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-ht-info-bg text-ht-info">
              <Users className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ht-ink">Caregiver</p>
              <p className="text-xs text-ht-muted">Connected</p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-ht-border bg-white/75 shadow-[0_28px_90px_rgba(5,31,32,0.11)] backdrop-blur">
          <div className="flex items-center gap-2 border-b border-ht-border bg-white/80 px-5 py-4">
            <span className="size-3 rounded-full bg-ht-danger/70" />
            <span className="size-3 rounded-full bg-ht-warning/75" />
            <span className="size-3 rounded-full bg-ht-success/80" />
            <div className="ml-3 hidden h-8 flex-1 items-center rounded-full border border-ht-border bg-ht-background px-4 text-xs font-medium text-ht-muted sm:flex">
              app.healtogether/routine
            </div>
          </div>

          <div className="bg-[linear-gradient(180deg,rgba(248,255,250,0.98),rgba(255,255,255,0.98))] p-4 sm:p-6 lg:p-8">
            <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
              <div className="space-y-5">
                <div className="flex flex-col gap-4 rounded-3xl border border-ht-border bg-white p-5 shadow-[0_12px_45px_rgba(5,31,32,0.06)] sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-ht-muted">Today</p>
                    <h3 className="mt-2 font-display text-3xl font-semibold leading-tight text-ht-ink">
                      Good morning, Alex
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-ht-muted">
                      Here’s your health routine for today.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-ht-border bg-ht-background px-3 py-2 text-sm font-medium text-ht-muted">
                    <Bell className="size-4 text-ht-teal" aria-hidden="true" />
                    Routine reminders on
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {summaryItems.map((item) => (
                    <Card
                      key={item.label}
                      className="rounded-3xl border border-ht-border bg-white py-0 shadow-none ring-0"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-ht-muted">{item.label}</p>
                          <item.icon className={`size-5 ${item.color}`} aria-hidden="true" />
                        </div>
                        <p className="mt-4 font-display text-2xl font-semibold text-ht-ink">
                          {item.value}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="rounded-3xl border border-ht-border bg-white p-5 shadow-[0_12px_45px_rgba(5,31,32,0.06)]">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-display text-xl font-semibold text-ht-ink">
                        Today’s medicines
                      </h3>
                      <p className="mt-1 text-sm text-ht-muted">
                        Simple status for each routine item.
                      </p>
                    </div>
                    <Pill className="size-5 text-ht-teal" aria-hidden="true" />
                  </div>

                  <div className="space-y-3">
                    {medicines.map((medicine) => (
                      <div
                        key={medicine.name}
                        className="flex flex-col gap-3 rounded-2xl border border-ht-border bg-ht-background/70 p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex size-10 items-center justify-center rounded-2xl bg-white text-ht-teal shadow-sm">
                            {medicine.status === "Taken" ? (
                              <CheckCircle2 className="size-5" aria-hidden="true" />
                            ) : (
                              <Clock3 className="size-5" aria-hidden="true" />
                            )}
                          </span>
                          <div>
                            <p className="font-medium text-ht-ink">{medicine.name}</p>
                            <p className="text-sm text-ht-muted">{medicine.time}</p>
                          </div>
                        </div>
                        <Badge className={`${statusClasses(medicine.tone)} border-transparent`}>
                          {medicine.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <aside className="space-y-5">
                <div className="rounded-3xl border border-ht-border bg-white p-5 shadow-[0_12px_45px_rgba(5,31,32,0.06)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-xl font-semibold text-ht-ink">
                        Emergency Health Card
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-ht-muted">
                        Important details are organized for quick access.
                      </p>
                    </div>
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-ht-green-soft text-ht-teal-dark">
                      <QrCode className="size-5" aria-hidden="true" />
                    </span>
                  </div>
                  <Badge className="mt-5 bg-ht-success-bg text-ht-success">
                    Ready
                  </Badge>
                </div>

                <div className="rounded-3xl border border-ht-border bg-white p-5 shadow-[0_12px_45px_rgba(5,31,32,0.06)]">
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-2xl bg-ht-info-bg text-ht-info">
                      <Users className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-semibold text-ht-ink">
                        Caregiver connected
                      </h3>
                      <p className="mt-1 text-sm text-ht-muted">
                        Support stays visible without taking over.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-ht-border bg-white p-5 shadow-[0_12px_45px_rgba(5,31,32,0.06)]">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-xl font-semibold text-ht-ink">
                        Weekly progress
                      </h3>
                      <p className="mt-1 text-sm text-ht-muted">
                        Small routines, steady rhythm.
                      </p>
                    </div>
                    <HeartPulse className="size-5 text-ht-teal" aria-hidden="true" />
                  </div>
                  <div className="grid grid-cols-7 gap-2" aria-label="Weekly routine progress">
                    {weeklyProgress.map((state, index) => (
                      <span
                        key={`${state}-${index}`}
                        className={`h-16 rounded-full ${
                          state === "done"
                            ? "bg-ht-teal"
                            : state === "today"
                              ? "bg-ht-blue"
                              : "bg-ht-green-soft"
                        }`}
                        title={`Day ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DashboardPreview
