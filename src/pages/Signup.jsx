import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { z } from "zod"

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

const signupSchema = z
  .object({
    name: z.string().trim().min(1, "Full name is required."),
    email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  })

function FieldError({ id, children }) {
  if (!children) return null

  return (
    <p id={id} className="mt-2 text-sm font-medium text-ht-danger">
      {children}
    </p>
  )
}

function Signup() {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formError, setFormError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values) {
    setFormError("")

    try {
      await signup({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      })
      navigate("/verify-email", { replace: true })
    } catch (error) {
      setFormError(error.message)
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
                Gentle start
              </p>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">
                Create your HealTogether space
              </h1>
              <p className="mt-5 text-base leading-7 text-ht-muted">
                Start with one small routine and build from there.
              </p>
            </div>

            <p className="mt-12 rounded-xl border border-ht-border bg-white/70 p-4 text-sm leading-6 text-ht-muted">
              Your health information is not required to create an account.
            </p>
          </aside>

          <section className="p-6 sm:p-10">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="font-display text-3xl font-semibold">
                Create Account
              </CardTitle>
              <CardDescription className="text-base text-ht-muted">
                Use only the basics for now. You can personalize your space later.
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
                  <label className="text-sm font-semibold text-ht-ink" htmlFor="signup-name">
                    Full Name
                  </label>
                  <input
                    id="signup-name"
                    type="text"
                    autoComplete="name"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "signup-name-error" : undefined}
                    className="mt-2 h-12 w-full rounded-xl border border-ht-border bg-white px-4 text-base outline-none transition placeholder:text-ht-muted-light focus:border-ht-teal focus:ring-4 focus:ring-ht-teal/15"
                    placeholder="Your name"
                    {...register("name")}
                  />
                  <FieldError id="signup-name-error">{errors.name?.message}</FieldError>
                </div>

                <div>
                  <label className="text-sm font-semibold text-ht-ink" htmlFor="signup-email">
                    Email
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    autoComplete="email"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "signup-email-error" : undefined}
                    className="mt-2 h-12 w-full rounded-xl border border-ht-border bg-white px-4 text-base outline-none transition placeholder:text-ht-muted-light focus:border-ht-teal focus:ring-4 focus:ring-ht-teal/15"
                    placeholder="you@example.com"
                    {...register("email")}
                  />
                  <FieldError id="signup-email-error">{errors.email?.message}</FieldError>
                </div>

                <div>
                  <label className="text-sm font-semibold text-ht-ink" htmlFor="signup-password">
                    Password
                  </label>
                  <div className="relative mt-2">
                    <input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby={errors.password ? "signup-password-error" : undefined}
                      className="h-12 w-full rounded-xl border border-ht-border bg-white px-4 pr-12 text-base outline-none transition placeholder:text-ht-muted-light focus:border-ht-teal focus:ring-4 focus:ring-ht-teal/15"
                      placeholder="At least 8 characters"
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
                  <FieldError id="signup-password-error">{errors.password?.message}</FieldError>
                </div>

                <div>
                  <label
                    className="text-sm font-semibold text-ht-ink"
                    htmlFor="signup-confirm-password"
                  >
                    Confirm Password
                  </label>
                  <div className="relative mt-2">
                    <input
                      id="signup-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      aria-invalid={Boolean(errors.confirmPassword)}
                      aria-describedby={
                        errors.confirmPassword ? "signup-confirm-password-error" : undefined
                      }
                      className="h-12 w-full rounded-xl border border-ht-border bg-white px-4 pr-12 text-base outline-none transition placeholder:text-ht-muted-light focus:border-ht-teal focus:ring-4 focus:ring-ht-teal/15"
                      placeholder="Repeat your password"
                      {...register("confirmPassword")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 size-10 -translate-y-1/2 rounded-full text-ht-muted hover:bg-ht-green-soft/70"
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      onClick={() => setShowConfirmPassword((value) => !value)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff aria-hidden="true" />
                      ) : (
                        <Eye aria-hidden="true" />
                      )}
                    </Button>
                  </div>
                  <FieldError id="signup-confirm-password-error">
                    {errors.confirmPassword?.message}
                  </FieldError>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 h-12 rounded-full bg-ht-teal text-base font-semibold text-white shadow-[0_14px_34px_rgba(15,163,160,0.24)] hover:bg-ht-teal-dark"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" aria-hidden="true" />
                      Creating account
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              <p className="mt-7 text-center text-sm text-ht-muted">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-ht-teal-dark underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ht-teal/40"
                >
                  Sign in
                </Link>
              </p>
            </CardContent>
          </section>
        </Card>
      </div>
    </main>
  )
}

export default Signup
