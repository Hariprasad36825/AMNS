import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: process.env.BASE_URI,
  timeout: 1000,
  headers: {
    Accept: 'application/json'
  }
})
