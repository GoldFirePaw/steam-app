import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { App } from "./App"
import reportWebVitals from "./reportWebVitals"
import { GoogleOAuthProvider } from "@react-oauth/google"

const rootElement = document.getElementById("root")
const googleClientId = process.env.REACT_APP_GOOGLE_API_TOKEN

if (!googleClientId) {
  throw new Error("Google Client ID is not defined in environment variables")
}

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <React.StrictMode>
      <GoogleOAuthProvider clientId={googleClientId}>
        <App />
      </GoogleOAuthProvider>
    </React.StrictMode>
  )
} else {
  console.error("Root element not found")
}

reportWebVitals()
