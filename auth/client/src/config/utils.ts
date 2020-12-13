import axios from 'axios'
import * as types from 'server/src/config/schema'
import { logoutOnInvalidToken } from './routes'

const envs = {
  BASE_URL: process.env.BASE_URL || 'http://localhost:4000',
}
export const logoutRoute = () => {
  const redirect = window.location.origin + '/login'
  return `${envs.BASE_URL}/auth/signout?redirect=${redirect}`
}

// in-memory access token
type Token = string | null
let token: Token = null

export const fetchToken = () => token

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

let tokenInterceptor: number | null = null

const setTokenInterceptor = (value: number | null) => {
  tokenInterceptor = value
}

const interceptor = (error: any) => {
  if (error.response.status !== 401) {
    return Promise.reject(error)
  }
  api.interceptors.response.eject(tokenInterceptor as number)

  return auth
    .refreshToken()
    .then(res => {
      console.log('[after] refresh token', res)
      error.response.config.headers['Authorization'] = `Bearer ${fetchToken()}`
      registerInterceptor()
      return api(error.response.config)
    })
    .catch(err => {
      document.body.dispatchEvent(logoutOnInvalidToken)
      return Promise.reject(err)
    })
}

const registerInterceptor = () => {
  setTokenInterceptor(
    api.interceptors.response.use(response => response, interceptor)
  )
}

registerInterceptor()

export const auth = {
  login: async (data: types.LoginBody) => {
    try {
      const res: types.LoginResponse = (await api.post('/auth/login', data))
        .data.data
      setToken(res.accessToken)
      return res
    } catch (e) {
      throwError(e)
    }
  },
  signup: async (data: types.SignupBody) => {
    try {
      const res = await api.post('/auth/signup', data)
      return res.data
    } catch (e) {
      throwError(e)
    }
  },
  refreshToken: async () => {
    try {
      const res = await api.get('/auth/refresh-token')
      const token = res.data?.data?.accessToken
      setToken(token)
    } catch (e) {
      setToken(null)
      throwError(e)
    }
  },
  signout: () => {
    setToken(null)
    window.location.href = logoutRoute()
  },
}

export const getAllUsers = async () => {
  try {
    const res = await api.get('/user')
    return res.data.data
  } catch (e) {
    throwError(e)
  }
}

const throwError = (e: any) => {
  throw Error(e?.response?.data?.error || 'Server Error!')
}
