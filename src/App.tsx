import React from "react"
import { Route, Routes } from "react-router-dom"
import "./App.css"
import { HomePage, LoginPage } from "./pages"
import { AuthProvider } from "./context/AuthContext"

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </AuthProvider>
  )
}
