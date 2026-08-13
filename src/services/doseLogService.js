import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore"

import { db } from "@/lib/firebase"

function doseLogsCollection(userId) {
  return collection(db, "users", userId, "doseLogs")
}

export function getDoseLogId(medicineId, scheduledDate, scheduledTime) {
  const safeMedicineId = medicineId.replace(/[^a-zA-Z0-9_-]/g, "_")
  const safeTime = scheduledTime.replace(":", "-")

  return `${safeMedicineId}_${scheduledDate}_${safeTime}`
}

function doseLogDocument(userId, medicineId, scheduledDate, scheduledTime) {
  return doc(db, "users", userId, "doseLogs", getDoseLogId(medicineId, scheduledDate, scheduledTime))
}

function withId(snapshot) {
  return {
    id: snapshot.id,
    ...snapshot.data(),
  }
}

export async function getDoseLogsForDate(userId, scheduledDate) {
  const snapshot = await getDocs(
    query(doseLogsCollection(userId), where("scheduledDate", "==", scheduledDate))
  )

  return snapshot.docs.map(withId)
}

export async function getDoseLogsForDates(userId, scheduledDates) {
  const logsByDate = await Promise.all(
    scheduledDates.map((scheduledDate) => getDoseLogsForDate(userId, scheduledDate))
  )

  return logsByDate.flat()
}

export async function getDoseStatus(userId, medicineId, scheduledDate, scheduledTime) {
  const snapshot = await getDoc(doseLogDocument(userId, medicineId, scheduledDate, scheduledTime))
  return snapshot.exists() ? withId(snapshot) : null
}

export async function setDoseStatus(userId, dose, status) {
  const ref = doseLogDocument(userId, dose.medicineId, dose.scheduledDate, dose.scheduledTime)
  const snapshot = await getDoc(ref)
  const payload = {
    medicineId: dose.medicineId,
    medicineName: dose.medicineName,
    scheduledDate: dose.scheduledDate,
    scheduledTime: dose.scheduledTime,
    status,
    markedAt: serverTimestamp(),
  }

  if (snapshot.exists()) {
    await updateDoc(ref, payload)
    return
  }

  await setDoc(ref, {
    ...payload,
    createdAt: serverTimestamp(),
  })
}
