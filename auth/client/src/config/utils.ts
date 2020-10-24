import axios from 'axios'
import * as types from 'server/src/config/schema'

const envs = {
  BASE_URL: process.env.BASE_URL || 'http://localhost:4000',
}

// in-memory access token
type Token = string | null
let token: Token = null

const fetchToken = () => token

const setToken = (newToken: Token) => (token = newToken)

const api = axios.create({
  baseURL: envs.BASE_URL,
  timeout: 6000,
})

api.interceptors.request.use(config => {
  config.headers['Authorization'] = `Bearer ${fetchToken()}`
  config.withCredentials = true
  return config
})

export const auth = {
  login: async (data: types.LoginBody) => {
    try {
      const res: types.LoginResponse = (await api.post('/login', data)).data
        .data
      setToken(res.accessToken)
      return res
    } catch (e) {
      throwError(e)
    }
  },
  signup: async (data: types.SignupBody) => {
    try {
      const res = await api.post('/signup', data)
      return res.data
    } catch (e) {
      throwError(e)
    }
  },
  signout: () => {
    setToken(null)
  },
}

export const getAllUsers = async () => {
  try {
    const res = await api.get('/users')
    return res.data.data
  } catch (e) {
    throwError(e)
  }
}

const throwError = (e: any) => {
  throw Error(e?.response?.data?.error || 'Server Error!')
}
