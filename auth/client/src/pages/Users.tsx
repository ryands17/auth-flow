import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, message } from 'antd'
import { routes } from 'config/routes'
import { User } from 'server/src/config/schema'
import { getAllUsers, auth } from 'config/utils'

const Users = () => {
  const [users, setUsers] = React.useState<User[]>([])
  const navigate = useNavigate()

  React.useEffect(() => {
    getAllUsers()
      .then(data => setUsers(data.users))
      .catch(e => message.error(e.toString()))
  }, [])

  return (
    <div>
      <h1>Home</h1>
      {!!users.length && <h4>Total users: {users.length}</h4>}
      <Button
        onClick={() => {
          auth.signout()
        }}
      >
        Sign Out
      </Button>
    </div>
  )
}

export default Users
