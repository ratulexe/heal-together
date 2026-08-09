import { useEffect, useState } from "react"
import { CheckCircle2, Loader2, MailCheck, RotateCcw, ShieldCheck } from "lucide-react"
import { Link, Navigate, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"
import logoIcon from "@/assets/branding/brand-icon.png"

const verificationSentAtKey = "healtogether_verification_sent_at"

function getInitialCooldown() {
  const lastSentAt = Number(window.sessionStorage.getItem(verificationSentAtKey))

  if (!lastSentAt) return 0

  const elapsedSeconds = Math.floor((Date.now() - lastSentAt) / 1000)
  return Math.max(60 - elapsedSeconds, 0)
}

function VerifyEmail() {
  const navigate = useNavigate()
  const { user, loading, logout, refreshUser, sendVerification } = useAuth()
  const [statusMessage, setStatusMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [cooldown, setCooldown] = useState(getInitialCooldown)

  useEffect(() => {
    if (cooldown <= 0) return undefined

    const timer = window.setInterval(() => {
      setCooldown((seconds) => Math.max(seconds - 1, 0))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [cooldown])

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ht-background px-6 text-ht-ink">
        <div className="w-full max-w-sm rounded-2xl border border-ht-border bg-white p-8 text-center shadow-[0_18px_50px_rgba(5,31,32,0.08)]">
          <div className="mx-auto mb-5 size-12 animate-pulse rounded-full bg-ht-green-soft" />
          <p className="font-display text-2xl font-semibold">Loading your space</p>
          <p className="mt-2 text-sm text-ht-muted">
            Checking your HealTogether session.
          </p>
        </div>
      </main>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.emailVerified) {
    return <Navigate to="/dashboard" replace />
  }

  async function handleCheckVerification() {
    setIsChecking(true)
    setStatusMessage("")
    setErrorMessage("")

    try {
      const refreshedUser = await refreshUser()

      if (refreshedUser?.emailVerified) {
        navigate("/dashboard", { replace: true })
        return
      }

      setErrorMessage("Your email hasn't been verified yet. Check your inbox and try again.")
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsChecking(false)
    }
  }

  async function handleResendVerification() {
    if (cooldown > 0) return

    setIsResending(true)
    setStatusMessage("")
    setErrorMessage("")

    try {
      await sendVerification()
      setCooldown(60)
      setStatusMessage("We sent a new verification email. It may take a minute to arrive.")
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsResending(false)
    }
  }

  async function handleSignOut() {
    await logout()
    navigate("/login", { replace: true })
  }

  return (
    <main className="min-h-screen bg-ht-background px-4 py-8 text-ht-ink sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center justify-center">
        <Card className="w-full overflow-hidden rounded-2xl border border-ht-border bg-white p-0 shadow-[0_24px_70px_rgba(5,31,32,0.08)]">
          <div className="grid md:grid-cols-[0.9fr_1.1fr]">
            <aside className="flex flex-col justify-between bg-ht-green-soft/70 p-8 sm:p-10">
              <Link
                to="/"
                className="inline-flex w-fit items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ht-teal/40"
                aria-label="HealTogether home"
              >
                <img src={logoIcon} alt="" className="size-11 rounded-full object-cover" />
                <span className="font-display text-xl font-semibold">HealTogether</span>
              </Link>

              <div className="mt-14 max-w-sm">
                <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-white text-ht-teal-dark shadow-sm">
                  <MailCheck aria-hidden="true" />
                </div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-ht-teal-dark">
                  Almost there
                </p>
                <h1 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">
                  Check your inbox
                </h1>
                <p className="mt-5 text-base leading-7 text-ht-muted">
                  We sent a verification link to {user.email}.
                </p>
              </div>

              <p className="mt-12 rounded-xl border border-ht-border bg-white/70 p-4 text-sm leading-6 text-ht-muted">
                Verify your email before continuing to your HealTogether space.
              </p>
            </aside>

            <section className="p-6 sm:p-10">
              <CardHeader className="px-0 pt-0">
                <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-ht-background text-ht-teal-dark">
                  <ShieldCheck aria-hidden="true" />
                </div>
                <CardTitle className="font-display text-3xl font-semibold">
                  Confirm when you're ready
                </CardTitle>
                <CardDescription className="text-base leading-7 text-ht-muted">
                  After opening the link from your email, come back here and we will refresh your account status.
                </CardDescription>
              </CardHeader>

              <CardContent className="grid gap-4 px-0 pb-0">
                {statusMessage ? (
                  <div
                    role="status"
                    className="flex gap-3 rounded-xl border border-ht-border bg-ht-green-soft/60 px-4 py-3 text-sm font-medium text-ht-teal-dark"
                  >
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <span>{statusMessage}</span>
                  </div>
                ) : null}

                {errorMessage ? (
                  <div
                    role="alert"
                    className="rounded-xl border border-ht-danger/20 bg-ht-danger-bg/70 px-4 py-3 text-sm font-medium text-ht-danger"
                  >
                    {errorMessage}
                  </div>
                ) : null}

                <Button
                  type="button"
                  disabled={isChecking}
                  className="h-12 rounded-full bg-ht-teal text-base font-semibold text-white shadow-[0_14px_34px_rgba(15,163,160,0.24)] hover:bg-ht-teal-dark"
                  onClick={handleCheckVerification}
                >
                  {isChecking ? (
                    <>
                      <Loader2 className="animate-spin" aria-hidden="true" />
                      Checking
                    </>
                  ) : (
                    "I've Verified My Email"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  disabled={isResending || cooldown > 0}
                  className="h-12 rounded-full border-ht-border bg-white text-base font-semibold text-ht-ink hover:bg-ht-green-soft/60"
                  onClick={handleResendVerification}
                >
                  {isResending ? (
                    <>
                      <Loader2 className="animate-spin" aria-hidden="true" />
                      Sending
                    </>
                  ) : (
                    <>
                      <RotateCcw aria-hidden="true" />
                      {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Verification Email"}
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="h-12 rounded-full text-base font-semibold text-ht-muted hover:bg-ht-green-soft/60 hover:text-ht-ink"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </CardContent>
            </section>
          </div>
        </Card>
      </div>
    </main>
  )
}

export default VerifyEmail
