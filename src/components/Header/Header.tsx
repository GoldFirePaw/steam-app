import React from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import s from "./header.module.css"

export const Header: React.FC = () => {
  const { user, loading, error, logout } = useAuth()

  const navigate = useNavigate()

  const handleLogoutSuccess = () => {
    logout()
  }

  const handleLoginClick = () => {
    navigate("/login")
  }

  const handleProfileClick = () => {
    navigate("/profile")
  }
  const handleHomeClick = () => {
    navigate("/")
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
          <button onClick={handleHomeClick}>Home page</button>
          <>
            <p>Pseudo: {user.pseudo || "Not set"}</p>
            <p>Steam ID: {user.steamId || "Not set"}</p>
          </>
          <button onClick={handleProfileClick}>Profile page</button>
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
