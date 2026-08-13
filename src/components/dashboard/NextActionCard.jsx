import { CheckCircle2, Clock3, Pill } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { formatDisplayTime } from "@/lib/schedule"

function getNextAction(doses) {
  if (!doses.length) {
    return {
      icon: Pill,
      title: "Add medicines to build today's schedule",
      description: "Once medicines are added, your next routine step will appear here.",
      cta: "Add Medicine",
      href: "/medicines/new",
    }
  }

  const pendingDose = doses.find((dose) => dose.status === "pending")
  if (pendingDose) {
    return {
      icon: Clock3,
      title: `${pendingDose.medicineName} is ready to mark`,
      description: `${formatDisplayTime(pendingDose.scheduledTime)} dose for today.`,
      cta: "Review medicines",
      href: "/medicines",
    }
  }

  const upcomingDose = doses.find((dose) => dose.status === "upcoming")
  if (upcomingDose) {
    return {
      icon: Clock3,
      title: `Next medicine at ${formatDisplayTime(upcomingDose.scheduledTime)}`,
      description: upcomingDose.medicineName,
      cta: "View schedule",
      href: "/medicines",
    }
  }

  const allTaken = doses.every((dose) => dose.status === "taken")
  if (allTaken) {
    return {
      icon: CheckCircle2,
      title: "All medicines completed for today",
      description: "Small steps count.",
      cta: "View medicines",
      href: "/medicines",
    }
  }

  return {
    icon: CheckCircle2,
    title: "Today's medicine schedule is wrapped up",
    description: "You can review or update today's dose statuses anytime.",
    cta: "View medicines",
    href: "/medicines",
  }
}

function NextActionCard({ doses, loading }) {
  if (loading) {
    return (
      <section className="rounded-2xl border border-ht-border bg-white p-5 shadow-[0_14px_36px_rgba(5,31,32,0.05)]">
        <div className="h-4 w-24 animate-pulse rounded-full bg-ht-green-soft" />
        <div className="mt-4 h-8 w-72 max-w-full animate-pulse rounded-full bg-ht-background" />
        <div className="mt-3 h-4 w-48 animate-pulse rounded-full bg-ht-background" />
      </section>
    )
  }

  const action = getNextAction(doses)
  const Icon = action.icon

  return (
    <section className="rounded-2xl border border-ht-border bg-white p-5 shadow-[0_14px_36px_rgba(5,31,32,0.05)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-ht-info-bg text-ht-info">
            <Icon className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-ht-teal-dark">
              Next action
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold">{action.title}</h2>
            <p className="mt-1 text-sm leading-6 text-ht-muted">{action.description}</p>
          </div>
        </div>
        <Button
          nativeButton={false}
          variant="outline"
          className="h-11 rounded-full border-ht-border bg-white hover:bg-ht-green-soft/70"
          render={<Link to={action.href} />}
        >
          {action.cta}
        </Button>
      </div>
    </section>
  )
}

export default NextActionCard
