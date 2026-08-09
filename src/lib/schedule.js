const weekdayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]

export const dayOptions = [
  { value: "mon", label: "Mon" },
  { value: "tue", label: "Tue" },
  { value: "wed", label: "Wed" },
  { value: "thu", label: "Thu" },
  { value: "fri", label: "Fri" },
  { value: "sat", label: "Sat" },
  { value: "sun", label: "Sun" },
]

export const instructionLabels = {
  no_preference: "No preference",
  before_food: "Before food",
  after_food: "After food",
  with_food: "With food",
}

export const dosageUnitOptions = ["tablet", "capsule", "ml", "mg", "drops", "other"]

export function formatLocalDate(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export function isValidTime(value) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value)
}

export function formatDisplayTime(value) {
  if (!isValidTime(value)) return value

  const [hours, minutes] = value.split(":").map(Number)
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)

  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

export function isMedicineScheduledForDate(medicine, date = new Date()) {
  if (!medicine?.isActive) return false

  const localDate = formatLocalDate(date)

  if (medicine.startDate && localDate < medicine.startDate) return false
  if (medicine.endDate && localDate > medicine.endDate) return false

  if (medicine.scheduleType === "daily") return true

  if (medicine.scheduleType === "selected_days") {
    const weekday = weekdayKeys[date.getDay()]
    return Array.isArray(medicine.daysOfWeek) && medicine.daysOfWeek.includes(weekday)
  }

  return false
}

export function getDoseStatusForTime(scheduledDate, scheduledTime, loggedStatus) {
  if (loggedStatus === "taken" || loggedStatus === "missed") return loggedStatus

  const now = new Date()
  const today = formatLocalDate(now)

  if (scheduledDate !== today) return "upcoming"

  const [hours, minutes] = scheduledTime.split(":").map(Number)
  const scheduled = new Date()
  scheduled.setHours(hours, minutes, 0, 0)

  return scheduled > now ? "upcoming" : "pending"
}

export function getScheduledDosesForDate(medicines, date = new Date(), doseLogs = []) {
  const scheduledDate = formatLocalDate(date)
  const logMap = new Map(
    doseLogs.map((log) => [`${log.medicineId}_${log.scheduledDate}_${log.scheduledTime}`, log])
  )

  return medicines
    .filter((medicine) => isMedicineScheduledForDate(medicine, date))
    .flatMap((medicine) =>
      [...new Set(medicine.times || [])].sort().map((scheduledTime) => {
        const log = logMap.get(`${medicine.id}_${scheduledDate}_${scheduledTime}`)

        return {
          id: `${medicine.id}_${scheduledDate}_${scheduledTime}`,
          medicine,
          medicineId: medicine.id,
          medicineName: medicine.name,
          dosage: medicine.dosage,
          dosageUnit: medicine.dosageUnit,
          instructions: medicine.instructions,
          scheduledDate,
          scheduledTime,
          log,
          status: getDoseStatusForTime(scheduledDate, scheduledTime, log?.status),
        }
      })
    )
    .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime))
}

export function getScheduleSummary(medicine) {
  const times = (medicine.times || []).map(formatDisplayTime).join(", ")

  if (medicine.scheduleType === "selected_days") {
    const days = dayOptions
      .filter((day) => medicine.daysOfWeek?.includes(day.value))
      .map((day) => day.label)
      .join(", ")

    return `${days || "Selected days"}${times ? ` at ${times}` : ""}`
  }

  return `Daily${times ? ` at ${times}` : ""}`
}
