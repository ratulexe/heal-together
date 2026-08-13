import { HeartPulse, LayoutDashboard } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"

function ReportsEmptyState() {
  return (
    <section className="rounded-2xl border border-dashed border-ht-border bg-white p-6 text-center shadow-[0_14px_36px_rgba(5,31,32,0.05)] sm:p-8">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-ht-green-soft text-ht-teal-dark">
        <HeartPulse className="size-6" aria-hidden="true" />
      </div>
      <h2 className="mt-5 font-display text-3xl font-semibold">Your weekly picture will appear here</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-ht-muted">
        Complete daily routines and wellness check-ins to start seeing your 7-day summary.
      </p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Button
          nativeButton={false}
          className="h-11 rounded-full bg-ht-teal px-5 text-white hover:bg-ht-teal-dark"
          render={<Link to="/dashboard" />}
        >
          <LayoutDashboard aria-hidden="true" />
          Check today&apos;s routine
        </Button>
        <Button
          nativeButton={false}
          variant="outline"
          className="h-11 rounded-full border-ht-border bg-white hover:bg-ht-green-soft/70"
          render={<Link to="/wellness" />}
        >
          Complete wellness check-in
        </Button>
      </div>
    </section>
  )
}

export default ReportsEmptyState
