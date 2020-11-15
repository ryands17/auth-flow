import supertest from 'supertest'
import { app } from './helpers'

let accessToken = ''
let refreshToken: string[] = []

test('signup', async () => {
  const res = await supertest(app.server)
    .post('/auth/signup')
    .send({
      email: 'user@g.com',
      password: 'password',
      name: 'User',
    })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)

  expect(res.body).toEqual({
    data: {
      user: {
        id: 1,
        name: 'User',
        email: 'user@g.com',
      },
    },
  })
})

test('login', async () => {
  const res = await supertest(app.server)
    .post('/auth/login')
    .send({
      email: 'user@g.com',
      password: 'password',
    })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)

  expect(res.body).toHaveProperty('data.user')
  expect(res.body).toHaveProperty('data.accessToken')
  refreshToken = res.headers['set-cookie']
  accessToken = res.body.data.accessToken
})

test('list users', async () => {
  const res = await supertest(app.server)
    .get('/user')
    .set({ Authorization: `Bearer ${accessToken}`, Accept: 'application/json' })
    .expect('Content-Type', /json/)
    .expect(200)

  expect(res.body).toHaveProperty('data.users')
  expect(res.body.data.users).toHaveLength(1)
})

test('request new access token', async () => {
  const res = await supertest(app.server)
    .get('/auth/refresh-token')
    .set({ Accept: 'application/json', Cookie: refreshToken })
    .expect('Content-Type', /json/)
    .expect(200)

  expect(res.body).toHaveProperty('data.accessToken')
  expect(res.body.data.accessToken).toBeDefined()
})
