import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore"

import { db } from "@/lib/firebase"

function inviteDocument(token) {
  return doc(db, "caregiverInvites", token)
}

function caregiverLinkDocument(ownerUid, caregiverUid) {
  return doc(db, "caregiverLinks", `${ownerUid}_${caregiverUid}`)
}

function caregiverLinksCollection() {
  return collection(db, "caregiverLinks")
}

function displayNameFor(user) {
  return user?.displayName?.trim() || user?.email?.split("@")[0] || "Someone"
}

function withId(snapshot) {
  return {
    id: snapshot.id,
    ...snapshot.data(),
  }
}

function isExpired(invite) {
  const expiresAt = invite?.expiresAt?.toDate?.()
  return expiresAt ? expiresAt.getTime() < Date.now() : true
}

export function createInviteToken() {
  return crypto.randomUUID()
}

export async function createCaregiverInvite(ownerUser) {
  const token = createInviteToken()
  const expiresAt = Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000))

  await setDoc(inviteDocument(token), {
    ownerUid: ownerUser.uid,
    ownerDisplayName: displayNameFor(ownerUser),
    createdAt: serverTimestamp(),
    expiresAt,
    status: "active",
  })

  return {
    token,
    expiresAt: expiresAt.toDate(),
  }
}

export async function getCaregiverInvite(token) {
  const snapshot = await getDoc(inviteDocument(token))
  if (!snapshot.exists()) return null

  const invite = withId(snapshot)

  return {
    ...invite,
    expired: isExpired(invite),
  }
}

export async function requestCaregiverConnection(token, caregiverUser) {
  const caregiverDisplayName = displayNameFor(caregiverUser)

  return runTransaction(db, async (transaction) => {
    const inviteRef = inviteDocument(token)
    const inviteSnapshot = await transaction.get(inviteRef)

    if (!inviteSnapshot.exists()) {
      throw new Error("This invitation is unavailable or has expired.")
    }

    const invite = inviteSnapshot.data()
    if (invite.status !== "active" || isExpired(invite)) {
      throw new Error("This invitation is unavailable or has expired.")
    }

    if (invite.ownerUid === caregiverUser.uid) {
      throw new Error("Use a different trusted account to accept a caregiver invitation.")
    }

    const linkRef = caregiverLinkDocument(invite.ownerUid, caregiverUser.uid)
    transaction.set(linkRef, {
      ownerUid: invite.ownerUid,
      caregiverUid: caregiverUser.uid,
      ownerDisplayName: invite.ownerDisplayName || "Someone",
      caregiverDisplayName,
      status: "pending",
      permissions: {
        viewMedicineStatus: false,
        viewEmergencyCard: false,
      },
      requestedAt: serverTimestamp(),
      approvedAt: null,
      updatedAt: serverTimestamp(),
    })
    transaction.update(inviteRef, {
      status: "used",
      usedAt: serverTimestamp(),
    })

    return {
      ownerDisplayName: invite.ownerDisplayName || "Someone",
    }
  })
}

export async function getPendingCaregiverRequests(ownerUid) {
  const snapshot = await getDocs(
    query(caregiverLinksCollection(), where("ownerUid", "==", ownerUid), where("status", "==", "pending"))
  )

  return snapshot.docs.map(withId)
}

export async function getMyCaregivers(ownerUid) {
  const snapshot = await getDocs(
    query(caregiverLinksCollection(), where("ownerUid", "==", ownerUid), where("status", "==", "active"))
  )

  return snapshot.docs.map(withId)
}

export async function getPeopleISupport(caregiverUid) {
  const snapshot = await getDocs(
    query(caregiverLinksCollection(), where("caregiverUid", "==", caregiverUid), where("status", "in", ["active", "pending"]))
  )

  return snapshot.docs.map(withId)
}

export async function approveCaregiver(link, permissions = link.permissions || {}) {
  await updateDoc(caregiverLinkDocument(link.ownerUid, link.caregiverUid), {
    status: "active",
    permissions: {
      viewMedicineStatus: Boolean(permissions.viewMedicineStatus),
      viewEmergencyCard: Boolean(permissions.viewEmergencyCard),
    },
    approvedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function declineCaregiver(link) {
  await updateDoc(caregiverLinkDocument(link.ownerUid, link.caregiverUid), {
    status: "revoked",
    updatedAt: serverTimestamp(),
  })
}

export async function updateCaregiverPermissions(link, permissions) {
  await updateDoc(caregiverLinkDocument(link.ownerUid, link.caregiverUid), {
    permissions: {
      viewMedicineStatus: Boolean(permissions.viewMedicineStatus),
      viewEmergencyCard: Boolean(permissions.viewEmergencyCard),
    },
    updatedAt: serverTimestamp(),
  })
}

export async function revokeCaregiver(link) {
  await updateDoc(caregiverLinkDocument(link.ownerUid, link.caregiverUid), {
    status: "revoked",
    updatedAt: serverTimestamp(),
  })
}

export async function leaveCaregiverConnection(link) {
  await updateDoc(caregiverLinkDocument(link.ownerUid, link.caregiverUid), {
    status: "revoked",
    updatedAt: serverTimestamp(),
  })
}
