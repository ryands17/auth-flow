import * as React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, Form, Input, Button, message } from 'antd'
import { ValidateErrorEntity } from 'rc-field-form/lib/interface'
import { routes } from 'config/routes'
import { login } from 'config/utils'
import { LoginBody } from 'server/src/config/schema'

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
}

const Login = () => {
  const navigate = useNavigate()
  const [isLoading, loading] = React.useState(false)

  const success = async (values: LoginBody) => {
    try {
      loading(true)
      await login(values)
      navigate(routes.home.path)
    } catch (e) {
      message.error(e.toString())
    } finally {
      loading(false)
    }
  }

  const failure = (errorInfo: ValidateErrorEntity) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card style={{ width: 500 }}>
        <h2>Login</h2>
        <Form
          {...layout}
          name="signup"
          onFinish={success}
          onFinishFailed={failure}
        >
          <Form.Item
            label="Email"
            name="email"
            required
            rules={[{ type: 'email' }, { required: true }]}
          >
            <Input placeholder="abc@g.com" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            required
            rules={[{ required: true }]}
          >
            <Input type="password" placeholder="********" />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Button loading={isLoading} type="primary" htmlType="submit">
                Login
              </Button>

              <Link to={routes.signup.path}>Signup</Link>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Login
