import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import Login from 'pages/Login'
import { renderWithRouter } from './helpers'

test(`renders 'Login' correctly`, () => {
  renderWithRouter(<Login />)
  const header = screen.getAllByText(/login/i)
  expect(header).toHaveLength(2)
})

test(`has the 'Signup' link`, () => {
  renderWithRouter(<Login />)
  const signup = screen.getByRole('link')
  expect(signup).toHaveTextContent(/signup/i)
})

test(`validations are loaded properly`, async () => {
  renderWithRouter(<Login />)
  // fireEvent.change(screen.getByLabelText(/email/i), {
  //   target: { value: 'some-random-text' },
  // })

  fireEvent.click(screen.getByRole('button'))
  await waitFor(() => screen.getByRole('alert'))

  expect(screen.getAllByRole('alert')).toHaveLength(2)
})
