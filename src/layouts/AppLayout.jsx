import {
  ChartNoAxesColumnIncreasing,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  Pill,
  QrCode,
  Settings,
  Users,
} from "lucide-react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"
import logoIcon from "@/assets/branding/brand-icon.png"

const desktopNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Medicines", href: "/medicines", icon: Pill },
  { label: "Wellness", href: "/wellness", icon: HeartPulse },
  { label: "Emergency", href: "/emergency", icon: QrCode },
  { label: "Caregiver", href: "/caregiver", icon: Users },
  { label: "Reports", href: "/reports", icon: ChartNoAxesColumnIncreasing },
  { label: "Settings", href: "/settings", icon: Settings },
]

const mobileNavItems = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Medicines", href: "/medicines", icon: Pill },
  { label: "Wellness", href: "/wellness", icon: HeartPulse },
  { label: "Emergency", href: "/emergency", icon: QrCode },
  { label: "Profile", href: "/settings", icon: Settings },
]

function getFirstName(user) {
  const displayName = user?.displayName?.trim()
  if (displayName) return displayName.split(/\s+/)[0]

  return user?.email?.split("@")[0] || "there"
}

function AppNavLink({ item, compact = false }) {
  const Icon = item.icon

  return (
    <NavLink
      to={item.href}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ht-teal/40",
          isActive
            ? "bg-ht-green-soft text-ht-ink"
            : "text-ht-muted hover:bg-ht-green-soft/50 hover:text-ht-ink",
          compact && "flex-col gap-1 rounded-2xl px-2 py-2 text-[0.7rem]"
        )
      }
    >
      <Icon className="size-5" aria-hidden="true" />
      <span>{item.label}</span>
    </NavLink>
  )
}

function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const firstName = getFirstName(user)

  async function handleLogout() {
    await logout()
    navigate("/", { replace: true })
  }

  return (
    <div className="min-h-screen bg-ht-background text-ht-ink">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-ht-border bg-white/90 px-4 py-5 shadow-[12px_0_45px_rgba(5,31,32,0.04)] backdrop-blur-xl lg:flex lg:flex-col">
        <NavLink
          to="/dashboard"
          className="flex items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ht-teal/40"
          aria-label="HealTogether dashboard"
        >
          <img src={logoIcon} alt="" className="size-11 rounded-full object-cover" />
          <span className="font-display text-xl font-semibold">HealTogether</span>
        </NavLink>

        <nav className="mt-9 grid gap-1" aria-label="App navigation">
          {desktopNavItems.map((item) => (
            <AppNavLink key={item.href} item={item} />
          ))}
        </nav>

        <div className="mt-auto rounded-2xl border border-ht-border bg-ht-background p-4">
          <p className="text-sm font-semibold text-ht-ink">{firstName}</p>
          <p className="mt-1 truncate text-xs text-ht-muted">{user?.email}</p>
          <Button
            type="button"
            variant="ghost"
            className="mt-4 h-10 w-full justify-start rounded-full text-ht-muted hover:bg-white hover:text-ht-ink"
            onClick={handleLogout}
          >
            <LogOut aria-hidden="true" />
            Sign out
          </Button>
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-ht-border bg-white/90 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <NavLink
            to="/dashboard"
            className="flex min-w-0 items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ht-teal/40"
            aria-label="HealTogether dashboard"
          >
            <img src={logoIcon} alt="" className="size-10 rounded-full object-cover" />
            <span className="font-display text-lg font-semibold">HealTogether</span>
          </NavLink>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full text-ht-muted hover:bg-ht-green-soft/70"
            aria-label="Sign out"
            onClick={handleLogout}
          >
            <LogOut aria-hidden="true" />
          </Button>
        </div>
      </header>

      <main className="pb-24 lg:ml-72 lg:pb-0">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </div>
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-ht-border bg-white/95 px-2 pb-2 pt-2 shadow-[0_-12px_35px_rgba(5,31,32,0.07)] backdrop-blur-xl lg:hidden"
        aria-label="Mobile app navigation"
      >
        <div className="grid grid-cols-5 gap-1">
          {mobileNavItems.map((item) => (
            <AppNavLink key={item.href} item={item} compact />
          ))}
        </div>
      </nav>
    </div>
  )
}

export default AppLayout
