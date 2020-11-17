import * as React from 'react'
import { Route } from 'react-router-dom'

export const routes = {
  home: {
    path: '/',
    element: React.lazy(() => import('pages/Users')),
    routeComponent: Route,
  },
  signup: {
    path: '/signup',
    element: React.lazy(() => import('pages/Signup')),
    routeComponent: Route,
  },
  login: {
    path: '/login',
    element: React.lazy(() => import('pages/Login')),
    routeComponent: Route,
  },
}

export const renderRoutes = Object.entries(routes)

export const logoutOnInvalidToken = new Event('logoutOnInvalidToken')
