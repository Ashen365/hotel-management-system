import axios from 'axios'

// One shared Axios instance for the whole app.
// baseURL comes from the client .env file (VITE_API_URL).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 10000,
})

// Attach the auth token to every request automatically.
// If the user is logged in, the token is in localStorage.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api