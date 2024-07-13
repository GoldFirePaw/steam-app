import React, { useState, useEffect } from "react"
import "./App.css"
import { GoogleLoginComponent } from "./components/GoogleLogin/GoogleLoginComponent"
import { useAuth } from "./api/useAuthApi"

export const App: React.FC = () => {
  const {
    user,
    newUser,
    loading,
    error,
    loginWithGoogle,
    updateUserPseudo,
    logout,
  } = useAuth()
  const [pseudo, setPseudo] = useState<string>("")

  useEffect(() => {
    if (user) {
      setPseudo(user.pseudo)
    }
  }, [user])

  const handleLoginSuccess = (credential: string) => {
    console.log("Google login successful, credential:", credential)
    loginWithGoogle(credential)
  }

  const handleLogoutSuccess = () => {
    console.log("Logged out")
    logout()
  }

  const handlePseudoChange = async () => {
    if (user) {
      try {
        await updateUserPseudo(user.googleId, pseudo)
        console.log("Pseudo updated successfully")
      } catch (error) {
        console.error("Error updating pseudo:", error)
      }
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>My Google Login App</h1>
        {user ? (
          <div>
            <h2>Welcome, {user.name}</h2>
            <p>Email: {user.email}</p>
            <img src={user.picture} alt={user.name} />
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
          <GoogleLoginComponent
            onLoginSuccess={handleLoginSuccess}
            onLogoutSuccess={handleLogoutSuccess}
          />
        )}
      </header>
    </div>
  )
}
