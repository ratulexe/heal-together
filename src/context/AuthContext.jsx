import { useCallback, useEffect, useMemo, useState } from "react"
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth"
import { doc, serverTimestamp, setDoc } from "firebase/firestore"

import { AuthContext } from "@/context/auth-context"
import { auth, db } from "@/lib/firebase"

const verificationSentAtKey = "healtogether_verification_sent_at"

const authErrorMessages = {
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/weak-password": "Choose a stronger password.",
  "auth/invalid-credential": "Email or password is incorrect.",
  "auth/wrong-password": "Email or password is incorrect.",
  "auth/user-not-found": "Email or password is incorrect.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  "auth/network-request-failed": "We couldn't connect. Check your internet connection and try again.",
}

function friendlyAuthError(error) {
  if (!navigator.onLine) {
    return "We couldn't connect. Check your internet connection and try again."
  }

  return (
    authErrorMessages[error?.code] ||
    "Something went wrong. Please try again in a moment."
  )
}

function profileSetupError(error) {
  const message = !navigator.onLine
    ? "Your account was created, but we couldn't finish setting up your profile because the connection dropped. Please sign in again once you're back online."
    : "Your account was created, but we couldn't finish setting up your profile. Please sign in again, or contact support if this continues."

  const setupError = new Error(message, { cause: error })
  setupError.code = "profile/setup-failed"

  return setupError
}

function verificationSetupError(error) {
  const message = !navigator.onLine
    ? "Your account was created, but we couldn't send the verification email because the connection dropped. Please sign in and resend it once you're back online."
    : "Your account was created, but we couldn't send the verification email. Please sign in and resend it from the verification page."

  const setupError = new Error(message, { cause: error })
  setupError.code = "verification/setup-failed"

  return setupError
}

function rememberVerificationSent() {
  window.sessionStorage.setItem(verificationSentAtKey, String(Date.now()))
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    let unsubscribe = () => {}

    setPersistence(auth, browserLocalPersistence)
      .catch(() => null)
      .finally(() => {
        if (!isMounted) return

        unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser)
          setLoading(false)
        })
      })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  const signup = useCallback(async ({ name, email, password }) => {
    let credential

    try {
      credential = await createUserWithEmailAndPassword(auth, email, password)
    } catch (error) {
      throw new Error(friendlyAuthError(error), { cause: error })
    }

    try {
      const cleanName = name.trim()

      await updateProfile(credential.user, {
        displayName: cleanName,
      })

      await setDoc(doc(db, "users", credential.user.uid), {
        uid: credential.user.uid,
        name: cleanName,
        email: credential.user.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      throw profileSetupError(error)
    }

    try {
      await sendEmailVerification(credential.user, {
        url: `${window.location.origin}/verify-email`,
        handleCodeInApp: false,
      })
      rememberVerificationSent()
    } catch (error) {
      throw verificationSetupError(error)
    }

    return credential.user
  }, [])

  const login = useCallback(async (email, password) => {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password)
      return credential.user
    } catch (error) {
      throw new Error(friendlyAuthError(error), { cause: error })
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await signOut(auth)
    } catch (error) {
      throw new Error(friendlyAuthError(error), { cause: error })
    }
  }, [])

  const resetPassword = useCallback(async (email) => {
    try {
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/login`,
      })
    } catch (error) {
      if (error?.code === "auth/user-not-found") return
      throw new Error(friendlyAuthError(error), { cause: error })
    }
  }, [])

  const sendVerification = useCallback(async () => {
    if (!auth.currentUser) {
      throw new Error("Please sign in before requesting a new verification email.")
    }

    try {
      await sendEmailVerification(auth.currentUser, {
        url: `${window.location.origin}/verify-email`,
        handleCodeInApp: false,
      })
      rememberVerificationSent()
    } catch (error) {
      throw new Error(friendlyAuthError(error), { cause: error })
    }
  }, [])

  const refreshUser = useCallback(async () => {
    if (!auth.currentUser) return null

    try {
      await auth.currentUser.reload()

      if (auth.currentUser.emailVerified) {
        await auth.currentUser.getIdToken(true)
      }

      setUser({
        ...auth.currentUser,
        displayName: auth.currentUser.displayName,
        email: auth.currentUser.email,
        emailVerified: auth.currentUser.emailVerified,
        uid: auth.currentUser.uid,
      })

      return auth.currentUser
    } catch (error) {
      throw new Error(friendlyAuthError(error), { cause: error })
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      signup,
      login,
      logout,
      refreshUser,
      resetPassword,
      sendVerification,
    }),
    [loading, login, logout, refreshUser, resetPassword, sendVerification, signup, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
