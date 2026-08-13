import { useEffect, useMemo, useState } from "react"
import { CalendarDays, Loader2, Save } from "lucide-react"

import EnergyCard from "@/components/wellness/EnergyCard"
import HydrationCard from "@/components/wellness/HydrationCard"
import MoodCard from "@/components/wellness/MoodCard"
import SleepCard from "@/components/wellness/SleepCard"
import SymptomNotesCard from "@/components/wellness/SymptomNotesCard"
import WellnessSummary from "@/components/wellness/WellnessSummary"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { formatLocalDate } from "@/lib/schedule"
import { energyOptions, moodOptions } from "@/lib/wellness"
import { getWellnessLog, saveWellnessLog } from "@/services/wellnessService"

const notesMaxLength = 800
const defaultWellnessForm = {
  hydration: {
    glasses: 0,
    goal: 8,
  },
  mood: "",
  sleepHours: "",
  energyLevel: "",
  symptomNotes: "",
}

function toNumberInRange(value, fallback, min, max) {
  const number = Number(value)
  if (!Number.isFinite(number)) return fallback

  return Math.min(Math.max(number, min), max)
}

function normalizeLoadedLog(log) {
  return {
    hydration: {
      glasses: toNumberInRange(log?.hydration?.glasses, defaultWellnessForm.hydration.glasses, 0, 20),
      goal: toNumberInRange(log?.hydration?.goal, defaultWellnessForm.hydration.goal, 1, 20),
    },
    mood: log?.mood || "",
    sleepHours: log?.sleepHours == null ? "" : toNumberInRange(log.sleepHours, "", 0, 24),
    energyLevel: log?.energyLevel == null ? "" : toNumberInRange(log.energyLevel, "", 1, 5),
    symptomNotes: log?.symptomNotes || "",
  }
}

function formatLongDate(date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

function validateWellnessForm(form) {
  const moodValues = moodOptions.map((option) => option.value)
  const energyValues = energyOptions.map((option) => option.value)
  const hydrationGlasses = Number(form.hydration.glasses)
  const hydrationGoal = Number(form.hydration.goal)
  const sleepHours = Number(form.sleepHours)
  const energyLevel = Number(form.energyLevel)

  if (!Number.isFinite(hydrationGlasses) || hydrationGlasses < 0 || hydrationGlasses > 20) {
    return "Hydration can be between 0 and 20 glasses."
  }

  if (!Number.isFinite(hydrationGoal) || hydrationGoal < 1 || hydrationGoal > 20) {
    return "Hydration goal can be between 1 and 20 glasses."
  }

  if (form.mood && !moodValues.includes(form.mood)) {
    return "Choose one of the listed mood options."
  }

  if (form.sleepHours !== "" && (!Number.isFinite(sleepHours) || sleepHours < 0 || sleepHours > 24)) {
    return "Sleep can be between 0 and 24 hours."
  }

  if (form.energyLevel !== "" && (!Number.isFinite(energyLevel) || !energyValues.includes(energyLevel))) {
    return "Choose an energy level from 1 to 5."
  }

  if (form.symptomNotes.length > notesMaxLength) {
    return `Notes can be up to ${notesMaxLength} characters.`
  }

  return ""
}

function buildSavedLog(dateKey, form) {
  return {
    dateKey,
    hydration: {
      glasses: form.hydration.glasses,
      goal: form.hydration.goal,
    },
    mood: form.mood,
    sleepHours: form.sleepHours === "" ? null : Number(form.sleepHours),
    energyLevel: form.energyLevel === "" ? null : Number(form.energyLevel),
    symptomNotes: form.symptomNotes.trim(),
  }
}

function WellnessLoading() {
  return (
    <div className="grid gap-6">
      <section className="rounded-2xl border border-ht-border bg-white p-6 shadow-[0_14px_36px_rgba(5,31,32,0.05)]">
        <div className="h-5 w-24 animate-pulse rounded-full bg-ht-green-soft" />
        <div className="mt-4 h-11 w-64 max-w-full animate-pulse rounded-full bg-ht-green-soft" />
        <div className="mt-4 h-6 w-80 max-w-full animate-pulse rounded-full bg-ht-background" />
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        {[0, 1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-64 animate-pulse rounded-2xl border border-ht-border bg-white shadow-[0_14px_36px_rgba(5,31,32,0.05)]"
          />
        ))}
      </section>
    </div>
  )
}

