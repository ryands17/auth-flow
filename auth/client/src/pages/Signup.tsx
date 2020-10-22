import * as React from 'react'
import { Card, Form, Input, Button } from 'antd'
import { Store } from 'antd/lib/form/interface'
import { ValidateErrorEntity } from 'rc-field-form/lib/interface'
import { sleep } from 'config/utils'

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
}

const Signup = () => {
  const [isLoading, loading] = React.useState(false)

  const success = async (values: Store) => {
    loading(true)
    await sleep()
    console.log('Success:', values)
    loading(false)
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
            <Button loading={isLoading} type="primary" htmlType="submit">
              Signup
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Signup
