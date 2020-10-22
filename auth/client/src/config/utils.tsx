import axios from 'axios'
import { LoginBody } from 'server/src/config/schema'

const envs = {
  BASE_URL: process.env.BASE_URL || 'http://localhost:4000',
}

export const sleep = (time = 2000) =>
  new Promise(resolve => setTimeout(resolve, time))

const api = axios.create({
  baseURL: envs.BASE_URL,
  timeout: 6000,
})

export const login = async (data: LoginBody) => {
  try {
    const res = await api.post('/login', data)
    console.log(res.data)
    return res.data
  } catch (e) {
    throwError(e)
  }
}

function throwError(e: any) {
  throw Error(e?.response?.data?.error || 'Server Error!')
}
