import { Navigate, useLocation } from "react-router-dom"

import { useAuth } from "@/hooks/useAuth"

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

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

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!user.emailVerified) {
    return <Navigate to="/verify-email" replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute
