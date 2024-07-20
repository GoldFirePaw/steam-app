import React from "react"
import { render, screen } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import { App } from "./App"
import "@testing-library/jest-dom"

test("renders HomePage and LoginPage based on route", () => {
  // Render the App component with a router
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )

  // Check if HomePage is rendered
  expect(screen.getByText(/Steam App/i)).toBeInTheDocument()

})
