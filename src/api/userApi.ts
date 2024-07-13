import axios from "axios"

const API_URL = "http://localhost:5001"

export const getUser = async (googleId: string) => {
  try {
    const response = await axios.get(`${API_URL}/user/${googleId}`)
    return response.data
  } catch (error) {
    console.error("Error fetching user:", error)
    throw error
  }
}

export const updateUserPseudo = async (googleId: string, pseudo: string) => {
  try {
    const response = await axios.post(`${API_URL}/user/${googleId}`, { pseudo })
    return response.data
  } catch (error) {
    console.error("Error updating user pseudo:", error)
    throw error
  }
}
