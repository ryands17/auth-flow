import * as React from 'react'
import { BrowserRouter, Routes, useNavigate } from 'react-router-dom'
import { renderRoutes, routes } from 'config/routes'
import { PrivateRoute, PublicRoute } from 'components/ConditionalRoute'

export const App = () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </React.Suspense>
  )
}

const AppRoutes = () => {
  const navigate = useNavigate()

  const logout = React.useCallback(() => {
    navigate(routes.login.path)
  }, [navigate])

  React.useEffect(() => {
    document.body.addEventListener('logoutOnInvalidToken', logout)

    return () =>
      document.body.removeEventListener('logoutOnInvalidToken', logout)
  }, [logout])

  return (
    <Routes>
      {renderRoutes.map(([key, value]) => (
        <value.routeComponent key={key} path={value.path}>
          {value.private ? (
            <PrivateRoute>
              <value.element />
            </PrivateRoute>
          ) : (
            <PublicRoute>
              <value.element />
            </PublicRoute>
          )}
        </value.routeComponent>
      ))}
    </Routes>
  )
}
