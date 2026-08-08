import { Link } from "react-router-dom"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

import logoIcon from "@/assets/branding/favicon.png"

const navItems = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Safety", href: "#safety" },
]

const navLinkClass =
  "rounded-full px-3 py-2 text-sm font-medium text-ht-muted transition hover:text-ht-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ht-teal/40"

const primaryLinkClass =
  "inline-flex h-10 items-center justify-center rounded-full bg-ht-teal px-5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(15,163,160,0.28)] transition hover:bg-ht-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ht-teal/40 focus-visible:ring-offset-2 focus-visible:ring-offset-ht-background"

const ghostLinkClass =
  "inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium text-ht-ink transition hover:bg-ht-green-soft/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ht-teal/40"

function Navbar() {
  return (
    <header className="fixed inset-x-0 top-4 z-50 px-3 sm:top-5 sm:px-4">
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between rounded-full border border-ht-border bg-white/85 px-3 shadow-[0_14px_45px_rgba(5,31,32,0.08)] backdrop-blur-xl sm:px-4"
        aria-label="Main navigation"
      >
        <Link
          to="/"
          className="flex min-w-0 items-center gap-2 rounded-full pr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ht-teal/40"
          aria-label="HealTogether home"
        >
          <img
            src={logoIcon}
            alt=""
            className="size-10 rounded-full object-cover"
          />
          <span className="hidden font-display text-lg font-semibold text-ht-ink min-[380px]:inline">
            HealTogether
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className={navLinkClass}>
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className={ghostLinkClass}>
            Sign In
          </Link>
          <Link to="/signup" className={primaryLinkClass}>
            Get Started
          </Link>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open navigation menu"
                  className="rounded-full"
                />
              }
            >
              <Menu aria-hidden="true" />
            </SheetTrigger>

            <SheetContent className="w-[min(88vw,22rem)] border-ht-border bg-white p-6">
              <div className="flex items-center gap-3">
                <img
                  src={logoIcon}
                  alt=""
                  className="size-10 rounded-full object-cover"
                />
                <span className="font-display text-lg font-semibold text-ht-ink">
                  HealTogether
                </span>
              </div>

              <div className="mt-10 flex flex-col gap-2">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className={cn(navLinkClass, "px-0 text-base")}
                  >
                    {item.label}
                  </a>
                ))}

                <div className="mt-6 grid gap-3">
                  <Link to="/login" className={ghostLinkClass}>
                    Sign In
                  </Link>
                  <Link to="/signup" className={primaryLinkClass}>
                    Get Started
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
