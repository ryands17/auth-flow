import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'

export const renderWithRouter = (ui: JSX.Element) => {
  return render(ui, { wrapper: MemoryRouter })
}
