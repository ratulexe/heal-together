import { HeartHandshake, QrCode, ShieldCheck, Users } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"

function QuickAccessSkeleton() {
  return (
    <div className="rounded-2xl border border-ht-border bg-white p-5 shadow-[0_14px_36px_rgba(5,31,32,0.05)]">
      <div className="h-10 w-10 animate-pulse rounded-full bg-ht-green-soft" />
      <div className="mt-4 h-6 w-36 animate-pulse rounded-full bg-ht-background" />
      <div className="mt-3 h-4 w-28 animate-pulse rounded-full bg-ht-background" />
      <div className="mt-5 h-10 w-24 animate-pulse rounded-full bg-ht-background" />
    </div>
  )
}

function QuickAccessCard({ icon: Icon, title, status, cta, href }) {
  return (
    <section className="rounded-2xl border border-ht-border bg-white p-5 shadow-[0_14px_36px_rgba(5,31,32,0.05)]">
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-ht-green-soft text-ht-teal-dark">
          <Icon className="size-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h2 className="font-display text-xl font-semibold">{title}</h2>
          <p className="mt-1 text-sm font-medium text-ht-muted">{status}</p>
        </div>
      </div>
      <Button
        nativeButton={false}
        variant="outline"
        className="mt-5 h-10 rounded-full border-ht-border bg-white hover:bg-ht-green-soft/70"
        render={<Link to={href} aria-label={`${cta}: ${title}`} />}
      >
        {cta}
      </Button>
    </section>
  )
}

function QuickAccessCards({ emergencyCard, emergencyLoading, emergencyError, caregiverCount, caregiverLoading, caregiverError }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1" aria-label="Quick access">
      {emergencyLoading ? (
        <QuickAccessSkeleton />
      ) : (
        <QuickAccessCard
          icon={emergencyCard?.sharingEnabled ? QrCode : ShieldCheck}
          title="Emergency Card"
          status={emergencyError ? "Status unavailable" : emergencyCard ? "Ready" : "Set up your card"}
          cta={emergencyCard ? "View card" : "Set up"}
          href="/emergency"
        />
      )}

      {caregiverLoading ? (
        <QuickAccessSkeleton />
      ) : (
        <QuickAccessCard
          icon={caregiverCount > 0 ? HeartHandshake : Users}
          title="Caregiver"
          status={caregiverError ? "Status unavailable" : caregiverCount > 0 ? "Connected" : "No caregiver connected"}
          cta={caregiverCount > 0 ? "View caregiver" : "Connect caregiver"}
          href="/caregiver"
        />
      )}
    </div>
  )
}

export default QuickAccessCards
