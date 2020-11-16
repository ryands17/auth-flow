import { promisify } from 'util'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify'

export const hash = promisify(bcrypt.hash)
export const compare = promisify(bcrypt.compare)

export const envs = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT || '4000',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  HOST: 'http://localhost:3000',
}

export const isDev = () => envs.NODE_ENV === 'development'

export const prisma = new PrismaClient({
  log: isDev() ? ['query'] : [],
})

export const createAuthTokens = (data: any) => {
  return Promise.all([
    jwt.sign({ ...data, type: TOKENS.ACCESS.type }, TOKENS.ACCESS.secret, {
      expiresIn: TOKENS.ACCESS.expiresIn,
    }),
    jwt.sign({ ...data, type: TOKENS.REFRESH.type }, TOKENS.REFRESH.secret, {
      expiresIn: TOKENS.REFRESH.expiresIn,
    }),
  ])
}

export const validateRequest = (
  req: FastifyRequest,
  res: FastifyReply,
  done: HookHandlerDoneFunction
) => {
  try {
    const token =
      (req.headers['authorization'] as string)?.replace('Bearer ', '') || ''
    jwt.verify(token, TOKENS.ACCESS.secret)
    done()
  } catch (e) {
    return res.status(401).send({
      error: 'Unauthorized request!',
    })
  }
}

export const validateRefreshToken = (refreshToken: string) => {
  try {
    const decoded: any = jwt.verify(refreshToken, TOKENS.REFRESH.secret)
    return decoded.email
  } catch (e) {
    throw new Error('Unauthorized request!')
  }
}

export const createNewAccessToken = (data: any) =>
  jwt.sign({ ...data, type: TOKENS.ACCESS.type }, TOKENS.ACCESS.secret, {
    expiresIn: TOKENS.ACCESS.expiresIn,
  })

export const TOKENS = {
  ACCESS: {
    type: 'access',
    expiresIn: '5m',
    secret: envs.JWT_ACCESS_SECRET || '',
  },
  REFRESH: {
    type: 'refresh',
    expiresIn: '15m',
    secret: envs.JWT_REFRESH_SECRET || '',
  },
}
