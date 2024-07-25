import React, { useEffect, useState } from "react"
import { Header } from "../components/Header/Header"
import { getGamesFromUser } from "../api/getGamesFromUser"

export const HomePage: React.FC = () => {
  const [games, setGames] = useState<any[]>([])
  const apikey = process.env.REACT_APP_STEAM_API_KEY_LOCAL
  const steamId = "76561198058004856" // Utilisez un ID Steam valide

  useEffect(() => {
    const fetchGames = async () => {
      try {
        if (apikey) {
          const data = await getGamesFromUser(apikey, steamId)
          setGames(data.response.games || [])
        }
      } catch (error) {
        console.error("Error fetching Steam user data:", error)
      }
    }

    fetchGames()
  }, [apikey, steamId])
  return (
    <div className="App">
      <Header />
      <div>Steam App</div>
      <h2>Owned Games:</h2>
      <ul>
        {games.map((game) => {
          return <li key={game.appid}>{game.appid}</li>
        })}
      </ul>
    </div>
  )
}
