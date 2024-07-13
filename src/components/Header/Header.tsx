import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import s from "./header.module.css"

export const Header: React.FC = () => {
  const { user, newUser, loading, error, updateUserPseudo, logout } = useAuth()
  const [pseudo, setPseudo] = useState<string>("")
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      setPseudo(user.pseudo)
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
            </>
          ) : (
            <p>Pseudo: {user.pseudo}</p>
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
