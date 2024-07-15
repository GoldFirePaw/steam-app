import axios from "axios"
import { jwtDecode } from "jwt-decode"

const API_URL = "http://localhost:5001"

export const loginWithGoogleApi = async (credential: string) => {
  const decodedToken: any = jwtDecode(credential)
  const response = await axios.post(`${API_URL}/auth/google`, {
    googleId: decodedToken.sub,
    name: decodedToken.name,
    email: decodedToken.email,
    picture: decodedToken.picture,
  })
  return response.data
}
