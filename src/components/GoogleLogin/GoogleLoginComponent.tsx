import React from "react"
import { GoogleLogin, CredentialResponse } from "@react-oauth/google"

interface GoogleLoginComponentProps {
  onLoginSuccess: (credential: string) => void
  onLogoutSuccess: () => void
}

export const GoogleLoginComponent: React.FC<GoogleLoginComponentProps> = ({
  onLoginSuccess,
  onLogoutSuccess,
}) => {
  const handleLoginSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      onLoginSuccess(credentialResponse.credential)
    }
  }

  const handleLogout = () => {
    onLogoutSuccess()
  }

  return (
    <div>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={() => {
          console.log("Login Failed")
        }}
      />
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}
