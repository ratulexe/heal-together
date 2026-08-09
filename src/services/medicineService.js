import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore"

import { db } from "@/lib/firebase"

function medicinesCollection(userId) {
  return collection(db, "users", userId, "medicines")
}

function medicineDocument(userId, medicineId) {
  return doc(db, "users", userId, "medicines", medicineId)
}

function normalizeMedicineData(data) {
  return {
    name: data.name.trim(),
    dosage: data.dosage.trim(),
    dosageUnit: data.dosageUnit.trim(),
    instructions: data.instructions,
    times: [...new Set(data.times)].sort(),
    scheduleType: data.scheduleType,
    daysOfWeek: data.scheduleType === "selected_days" ? data.daysOfWeek : [],
    startDate: data.startDate,
    endDate: data.endDate || "",
    notes: data.notes?.trim() || "",
    isActive: Boolean(data.isActive),
  }
}

function withId(snapshot) {
  return {
    id: snapshot.id,
    ...snapshot.data(),
  }
}

export async function createMedicine(userId, data) {
  const payload = normalizeMedicineData(data)

  const ref = await addDoc(medicinesCollection(userId), {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return ref.id
}

export async function getMedicine(userId, medicineId) {
  const snapshot = await getDoc(medicineDocument(userId, medicineId))
  if (!snapshot.exists()) return null

  return withId(snapshot)
}

export async function getMedicines(userId) {
  const snapshot = await getDocs(query(medicinesCollection(userId), orderBy("createdAt", "desc")))
  return snapshot.docs.map(withId)
}

export async function getActiveMedicines(userId) {
  const medicines = await getMedicines(userId)
  return medicines.filter((medicine) => medicine.isActive)
}

export async function updateMedicine(userId, medicineId, data) {
  await updateDoc(medicineDocument(userId, medicineId), {
    ...normalizeMedicineData(data),
    updatedAt: serverTimestamp(),
  })
}

export async function setMedicineActive(userId, medicineId, isActive) {
  await updateDoc(medicineDocument(userId, medicineId), {
    isActive,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteMedicine(userId, medicineId) {
  await deleteDoc(medicineDocument(userId, medicineId))
}
