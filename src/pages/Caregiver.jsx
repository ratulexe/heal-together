import { useCallback, useEffect, useMemo, useState } from "react"
import { Clipboard, HeartHandshake, Loader2, ShieldCheck, UserPlus, Users } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { formatLocalDate, getScheduledDosesForDate } from "@/lib/schedule"
import {
  approveCaregiver,
  createCaregiverInvite,
  declineCaregiver,
  getMyCaregivers,
  getPendingCaregiverRequests,
  getPeopleISupport,
  leaveCaregiverConnection,
  revokeCaregiver,
  updateCaregiverPermissions,
} from "@/services/caregiverService"
import { getDoseLogsForDate } from "@/services/doseLogService"
import { getPrivateEmergencyCard } from "@/services/emergencyCardService"
import { getMedicines } from "@/services/medicineService"

function PermissionToggle({ id, label, description, checked, disabled, onChange }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-ht-border bg-ht-background p-4">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 size-4 accent-ht-teal disabled:opacity-50"
      />
      <span>
        <span className="block text-sm font-semibold text-ht-ink">{label}</span>
        <span className="mt-1 block text-sm leading-5 text-ht-muted">{description}</span>
      </span>
    </label>
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

function routineSummary(doses) {
  const total = doses.length
  const taken = doses.filter((dose) => dose.status === "taken").length
  const missed = doses.filter((dose) => dose.status === "missed").length
  const pending = total - taken - missed

  return { total, taken, missed, pending }
}

async function loadSupportedOverview(link) {
  const overview = {
    link,
    doses: [],
    emergencyCard: null,
  }

  if (link.status !== "active") return overview

  const today = new Date()
  const todayKey = formatLocalDate(today)

  if (link.permissions?.viewMedicineStatus) {
    const [medicines, doseLogs] = await Promise.all([
      getMedicines(link.ownerUid),
      getDoseLogsForDate(link.ownerUid, todayKey),
    ])
    overview.doses = getScheduledDosesForDate(medicines, today, doseLogs)
  }

  if (link.permissions?.viewEmergencyCard) {
    overview.emergencyCard = await getPrivateEmergencyCard(link.ownerUid)
  }

  return overview
}

function Caregiver() {
  const { user } = useAuth()
  const userId = user?.uid
  const [activeTab, setActiveTab] = useState("my-support")
  const [pendingRequests, setPendingRequests] = useState([])
  const [caregivers, setCaregivers] = useState([])
  const [peopleISupport, setPeopleISupport] = useState([])
  const [supportedOverviews, setSupportedOverviews] = useState([])
  const [approvalDrafts, setApprovalDrafts] = useState({})
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState("")
  const [message, setMessage] = useState({ type: "", text: "" })
  const [inviteOpen, setInviteOpen] = useState(false)
  const [invite, setInvite] = useState(null)
  const [creatingInvite, setCreatingInvite] = useState(false)

  const inviteLink = useMemo(() => {
    if (!invite?.token) return ""
    return `${window.location.origin}/caregiver/invite/${invite.token}`
  }, [invite])

  const loadCaregiverData = useCallback(async () => {
    if (!userId) return

    setLoading(true)
    setMessage({ type: "", text: "" })

    try {
      const [pending, active, supporting] = await Promise.all([
        getPendingCaregiverRequests(userId),
        getMyCaregivers(userId),
        getPeopleISupport(userId),
      ])
      const overviews = await Promise.all(supporting.map(loadSupportedOverview))

      setPendingRequests(pending)
      setCaregivers(active)
      setPeopleISupport(supporting)
      setSupportedOverviews(overviews)
      setApprovalDrafts((current) => {
        const next = { ...current }
        pending.forEach((request) => {
          if (!next[request.id]) {
            next[request.id] = {
              viewMedicineStatus: false,
              viewEmergencyCard: false,
            }
          }
        })
        return next
      })
    } catch {
      setMessage({ type: "error", text: "We couldn't load caregiver access." })
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    let ignore = false

    async function loadInitialCaregiverData() {
      await Promise.resolve()
      if (!ignore) await loadCaregiverData()
    }

    loadInitialCaregiverData()

    return () => {
      ignore = true
    }
  }, [loadCaregiverData])

  async function handleCreateInvite() {
    setCreatingInvite(true)
    setMessage({ type: "", text: "" })

    try {
      const newInvite = await createCaregiverInvite(user)
      setInvite(newInvite)
    } catch {
      setMessage({ type: "error", text: "We couldn't create a caregiver invitation." })
    } finally {
      setCreatingInvite(false)
    }
  }

  async function handleCopyInvite(value, label) {
    try {
      await navigator.clipboard.writeText(value)
      setMessage({ type: "success", text: `${label} copied.` })
    } catch {
      setMessage({ type: "error", text: "We couldn't copy that invitation." })
    }
  }

  async function handleApprove(link) {
    setUpdatingId(link.id)
    setMessage({ type: "", text: "" })

    try {
      await approveCaregiver(link, approvalDrafts[link.id])
      await loadCaregiverData()
      setMessage({ type: "success", text: "Caregiver access approved." })
    } catch {
      setMessage({ type: "error", text: "We couldn't update caregiver access." })
    } finally {
      setUpdatingId("")
    }
  }

  async function handleDecline(link) {
    setUpdatingId(link.id)
    setMessage({ type: "", text: "" })

    try {
      await declineCaregiver(link)
      await loadCaregiverData()
      setMessage({ type: "success", text: "Caregiver request declined." })
    } catch {
      setMessage({ type: "error", text: "We couldn't update caregiver access." })
    } finally {
      setUpdatingId("")
    }
  }

  async function handlePermissionChange(link, field, value) {
    setUpdatingId(`${link.id}-${field}`)
    setMessage({ type: "", text: "" })

    try {
      await updateCaregiverPermissions(link, {
        ...link.permissions,
        [field]: value,
      })
      await loadCaregiverData()
      setMessage({ type: "success", text: "Caregiver permissions updated." })
    } catch {
      setMessage({ type: "error", text: "We couldn't update caregiver access." })
    } finally {
      setUpdatingId("")
    }
  }

  async function handleRevoke(link) {
    const confirmed = window.confirm(
      "Remove caregiver access?\n\nThis person will no longer be able to view your shared HealTogether information."
    )
    if (!confirmed) return

    setUpdatingId(link.id)
    setMessage({ type: "", text: "" })

    try {
      await revokeCaregiver(link)
      await loadCaregiverData()
      setMessage({ type: "success", text: "Caregiver access removed." })
    } catch {
      setMessage({ type: "error", text: "We couldn't update caregiver access." })
    } finally {
      setUpdatingId("")
    }
  }

  async function handleLeave(link) {
    const confirmed = window.confirm("Stop supporting this person?")
    if (!confirmed) return

    setUpdatingId(link.id)
    setMessage({ type: "", text: "" })

    try {
      await leaveCaregiverConnection(link)
      await loadCaregiverData()
      setMessage({ type: "success", text: "You are no longer connected." })
    } catch {
      setMessage({ type: "error", text: "We couldn't update caregiver access." })
    } finally {
      setUpdatingId("")
    }
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
              Caregiver Connections
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl">
              Stay connected when support is helpful
            </h1>
            <p className="mt-4 text-base leading-7 text-ht-muted">
              You control who can view your shared HealTogether information. Caregivers get read-only access after you approve them.
            </p>
          </div>
          <Button
            type="button"
            className="h-11 rounded-full bg-ht-teal px-5 text-white hover:bg-ht-teal-dark"
            onClick={() => setInviteOpen(true)}
          >
            <UserPlus aria-hidden="true" />
            Invite a Caregiver
          </Button>
        </div>
      </section>

      <StatusMessage message={message} />

      <div className="flex flex-wrap gap-2 rounded-2xl border border-ht-border bg-white p-2 shadow-[0_14px_36px_rgba(5,31,32,0.05)]" role="tablist" aria-label="Caregiver views">
        {[
          { id: "my-support", label: "My Support", icon: Users },
          { id: "supporting", label: "People I Support", icon: HeartHandshake },
        ].map((tab) => {
          const Icon = tab.icon
          const active = activeTab === tab.id

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              className={`inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ht-teal/15 sm:flex-none ${
                active ? "bg-ht-green-soft text-ht-ink" : "text-ht-muted hover:bg-ht-green-soft/50"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="size-4" aria-hidden="true" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {activeTab === "my-support" ? (
        <section className="grid gap-5">
          <div className="rounded-2xl border border-ht-border bg-white p-5 shadow-[0_14px_36px_rgba(5,31,32,0.05)]">
            <h2 className="font-display text-2xl font-semibold">Pending Requests</h2>
            <p className="mt-2 text-sm leading-6 text-ht-muted">
              Review who is asking to connect before any health information becomes visible.
            </p>
            {pendingRequests.length === 0 ? (
              <p className="mt-5 rounded-xl bg-ht-background p-4 text-sm font-medium text-ht-muted">No pending caregiver requests.</p>
            ) : (
              <div className="mt-5 grid gap-4">
                {pendingRequests.map((request) => (
                  <article key={request.id} className="rounded-2xl border border-ht-border bg-ht-background p-4">
                    <h3 className="font-display text-xl font-semibold">
                      {request.caregiverDisplayName} wants to connect as a caregiver.
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-ht-muted">
                      Choose what this caregiver will be able to access. No edit permissions are included.
                    </p>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <PermissionToggle
                        id={`${request.id}-approve-medicine`}
                        label="View Medicine Status"
                        description="Read-only view of today's routine summary."
                        checked={Boolean(approvalDrafts[request.id]?.viewMedicineStatus)}
                        onChange={(value) =>
                          setApprovalDrafts((current) => ({
                            ...current,
                            [request.id]: {
                              ...current[request.id],
                              viewMedicineStatus: value,
                            },
                          }))
                        }
                      />
                      <PermissionToggle
                        id={`${request.id}-approve-emergency`}
                        label="View Emergency Information"
                        description="Read-only view of your private emergency card summary."
                        checked={Boolean(approvalDrafts[request.id]?.viewEmergencyCard)}
                        onChange={(value) =>
                          setApprovalDrafts((current) => ({
                            ...current,
                            [request.id]: {
                              ...current[request.id],
                              viewEmergencyCard: value,
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <Button
                        type="button"
                        disabled={updatingId === request.id}
                        className="h-10 rounded-full bg-ht-teal px-5 text-white hover:bg-ht-teal-dark"
                        onClick={() => handleApprove(request)}
                      >
                        {updatingId === request.id ? <Loader2 className="animate-spin" aria-hidden="true" /> : <ShieldCheck aria-hidden="true" />}
                        Approve
                      </Button>
                      <Button type="button" variant="outline" className="h-10 rounded-full border-ht-border bg-white" onClick={() => handleDecline(request)}>
                        Decline
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-ht-border bg-white p-5 shadow-[0_14px_36px_rgba(5,31,32,0.05)]">
            <h2 className="font-display text-2xl font-semibold">Connected Caregivers</h2>
            {caregivers.length === 0 ? (
              <p className="mt-5 rounded-xl bg-ht-background p-4 text-sm font-medium text-ht-muted">No active caregivers yet.</p>
            ) : (
              <div className="mt-5 grid gap-4">
                {caregivers.map((caregiver) => (
                  <article key={caregiver.id} className="rounded-2xl border border-ht-border bg-ht-background p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-display text-xl font-semibold">{caregiver.caregiverDisplayName}</h3>
                        <p className="mt-1 text-sm text-ht-muted">Read-only caregiver access</p>
                      </div>
                      <Button type="button" variant="destructive" className="h-10 rounded-full" onClick={() => handleRevoke(caregiver)}>
                        Remove Caregiver
                      </Button>
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <PermissionToggle
                        id={`${caregiver.id}-medicine`}
                        label="View Medicine Status"
                        description="Show today's medicine completion summary."
                        checked={Boolean(caregiver.permissions?.viewMedicineStatus)}
                        disabled={updatingId === `${caregiver.id}-viewMedicineStatus`}
                        onChange={(value) => handlePermissionChange(caregiver, "viewMedicineStatus", value)}
                      />
                      <PermissionToggle
                        id={`${caregiver.id}-emergency`}
                        label="View Emergency Information"
                        description="Show your private emergency card summary."
                        checked={Boolean(caregiver.permissions?.viewEmergencyCard)}
                        disabled={updatingId === `${caregiver.id}-viewEmergencyCard`}
                        onChange={(value) => handlePermissionChange(caregiver, "viewEmergencyCard", value)}
                      />
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="rounded-2xl border border-ht-border bg-white p-5 shadow-[0_14px_36px_rgba(5,31,32,0.05)]">
          <h2 className="font-display text-2xl font-semibold">People I Support</h2>
          <p className="mt-2 text-sm leading-6 text-ht-muted">
            Supporting someone's routine is read-only here. You cannot edit medicines, mark doses, or change their settings.
          </p>

          {peopleISupport.length === 0 ? (
            <p className="mt-5 rounded-xl bg-ht-background p-4 text-sm font-medium text-ht-muted">No support connections yet.</p>
          ) : (
            <div className="mt-5 grid gap-4">
              {supportedOverviews.map((overview) => {
                const link = overview.link
                const summary = routineSummary(overview.doses)

                return (
                  <article key={link.id} className="rounded-2xl border border-ht-border bg-ht-background p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-display text-xl font-semibold">Supporting {link.ownerDisplayName}</h3>
                        <p className="mt-1 text-sm text-ht-muted">
                          {link.status === "pending" ? "Waiting for approval." : "Active read-only connection."}
                        </p>
                      </div>
                      <Button type="button" variant="outline" className="h-10 rounded-full border-ht-border bg-white" onClick={() => handleLeave(link)}>
                        Stop Supporting
                      </Button>
                    </div>

                    {link.status === "pending" ? (
                      <p className="mt-4 rounded-xl bg-white p-4 text-sm font-medium text-ht-muted">
                        You cannot see health information until {link.ownerDisplayName} approves the request.
                      </p>
                    ) : (
                      <div className="mt-4 grid gap-3 lg:grid-cols-2">
                        {link.permissions?.viewMedicineStatus ? (
                          <div className="rounded-2xl border border-ht-border bg-white p-4">
                            <p className="text-sm font-semibold text-ht-muted">Medicine routine</p>
                            <p className="mt-2 font-display text-3xl font-semibold">
                              {summary.taken} of {summary.total} completed today
                            </p>
                            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                              <div className="rounded-xl bg-ht-success-bg p-3 text-ht-success">
                                <span className="block font-semibold">{summary.taken}</span>
                                Taken
                              </div>
                              <div className="rounded-xl bg-white p-3 text-ht-muted">
                                <span className="block font-semibold">{summary.pending}</span>
                                Pending
                              </div>
                              <div className="rounded-xl bg-ht-warning-bg p-3 text-ht-warning">
                                <span className="block font-semibold">{summary.missed}</span>
                                Missed
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="rounded-2xl border border-ht-border bg-white p-4 text-sm font-medium text-ht-muted">
                            Medicine status is not shared.
                          </p>
                        )}

                        {link.permissions?.viewEmergencyCard ? (
                          <div className="rounded-2xl border border-ht-border bg-white p-4">
                            <p className="text-sm font-semibold text-ht-muted">Emergency information</p>
                            <h4 className="mt-2 font-display text-2xl font-semibold">
                              {overview.emergencyCard?.fullName || link.ownerDisplayName}
                            </h4>
                            <div className="mt-3 grid gap-2 text-sm text-ht-muted">
                              {overview.emergencyCard?.bloodGroup ? <p>Blood group: {overview.emergencyCard.bloodGroup}</p> : null}
                              {overview.emergencyCard?.allergies ? <p>Allergies: {overview.emergencyCard.allergies}</p> : null}
                              {overview.emergencyCard?.doctorName || overview.emergencyCard?.doctorPhone ? (
                                <p>Doctor: {[overview.emergencyCard?.doctorName, overview.emergencyCard?.doctorPhone].filter(Boolean).join(" - ")}</p>
                              ) : null}
                            </div>
                          </div>
                        ) : (
                          <p className="rounded-2xl border border-ht-border bg-white p-4 text-sm font-medium text-ht-muted">
                            Emergency information is not shared.
                          </p>
                        )}
                      </div>
                    )}
                  </article>
                )
              })}
            </div>
          )}
        </section>
      )}

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="mb-1 flex size-11 items-center justify-center rounded-full bg-ht-green-soft text-ht-teal-dark">
              <UserPlus className="size-5" aria-hidden="true" />
            </div>
            <DialogTitle>Invite a Caregiver</DialogTitle>
            <DialogDescription>
              Share this private invitation with one trusted person. It contains no health information and expires in 24 hours.
            </DialogDescription>
          </DialogHeader>

          {invite ? (
            <div className="grid gap-3">
              <div>
                <label className="text-sm font-semibold text-ht-ink" htmlFor="caregiver-invite-link">
                  Share Link
                </label>
                <input id="caregiver-invite-link" value={inviteLink} readOnly className="mt-2 h-11 w-full rounded-xl border border-ht-border bg-ht-background px-4 text-sm outline-none" />
              </div>
              <div>
                <label className="text-sm font-semibold text-ht-ink" htmlFor="caregiver-invite-code">
                  Copy Code
                </label>
                <input id="caregiver-invite-code" value={invite.token} readOnly className="mt-2 h-11 w-full rounded-xl border border-ht-border bg-ht-background px-4 text-sm outline-none" />
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <Button type="button" variant="outline" className="h-10 rounded-full border-ht-border bg-white" onClick={() => handleCopyInvite(inviteLink, "Caregiver invite link")}>
                  <Clipboard aria-hidden="true" />
                  Copy Link
                </Button>
                <Button type="button" variant="outline" className="h-10 rounded-full border-ht-border bg-white" onClick={() => handleCopyInvite(invite.token, "Caregiver invite code")}>
                  <Clipboard aria-hidden="true" />
                  Copy Code
                </Button>
              </div>
            </div>
          ) : (
            <p className="rounded-2xl border border-ht-border bg-ht-background p-4 text-sm leading-6 text-ht-muted">
              The caregiver must sign in with a verified email and request connection. You approve access before anything is visible.
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="ghost" className="h-10 rounded-full text-ht-muted hover:bg-ht-green-soft/70" onClick={() => setInviteOpen(false)}>
              Close
            </Button>
            {!invite ? (
              <Button type="button" disabled={creatingInvite} className="h-10 rounded-full bg-ht-teal text-white hover:bg-ht-teal-dark" onClick={handleCreateInvite}>
                {creatingInvite ? <Loader2 className="animate-spin" aria-hidden="true" /> : <UserPlus aria-hidden="true" />}
                Create Invitation
              </Button>
            ) : null}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Caregiver
