import { useEffect, useMemo, useRef, useState } from "react"
import { Check, Clipboard, Download, Loader2, Pencil, QrCode, RefreshCw, ShieldCheck, XCircle } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import {
  createEmptyEmergencyCard,
  disableEmergencySharing,
  enableEmergencySharing,
  getPrivateEmergencyCard,
  regenerateEmergencyShareLink,
  savePrivateEmergencyCard,
  updatePublicEmergencyCard,
} from "@/services/emergencyCardService"
import { getActiveMedicines } from "@/services/medicineService"

const inputClass =
  "mt-2 h-11 w-full rounded-xl border border-ht-border bg-white px-4 text-base outline-none transition placeholder:text-ht-muted-light focus:border-ht-teal focus:ring-4 focus:ring-ht-teal/15"
const textareaClass =
  "mt-2 min-h-28 w-full rounded-xl border border-ht-border bg-white px-4 py-3 text-base outline-none transition placeholder:text-ht-muted-light focus:border-ht-teal focus:ring-4 focus:ring-ht-teal/15"

const visibilityOptions = [
  { key: "fullName", label: "Name", description: "Shows the name entered on this card." },
  { key: "bloodGroup", label: "Blood Group", description: "Shows only the selected blood group." },
  { key: "medicalConditions", label: "Medical Conditions", description: "Shows the condition lines you entered." },
  { key: "allergies", label: "Allergies", description: "Shows the allergy lines you entered." },
  { key: "currentMedicines", label: "Current Medicines", description: "Shows only medicines you select below." },
  { key: "emergencyContacts", label: "Emergency Contact", description: "Shows the contacts listed on this card." },
  { key: "doctorContact", label: "Doctor Contact", description: "Shows doctor name and phone." },
]

function Field({ id, label, children }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-ht-ink">
        {label}
      </label>
      {children}
    </div>
  )
}

function StatusMessage({ message }) {
  if (!message.text) return null

  return (
    <div
      role="status"
      className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
        message.type === "error"
          ? "border-ht-danger/20 bg-ht-danger-bg/70 text-ht-danger"
          : "border-ht-border bg-ht-green-soft/60 text-ht-teal-dark"
      }`}
    >
      {message.text}
    </div>
  )
}

function textLines(value) {
  return String(value || "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function DetailItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-ht-border bg-ht-background p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ht-teal-dark">{label}</p>
      <p className="mt-2 text-lg font-semibold text-ht-ink">{value || "Not added"}</p>
    </div>
  )
}

function DetailList({ label, value }) {
  const lines = textLines(value)

  return (
    <div className="rounded-2xl border border-ht-border bg-ht-background p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ht-teal-dark">{label}</p>
      {lines.length > 0 ? (
        <ul className="mt-3 grid gap-2">
          {lines.map((line, index) => (
            <li key={`${line}-${index}`} className="rounded-xl bg-white px-3 py-2 text-base font-medium text-ht-ink">
              {line}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-base text-ht-muted">Not added</p>
      )}
    </div>
  )
}

function EmergencyCardPreview({ card }) {
  const contacts = card.emergencyContacts?.filter(
    (contact) => contact.name || contact.relationship || contact.phone
  )

  return (
    <section className="grid gap-5 rounded-2xl border border-ht-border bg-white p-5 shadow-[0_14px_36px_rgba(5,31,32,0.05)] sm:p-6">
      <div className="rounded-2xl border border-ht-border bg-ht-green-soft/45 p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-ht-teal-dark">
          Saved Emergency Card
        </p>
        <h2 className="mt-3 font-display text-3xl font-semibold leading-tight">
          {card.fullName || "Emergency Health Card"}
        </h2>
        <p className="mt-2 text-sm leading-6 text-ht-muted">
          Your private details are saved. Use Edit Card to make changes.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <DetailItem label="Full Name" value={card.fullName} />
        <DetailItem label="Date of Birth" value={card.dateOfBirth} />
        <DetailItem label="Blood Group" value={card.bloodGroup} />
        <DetailItem label="Doctor Name" value={card.doctorName} />
        <DetailItem label="Doctor Phone" value={card.doctorPhone} />
      </div>

      <DetailList label="Medical Conditions" value={card.medicalConditions} />
      <DetailList label="Allergies" value={card.allergies} />
      <DetailList label="Current Medicines Notes" value={card.currentMedicines} />

      <div className="rounded-2xl border border-ht-border bg-ht-background p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ht-teal-dark">
          Emergency Contacts
        </p>
        {contacts?.length ? (
          <div className="mt-3 grid gap-3">
            {contacts.map((contact, index) => (
              <div key={`${contact.name}-${index}`} className="rounded-xl bg-white p-3">
                <p className="font-semibold text-ht-ink">{contact.name || "Emergency contact"}</p>
                <p className="mt-1 text-sm text-ht-muted">{contact.relationship || "Relationship not added"}</p>
                <p className="mt-1 text-sm font-semibold text-ht-teal-dark">{contact.phone || "Phone not added"}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-base text-ht-muted">Not added</p>
        )}
      </div>

      <DetailList label="Private Notes" value={card.additionalNotes} />
    </section>
  )
}

function emergencyCardErrorMessage(action, error) {
  if (error?.code === "permission-denied") {
    return `Firestore rules are blocking ${action}. Deploy the updated rules that allow users/{uid}/emergencyCard/profile.`
  }

  if (error?.code === "unavailable" || !navigator.onLine) {
    return `We couldn't ${action}. Check your connection or browser privacy settings if Firebase is being blocked.`
  }

  return `We couldn't ${action}. Please try again.`
}

