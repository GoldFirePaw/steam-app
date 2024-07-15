import axios from "axios"

const API_URL = "http://localhost:5001"

export const updateUserPseudoApi = async (googleId: string, pseudo: string) => {
  const response = await axios.post(`${API_URL}/user/${googleId}/pseudo`, {
    pseudo,
  })
  return response.data
}
