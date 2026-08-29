import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response
      
      switch (status) {
        case 400:
          toast.error(data.message || 'Invalid request')
          break
        case 401:
          localStorage.removeItem('access_token')
          break
        case 403:
          toast.error('Access denied')
          break
        case 404:
          toast.error(data.message || 'Resource not found')
          break
        case 500:
          toast.error('Server error. Please try again later')
          break
        default:
          toast.error(data.message || 'Something went wrong')
      }
    } else if (error.request) {
      // Request made but no response
    } else {
      // Something else happened
      toast.error('An unexpected error occurred')
    }
    
    return Promise.reject(error)
  }
)

export default axiosInstance
