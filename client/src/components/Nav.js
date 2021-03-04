import React from 'react'
import { Button, Container } from 'semantic-ui-react'

const Nav = (props) => {
  const displayButtons = () => {
    if (props.authenticated) {
      return (
        <div>
          <Button
            onClick={() => props.toggleCreate(true)}
            icon="edit"
            labelPosition="right"
            color="blue"
            content="Create Post"
          />
          <Button onClick={props.logOut} color="violet" content="Log Out" />
        </div>
      )
    }
    return (
      <div>
        <Button onClick={() => props.toggleLogin(true)} color="violet">
          Login
        </Button>
        <Button onClick={() => props.toggleRegister(true)} color="teal">
          Register
        </Button>
      </div>
    )
  }
  return (
    <Container className="nav" textAlign="right">
      {displayButtons()}
    </Container>
  )
}

export default Nav
