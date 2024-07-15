import React from "react"
import { GoogleLoginComponent } from "../components/GoogleLogin/GoogleLoginComponent"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

export const LoginPage: React.FC = () => {
  const { loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  const handleLoginSuccess = (credential: string) => {
    loginWithGoogle(credential)
    navigate("/") // Rediriger vers la page d'accueil après le login
  }

  return (
    <div>
      <h1>Login Page</h1>
      <GoogleLoginComponent onLoginSuccess={handleLoginSuccess} />
    </div>
  )
}
