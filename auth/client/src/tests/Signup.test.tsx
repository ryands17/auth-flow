import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import Signup from 'pages/Signup'
import { renderWithRouter } from './helpers'

test(`renders 'Signup' correctly`, () => {
  renderWithRouter(<Signup />)
  const header = screen.getAllByText(/signup/i)
  expect(header).toHaveLength(2)
})

test(`has the 'Login' link`, () => {
  renderWithRouter(<Signup />)
  const login = screen.getByRole('link')
  expect(login).toHaveTextContent(/login/i)
})

test(`validations are loaded properly`, async () => {
  renderWithRouter(<Signup />)

  fireEvent.click(screen.getByRole('button'))
  await waitFor(() => screen.getAllByRole('alert'))

  expect(screen.getAllByRole('alert')).toHaveLength(3)
})
