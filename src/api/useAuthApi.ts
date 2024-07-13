import { useState } from "react"
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

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [newUser, setNewUser] = useState<boolean>(false)

  const loginWithGoogle = async (credential: string) => {
    setLoading(true)
    setError(null)
    try {
      const decodedToken: any = jwtDecode(credential) // Décoder le JWT Google
      console.log("Decoded token:", decodedToken)
      const response = await axios.post(`${API_URL}/auth/google`, {
        googleId: decodedToken.sub,
        name: decodedToken.name,
        email: decodedToken.email,
        picture: decodedToken.picture,
      })
      console.log("Auth response:", response.data)
      setUser(response.data.user)
      setNewUser(response.data.newUser)
    } catch (error) {
      console.error("Error during Google authentication:", error)
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
      console.log("Update pseudo response:", response.data)
      setUser(response.data) // Met à jour l'état avec l'utilisateur mis à jour
      setNewUser(false) // Met à jour newUser à false après la mise à jour réussie
    } catch (error) {
      console.error("Error updating pseudo:", error)
      setError("Error updating pseudo")
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
  }

  return {
    user,
    newUser,
    loading,
    error,
    loginWithGoogle,
    updateUserPseudo,
    logout,
  }
}
