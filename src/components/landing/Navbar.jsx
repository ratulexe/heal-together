import { Link } from "react-router-dom"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

import logo from "@/assets/branding/logo.svg"

function Navbar() {
  return (
    <header className="fixed left-0 right-0 top-5 z-50 px-4">
      <nav
        className="
          mx-auto flex max-w-6xl
          items-center justify-between
          rounded-full
          border border-ht-border
          bg-white/85
          px-5 py-3
          shadow-sm
          backdrop-blur-xl
        "
      >
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="HealTogether"
            className="h-9 w-auto"
          />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="font-medium text-ht-ink">
            Features
          </a>

          <a href="#how-it-works" className="font-medium text-ht-ink">
            How it Works
          </a>

          <a href="#safety" className="font-medium text-ht-ink">
            Safety
          </a>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" asChild>
            <Link to="/login">Sign In</Link>
          </Button>

          <Button
            asChild
            className="rounded-full bg-ht-teal text-white hover:bg-ht-teal-dark"
          >
            <Link to="/signup">
              Get Started
            </Link>
          </Button>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>

            <SheetContent>
              <div className="mt-10 flex flex-col gap-6">
                <a href="#features">Features</a>
                <a href="#how-it-works">How it Works</a>
                <a href="#safety">Safety</a>

                <Link to="/login">Sign In</Link>

                <Button
                  asChild
                  className="bg-ht-teal text-white hover:bg-ht-teal-dark"
                >
                  <Link to="/signup">
                    Get Started
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}

export default Navbar