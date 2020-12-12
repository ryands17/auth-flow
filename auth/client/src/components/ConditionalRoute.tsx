import * as React from 'react'
import { Navigate } from 'react-router-dom'
import { routes } from 'config/routes'
import { fetchToken, auth } from 'config/utils'

const TOKEN_STATE = {
  LOADING: 0,
  SUCCESS: 1,
  ERROR: -1,
}

const useAuth = () => {
  const [validTokenState, setValidTokenState] = React.useState(
    TOKEN_STATE.LOADING
  )

  React.useEffect(() => {
    const currentToken = fetchToken()
    if (currentToken) {
      setValidTokenState(TOKEN_STATE.SUCCESS)
    } else {
      setValidTokenState(TOKEN_STATE.LOADING)
      const needAsync = async () => {
        try {
          await auth.refreshToken()
          setValidTokenState(TOKEN_STATE.SUCCESS)
        } catch (err) {
          setValidTokenState(TOKEN_STATE.ERROR)
        }
      }
      needAsync()
    }
  }, [])

  return validTokenState
}

export const PrivateRoute: React.FC = props => {
  const validTokenState = useAuth()

  switch (validTokenState) {
    case TOKEN_STATE.LOADING:
      return <div>Loading....</div>
    case TOKEN_STATE.SUCCESS:
      return <div>{props.children || null}</div>
    case TOKEN_STATE.ERROR:
    default:
      return <>{props.children || null}</>
  }
}

export const PublicRoute: React.FC = props => {
  const validTokenState = useAuth()

  switch (validTokenState) {
    case TOKEN_STATE.LOADING:
      return <div>Loading....</div>
    case TOKEN_STATE.SUCCESS:
      return <Navigate to={routes.home.path}></Navigate>
    case TOKEN_STATE.ERROR:
    default:
      return <div>{props.children || null}</div>
  }
}