function Wellness() {
  const { user } = useAuth()
  const today = useMemo(() => new Date(), [])
  const dateKey = useMemo(() => formatLocalDate(today), [today])
  const formattedDate = useMemo(() => formatLongDate(today), [today])
  const [form, setForm] = useState(defaultWellnessForm)
  const [savedLog, setSavedLog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [status, setStatus] = useState("")

  useEffect(() => {
    let ignore = false

    async function loadWellnessLog() {
      if (!user?.uid) return

      setLoading(true)
      setError("")
      setStatus("")

      try {
        const log = await getWellnessLog(user.uid, dateKey)

        if (ignore) return

        if (log) {
          const loadedForm = normalizeLoadedLog(log)
          setForm(loadedForm)
          setSavedLog(buildSavedLog(dateKey, loadedForm))
        } else {
          setForm(defaultWellnessForm)
          setSavedLog(null)
        }
      } catch {
        if (!ignore) setError("We couldn't load today's check-in. Please try again.")
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadWellnessLog()

    return () => {
      ignore = true
    }
  }, [dateKey, user])

  function updateForm(partial) {
    setForm((current) => ({
      ...current,
      ...partial,
    }))
    setStatus("")
  }

  function updateHydration(glasses) {
    updateForm({
      hydration: {
        ...form.hydration,
        glasses,
      },
    })
  }

  async function handleSave(event) {
    event.preventDefault()
    if (!user?.uid) return

    const validationMessage = validateWellnessForm(form)
    if (validationMessage) {
      setError(validationMessage)
      setStatus("")
      return
    }

    setSaving(true)
    setError("")
    setStatus("")

    try {
      const nextLog = buildSavedLog(dateKey, form)
      await saveWellnessLog(user.uid, dateKey, nextLog)
      setSavedLog(nextLog)
      setStatus("Today's check-in is saved.")
    } catch {
      setError("We couldn't save today's check-in. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <WellnessLoading />

  return (
    <form className="grid gap-6" onSubmit={handleSave}>
      <section className="flex flex-col gap-4 rounded-2xl border border-ht-border bg-white p-6 shadow-[0_14px_36px_rgba(5,31,32,0.05)] lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-ht-green-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-ht-teal-dark">
            <CalendarDays className="size-4" aria-hidden="true" />
            Today
          </div>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">
            Daily Wellness
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-ht-muted">
            A quick check-in to help you understand today&apos;s routine.
          </p>
          <p className="mt-2 text-sm font-semibold text-ht-teal-dark">{formattedDate}</p>
        </div>
      </section>

      {error ? (
        <div
          role="alert"
          className="rounded-2xl border border-ht-danger/20 bg-ht-danger-bg/70 px-4 py-3 text-sm font-medium text-ht-danger"
        >
          {error}
        </div>
      ) : null}

      <div role="status" aria-live="polite" className="sr-only">
        {status}
      </div>

      {status ? (
        <div className="rounded-2xl border border-ht-success/20 bg-ht-success-bg/70 px-4 py-3 text-sm font-medium text-ht-success">
          {status}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <HydrationCard
          glasses={form.hydration.glasses}
          goal={form.hydration.goal}
          onChange={updateHydration}
        />
        <MoodCard value={form.mood} onChange={(mood) => updateForm({ mood })} />
        <SleepCard value={form.sleepHours} onChange={(sleepHours) => updateForm({ sleepHours })} />
        <EnergyCard value={form.energyLevel} onChange={(energyLevel) => updateForm({ energyLevel })} />
        <div className="lg:col-span-2">
          <SymptomNotesCard
            value={form.symptomNotes}
            maxLength={notesMaxLength}
            onChange={(symptomNotes) => updateForm({ symptomNotes })}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-ht-border bg-white p-5 shadow-[0_14px_36px_rgba(5,31,32,0.05)] sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-ht-muted">
          Save when you&apos;re ready. You can come back and update today&apos;s check-in.
        </p>
        <Button
          type="submit"
          className="h-12 rounded-full bg-ht-teal px-6 text-white hover:bg-ht-teal-dark"
          disabled={saving}
        >
          {saving ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Save aria-hidden="true" />}
          {saving ? "Saving..." : "Save today's check-in"}
        </Button>
      </div>

      <WellnessSummary log={savedLog} />
    </form>
  )
}

export default Wellness
