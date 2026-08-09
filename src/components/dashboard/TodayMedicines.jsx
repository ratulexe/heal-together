import { Link } from "react-router-dom"
import { Pill } from "lucide-react"

import DoseCard from "@/components/dashboard/DoseCard"
import { Button } from "@/components/ui/button"

function TodayMedicines({ doses, loading, onSetStatus, updatingDoseId }) {
  if (loading) {
    return (
      <section className="rounded-2xl border border-ht-border bg-white p-5 shadow-[0_14px_36px_rgba(5,31,32,0.05)]">
        <div className="h-7 w-48 animate-pulse rounded-full bg-ht-green-soft" />
        <div className="mt-6 grid gap-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-28 animate-pulse rounded-2xl bg-ht-background" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-ht-border bg-white p-5 shadow-[0_14px_36px_rgba(5,31,32,0.05)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold">Today&apos;s Medicines</h2>
          <p className="mt-1 text-sm text-ht-muted">
            Track the routine already provided to you.
          </p>
        </div>
      </div>

      {doses.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-ht-border bg-ht-background p-6 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-white text-ht-teal-dark">
            <Pill aria-hidden="true" />
          </div>
          <h3 className="mt-4 font-display text-2xl font-semibold">Your routine starts here</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ht-muted">
            Add your first medicine to begin building today&apos;s schedule.
          </p>
          <Button
            nativeButton={false}
            className="mt-5 h-11 rounded-full bg-ht-teal px-5 text-white hover:bg-ht-teal-dark"
            render={<Link to="/medicines/new" />}
          >
            Add Medicine
          </Button>
        </div>
      ) : (
        <div className="mt-6 grid gap-3">
          {doses.map((dose) => (
            <DoseCard
              key={dose.id}
              dose={dose}
              onSetStatus={onSetStatus}
              updating={updatingDoseId === dose.id}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default TodayMedicines
