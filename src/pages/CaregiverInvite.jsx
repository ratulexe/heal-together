import { useEffect, useState } from "react"
import { HeartHandshake, Loader2, ShieldCheck } from "lucide-react"
import { Link, useParams } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { getCaregiverInvite, requestCaregiverConnection } from "@/services/caregiverService"
import logoIcon from "@/assets/branding/brand-icon.png"

function CaregiverInvite() {
  const { token } = useParams()
  const { user } = useAuth()
  const [invite, setInvite] = useState(null)
  const [loading, setLoading] = useState(true)
  const [requesting, setRequesting] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [unavailable, setUnavailable] = useState(false)

  useEffect(() => {
    let ignore = false

    async function loadInvite() {
      setLoading(true)
      setUnavailable(false)

      try {
        const foundInvite = await getCaregiverInvite(token)
        if (ignore) return

        if (!foundInvite || foundInvite.status !== "active" || foundInvite.expired) {
          setUnavailable(true)
          return
        }

        setInvite(foundInvite)
      } catch {
        if (!ignore) setUnavailable(true)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadInvite()

    return () => {
      ignore = true
    }
  }, [token])

  async function handleRequestConnection() {
    setRequesting(true)
    setMessage({ type: "", text: "" })

    try {
      await requestCaregiverConnection(token, user)
      setMessage({
        type: "success",
        text: "Connection requested. Health information stays private until approval.",
      })
      setUnavailable(true)
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "This invitation is unavailable or has expired.",
      })
    } finally {
      setRequesting(false)
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-2xl gap-5">
      <section className="rounded-2xl border border-ht-border bg-white p-6 text-center shadow-[0_14px_36px_rgba(5,31,32,0.05)] sm:p-8">
        <Link
          to="/dashboard"
          className="mx-auto inline-flex items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ht-teal/40"
          aria-label="HealTogether dashboard"
        >
          <img src={logoIcon} alt="" className="size-11 rounded-full object-cover" />
          <span className="font-display text-xl font-semibold">HealTogether</span>
        </Link>

        <div className="mx-auto mt-8 flex size-14 items-center justify-center rounded-full bg-ht-green-soft text-ht-teal-dark">
          <HeartHandshake aria-hidden="true" />
        </div>

        {loading ? (
          <>
            <h1 className="mt-5 font-display text-3xl font-semibold">Checking invitation</h1>
            <p className="mt-3 text-base leading-7 text-ht-muted">This will just take a moment.</p>
          </>
        ) : unavailable && !message.text ? (
          <>
            <h1 className="mt-5 font-display text-3xl font-semibold">This invitation is unavailable or has expired.</h1>
            <p className="mt-3 text-base leading-7 text-ht-muted">
              Ask the person you support to create a fresh caregiver invitation.
            </p>
          </>
        ) : (
          <>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.12em] text-ht-teal-dark">
              Caregiver Invitation
            </p>
            <h1 className="mt-3 font-display text-3xl font-semibold">
              {invite?.ownerDisplayName || "Someone"} invited you to connect on HealTogether.
            </h1>
            <p className="mt-3 text-base leading-7 text-ht-muted">
              Request connection first. You will not see health information unless they approve you and choose permissions.
            </p>
          </>
        )}

        {message.text ? (
          <div
            role="status"
            className={`mt-5 rounded-2xl border px-4 py-3 text-sm font-medium ${
              message.type === "error"
                ? "border-ht-danger/20 bg-ht-danger-bg/70 text-ht-danger"
                : "border-ht-border bg-ht-green-soft/70 text-ht-teal-dark"
            }`}
          >
            {message.text}
          </div>
        ) : null}

        {!loading && invite && !unavailable ? (
          <Button
            type="button"
            disabled={requesting}
            className="mt-6 h-11 rounded-full bg-ht-teal px-5 text-white hover:bg-ht-teal-dark"
            onClick={handleRequestConnection}
          >
            {requesting ? <Loader2 className="animate-spin" aria-hidden="true" /> : <ShieldCheck aria-hidden="true" />}
            Request Connection
          </Button>
        ) : (
          <Button
            nativeButton={false}
            render={<Link to="/caregiver" />}
            className="mt-6 h-11 rounded-full bg-ht-teal px-5 text-white hover:bg-ht-teal-dark"
          >
            Go to Caregiver
          </Button>
        )}
      </section>
    </div>
  )
}

export default CaregiverInvite
