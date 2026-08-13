import { buildWeeklyReport } from "@/lib/reports"
import { getDoseLogsForDates } from "@/services/doseLogService"
import { getMedicines } from "@/services/medicineService"
import { getWellnessLogsForDates } from "@/services/wellnessService"

function buildAvailableHighlights(report, sourceErrors) {
  const highlights = []

  if (!sourceErrors.wellness) {
    highlights.push(`${report.wellness.checkInCount} of 7 wellness check-ins completed.`)

    if (report.wellness.hydrationDays > 0) {
      highlights.push(
        `Hydration was logged on ${report.wellness.hydrationDays} ${
          report.wellness.hydrationDays === 1 ? "day" : "days"
        }.`
      )
    }

    if (report.wellness.sleepDays > 0) {
      highlights.push(
        `Sleep was recorded on ${report.wellness.sleepDays} ${
          report.wellness.sleepDays === 1 ? "day" : "days"
        }.`
      )
    }

    if (report.wellness.energyDays > 0) {
      highlights.push(
        `Energy was recorded on ${report.wellness.energyDays} ${
          report.wellness.energyDays === 1 ? "day" : "days"
        }.`
      )
    }
  }

  if (!sourceErrors.medicine && report.medicine.scheduledDoses > 0) {
    highlights.push(
      `${report.medicine.takenDoses} of ${report.medicine.scheduledDoses} scheduled medicine doses were marked taken.`
    )

    if (report.medicine.missedDoses > 0) {
      highlights.push(
        `${report.medicine.missedDoses} medicine ${
          report.medicine.missedDoses === 1 ? "dose was" : "doses were"
        } marked missed.`
      )
    }

    if (report.medicine.unmarkedDoses > 0) {
      highlights.push(
        `${report.medicine.unmarkedDoses} scheduled medicine ${
          report.medicine.unmarkedDoses === 1 ? "dose is" : "doses are"
        } not marked yet.`
      )
    }
  }

  return highlights.length ? highlights : ["Some weekly data could not be loaded."]
}

export async function getWeeklyReport(userId, days, now = new Date()) {
  const dateKeys = days.map((day) => day.dateKey)
  const [medicinesResult, doseLogsResult, wellnessLogsResult] = await Promise.allSettled([
    getMedicines(userId),
    getDoseLogsForDates(userId, dateKeys),
    getWellnessLogsForDates(userId, dateKeys),
  ])
  const sourceErrors = {
    medicine: medicinesResult.status === "rejected" || doseLogsResult.status === "rejected",
    wellness: wellnessLogsResult.status === "rejected",
  }
  const medicines = sourceErrors.medicine ? [] : medicinesResult.value
  const doseLogs = sourceErrors.medicine ? [] : doseLogsResult.value
  const wellnessLogs = sourceErrors.wellness ? [] : wellnessLogsResult.value

  const report = buildWeeklyReport({
    medicines,
    doseLogs,
    wellnessLogs,
    days,
    now,
  })

  return {
    ...report,
    highlights: buildAvailableHighlights(report, sourceErrors),
    sourceErrors,
  }
}
