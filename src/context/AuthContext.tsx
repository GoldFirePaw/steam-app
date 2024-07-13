import React, { createContext, useState, ReactNode, useContext } from "react"
import axios from "axios"
import { jwtDecode } from "jwt-decode"

const API_URL = "http://localhost:5001"

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
      const decodedToken: any = jwtDecode(credential) // Décoder le JWT Google
      const response = await axios.post(`${API_URL}/auth/google`, {
        googleId: decodedToken.sub,
        name: decodedToken.name,
        email: decodedToken.email,
        picture: decodedToken.picture,
      })
      setUser(response.data.user)
      setNewUser(response.data.newUser)
      localStorage.setItem("user", JSON.stringify(response.data.user))
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
      const response = await axios.post(`${API_URL}/user/${googleId}/pseudo`, {
        pseudo,
      })
      setUser(response.data)
      setNewUser(false)
      localStorage.setItem("user", JSON.stringify(response.data))
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
