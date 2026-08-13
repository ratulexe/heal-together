import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore"

import { db } from "@/lib/firebase"

function wellnessLogDocument(userId, dateKey) {
  return doc(db, "users", userId, "wellnessLogs", dateKey)
}

function normalizeWellnessLog(dateKey, data) {
  return {
    dateKey,
    hydration: {
      glasses: Number(data.hydration?.glasses ?? 0),
      goal: Number(data.hydration?.goal ?? 8),
    },
    mood: data.mood || "",
    sleepHours: data.sleepHours === "" || data.sleepHours == null ? null : Number(data.sleepHours),
    energyLevel: data.energyLevel === "" || data.energyLevel == null ? null : Number(data.energyLevel),
    symptomNotes: data.symptomNotes?.trim() || "",
  }
}

function withId(snapshot) {
  return {
    id: snapshot.id,
    ...snapshot.data(),
  }
}

export async function getWellnessLog(userId, dateKey) {
  const snapshot = await getDoc(wellnessLogDocument(userId, dateKey))
  if (!snapshot.exists()) return null

  return withId(snapshot)
}

export async function getWellnessLogsForDates(userId, dateKeys) {
  const logs = await Promise.all(dateKeys.map((dateKey) => getWellnessLog(userId, dateKey)))

  return logs.filter(Boolean)
}

export async function saveWellnessLog(userId, dateKey, data) {
  const ref = wellnessLogDocument(userId, dateKey)
  const snapshot = await getDoc(ref)
  const payload = {
    ...normalizeWellnessLog(dateKey, data),
    updatedAt: serverTimestamp(),
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
