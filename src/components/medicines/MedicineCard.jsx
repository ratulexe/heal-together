import { Link } from "react-router-dom"
import { MoreVertical, Pencil, Power, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatDisplayTime, getScheduleSummary, instructionLabels } from "@/lib/schedule"

function MedicineCard({ medicine, deleteTarget, onSetDeleteTarget, onToggleActive, onDelete }) {
  return (
    <article className="rounded-2xl border border-ht-border bg-white p-5 shadow-[0_14px_36px_rgba(5,31,32,0.05)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-2xl font-semibold">{medicine.name}</h2>
            <Badge className={medicine.isActive ? "bg-ht-green-soft text-ht-teal-dark" : "bg-ht-background text-ht-muted"}>
              {medicine.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="mt-2 text-sm text-ht-muted">
            {medicine.dosage} {medicine.dosageUnit}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-ht-background text-ht-muted">
              {getScheduleSummary(medicine)}
            </Badge>
            <Badge variant="outline" className="bg-white text-ht-muted">
              {instructionLabels[medicine.instructions] || "No preference"}
            </Badge>
          </div>
          {medicine.notes ? (
            <p className="mt-4 max-w-2xl text-sm leading-6 text-ht-muted">{medicine.notes}</p>
          ) : null}
          <p className="mt-4 text-xs text-ht-muted">
            Times: {(medicine.times || []).map(formatDisplayTime).join(", ")}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          <Button
            nativeButton={false}
            variant="outline"
            size="sm"
            className="h-10 rounded-full border-ht-border bg-white"
            render={<Link to={`/medicines/${medicine.id}/edit`} />}
          >
            <Pencil aria-hidden="true" />
            Edit
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-10 rounded-full border-ht-border bg-white"
            onClick={() => onToggleActive(medicine)}
          >
            <Power aria-hidden="true" />
            {medicine.isActive ? "Deactivate" : "Activate"}
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="h-10 rounded-full"
            onClick={() => onSetDeleteTarget(medicine)}
          >
            <Trash2 aria-hidden="true" />
            Delete
          </Button>
          <Button type="button" variant="ghost" size="icon-sm" className="hidden" aria-label="More actions">
            <MoreVertical aria-hidden="true" />
          </Button>
        </div>
      </div>

      <Dialog open={deleteTarget?.id === medicine.id} onOpenChange={(open) => !open && onSetDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete medicine?</DialogTitle>
            <DialogDescription>
              This removes the medicine from your active routine. Existing dose history should remain available.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              className="rounded-full text-ht-muted hover:bg-ht-green-soft/70"
              onClick={() => onSetDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="rounded-full"
              onClick={() => onDelete(medicine)}
            >
              Delete medicine
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </article>
  )
}

export default MedicineCard
