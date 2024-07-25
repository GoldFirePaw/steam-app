import axios from "axios"

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
})

export const getGamesFromUser = async (apikey: string, steamId: string) => {
  const url = `/api/steam/IPlayerService/GetOwnedGames/v0001/?key=${apikey}&steamid=${steamId}&format=json`

  try {
    const response = await apiClient.get(url)
    return response.data
  } catch (error) {
    console.error("Error fetching Steam user data:", error)
    throw error
  }
}
