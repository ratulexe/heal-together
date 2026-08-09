import { Check, Clock3, CircleDashed } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDisplayTime, instructionLabels } from "@/lib/schedule"
import { cn } from "@/lib/utils"

const statusStyles = {
  taken: "bg-ht-green-soft text-ht-teal-dark",
  missed: "bg-ht-warning-bg text-ht-ink",
  upcoming: "bg-ht-info-bg text-ht-info",
  pending: "bg-ht-background text-ht-muted",
}

const statusLabels = {
  taken: "Taken",
  missed: "Missed",
  upcoming: "Upcoming",
  pending: "Pending",
}

function DoseCard({ dose, onSetStatus, updating }) {
  const isTaken = dose.status === "taken"
  const isMissed = dose.status === "missed"

  return (
    <article className="rounded-2xl border border-ht-border bg-white p-4 shadow-[0_12px_30px_rgba(5,31,32,0.04)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-xl font-semibold">{dose.medicineName}</h3>
            <Badge className={cn("border-transparent", statusStyles[dose.status])}>
              {statusLabels[dose.status]}
            </Badge>
          </div>
          <p className="mt-2 text-sm text-ht-muted">
            {dose.dosage} {dose.dosageUnit} at {formatDisplayTime(dose.scheduledTime)}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-ht-background text-ht-muted">
              <Clock3 aria-hidden="true" />
              {formatDisplayTime(dose.scheduledTime)}
            </Badge>
            <Badge variant="outline" className="bg-white text-ht-muted">
              {instructionLabels[dose.instructions] || "No preference"}
            </Badge>
          </div>
          {isMissed ? <p className="mt-3 text-sm text-ht-muted">Marked as missed.</p> : null}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:min-w-56">
          <Button
            type="button"
            size="sm"
            disabled={updating}
            className="h-10 rounded-full bg-ht-teal text-white hover:bg-ht-teal-dark"
            onClick={() => onSetStatus(dose, "taken")}
          >
            <Check aria-hidden="true" />
            {isTaken ? "Taken" : "Mark Taken"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={updating}
            className="h-10 rounded-full border-ht-border bg-white text-ht-ink hover:bg-ht-green-soft/60"
            onClick={() => onSetStatus(dose, "missed")}
          >
            <CircleDashed aria-hidden="true" />
            {isMissed ? "Missed" : "Mark Missed"}
          </Button>
        </div>
      </div>
    </article>
  )
}

export default DoseCard
