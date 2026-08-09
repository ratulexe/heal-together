import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { AuthProvider } from "@/context/AuthContext"
import { useAuth } from "@/hooks/useAuth"
import AppLayout from "@/layouts/AppLayout"
import AddMedicine from "@/pages/AddMedicine"
import Caregiver from "@/pages/Caregiver"
import CaregiverInvite from "@/pages/CaregiverInvite"
import Dashboard from "@/pages/Dashboard"
import EditMedicine from "@/pages/EditMedicine"
import Emergency from "@/pages/Emergency"
import Landing from "@/pages/Landing"
import Login from "@/pages/Login"
import Medicines from "@/pages/Medicines"
import PublicEmergencyCard from "@/pages/PublicEmergencyCard"
import Reports from "@/pages/Reports"
import Settings from "@/pages/Settings"
import Signup from "@/pages/Signup"
import VerifyEmail from "@/pages/VerifyEmail"
import Wellness from "@/pages/Wellness"

function RootRoute() {
  const { user, loading } = useAuth()

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

  if (user?.emailVerified) {
    return <Navigate to="/dashboard" replace />
  }

  if (user) {
    return <Navigate to="/verify-email" replace />
  }

  return <Landing />
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<RootRoute />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/emergency-card/:shareId" element={<PublicEmergencyCard />} />
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/medicines" element={<Medicines />} />
            <Route path="/medicines/new" element={<AddMedicine />} />
            <Route path="/medicines/:medicineId/edit" element={<EditMedicine />} />
            <Route path="/wellness" element={<Wellness />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/caregiver" element={<Caregiver />} />
            <Route path="/caregiver/invite/:token" element={<CaregiverInvite />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
