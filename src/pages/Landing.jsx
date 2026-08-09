import Navbar from "@/components/landing/Navbar"
import Hero from "@/components/landing/Hero"
import HealthFloatingCards from "@/components/landing/HealthFloatingCards"
import DashboardPreview from "@/components/landing/DashboardPreview"
import ProblemSection from "@/components/landing/ProblemSection"
import FeaturesSection from "@/components/landing/FeaturesSection"
import HowItWorks from "@/components/landing/HowItWorks"
import EmergencyCardSection from "@/components/landing/EmergencyCardSection"
import CaregiverSection from "@/components/landing/CaregiverSection"
import SafetySection from "@/components/landing/SafetySection"
import FinalCTA from "@/components/landing/FinalCTA"
import Footer from "@/components/landing/Footer"

function Landing() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-ht-background text-ht-ink">
      <div
        className="heal-grid-bg pointer-events-none absolute inset-0"
        aria-hidden="true"
      />
      <Navbar />
      <Hero />
      <HealthFloatingCards />
      <DashboardPreview />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorks />
      <EmergencyCardSection />
      <CaregiverSection />
      <SafetySection />
      <FinalCTA />
      <Footer />
    </main>
  )
}

export default Landing
