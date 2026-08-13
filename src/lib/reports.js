import { energyOptions, moodOptions } from "@/lib/wellness"
import { formatLocalDate, getScheduledDosesForDate, isValidTime } from "@/lib/schedule"

function localDateFromKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number)
  return new Date(year, month - 1, day)
}

function scheduledDateTime(dose) {
  const date = localDateFromKey(dose.scheduledDate)
  if (!isValidTime(dose.scheduledTime)) return date

  const [hours, minutes] = dose.scheduledTime.split(":").map(Number)
  date.setHours(hours, minutes, 0, 0)
  return date
}

function average(values) {
  const numericValues = values.map(Number).filter(Number.isFinite)
  if (!numericValues.length) return null

  return numericValues.reduce((sum, value) => sum + value, 0) / numericValues.length
}

function roundToOne(value) {
  if (value == null || !Number.isFinite(value)) return null
  return Math.round(value * 10) / 10
}

export function buildLastSevenDays(today = new Date()) {
  const current = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(current)
    date.setDate(current.getDate() - (6 - index))

    return {
      date,
      dateKey: formatLocalDate(date),
      dayLabel: new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(date),
      shortLabel: new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(date),
    }
  })
}

export function formatReportRange(days) {
  if (!days.length) return ""

  const rangeFormatter = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  })

  return `${rangeFormatter.format(days[0].date)} - ${rangeFormatter.format(days[days.length - 1].date)}`
}

export function buildWeeklyReport({ medicines = [], doseLogs = [], wellnessLogs = [], days, now = new Date() }) {
  const todayKey = formatLocalDate(now)
  const logMap = new Map(wellnessLogs.map((log) => [log.dateKey || log.id, log]))
  const doseLogsByDate = new Map()

  doseLogs.forEach((log) => {
    const logs = doseLogsByDate.get(log.scheduledDate) || []
    logs.push(log)
    doseLogsByDate.set(log.scheduledDate, logs)
  })

  const dayRows = days.map((day) => {
    const wellnessLog = logMap.get(day.dateKey) || null
    const scheduledDoses = getScheduledDosesForDate(
      medicines,
      day.date,
      doseLogsByDate.get(day.dateKey) || []
    )
    const reportableDoses = scheduledDoses.filter((dose) => {
      const loggedStatus = dose.log?.status
      if (loggedStatus === "taken" || loggedStatus === "missed") return true
      if (dose.scheduledDate < todayKey) return true
      if (dose.scheduledDate > todayKey) return false

      return scheduledDateTime(dose).getTime() <= now.getTime()
    })

    const taken = reportableDoses.filter((dose) => dose.log?.status === "taken").length
    const missed = reportableDoses.filter((dose) => dose.log?.status === "missed").length
    const unmarked = reportableDoses.length - taken - missed

    return {
      ...day,
      wellnessLog,
      scheduledDoses: reportableDoses.length,
      taken,
      missed,
      unmarked,
      hydrationGlasses: wellnessLog?.hydration ? Number(wellnessLog.hydration.glasses) : null,
      hydrationGoal: wellnessLog?.hydration ? Number(wellnessLog.hydration.goal) : null,
      mood: wellnessLog?.mood || "",
      sleepHours: wellnessLog?.sleepHours == null ? null : Number(wellnessLog.sleepHours),
      energyLevel: wellnessLog?.energyLevel == null ? null : Number(wellnessLog.energyLevel),
      hasNotes: Boolean(wellnessLog?.symptomNotes?.trim()),
    }
  })

  const scheduledDoses = dayRows.reduce((sum, day) => sum + day.scheduledDoses, 0)
  const takenDoses = dayRows.reduce((sum, day) => sum + day.taken, 0)
  const missedDoses = dayRows.reduce((sum, day) => sum + day.missed, 0)
  const unmarkedDoses = dayRows.reduce((sum, day) => sum + day.unmarked, 0)
  const adherencePercent = scheduledDoses > 0 ? Math.round((takenDoses / scheduledDoses) * 100) : null

  const checkInCount = dayRows.filter((day) => day.wellnessLog).length
  const hydrationDays = dayRows.filter((day) => day.hydrationGlasses != null && Number.isFinite(day.hydrationGlasses))
  const sleepDays = dayRows.filter((day) => day.sleepHours != null && Number.isFinite(day.sleepHours))
  const energyDays = dayRows.filter((day) => day.energyLevel != null && Number.isFinite(day.energyLevel))
  const moodDays = dayRows.filter((day) => day.mood)
  const notesDays = dayRows.filter((day) => day.hasNotes).length

  const averageHydration = roundToOne(average(hydrationDays.map((day) => day.hydrationGlasses)))
  const averageHydrationGoal = roundToOne(average(hydrationDays.map((day) => day.hydrationGoal)))
  const averageSleep = roundToOne(average(sleepDays.map((day) => day.sleepHours)))
  const averageEnergy = roundToOne(average(energyDays.map((day) => day.energyLevel)))

  const moodDistribution = moodOptions.map((option) => ({
    ...option,
    count: moodDays.filter((day) => day.mood === option.value).length,
  }))
  const mostCommonMood = moodDistribution
    .filter((mood) => mood.count > 0)
    .sort((a, b) => b.count - a.count)[0]

  const chartData = dayRows.map((day) => ({
    dateKey: day.dateKey,
    day: day.dayLabel,
    date: day.shortLabel,
    hydration: day.hydrationGlasses,
    sleep: day.sleepHours,
    energy: day.energyLevel,
  }))

  const highlights = [
    `${checkInCount} of 7 wellness check-ins completed.`,
  ]

  if (scheduledDoses > 0) {
    highlights.push(`${takenDoses} of ${scheduledDoses} scheduled medicine doses were marked taken.`)
  }

  if (missedDoses > 0) {
    highlights.push(`${missedDoses} medicine ${missedDoses === 1 ? "dose was" : "doses were"} marked missed.`)
  }

  if (unmarkedDoses > 0) {
    highlights.push(`${unmarkedDoses} scheduled medicine ${unmarkedDoses === 1 ? "dose is" : "doses are"} not marked yet.`)
  }

  if (hydrationDays.length > 0) {
    highlights.push(`Hydration was logged on ${hydrationDays.length} ${hydrationDays.length === 1 ? "day" : "days"}.`)
  }

  if (sleepDays.length > 0) {
    highlights.push(`Sleep was recorded on ${sleepDays.length} ${sleepDays.length === 1 ? "day" : "days"}.`)
  }

  if (energyDays.length > 0) {
    highlights.push(`Energy was recorded on ${energyDays.length} ${energyDays.length === 1 ? "day" : "days"}.`)
  }

  if (notesDays > 0) {
    highlights.push(`Notes were added on ${notesDays} ${notesDays === 1 ? "day" : "days"}.`)
  }

  return {
    days: dayRows,
    chartData,
    medicine: {
      scheduledDoses,
      takenDoses,
      missedDoses,
      unmarkedDoses,
      adherencePercent,
    },
    wellness: {
      checkInCount,
      hydrationDays: hydrationDays.length,
      sleepDays: sleepDays.length,
      energyDays: energyDays.length,
      moodDays: moodDays.length,
      averageHydration,
      averageHydrationGoal,
      averageSleep,
      averageEnergy,
      moodDistribution,
      mostCommonMood,
    },
    highlights,
    hasAnyData: scheduledDoses > 0 || checkInCount > 0,
    energyLabel: energyOptions.find((option) => option.value === Math.round(averageEnergy))?.label || "",
  }
}
