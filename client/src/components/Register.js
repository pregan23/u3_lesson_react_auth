import React, { useState } from 'react'
import { Button, Form, Icon, Modal } from 'semantic-ui-react'
import axios from 'axios'
import { BASE_URL } from '../globals'
const Register = (props) => {
  const [registerForm, handleRegisterForm] = useState({
    email: '',
    password: '',
    name: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${BASE_URL}/auth/register`, registerForm)
      // Could pre populate the sign up form if state is passed from app.js
      props.toggleRegister(false)
      handleRegisterForm({ email: '', password: '', name: '' })
    } catch (error) {
      console.log(error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    handleRegisterForm({ ...registerForm, [name]: value })
  }

  return (
    <Modal open={props.registerOpen}>
      <Modal.Content>
        <Form onSubmit={handleSubmit}>
          <Form.Field>
            <label>Your Name</label>
            <input
              type="text"
              name="name"
              placeholder="Jane Doe"
              value={registerForm.name}
              onChange={handleChange}
              required
            />
          </Form.Field>
          <Form.Field>
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="jane@mail.com"
              value={registerForm.email}
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
              value={registerForm.password}
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
          onClick={() => props.toggleRegister(false)}
        >
          <Button.Content visible>Close</Button.Content>
          <Button.Content hidden>
            <Icon name="close" />
          </Button.Content>
        </Button>
        <Button
          disabled={
            !registerForm.email || !registerForm.password || !registerForm.name
          }
          size="large"
          color="teal"
          animated="fade"
          onClick={handleSubmit}
        >
          <Button.Content visible>Sign Up</Button.Content>
          <Button.Content hidden>
            <Icon name="lock" />
          </Button.Content>
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default Register
