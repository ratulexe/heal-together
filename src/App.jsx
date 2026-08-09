import { BrowserRouter, Route, Routes } from "react-router-dom"

import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { AuthProvider } from "@/context/AuthContext"
import Caregiver from "@/pages/Caregiver"
import Dashboard from "@/pages/Dashboard"
import Emergency from "@/pages/Emergency"
import Landing from "@/pages/Landing"
import Login from "@/pages/Login"
import Medicines from "@/pages/Medicines"
import Reports from "@/pages/Reports"
import Settings from "@/pages/Settings"
import Signup from "@/pages/Signup"
import VerifyEmail from "@/pages/VerifyEmail"
import Wellness from "@/pages/Wellness"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/medicines" element={<Medicines />} />
          <Route path="/wellness" element={<Wellness />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/caregiver" element={<Caregiver />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
