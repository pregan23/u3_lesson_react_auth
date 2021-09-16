import { useState } from 'react'
import { Route, Switch } from 'react-router'
import Nav from './components/Nav'
import Home from './pages/Home'
import Register from './pages/Register'
import SignIn from './pages/SignIn'
import './styles/App.css'

function App() {
  const [authenticated, toggleAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  const handleLogOut = () => {
    //Reset all auth related state and clear localstorage
    setUser(null)
    toggleAuthenticated(false)
    localStorage.clear()
  }

  return (
    <div className="App">
      <Nav
        authenticated={authenticated}
        user={user}
        handleLogOut={handleLogOut}
      />
      <main>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/signin" component={(props) => <SignIn {...props} />} />
          <Route path="/register" component={Register} />
        </Switch>
      </main>
    </div>
  )
}

export default App
