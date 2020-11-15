import { FastifyInstance } from 'fastify'
import { app, buildRoutes } from '../src/app'
import { prisma } from '../src/config/utils'
import cookieParser from 'fastify-cookie'

const start = async (app: FastifyInstance) => {
  try {
    await buildRoutes(app)
    app.register(cookieParser)
  } catch (err) {
    console.log('e', err)
    process.exit(1)
  }
}

beforeAll(async done => {
  await start(app)
  await app.ready()
  done()
})

afterAll(async done => {
  await prisma.$disconnect()
  await app.close()
  done()
})

export { app }
