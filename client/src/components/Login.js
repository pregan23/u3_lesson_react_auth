import React, { useState } from 'react'
import { Button, Form, Icon, Modal } from 'semantic-ui-react'
import axios from 'axios'
import { BASE_URL } from '../globals'
const Login = (props) => {
  const [loginForm, handleLoginForm] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, loginForm)
      localStorage.setItem('token', res.data.token)
      props.toggleAuthenticated(true)
      props.toggleLogin(false)
      handleLoginForm({ email: '', password: '' })
    } catch (error) {
      console.log(error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    handleLoginForm({ ...loginForm, [name]: value })
  }

  return (
    <Modal open={props.loginOpen}>
      <Modal.Content>
        <Form onSubmit={handleSubmit}>
          <Form.Field>
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="jane@mail.com"
              value={loginForm.email}
              onChange={handleChange}
              required
            />
          </Form.Field>
          <Form.Field>
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Your Password"
              value={loginForm.password}
              onChange={handleChange}
              required
            />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          size="large"
          color="red"
          animated="fade"
          onClick={() => props.toggleLogin(false)}
        >
          <Button.Content visible>Close</Button.Content>
          <Button.Content hidden>
            <Icon name="close" />
          </Button.Content>
        </Button>
        <Button
          disabled={!loginForm.email || !loginForm.password}
          size="large"
          color="teal"
          animated="fade"
          onClick={handleSubmit}
        >
          <Button.Content visible>Login</Button.Content>
          <Button.Content hidden>
            <Icon name="lock" />
          </Button.Content>
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default Login
