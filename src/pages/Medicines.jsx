import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Pill } from "lucide-react"

import MedicineCard from "@/components/medicines/MedicineCard"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import {
  deleteMedicine,
  getMedicines,
  setMedicineActive,
} from "@/services/medicineService"

function Medicines() {
  const { user } = useAuth()
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    let ignore = false

    async function loadMedicines() {
      if (!user?.uid) return

      await Promise.resolve()
      if (ignore) return

      setLoading(true)
      setError("")

      try {
        const medicineList = await getMedicines(user.uid)
        if (!ignore) setMedicines(medicineList)
      } catch {
        if (!ignore) setError("We couldn't load your medicines. Try again.")
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadMedicines()

    return () => {
      ignore = true
    }
  }, [user])

  async function refreshMedicines() {
    if (!user?.uid) return
    setMedicines(await getMedicines(user.uid))
  }

  async function handleToggleActive(medicine) {
    if (!user?.uid) return

    try {
      await setMedicineActive(user.uid, medicine.id, !medicine.isActive)
      await refreshMedicines()
    } catch {
      setError("That update didn't go through. Please try again.")
    }
  }

  async function handleDelete(medicine) {
    if (!user?.uid) return

    try {
      await deleteMedicine(user.uid, medicine.id)
      setDeleteTarget(null)
      await refreshMedicines()
    } catch {
      setError("We couldn't delete this medicine. Please try again.")
    }
  }

  return (
    <div className="grid gap-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
            Medicines
          </h1>
          <p className="mt-3 text-lg text-ht-muted">
            Manage the medicine routine provided to you.
          </p>
        </div>
        <Button
          nativeButton={false}
          className="h-11 w-fit rounded-full bg-ht-teal px-5 text-white hover:bg-ht-teal-dark"
          render={<Link to="/medicines/new" />}
        >
          Add Medicine
        </Button>
      </section>

      {error ? (
        <div
          role="alert"
          className="rounded-2xl border border-ht-danger/20 bg-ht-danger-bg/70 px-4 py-3 text-sm font-medium text-ht-danger"
        >
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="grid gap-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-36 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      ) : medicines.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-ht-border bg-white p-8 text-center shadow-[0_14px_36px_rgba(5,31,32,0.05)]">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-ht-green-soft text-ht-teal-dark">
            <Pill aria-hidden="true" />
          </div>
          <h2 className="mt-4 font-display text-3xl font-semibold">No medicines yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ht-muted">
            Add the medicines already part of your routine.
          </p>
          <Button
            nativeButton={false}
            className="mt-5 h-11 rounded-full bg-ht-teal px-5 text-white hover:bg-ht-teal-dark"
            render={<Link to="/medicines/new" />}
          >
            Add Your First Medicine
          </Button>
        </section>
      ) : (
        <section className="grid gap-3" aria-label="Medicine list">
          {medicines.map((medicine) => (
            <MedicineCard
              key={medicine.id}
              medicine={medicine}
              deleteTarget={deleteTarget}
              onSetDeleteTarget={setDeleteTarget}
              onToggleActive={handleToggleActive}
              onDelete={handleDelete}
            />
          ))}
        </section>
      )}
    </div>
  )
}

export default Medicines
