import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"

import DashboardSummary from "@/components/dashboard/DashboardSummary"
import TodayMedicines from "@/components/dashboard/TodayMedicines"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { formatLocalDate, getScheduledDosesForDate } from "@/lib/schedule"
import { getDoseLogsForDate, setDoseStatus } from "@/services/doseLogService"
import { getMedicines } from "@/services/medicineService"

async function getDashboardData(userId, todayKey) {
  const [medicineList, logList] = await Promise.all([
    getMedicines(userId),
    getDoseLogsForDate(userId, todayKey),
  ])

  return { medicineList, logList }
}

function getFirstName(user) {
  const displayName = user?.displayName?.trim()
  if (displayName) return displayName.split(/\s+/)[0]

  return user?.email?.split("@")[0] || "there"
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

function Dashboard() {
  const { user } = useAuth()
  const [medicines, setMedicines] = useState([])
  const [doseLogs, setDoseLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [updatingDoseId, setUpdatingDoseId] = useState("")

  const today = useMemo(() => new Date(), [])
  const todayKey = formatLocalDate(today)

  useEffect(() => {
    let ignore = false

    async function loadDashboard() {
      if (!user?.uid) return

      await Promise.resolve()
      if (ignore) return

      setLoading(true)
      setError("")

      try {
        const { medicineList, logList } = await getDashboardData(user.uid, todayKey)

        if (!ignore) {
          setMedicines(medicineList)
          setDoseLogs(logList)
        }
      } catch {
        if (!ignore) setError("We couldn't load your medicines. Try again.")
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadDashboard()

    return () => {
      ignore = true
    }
  }, [todayKey, user])

  const todaysDoses = useMemo(
    () => getScheduledDosesForDate(medicines, today, doseLogs),
    [doseLogs, medicines, today]
  )

  const summary = useMemo(() => {
    const medicinesToday = new Set(todaysDoses.map((dose) => dose.medicineId)).size
    const completed = todaysDoses.filter((dose) => dose.status === "taken").length
    const missed = todaysDoses.filter((dose) => dose.status === "missed").length
    const upcoming = todaysDoses.length - completed - missed

    return {
      medicinesToday,
      completed,
      upcoming,
      missed,
    }
  }, [todaysDoses])

  async function handleDoseStatus(dose, status) {
    if (!user?.uid) return

    setUpdatingDoseId(dose.id)
    setError("")

    try {
      await setDoseStatus(user.uid, dose, status)
      const logList = await getDoseLogsForDate(user.uid, todayKey)
      setDoseLogs(logList)
    } catch {
      setError("That update didn't go through. Please try again.")
    } finally {
      setUpdatingDoseId("")
    }
  }

  return (
    <div className="grid gap-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-ht-teal-dark">
            Today
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl">
            {getGreeting()}, {getFirstName(user)}
          </h1>
          <p className="mt-3 text-lg text-ht-muted">Here&apos;s your health routine for today.</p>
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

      <DashboardSummary summary={summary} />

      <TodayMedicines
        doses={todaysDoses}
        loading={loading}
        onSetStatus={handleDoseStatus}
        updatingDoseId={updatingDoseId}
      />
    </div>
  )
}

export default Dashboard
