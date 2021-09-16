import React from 'react'
import Welcome from '../assets/welcome.svg'
export default function Home({ history }) {
  return (
    <div className="home-container col">
      <img src={Welcome} />

      <section className="welcome-signin">
        <button onClick={() => history.push('/signin')}>
          Click Here To Get Started
        </button>
      </section>
    </div>
  )
}
