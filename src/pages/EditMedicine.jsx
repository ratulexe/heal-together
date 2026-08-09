import { useEffect, useState } from "react"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"

import MedicineForm from "@/components/medicines/MedicineForm"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { getMedicine, updateMedicine } from "@/services/medicineService"

function EditMedicine() {
  const { user } = useAuth()
  const { medicineId } = useParams()
  const navigate = useNavigate()
  const [medicine, setMedicine] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let ignore = false

    async function loadMedicine() {
      if (!user?.uid || !medicineId) return

      await Promise.resolve()
      if (ignore) return

      setLoading(true)
      setError("")

      try {
        const nextMedicine = await getMedicine(user.uid, medicineId)
        if (!nextMedicine) {
          if (!ignore) setNotFound(true)
          return
        }
        if (!ignore) setMedicine(nextMedicine)
      } catch {
        if (!ignore) setError("We couldn't load this medicine. Try again.")
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadMedicine()

    return () => {
      ignore = true
    }
  }, [medicineId, user])

  async function handleSubmit(values) {
    if (!user?.uid || !medicineId) return

    setSubmitting(true)
    setError("")

    try {
      await updateMedicine(user.uid, medicineId, values)
      navigate("/medicines", { replace: true })
    } catch {
      setError("We couldn't save this medicine.")
    } finally {
      setSubmitting(false)
    }
  }

  if (notFound) {
    return <Navigate to="/medicines" replace />
  }

  return (
    <div className="grid gap-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold">Edit Medicine</h1>
          <p className="mt-3 text-ht-muted">
            Keep your existing medicine routine up to date.
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

      {loading ? (
        <div className="h-[32rem] animate-pulse rounded-2xl bg-white" />
      ) : (
        <MedicineForm mode="edit" medicine={medicine} onSubmit={handleSubmit} submitting={submitting} />
      )}
    </div>
  )
}

export default EditMedicine
