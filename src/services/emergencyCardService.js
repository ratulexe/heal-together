import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore"

import { db } from "@/lib/firebase"

const defaultVisibility = {
  fullName: true,
  bloodGroup: false,
  medicalConditions: false,
  allergies: false,
  currentMedicines: false,
  emergencyContacts: false,
  doctorContact: false,
}

function privateCardDocument(userId) {
  return doc(db, "users", userId, "emergencyCard", "profile")
}

function publicCardDocument(shareId) {
  return doc(db, "publicEmergencyCards", shareId)
}

function lineList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean)
  }

  return String(value || "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function cleanContacts(contacts = []) {
  return contacts
    .map((contact) => ({
      name: String(contact.name || "").trim(),
      relationship: String(contact.relationship || "").trim(),
      phone: String(contact.phone || "").trim(),
    }))
    .filter((contact) => contact.name || contact.relationship || contact.phone)
    .slice(0, 3)
}

function publicMedicineList(card, activeMedicines) {
  const selectedIds = new Set(card.selectedMedicineIds || [])
  const selectedActiveMedicines = activeMedicines
    .filter((medicine) => selectedIds.has(medicine.id))
    .map((medicine) => {
      const dosage = [medicine.dosage, medicine.dosageUnit].filter(Boolean).join(" ")
      return dosage ? `${medicine.name} ${dosage}` : medicine.name
    })

  if (selectedActiveMedicines.length > 0) return selectedActiveMedicines

  return lineList(card.currentMedicines)
}

export function createEmptyEmergencyCard(user) {
  return {
    fullName: user?.displayName || "",
    dateOfBirth: "",
    bloodGroup: "",
    medicalConditions: "",
    allergies: "",
    currentMedicines: "",
    emergencyContacts: [{ name: "", relationship: "", phone: "" }],
    doctorName: "",
    doctorPhone: "",
    additionalNotes: "",
    selectedMedicineIds: [],
    visibility: defaultVisibility,
    shareId: "",
    sharingEnabled: false,
  }
}

export async function getPrivateEmergencyCard(userId) {
  const snapshot = await getDoc(privateCardDocument(userId))
  if (!snapshot.exists()) return null

  const data = snapshot.data()

  return {
    ...createEmptyEmergencyCard(),
    ...data,
    visibility: {
      ...defaultVisibility,
      ...(data.visibility || {}),
    },
    emergencyContacts:
      data.emergencyContacts?.length > 0
        ? data.emergencyContacts
        : [{ name: "", relationship: "", phone: "" }],
  }
}

export async function savePrivateEmergencyCard(userId, card) {
  const payload = {
    fullName: String(card.fullName || "").trim(),
    dateOfBirth: String(card.dateOfBirth || "").trim(),
    bloodGroup: String(card.bloodGroup || "").trim(),
    medicalConditions: String(card.medicalConditions || "").trim(),
    allergies: String(card.allergies || "").trim(),
    currentMedicines: String(card.currentMedicines || "").trim(),
    emergencyContacts: cleanContacts(card.emergencyContacts),
    doctorName: String(card.doctorName || "").trim(),
    doctorPhone: String(card.doctorPhone || "").trim(),
    additionalNotes: String(card.additionalNotes || "").trim(),
    selectedMedicineIds: Array.isArray(card.selectedMedicineIds) ? card.selectedMedicineIds : [],
    visibility: {
      ...defaultVisibility,
      ...(card.visibility || {}),
    },
    shareId: card.shareId || "",
    sharingEnabled: Boolean(card.sharingEnabled),
    updatedAt: serverTimestamp(),
  }

  await setDoc(privateCardDocument(userId), payload, { merge: true })

  return payload
}

export function buildPublicEmergencyCard(userId, card, activeMedicines, shareId) {
  const visibility = {
    ...defaultVisibility,
    ...(card.visibility || {}),
  }

  const payload = {
    ownerUid: userId,
    shareId,
    enabled: true,
    visibleFields: visibility,
    lastUpdated: serverTimestamp(),
  }

  if (visibility.fullName) payload.fullName = String(card.fullName || "").trim()
  if (visibility.bloodGroup) payload.bloodGroup = String(card.bloodGroup || "").trim()
  if (visibility.medicalConditions) payload.selectedConditions = lineList(card.medicalConditions)
  if (visibility.allergies) payload.selectedAllergies = lineList(card.allergies)
  if (visibility.currentMedicines) {
    payload.selectedMedicines = publicMedicineList(card, activeMedicines)
  }
  if (visibility.emergencyContacts) {
    payload.selectedEmergencyContacts = cleanContacts(card.emergencyContacts)
  }
  if (visibility.doctorContact) {
    payload.doctorContact = {
      name: String(card.doctorName || "").trim(),
      phone: String(card.doctorPhone || "").trim(),
    }
  }

  return payload
}

export async function enableEmergencySharing(userId, card, activeMedicines) {
  const shareId = card.shareId || crypto.randomUUID()
  const publicPayload = buildPublicEmergencyCard(userId, card, activeMedicines, shareId)

  await Promise.all([
    setDoc(publicCardDocument(shareId), publicPayload),
    setDoc(
      privateCardDocument(userId),
      {
        shareId,
        sharingEnabled: true,
        visibility: publicPayload.visibleFields,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    ),
  ])

  return shareId
}

export async function updatePublicEmergencyCard(userId, card, activeMedicines) {
  if (!card.shareId || !card.sharingEnabled) return

  await setDoc(
    publicCardDocument(card.shareId),
    buildPublicEmergencyCard(userId, card, activeMedicines, card.shareId)
  )
}

export async function disableEmergencySharing(userId, shareId) {
  const updates = [
    setDoc(
      privateCardDocument(userId),
      {
        sharingEnabled: false,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    ),
  ]

  if (shareId) {
    updates.push(
      updateDoc(publicCardDocument(shareId), {
        enabled: false,
        lastUpdated: serverTimestamp(),
      })
    )
  }

  await Promise.all(updates)
}

export async function regenerateEmergencyShareLink(userId, card, activeMedicines) {
  const previousShareId = card.shareId
  const shareId = crypto.randomUUID()
  const nextCard = { ...card, shareId, sharingEnabled: true }

  await Promise.all([
    setDoc(publicCardDocument(shareId), buildPublicEmergencyCard(userId, nextCard, activeMedicines, shareId)),
    setDoc(
      privateCardDocument(userId),
      {
        shareId,
        sharingEnabled: true,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    ),
    previousShareId ? deleteDoc(publicCardDocument(previousShareId)) : Promise.resolve(),
  ])

  return shareId
}

export async function getPublicEmergencyCard(shareId) {
  const snapshot = await getDoc(publicCardDocument(shareId))
  if (!snapshot.exists()) return null

  const data = snapshot.data()
  if (!data.enabled) return null

  return {
    id: snapshot.id,
    ...data,
  }
}
