import * as React from 'react'
import { BrowserRouter, Routes } from 'react-router-dom'
import { renderRoutes } from 'config/routes'

export const App = () => {
  return <AppRoutes />
}

const AppRoutes = () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <BrowserRouter>
        <Routes>
          {renderRoutes.map(([key, value]) => (
            <value.routeComponent key={key} path={value.path}>
              <value.element />
            </value.routeComponent>
          ))}
        </Routes>
      </BrowserRouter>
    </React.Suspense>
  )
}
