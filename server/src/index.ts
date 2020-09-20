import { config } from 'dotenv'
config()

import { PrismaClient } from '@prisma/client'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import {
  hash,
  compare,
  createAuthTokens,
  validateRequest,
  validateRefreshToken,
  createNewAccessToken,
} from './config/utils'

const PORT = 4000

const prisma = new PrismaClient({
  log: ['query'],
})
const app = express()

app.use(helmet())
app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser())
app.use(morgan('dev'))

app.listen(PORT, () => console.log(`app running on http://localhost:${PORT}/`))

app.get('/', (_req, res) => {
  res.send('API functional!')
})

app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: await hash(password, 10),
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  })

  res.json({
    data: { user },
  })
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body

  const user = await prisma.user.findOne({
    where: {
      email,
    },
  })

  const doesPasswordMatch = await compare(password, user?.password || '')
  if (!user || !doesPasswordMatch) {
    return res.status(400).json({
      error: 'Invalid username or password!',
    })
  }

  const { password: _pass, ...rest } = user
  const [accessToken, refreshToken] = await createAuthTokens({ email })

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
  })
  res.json({
    data: {
      user: rest,
      accessToken,
    },
  })
})

app.get('/request-access-token', validateRefreshToken, async (_req, res) => {
  const accessToken = createNewAccessToken({ email: res.locals['email'] })

  res.json({
    data: {
      accessToken,
    },
  })
})

// private route
app.get('/users', validateRequest, async (_req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  })
  res.json({
    data: { users },
  })
})
