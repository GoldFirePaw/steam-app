import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import { App } from "./App"
import reportWebVitals from "./reportWebVitals"
import { GoogleOAuthProvider } from "@react-oauth/google"

const googleClientId = process.env.REACT_APP_GOOGLE_API_TOKEN

if (!googleClientId) {
  throw new Error("Google Client ID is not defined in environment variables")
}

ReactDOM.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
)

reportWebVitals()
