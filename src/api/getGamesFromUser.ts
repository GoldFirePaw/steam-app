import axios from "axios"

export interface Game {
  appid: number
  name: string
  playtime_forever: number
}

export interface SteamResponse {
  response: {
    game_count: number
    games: Game[]
  }
}

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
