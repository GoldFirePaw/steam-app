import React, { createContext, useState, ReactNode, useContext } from "react"
import { loginWithGoogleApi } from "../api/loginWithGoogleApi"
import { updateUserPseudoApi } from "../api/updateUserPseudoApi"

interface User {
  id: string
  googleId: string
  name: string
  email: string
  picture: string
  pseudo: string
}

interface AuthContextType {
  user: User | null
  newUser: boolean
  loading: boolean
  error: string | null
  loginWithGoogle: (credential: string) => Promise<void>
  updateUserPseudo: (googleId: string, pseudo: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user")
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [newUser, setNewUser] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const loginWithGoogle = async (credential: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await loginWithGoogleApi(credential)
      setUser(data.user)
      setNewUser(data.newUser)
      localStorage.setItem("user", JSON.stringify(data.user))
    } catch (error) {
      setError("Error during Google authentication")
    } finally {
      setLoading(false)
    }
  }

  const updateUserPseudo = async (googleId: string, pseudo: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await updateUserPseudoApi(googleId, pseudo)
      setUser(data)
      setNewUser(false)
      localStorage.setItem("user", JSON.stringify(data))
    } catch (error) {
      setError("Error updating pseudo")
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        newUser,
        loading,
        error,
        loginWithGoogle,
        updateUserPseudo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
