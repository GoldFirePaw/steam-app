import React, { useState } from "react"
import { getGamesFromUser, SteamResponse, Game } from "../api/getGamesFromUser"

const ProfilePage = () => {
  const [steamId, setSteamId] = useState("")
  const [games, setGames] = useState<Game[]>([])

  const handleFetchGames = async () => {
    try {
      const apiKey = process.env.REACT_APP_STEAM_API_KEY_LOCAL
      const data: SteamResponse = apiKey
        ? await getGamesFromUser(apiKey, steamId)
        : null
      setGames(data.response.games || [])
      console.log(data)
    } catch (error) {
      console.error("Failed to fetch user games data:", error)
    }
  }

  if (!games) {
    return null
  }

  return (
    <div>
      <h1>Profile Page</h1>
      <div>
        <input
          type="text"
          placeholder="Enter your Steam ID"
          value={steamId}
          onChange={(e) => setSteamId(e.target.value)}
        />
        <button onClick={handleFetchGames}>Fetch Games</button>
      </div>
      <ul>
        {games.map((game) => (
          <li key={game.appid}>{game.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default ProfilePage
