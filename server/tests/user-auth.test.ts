import supertest from 'supertest'
import { app } from './helpers'

let accessToken = ''

test('signup', async () => {
  const res = await supertest(app.server)
    .post('/signup')
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
    .post('/login')
    .send({
      email: 'user@g.com',
      password: 'password',
    })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)

  expect(res.body).toHaveProperty('data.user')
  expect(res.body).toHaveProperty('data.accessToken')
  accessToken = res.body.data.accessToken
})

test('list users', async () => {
  const res = await supertest(app.server)
    .get('/users')
    .set({ Authorization: `Bearer ${accessToken}`, Accept: 'application/json' })
    .expect('Content-Type', /json/)
    .expect(200)

  expect(res.body).toHaveProperty('data.users')
  expect(res.body.data.users).toHaveLength(1)
})
