import type { FastifyPluginCallback } from 'fastify'
import * as utils from '../config/utils'
import * as schemaParsers from '../config/schema'
import type * as schemaTypes from '../config/schema'

const user: FastifyPluginCallback = (app, opts, next) => {
  app.post<{
    Body: schemaTypes.SignupBody
  }>('/signup', async (req, res) => {
    await schemaParsers.SignupPayload.parseAsync(req.body)
    const { name, email, password } = req.body
    const user = await utils.prisma.user.create({
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

    const user = await utils.prisma.user.findOne({
      where: {
        email,
      },
    })

    const doesPasswordMatch = await utils.compare(
      password,
      user?.password || ''
    )
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
        sameSite: 'lax',
        path: '/',
      })
      .send({
        data: {
          user: rest,
          accessToken,
        },
      })
  })

  app.get('/refresh-token', (req, res) => {
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
  next()
}

export default user
