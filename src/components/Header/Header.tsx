import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import s from "./header.module.css"

export const Header: React.FC = () => {
  const {
    user,
    newUser,
    loading,
    error,
    updateUserPseudo,
    updateUserSteamId,
    logout,
  } = useAuth()
  const [pseudo, setPseudo] = useState<string>("")
  const [steamId, setSteamId] = useState<string>("")
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      setPseudo(user.pseudo)
      setSteamId(user.steamId || "")
    }
  }, [user])

  const handleLogoutSuccess = () => {
    logout()
  }

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

  const handleLoginClick = () => {
    navigate("/login")
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <>
      {user ? (
        <div className={s.headerContainer}>
          {newUser ? (
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
          ) : (
            <>
              <p>Pseudo: {user.pseudo}</p>
              <p>Steam ID: {user.steamId || "Not set"}</p>
              <input
                type="text"
                value={steamId}
                onChange={(e) => setSteamId(e.target.value)}
                placeholder="Enter your Steam ID"
              />
              <button onClick={handleSteamIdChange}>Set Steam ID</button>
            </>
          )}
          <button onClick={handleLogoutSuccess}>Logout</button>
        </div>
      ) : (
        <>
          <button onClick={handleLoginClick}>Login</button>
        </>
      )}
    </>
  )
}
