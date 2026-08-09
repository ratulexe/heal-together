import { Link } from "react-router-dom"

import logoIcon from "@/assets/branding/brand-icon.png"

const year = new Date().getFullYear()

function Footer() {
  return (
    <footer className="border-t border-ht-border bg-white/70 px-4 py-10 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.3fr_0.7fr_0.7fr]">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ht-teal/40"
            aria-label="HealTogether home"
          >
            <img
              src={logoIcon}
              alt=""
              className="size-10 rounded-full object-cover"
            />
            <span className="font-display text-lg font-semibold text-ht-ink">
              HealTogether
            </span>
          </Link>
          <p className="mt-4 max-w-md text-sm leading-6 text-ht-muted">
            Daily health routines, connected with care.
          </p>
          <p className="mt-5 max-w-xl text-xs leading-5 text-ht-muted">
            HealTogether is not a medical provider and does not provide
            diagnosis, treatment or prescription advice.
          </p>
        </div>

        <nav aria-label="Footer navigation">
          <h2 className="text-sm font-semibold text-ht-ink">Navigation</h2>
          <div className="mt-4 grid gap-3 text-sm text-ht-muted">
            <a className="hover:text-ht-ink" href="#features">
              Features
            </a>
            <a className="hover:text-ht-ink" href="#how-it-works">
              How It Works
            </a>
            <a className="hover:text-ht-ink" href="#safety">
              Safety
            </a>
          </div>
        </nav>

        <nav aria-label="Account navigation">
          <h2 className="text-sm font-semibold text-ht-ink">Account</h2>
          <div className="mt-4 grid gap-3 text-sm text-ht-muted">
            <Link className="hover:text-ht-ink" to="/login">
              Sign In
            </Link>
            <Link className="hover:text-ht-ink" to="/signup">
              Get Started
            </Link>
          </div>
        </nav>
      </div>

      <div className="mx-auto mt-8 max-w-6xl border-t border-ht-border pt-6 text-xs text-ht-muted">
        Copyright {year} HealTogether. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
