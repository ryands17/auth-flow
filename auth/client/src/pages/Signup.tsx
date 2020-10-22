import * as React from 'react'
import { Card, Form, Input, Button, message } from 'antd'
import { useNavigate, Link } from 'react-router-dom'
import { ValidateErrorEntity } from 'rc-field-form/lib/interface'
import { signup } from 'config/utils'
import { routes } from 'config/routes'
import { SignupBody } from 'server/src/config/schema'

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
}

const Signup = () => {
  const navigate = useNavigate()
  const [isLoading, loading] = React.useState(false)

  const success = async (values: SignupBody) => {
    try {
      loading(true)
      await signup(values)
      navigate(routes.login.path)
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
        <h2>Signup</h2>
        <Form
          {...layout}
          name="signup"
          onFinish={success}
          onFinishFailed={failure}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true }]}
            required
          >
            <Input placeholder="John Doe" />
          </Form.Item>

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
                Signup
              </Button>

              <Link to={routes.login.path}>Login</Link>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Signup