function Emergency() {
  const { user } = useAuth()
  const [card, setCard] = useState(() => createEmptyEmergencyCard(user))
  const [activeMedicines, setActiveMedicines] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(true)
  const [sharingAction, setSharingAction] = useState("")
  const [message, setMessage] = useState({ type: "", text: "" })
  const qrWrapRef = useRef(null)

  const shareUrl = useMemo(() => {
    if (!card.shareId) return ""
    return `${window.location.origin}/emergency-card/${card.shareId}`
  }, [card.shareId])

  useEffect(() => {
    let ignore = false

    async function loadEmergencyCard() {
      if (!user?.uid) return

      await Promise.resolve()
      if (ignore) return

      setLoading(true)
      setMessage({ type: "", text: "" })

      try {
        const privateCard = await getPrivateEmergencyCard(user.uid)

        if (ignore) return

        setCard(privateCard || createEmptyEmergencyCard(user))
        setIsEditing(!privateCard)
      } catch (error) {
        if (!ignore) {
          setMessage({
            type: "error",
            text: emergencyCardErrorMessage("load your emergency card", error),
          })
        }
      } finally {
        if (!ignore) setLoading(false)
      }

      try {
        const medicines = await getActiveMedicines(user.uid)
        if (!ignore) setActiveMedicines(medicines)
      } catch {
        if (!ignore) {
          setActiveMedicines([])
          setMessage({
            type: "error",
            text: "Your emergency details loaded, but we couldn't load active medicines for sharing.",
          })
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadEmergencyCard()

    return () => {
      ignore = true
    }
  }, [user])

  function updateCard(field, value) {
    setCard((current) => ({ ...current, [field]: value }))
  }

  function updateVisibility(field, value) {
    setCard((current) => ({
      ...current,
      visibility: {
        ...current.visibility,
        [field]: value,
      },
    }))
  }

  function updateContact(index, field, value) {
    setCard((current) => ({
      ...current,
      emergencyContacts: current.emergencyContacts.map((contact, contactIndex) =>
        contactIndex === index ? { ...contact, [field]: value } : contact
      ),
    }))
  }

  function addContact() {
    setCard((current) => ({
      ...current,
      emergencyContacts:
        current.emergencyContacts.length >= 3
          ? current.emergencyContacts
          : [...current.emergencyContacts, { name: "", relationship: "", phone: "" }],
    }))
  }

  function removeContact(index) {
    setCard((current) => ({
      ...current,
      emergencyContacts:
        current.emergencyContacts.length <= 1
          ? current.emergencyContacts
          : current.emergencyContacts.filter((_, contactIndex) => contactIndex !== index),
    }))
  }

  function toggleMedicine(medicineId, checked) {
    setCard((current) => {
      const selected = new Set(current.selectedMedicineIds || [])
      if (checked) selected.add(medicineId)
      else selected.delete(medicineId)

      return {
        ...current,
        selectedMedicineIds: [...selected],
      }
    })
  }

  async function handleSave() {
    setSaving(true)
    setMessage({ type: "", text: "" })

    try {
      const saved = await savePrivateEmergencyCard(user.uid, card)
      const nextCard = { ...card, ...saved }
      setCard(nextCard)
      setIsEditing(false)

      if (!nextCard.sharingEnabled) {
        setMessage({ type: "success", text: "Emergency card saved." })
        return
      }

      try {
        await updatePublicEmergencyCard(user.uid, nextCard, activeMedicines)
        setMessage({ type: "success", text: "Emergency card saved and shared QR details updated." })
      } catch (sharingError) {
        setMessage({
          type: "error",
          text: `${emergencyCardErrorMessage("update sharing", sharingError)} Your private emergency card was saved.`,
        })
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: emergencyCardErrorMessage("save your emergency card", error),
      })
    } finally {
      setSaving(false)
    }
  }

  async function handleEnableSharing() {
    setSharingAction("enable")
    setMessage({ type: "", text: "" })

    try {
      const saved = await savePrivateEmergencyCard(user.uid, card)
      const shareId = await enableEmergencySharing(user.uid, { ...card, ...saved }, activeMedicines)
      setCard((current) => ({ ...current, ...saved, shareId, sharingEnabled: true }))
      setIsEditing(false)
      setMessage({ type: "success", text: "Emergency sharing is on. Only selected fields are visible." })
    } catch (error) {
      setMessage({
        type: "error",
        text: emergencyCardErrorMessage("update sharing", error),
      })
    } finally {
      setSharingAction("")
    }
  }

  async function handleDisableSharing() {
    setSharingAction("disable")
    setMessage({ type: "", text: "" })

    try {
      await disableEmergencySharing(user.uid, card.shareId)
      setCard((current) => ({ ...current, sharingEnabled: false }))
      setMessage({ type: "success", text: "Emergency sharing is disabled." })
    } catch (error) {
      setMessage({
        type: "error",
        text: emergencyCardErrorMessage("update sharing", error),
      })
    } finally {
      setSharingAction("")
    }
  }

  async function handleRegenerateLink() {
    const confirmed = window.confirm(
      "Regenerate emergency link?\n\nThe previous QR code and link will stop working."
    )
    if (!confirmed) return

    setSharingAction("regenerate")
    setMessage({ type: "", text: "" })

    try {
      const shareId = await regenerateEmergencyShareLink(user.uid, card, activeMedicines)
      setCard((current) => ({ ...current, shareId, sharingEnabled: true }))
      setMessage({ type: "success", text: "Emergency link regenerated. The old link no longer works." })
    } catch (error) {
      setMessage({
        type: "error",
        text: emergencyCardErrorMessage("update sharing", error),
      })
    } finally {
      setSharingAction("")
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setMessage({ type: "success", text: "Emergency card link copied." })
    } catch {
      setMessage({ type: "error", text: "We couldn't copy the link." })
    }
  }

  function handleDownloadQr() {
    const svg = qrWrapRef.current?.querySelector("svg")
    if (!svg) return

    const blob = new Blob([new XMLSerializer().serializeToString(svg)], {
      type: "image/svg+xml;charset=utf-8",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "healtogether-emergency-qr.svg"
    link.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="grid gap-4">
        <div className="h-36 animate-pulse rounded-2xl bg-white" />
        <div className="h-96 animate-pulse rounded-2xl bg-white" />
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-2xl border border-ht-border bg-white p-6 shadow-[0_14px_36px_rgba(5,31,32,0.05)] sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-ht-teal-dark">
              Private Emergency Health Card
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl">
              Keep important emergency details ready
            </h1>
            <p className="mt-4 text-base leading-7 text-ht-muted">
              This card stores information you enter. It does not diagnose, prescribe, or suggest treatment.
            </p>
          </div>
          {isEditing ? (
            <Button
              type="button"
              disabled={saving}
              className="h-11 rounded-full bg-ht-teal px-5 text-white hover:bg-ht-teal-dark"
              onClick={handleSave}
            >
              {saving ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Check aria-hidden="true" />}
              Save Card
            </Button>
          ) : (
            <Button
              type="button"
              className="h-11 rounded-full bg-ht-teal px-5 text-white hover:bg-ht-teal-dark"
              onClick={() => setIsEditing(true)}
            >
              <Pencil aria-hidden="true" />
              Edit Card
            </Button>
          )}
        </div>
      </section>

      <StatusMessage message={message} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
        {isEditing ? (
        <section className="grid gap-5 rounded-2xl border border-ht-border bg-white p-5 shadow-[0_14px_36px_rgba(5,31,32,0.05)] sm:p-6">
          <div>
            <h2 className="font-display text-2xl font-semibold">Card Details</h2>
            <p className="mt-2 text-sm leading-6 text-ht-muted">
              Add only details that would help identify your preferences and contacts in an emergency.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field id="fullName" label="Full Name">
              <input
                id="fullName"
                value={card.fullName}
                onChange={(event) => updateCard("fullName", event.target.value)}
                className={inputClass}
                autoComplete="name"
              />
            </Field>
            <Field id="dateOfBirth" label="Date of Birth">
              <input
                id="dateOfBirth"
                type="text"
                inputMode="numeric"
                value={card.dateOfBirth}
                onChange={(event) => updateCard("dateOfBirth", event.target.value)}
                className={inputClass}
                placeholder="DD-MM-YYYY"
              />
            </Field>
            <Field id="bloodGroup" label="Blood Group">
              <select
                id="bloodGroup"
                value={card.bloodGroup}
                onChange={(event) => updateCard("bloodGroup", event.target.value)}
                className={inputClass}
              >
                <option value="">Prefer not to say</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="doctorName" label="Doctor Name">
              <input
                id="doctorName"
                value={card.doctorName}
                onChange={(event) => updateCard("doctorName", event.target.value)}
                className={inputClass}
                autoComplete="off"
              />
            </Field>
            <Field id="doctorPhone" label="Doctor Phone">
              <input
                id="doctorPhone"
                value={card.doctorPhone}
                onChange={(event) => updateCard("doctorPhone", event.target.value)}
                className={inputClass}
                type="tel"
                autoComplete="tel"
              />
            </Field>
          </div>

          <Field id="medicalConditions" label="Medical Conditions">
            <textarea
              id="medicalConditions"
              value={card.medicalConditions}
              onChange={(event) => updateCard("medicalConditions", event.target.value)}
              className={textareaClass}
              placeholder="One condition per line"
            />
          </Field>

          <Field id="allergies" label="Allergies">
            <textarea
              id="allergies"
              value={card.allergies}
              onChange={(event) => updateCard("allergies", event.target.value)}
              className={textareaClass}
              placeholder="One allergy per line"
            />
          </Field>

          <Field id="currentMedicines" label="Current Medicines Notes">
            <textarea
              id="currentMedicines"
              value={card.currentMedicines}
              onChange={(event) => updateCard("currentMedicines", event.target.value)}
              className={textareaClass}
              placeholder="Optional notes. Prefer selecting active medicines below for QR sharing."
            />
          </Field>

          <div className="rounded-2xl border border-ht-border bg-ht-background p-4">
            <h3 className="font-display text-xl font-semibold">Medicines visible on emergency card</h3>
            <p className="mt-2 text-sm leading-6 text-ht-muted">
              Select active medicines only if you want them to appear when medicine sharing is enabled.
            </p>
            {activeMedicines.length === 0 ? (
              <p className="mt-4 text-sm font-medium text-ht-muted">No active medicines found.</p>
            ) : (
              <div className="mt-4 grid gap-3">
                {activeMedicines.map((medicine) => (
                  <label
                    key={medicine.id}
                    className="flex items-start gap-3 rounded-xl border border-ht-border bg-white p-3 text-sm font-semibold"
                  >
                    <input
                      type="checkbox"
                      checked={card.selectedMedicineIds?.includes(medicine.id)}
                      onChange={(event) => toggleMedicine(medicine.id, event.target.checked)}
                      className="mt-1 size-4 accent-ht-teal"
                    />
                    <span>
                      {medicine.name}
                      <span className="block font-normal text-ht-muted">
                        {[medicine.dosage, medicine.dosageUnit].filter(Boolean).join(" ")}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-xl font-semibold">Emergency Contacts</h3>
                <p className="mt-1 text-sm text-ht-muted">Add up to three people. HealTogether will not contact them automatically.</p>
              </div>
              <Button
                type="button"
                variant="outline"
                disabled={card.emergencyContacts.length >= 3}
                className="h-10 rounded-full border-ht-border bg-white"
                onClick={addContact}
              >
                Add Contact
              </Button>
            </div>

            {card.emergencyContacts.map((contact, index) => (
              <div key={index} className="grid gap-3 rounded-2xl border border-ht-border bg-ht-background p-4 md:grid-cols-3">
                <Field id={`contact-name-${index}`} label="Contact Name">
                  <input
                    id={`contact-name-${index}`}
                    value={contact.name}
                    onChange={(event) => updateContact(index, "name", event.target.value)}
                    className={inputClass}
                    autoComplete="name"
                  />
                </Field>
                <Field id={`contact-relationship-${index}`} label="Relationship">
                  <input
                    id={`contact-relationship-${index}`}
                    value={contact.relationship}
                    onChange={(event) => updateContact(index, "relationship", event.target.value)}
                    className={inputClass}
                  />
                </Field>
                <div>
                  <Field id={`contact-phone-${index}`} label="Phone Number">
                    <input
                      id={`contact-phone-${index}`}
                      value={contact.phone}
                      onChange={(event) => updateContact(index, "phone", event.target.value)}
                      className={inputClass}
                      type="tel"
                      autoComplete="tel"
                    />
                  </Field>
                  {card.emergencyContacts.length > 1 ? (
                    <button
                      type="button"
                      className="mt-2 rounded-full text-xs font-semibold text-ht-danger underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ht-danger/30"
                      onClick={() => removeContact(index)}
                    >
                      Remove contact
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <Field id="additionalNotes" label="Private Notes">
            <textarea
              id="additionalNotes"
              value={card.additionalNotes}
              onChange={(event) => updateCard("additionalNotes", event.target.value)}
              className={textareaClass}
              placeholder="Private notes stay in your private card unless a future setting explicitly shares them."
            />
          </Field>
        </section>
        ) : (
          <EmergencyCardPreview card={card} />
        )}

        <aside className="grid h-fit gap-5">
          <section className="rounded-2xl border border-ht-border bg-white p-5 shadow-[0_14px_36px_rgba(5,31,32,0.05)] sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-ht-green-soft text-ht-teal-dark">
                <ShieldCheck aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-semibold">What should be visible?</h2>
                <p className="mt-2 text-sm leading-6 text-ht-muted">
                  {isEditing
                    ? "Only the information you choose will be visible."
                    : "Use Edit Card to change what becomes visible through the QR."}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {visibilityOptions.map((option) => (
                <label
                  key={option.key}
                  className="flex cursor-pointer items-start gap-3 rounded-2xl border border-ht-border bg-ht-background p-4"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(card.visibility?.[option.key])}
                    disabled={!isEditing}
                    onChange={(event) => updateVisibility(option.key, event.target.checked)}
                    className="mt-1 size-4 accent-ht-teal disabled:opacity-60"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-ht-ink">{option.label}</span>
                    <span className="mt-1 block text-sm leading-5 text-ht-muted">{option.description}</span>
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-ht-border bg-white p-5 shadow-[0_14px_36px_rgba(5,31,32,0.05)] sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-ht-green-soft text-ht-teal-dark">
                <QrCode aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-semibold">QR Emergency Access</h2>
                <p className="mt-2 text-sm leading-6 text-ht-muted">
                  Scan to view your shared emergency information.
                </p>
              </div>
            </div>

            {card.sharingEnabled && shareUrl ? (
              <div className="mt-5 grid gap-4">
                <div ref={qrWrapRef} className="mx-auto rounded-2xl border border-ht-border bg-white p-4">
                  <QRCodeSVG
                    value={shareUrl}
                    size={220}
                    level="M"
                    includeMargin
                    title="QR code for shared HealTogether emergency card"
                  />
                </div>
                <p className="break-all rounded-xl bg-ht-background p-3 text-xs font-medium text-ht-muted">
                  {shareUrl}
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Button type="button" variant="outline" className="h-10 rounded-full border-ht-border bg-white" onClick={handleDownloadQr}>
                    <Download aria-hidden="true" />
                    Download QR
                  </Button>
                  <Button type="button" variant="outline" className="h-10 rounded-full border-ht-border bg-white" onClick={handleCopyLink}>
                    <Clipboard aria-hidden="true" />
                    Copy Link
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={sharingAction === "regenerate"}
                    className="h-10 rounded-full border-ht-border bg-white"
                    onClick={handleRegenerateLink}
                  >
                    {sharingAction === "regenerate" ? <Loader2 className="animate-spin" aria-hidden="true" /> : <RefreshCw aria-hidden="true" />}
                    Regenerate Link
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={sharingAction === "disable"}
                    className="h-10 rounded-full"
                    onClick={handleDisableSharing}
                  >
                    {sharingAction === "disable" ? <Loader2 className="animate-spin" aria-hidden="true" /> : <XCircle aria-hidden="true" />}
                    Disable Sharing
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-ht-border bg-ht-background p-5">
                <p className="text-sm leading-6 text-ht-muted">
                  Public sharing is off. Save your card, choose visible fields, then enable sharing when you are ready.
                </p>
                <Button
                  type="button"
                  disabled={sharingAction === "enable"}
                  className="mt-4 h-11 rounded-full bg-ht-teal px-5 text-white hover:bg-ht-teal-dark"
                  onClick={handleEnableSharing}
                >
                  {sharingAction === "enable" ? <Loader2 className="animate-spin" aria-hidden="true" /> : <ShieldCheck aria-hidden="true" />}
                  Enable Sharing
                </Button>
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  )
}

export default Emergency
