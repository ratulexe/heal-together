import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2, MailCheck } from "lucide-react"
import { useForm } from "react-hook-form"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAuth } from "@/hooks/useAuth"
import logoIcon from "@/assets/branding/brand-icon.png"

const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
})

const emailSchema = z.string().trim().min(1, "Email is required.").email("Enter a valid email address.")

function FieldError({ id, children }) {
  if (!children) return null

  return (
    <p id={id} className="mt-2 text-sm font-medium text-ht-danger">
      {children}
    </p>
  )
}

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, resetPassword } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState("")
  const [resetOpen, setResetOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetError, setResetError] = useState("")
  const [resetMessage, setResetMessage] = useState("")
  const [isResetting, setIsResetting] = useState(false)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values) {
    setFormError("")

    try {
      const signedInUser = await login(values.email.trim(), values.password)
      const destination = signedInUser.emailVerified
        ? location.state?.from?.pathname || "/dashboard"
        : "/verify-email"

      navigate(destination, { replace: true })
    } catch (error) {
      setFormError(error.message)
    }
  }

  function openReset() {
    setResetOpen(true)
    setResetError("")
    setResetMessage("")
    setResetEmail(getValues("email"))
  }

  async function onResetSubmit(event) {
    event?.preventDefault()
    setResetError("")
    setResetMessage("")

    const parsedEmail = emailSchema.safeParse(resetEmail)

    if (!parsedEmail.success) {
      setResetError(parsedEmail.error.issues[0]?.message || "Enter a valid email address.")
      return
    }

    setIsResetting(true)

    try {
      await resetPassword(parsedEmail.data.trim())
      setResetMessage("If an account exists for this email, you'll receive password reset instructions.")
    } catch (error) {
      setResetError(error.message)
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <main className="min-h-screen bg-ht-background px-4 py-8 text-ht-ink sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
        <Card className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-ht-border bg-white p-0 shadow-[0_24px_70px_rgba(5,31,32,0.08)] md:grid-cols-[0.95fr_1.05fr]">
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
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-ht-teal-dark">
                Welcome back
              </p>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">
                Welcome back
              </h1>
              <p className="mt-5 text-base leading-7 text-ht-muted">
                Continue your health routine.
              </p>
            </div>

            <p className="mt-12 rounded-xl border border-ht-border bg-white/70 p-4 text-sm leading-6 text-ht-muted">
              Sign in to return to your private HealTogether space.
            </p>
          </aside>

          <section className="p-6 sm:p-10">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="font-display text-3xl font-semibold">
                Sign In
              </CardTitle>
              <CardDescription className="text-base text-ht-muted">
                Use the email and password you chose when creating your account.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-0 pb-0">
              <form className="mt-8 grid gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
                {formError ? (
                  <div
                    role="alert"
                    className="rounded-xl border border-ht-danger/20 bg-ht-danger-bg/70 px-4 py-3 text-sm font-medium text-ht-danger"
                  >
                    {formError}
                  </div>
                ) : null}

                <div>
                  <label className="text-sm font-semibold text-ht-ink" htmlFor="login-email">
                    Email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "login-email-error" : undefined}
                    className="mt-2 h-12 w-full rounded-xl border border-ht-border bg-white px-4 text-base outline-none transition placeholder:text-ht-muted-light focus:border-ht-teal focus:ring-4 focus:ring-ht-teal/15"
                    placeholder="you@example.com"
                    {...register("email")}
                  />
                  <FieldError id="login-email-error">{errors.email?.message}</FieldError>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-3">
                    <label className="text-sm font-semibold text-ht-ink" htmlFor="login-password">
                      Password
                    </label>
                    <button
                      type="button"
                      className="rounded-full text-sm font-semibold text-ht-teal-dark underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ht-teal/40"
                      onClick={openReset}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative mt-2">
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby={errors.password ? "login-password-error" : undefined}
                      className="h-12 w-full rounded-xl border border-ht-border bg-white px-4 pr-12 text-base outline-none transition placeholder:text-ht-muted-light focus:border-ht-teal focus:ring-4 focus:ring-ht-teal/15"
                      placeholder="Your password"
                      {...register("password")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 size-10 -translate-y-1/2 rounded-full text-ht-muted hover:bg-ht-green-soft/70"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((value) => !value)}
                    >
                      {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                    </Button>
                  </div>
                  <FieldError id="login-password-error">{errors.password?.message}</FieldError>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 h-12 rounded-full bg-ht-teal text-base font-semibold text-white shadow-[0_14px_34px_rgba(15,163,160,0.24)] hover:bg-ht-teal-dark"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" aria-hidden="true" />
                      Signing in
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <p className="mt-7 text-center text-sm text-ht-muted">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-ht-teal-dark underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ht-teal/40"
                >
                  Create one
                </Link>
              </p>
            </CardContent>
          </section>
        </Card>
      </div>

      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="mb-1 flex size-11 items-center justify-center rounded-full bg-ht-green-soft text-ht-teal-dark">
              <MailCheck className="size-5" aria-hidden="true" />
            </div>
            <DialogTitle>Reset your password</DialogTitle>
            <DialogDescription>
              Enter your email and we will send reset instructions if an account exists.
            </DialogDescription>
          </DialogHeader>

          <form className="grid gap-4" onSubmit={onResetSubmit} noValidate>
            <div>
              <label className="text-sm font-semibold text-ht-ink" htmlFor="reset-email">
                Email
              </label>
              <input
                id="reset-email"
                type="email"
                value={resetEmail}
                autoComplete="email"
                aria-invalid={Boolean(resetError)}
                aria-describedby={
                  resetError ? "reset-email-error" : resetMessage ? "reset-email-message" : undefined
                }
                onChange={(event) => setResetEmail(event.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-ht-border bg-white px-4 text-base outline-none transition placeholder:text-ht-muted-light focus:border-ht-teal focus:ring-4 focus:ring-ht-teal/15"
                placeholder="you@example.com"
              />
              {resetError ? (
                <p id="reset-email-error" role="alert" className="mt-2 text-sm font-medium text-ht-danger">
                  {resetError}
                </p>
              ) : null}
              {resetMessage ? (
                <p id="reset-email-message" className="mt-2 text-sm font-medium text-ht-teal-dark">
                  {resetMessage}
                </p>
              ) : null}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                className="h-10 rounded-full text-ht-muted hover:bg-ht-green-soft/70"
                onClick={() => setResetOpen(false)}
              >
                Close
              </Button>
              <Button
                type="submit"
                disabled={isResetting}
                className="h-10 rounded-full bg-ht-teal text-white hover:bg-ht-teal-dark"
              >
                {isResetting ? (
                  <>
                    <Loader2 className="animate-spin" aria-hidden="true" />
                    Sending
                  </>
                ) : (
                  "Send reset email"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  )
}

export default Login
