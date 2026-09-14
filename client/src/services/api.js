import axios from 'axios'

// One shared Axios instance for the whole app.
// baseURL comes from the client .env file (VITE_API_URL).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 10000,
})

export default api