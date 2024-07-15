import React from "react"
import { GoogleLogin, CredentialResponse } from "@react-oauth/google"
import { useNavigate } from "react-router-dom"

interface GoogleLoginComponentProps {
  onLoginSuccess: (credential: string) => void
}

export const GoogleLoginComponent: React.FC<GoogleLoginComponentProps> = ({
  onLoginSuccess,
}) => {
  const navigate = useNavigate()

  const handleLoginSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      onLoginSuccess(credentialResponse.credential)
    }
  }

  const handleCancel = () => {
    navigate("/")
  }

  return (
    <div>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={() => {
          console.log("Login Failed")
        }}
      />
      <button onClick={handleCancel}>Cancel</button>
    </div>
  )
}
