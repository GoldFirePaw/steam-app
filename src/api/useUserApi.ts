import { useState, useEffect } from "react"
import axios from "axios"

const API_URL = "http://localhost:5001"

interface User {
  id: string
  name: string
  email: string
  picture: string
  pseudo: string
}

export const useUser = (googleId: string | null) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!googleId) return

    const fetchUser = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await axios.get(`${API_URL}/user/${googleId}`)
        setUser(response.data)
      } catch (error) {
        setError("Error fetching user data")
      } finally {
        setLoading(false)
      }
    }

    console.log(googleId)

    fetchUser()
  }, [googleId])

  return { user, loading, error }
}

export const useUpdateUserPseudo = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const updateUserPseudo = async (googleId: string, pseudo: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.post(`${API_URL}/user/${googleId}`, {
        pseudo,
      })
      console.log(response)

      return response.data
    } catch (error) {
      setError("Error updating pseudo")
      throw error
    } finally {
      setLoading(false)
    }
  }
  return { updateUserPseudo, loading, error }
}
