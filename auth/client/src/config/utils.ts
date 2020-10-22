import axios from 'axios'
import { LoginBody, SignupBody } from 'server/src/config/schema'

const envs = {
  BASE_URL: process.env.BASE_URL || 'http://localhost:4000',
}

const api = axios.create({
  baseURL: envs.BASE_URL,
  timeout: 6000,
})

export const login = async (data: LoginBody) => {
  try {
    const res = await api.post('/login', data)
    return res.data
  } catch (e) {
    throwError(e)
  }
}

export const signup = async (data: SignupBody) => {
  try {
    const res = await api.post('/signup', data)
    return res.data
  } catch (e) {
    throwError(e)
  }
}

const throwError = (e: any) => {
  throw Error(e?.response?.data?.error || 'Server Error!')
}
