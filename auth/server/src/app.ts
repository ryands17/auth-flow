import fastify, { FastifyInstance } from 'fastify'
import { isDev } from './config/utils'
import util from 'util'
import path from 'path'
import globSync from 'glob'

const glob = util.promisify(globSync)

export const app = fastify({
  logger: {
    level: isDev() ? 'info' : 'warn',
  },
})

export const buildRoutes = async (app: FastifyInstance) => {
  const folder = './routes'
  const files = await glob('*.{js,ts}', { cwd: path.join(__dirname, folder) })
  for (let file of files) {
    const prefix = `/${file.slice(0, file.lastIndexOf('.'))}`
    if (prefix == '/index') {
      app.register(require(`${folder}/${file}`))
    }
    app.register(require(`${folder}/${file}`), {
      prefix,
    })
  }
}
