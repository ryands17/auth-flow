import * as React from 'react'

export const sleep = (time = 2000) =>
  new Promise(resolve => setTimeout(resolve, time))

type State = {
  token: string | null
  user: Record<string, any> | null
}

type Action =
  | { type: 'login'; payload: { token: State['token']; user: State['user'] } }
  | { type: 'logout' }

const Auth = React.createContext<{
  state: State
  dispatch: React.Dispatch<Action>
} | null>(null)

export const useAuth = () => React.useContext(Auth)

const initialState: State = { token: null, user: null }

const authOptions = (state: State, action: Action): State => {
  switch (action.type) {
    case 'login':
      return {
        token: action.payload.token,
        user: action.payload.user,
      }
    case 'logout':
      return {
        token: null,
        user: null,
      }
    default:
      return state
  }
}

export const Authenticator: React.FC = ({ children }) => {
  const [state, dispatch] = React.useReducer(authOptions, initialState)

  return <Auth.Provider value={{ state, dispatch }}>{children}</Auth.Provider>
}
