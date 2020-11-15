import { config } from 'dotenv'
config()

import { FastifyInstance } from 'fastify'
import cors from 'fastify-cors'
import helmet from 'fastify-helmet'
import cookieParser from 'fastify-cookie'
import { app, buildRoutes } from './app'
import { envs } from './config/utils'

export const start = async (app: FastifyInstance) => {
  try {
    app.register(helmet)
    app.register(cors)
    app.register(cookieParser)
    await buildRoutes(app)
    await app.listen(envs.PORT)
    app.log.info(`app running on http://localhost:${envs.PORT}/`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start(app)
