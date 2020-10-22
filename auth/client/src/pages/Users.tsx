import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'antd'
import { routes } from 'config/routes'

const Users = () => {
  const navigate = useNavigate()

  return (
    <div>
      <h1>Users</h1>
      <Button onClick={() => navigate(routes.login.path)}>Sign Out</Button>
    </div>
  )
}

export default Users
