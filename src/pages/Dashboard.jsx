import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"

import DashboardSummary from "@/components/dashboard/DashboardSummary"
import NextActionCard from "@/components/dashboard/NextActionCard"
import QuickAccessCards from "@/components/dashboard/QuickAccessCards"
import TodayMedicines from "@/components/dashboard/TodayMedicines"
import WellnessCheckInCard from "@/components/dashboard/WellnessCheckInCard"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { formatLocalDate, getScheduledDosesForDate } from "@/lib/schedule"
import { getMyCaregivers } from "@/services/caregiverService"
import { getDoseLogsForDate, setDoseStatus } from "@/services/doseLogService"
import { getPrivateEmergencyCard } from "@/services/emergencyCardService"
import { getMedicines } from "@/services/medicineService"
import { getWellnessLog } from "@/services/wellnessService"

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
  const [wellnessLog, setWellnessLog] = useState(null)
  const [wellnessLoading, setWellnessLoading] = useState(true)
  const [wellnessError, setWellnessError] = useState("")
  const [wellnessReloadKey, setWellnessReloadKey] = useState(0)
  const [emergencyCard, setEmergencyCard] = useState(null)
  const [emergencyLoading, setEmergencyLoading] = useState(true)
  const [emergencyError, setEmergencyError] = useState("")
  const [caregiverCount, setCaregiverCount] = useState(0)
  const [caregiverLoading, setCaregiverLoading] = useState(true)
  const [caregiverError, setCaregiverError] = useState("")

  const today = useMemo(() => new Date(), [])
  const todayKey = formatLocalDate(today)
  const userId = user?.uid

  useEffect(() => {
    let ignore = false

    async function loadDashboard() {
      if (!userId) {
        setLoading(false)
        return
      }

      await Promise.resolve()
      if (ignore) return

      setLoading(true)
      setError("")

      try {
        const { medicineList, logList } = await getDashboardData(userId, todayKey)

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
  }, [todayKey, userId])

  useEffect(() => {
    let ignore = false

    async function loadTodayWellness() {
      if (!userId) {
        await Promise.resolve()
        if (!ignore) setWellnessLoading(false)
        return
      }

      await Promise.resolve()
      if (ignore) return

      setWellnessLoading(true)
      setWellnessError("")

      try {
        const log = await getWellnessLog(userId, todayKey)

        if (!ignore) {
          setWellnessLog(log)
        }
      } catch {
        if (!ignore) {
          setWellnessLog(null)
          setWellnessError("We couldn't load today's wellness check-in.")
        }
      } finally {
        if (!ignore) setWellnessLoading(false)
      }
    }

    loadTodayWellness()

    return () => {
      ignore = true
    }
  }, [todayKey, userId, wellnessReloadKey])

  useEffect(() => {
    let ignore = false

    async function loadEmergencyStatus() {
      if (!userId) {
        setEmergencyLoading(false)
        return
      }

      setEmergencyLoading(true)
      setEmergencyError("")

      try {
        const card = await getPrivateEmergencyCard(userId)
        if (!ignore) setEmergencyCard(card)
      } catch {
        if (!ignore) {
          setEmergencyCard(null)
          setEmergencyError("unavailable")
        }
      } finally {
        if (!ignore) setEmergencyLoading(false)
      }
    }

    async function loadCaregiverStatus() {
      if (!userId) {
        setCaregiverLoading(false)
        return
      }

      setCaregiverLoading(true)
      setCaregiverError("")

      try {
        const caregivers = await getMyCaregivers(userId)
        if (!ignore) setCaregiverCount(caregivers.length)
      } catch {
        if (!ignore) {
          setCaregiverCount(0)
          setCaregiverError("unavailable")
        }
      } finally {
        if (!ignore) setCaregiverLoading(false)
      }
    }

    loadEmergencyStatus()
    loadCaregiverStatus()

    return () => {
      ignore = true
    }
  }, [userId])

  const todaysDoses = useMemo(
    () => getScheduledDosesForDate(medicines, today, doseLogs),
    [doseLogs, medicines, today]
  )

  const summary = useMemo(() => {
    const medicinesToday = new Set(todaysDoses.map((dose) => dose.medicineId)).size
    const totalDoses = todaysDoses.length
    const completed = todaysDoses.filter((dose) => dose.status === "taken").length
    const missed = todaysDoses.filter((dose) => dose.status === "missed").length
    const pending = todaysDoses.filter((dose) => dose.status === "pending").length
    const upcoming = todaysDoses.filter((dose) => dose.status === "upcoming").length

    return {
      medicinesToday,
      totalDoses,
      completed,
      pending,
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

      <DashboardSummary
        medicineSummary={summary}
        wellnessLog={wellnessLog}
        medicineLoading={loading}
        wellnessLoading={wellnessLoading}
        wellnessError={wellnessError}
      />

      <NextActionCard doses={todaysDoses} loading={loading} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <TodayMedicines
          doses={todaysDoses}
          loading={loading}
          onSetStatus={handleDoseStatus}
          updatingDoseId={updatingDoseId}
        />

        <div className="grid gap-6">
          <WellnessCheckInCard
            log={wellnessLog}
            loading={wellnessLoading}
            error={wellnessError}
            onRetry={() => setWellnessReloadKey((key) => key + 1)}
          />
          <QuickAccessCards
            emergencyCard={emergencyCard}
            emergencyLoading={emergencyLoading}
            emergencyError={emergencyError}
            caregiverCount={caregiverCount}
            caregiverLoading={caregiverLoading}
            caregiverError={caregiverError}
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
