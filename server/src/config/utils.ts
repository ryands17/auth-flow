import { promisify } from 'util'
import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const hash = promisify(bcrypt.hash)
export const compare = promisify(bcrypt.compare)

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

export const validateRequest = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || ''
    await jwt.verify(token, TOKENS.ACCESS.secret)
    next()
  } catch (e) {
    return res.status(401).json({
      error: 'Unauthorized request!',
    })
  }
}

export const validateRefreshToken = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { refreshToken } = req.cookies
    const decoded: any = await jwt.verify(refreshToken, TOKENS.REFRESH.secret)
    res.locals['email'] = decoded.email
    next()
  } catch (e) {
    return res.status(401).json({
      error: 'Unauthorized request!',
    })
  }
}

export const createNewAccessToken = (data: any) =>
  jwt.sign({ ...data, type: TOKENS.ACCESS.type }, TOKENS.ACCESS.secret, {
    expiresIn: TOKENS.ACCESS.expiresIn,
  })

const TOKENS = {
  ACCESS: {
    type: 'access',
    expiresIn: '5m',
    secret: process.env.JWT_ACCESS_SECRET || '',
  },
  REFRESH: {
    type: 'refresh',
    expiresIn: '15m',
    secret: process.env.JWT_REFRESH_SECRET || '',
  },
}
