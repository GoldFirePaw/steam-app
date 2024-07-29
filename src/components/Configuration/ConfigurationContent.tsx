import React, { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"

export const ConfigurationContent = () => {
  const { user, updateUserPseudo, updateUserSteamId } = useAuth()
  const [pseudo, setPseudo] = useState<string>("")
  const [steamId, setSteamId] = useState<string>("")

  useEffect(() => {
    if (user) {
      setPseudo(user.pseudo)
      setSteamId(user.steamId || "")
    }
  }, [user])

  const handlePseudoChange = async () => {
    if (user) {
      try {
        await updateUserPseudo(user.googleId, pseudo)
      } catch (error) {
        console.error("Error updating pseudo:", error)
      }
    }
  }

  const handleSteamIdChange = async () => {
    if (user) {
      try {
        await updateUserSteamId(user.googleId, steamId)
      } catch (error) {
        console.error("Error updating Steam ID:", error)
      }
    }
  }

  return (
    <div>
      <div>User name</div>
      <div>Change username</div>
      <>
        <p>Please enter a pseudo:</p>
        <input
          type="text"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
          placeholder="Enter your pseudo"
        />
        <button onClick={handlePseudoChange}>Set Pseudo</button>
        <p>Please enter your Steam ID:</p>
        <input
          type="text"
          value={steamId}
          onChange={(e) => setSteamId(e.target.value)}
          placeholder="Enter your Steam ID"
        />
        <button onClick={handleSteamIdChange}>Set Steam ID</button>
      </>
    </div>
  )
}
