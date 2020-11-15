import type { FastifyPluginCallback } from 'fastify'

const user: FastifyPluginCallback = (app, opts, next) => {
  app.get('/', (_req, res) => {
    res.send({
      data: 'API functional!',
    })
  })
  next()
}

export default user
