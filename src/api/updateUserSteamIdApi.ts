import axios from "axios"

const API_URL = "http://localhost:5001"

export const updateUserSteamIdApi = async (
  googleId: string,
  steamId: string
) => {
  const response = await axios.post(`${API_URL}/user/${googleId}/steamId`, {
    steamId,
  })
  return response.data
}
