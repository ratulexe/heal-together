import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import MedicineForm from "@/components/medicines/MedicineForm"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { createMedicine } from "@/services/medicineService"

function AddMedicine() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(values) {
    if (!user?.uid) return

    setSubmitting(true)
    setError("")

    try {
      await createMedicine(user.uid, values)
      navigate("/medicines", { replace: true })
    } catch {
      setError("We couldn't save this medicine.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid gap-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold">Add Medicine</h1>
          <p className="mt-3 text-ht-muted">
            Add an existing medicine routine so it can appear on your daily schedule.
          </p>
        </div>
        <Button
          nativeButton={false}
          variant="outline"
          className="h-11 w-fit rounded-full border-ht-border bg-white"
          render={<Link to="/medicines" />}
        >
          Back to Medicines
        </Button>
      </section>

      {error ? (
        <div role="alert" className="rounded-2xl border border-ht-danger/20 bg-ht-danger-bg/70 px-4 py-3 text-sm font-medium text-ht-danger">
          {error}
        </div>
      ) : null}

      <MedicineForm mode="create" onSubmit={handleSubmit} submitting={submitting} />
    </div>
  )
}

export default AddMedicine
