import type { FastifyPluginCallback } from 'fastify'
import { validateRequest, prisma } from '../config/utils'

const user: FastifyPluginCallback = (app, opts, next) => {
  app.get(
    '/',
    {
      onRequest: (req, res, done) => {
        validateRequest(req, res, done)
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
  next()
}

export default user
