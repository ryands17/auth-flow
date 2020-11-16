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

const tokenInterceptor = api.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status !== 401) {
      return Promise.reject(error)
    }
    api.interceptors.response.eject(tokenInterceptor)

    return auth
      .refreshToken()
      .then(res => {
        console.log('[after] refresh token', res)
        setToken(res)
        error.response.config.headers[
          'Authorization'
        ] = `Bearer ${fetchToken()}`
        return api(error.response.config)
      })
      .catch(err => {
        setToken(null)
        return Promise.reject(err)
      })
  }
)

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
      return res.data?.data?.accessToken
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
    const res = await api.get('/user')
    return res.data.data
  } catch (e) {
    throwError(e)
  }
}

const throwError = (e: any) => {
  throw Error(e?.response?.data?.error || 'Server Error!')
}
