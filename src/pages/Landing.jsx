import Navbar from "@/components/landing/Navbar"
import Hero from "@/components/landing/Hero"
import HealthStatusCards from "@/components/landing/HealthStatusCards"
import DashboardPreview from "@/components/landing/DashboardPreview"

function Landing() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-ht-background text-ht-ink">
      <Navbar />

      <Hero />
      <HealthStatusCards />
      <DashboardPreview />

      <section
        id="safety"
        className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:pb-24"
        aria-labelledby="safety-heading"
      >
        <div className="rounded-[2rem] border border-ht-border bg-white/80 p-6 shadow-[0_18px_70px_rgba(5,31,32,0.07)] backdrop-blur md:p-8">
          <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div>
              <p className="mb-3 text-sm font-medium text-ht-teal-dark">
                Safety and privacy
              </p>
              <h2
                id="safety-heading"
                className="font-display text-3xl font-semibold leading-tight text-ht-ink md:text-4xl"
              >
                Support without pressure.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-ht-muted">
              HealTogether is designed to organize routines, emergency details,
              and caregiver coordination. It does not diagnose, treat,
              prescribe, or replace advice from a licensed clinician.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Landing
