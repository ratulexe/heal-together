import { LogOut, PlusCircle } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

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

function getFirstName(user) {
  const displayName = user?.displayName?.trim()
  if (displayName) return displayName.split(/\s+/)[0]

  const emailName = user?.email?.split("@")[0]
  return emailName || "there"
}

function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const firstName = getFirstName(user)

  async function handleLogout() {
    await logout()
    navigate("/", { replace: true })
  }

  return (
    <main className="min-h-screen bg-ht-background text-ht-ink">
      <header className="border-b border-ht-border bg-white/85 px-4 py-4 backdrop-blur-xl sm:px-6">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4" aria-label="Dashboard">
          <Link
            to="/"
            className="flex min-w-0 items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ht-teal/40"
            aria-label="HealTogether home"
          >
            <img src={logoIcon} alt="" className="size-10 rounded-full object-cover" />
            <span className="font-display text-lg font-semibold">HealTogether</span>
          </Link>

          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-full border-ht-border bg-white px-4 text-sm font-semibold text-ht-ink hover:bg-ht-green-soft/60"
            onClick={handleLogout}
          >
            <LogOut aria-hidden="true" />
            Logout
          </Button>
        </nav>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl content-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-ht-teal-dark">
            Account ready
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">
            Good morning, {firstName}
          </h1>
          <p className="mt-5 text-lg leading-8 text-ht-muted">
            Your HealTogether space is ready.
          </p>
        </div>

        <Card className="rounded-2xl border border-ht-border bg-white shadow-[0_24px_70px_rgba(5,31,32,0.08)]">
          <CardHeader>
            <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-ht-green-soft text-ht-teal-dark">
              <PlusCircle aria-hidden="true" />
            </div>
            <CardTitle className="font-display text-2xl font-semibold">
              Start your first health routine
            </CardTitle>
            <CardDescription className="text-base leading-7 text-ht-muted">
              Next, we'll help you add your medicines and daily wellness routine.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-ht-border bg-ht-background p-4 text-sm leading-6 text-ht-muted">
              Authentication is working. The full dashboard will come next.
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}

export default Dashboard
