import fastify from 'fastify'
import { PrismaClient } from '@prisma/client'
import * as utils from './config/utils'
import { isDev } from './config/utils'
import * as schemaParsers from './config/schema'
import type * as schemaTypes from './config/schema'

const prisma = new PrismaClient({
  log: ['query'],
})

export const app = fastify({
  logger: {
    level: isDev() ? 'info' : 'warn',
  },
})

app.get('/', (_req, res) => {
  res.send({
    data: 'API functional!',
  })
})

app.post<{
  Body: schemaTypes.SignupBody
}>('/signup', async (req, res) => {
  await schemaParsers.SignupPayload.parseAsync(req.body)
  const { name, email, password } = req.body
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: await utils.hash(password, 10),
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  })

  res.send({
    data: { user },
  })
})

app.post<{ Body: schemaTypes.LoginBody }>('/login', async (req, res) => {
  await schemaParsers.LoginPayload.parseAsync(req.body)
  const { email, password } = req.body

  const user = await prisma.user.findOne({
    where: {
      email,
    },
  })

  const doesPasswordMatch = await utils.compare(password, user?.password || '')
  if (!user || !doesPasswordMatch) {
    return res.status(400).send({
      error: 'Invalid username or password!',
    })
  }

  const { password: _pass, ...rest } = user
  const [accessToken, refreshToken] = await utils.createAuthTokens({ email })

  res
    .setCookie('refreshToken', refreshToken, {
      httpOnly: true,
    })
    .send({
      data: {
        user: rest,
        accessToken,
      },
    })
})

app.get('/request-access-token', (req, res) => {
  const { refreshToken } = req.cookies
  const email = utils.validateRefreshToken(refreshToken)
  const accessToken = utils.createNewAccessToken({
    email,
  })

  res.send({
    data: {
      accessToken,
    },
  })
})

// private route
app.get(
  '/users',
  {
    onRequest: (req, res, done) => {
      utils.validateRequest(req, res, done)
    },
  },
  async (_req, res) => {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    })
    res.send({
      data: { users },
    })
  }
)
