import supertest from 'supertest'
import { app } from './helpers'

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
