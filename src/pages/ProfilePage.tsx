import React, { useState } from "react"
import { getGamesFromUser, SteamResponse, Game } from "../api/getGamesFromUser"
import { ConfigurationContent } from "../components/Configuration/ConfigurationContent"
import { Header } from "../components/Header/Header"

export const ProfilePage = () => {
  // const [steamId, setSteamId] = useState("")
  // const [games, setGames] = useState<Game[]>([])
  const [isConfiguration, setIsConfiguration] = useState(false)

  const handleConfigurationClick = () => {
    setIsConfiguration(!isConfiguration)
  }

  // const handleFetchGames = async () => {
  //   try {
  //     const apiKey = process.env.REACT_APP_STEAM_API_KEY_LOCAL
  //     const data: SteamResponse = apiKey
  //       ? await getGamesFromUser(apiKey, steamId)
  //       : null
  //     setGames(data.response.games || [])
  //     console.log(data)
  //   } catch (error) {
  //     console.error("Failed to fetch user games data:", error)
  //   }
  // }

  // if (!games) {
  //   return null
  // }

  return (
    <div>
      <Header />
      <h1>Profile Page</h1>
      <button onClick={handleConfigurationClick}> Configure profile </button>
      {isConfiguration ? (
        <ConfigurationContent />
      ) : (
        <ul>
          {/* {games.map((game) => (
            <li key={game.appid}>{game.name}</li>
          ))} */}
        </ul>
      )}
    </div>
  )
}
