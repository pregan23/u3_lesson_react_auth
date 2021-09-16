import { useEffect, useState } from 'react'
import { Route, Switch } from 'react-router'
import Nav from './components/Nav'
import ProtectedRoute from './components/ProtectedRoute'
import Feed from './pages/Feed'
import Home from './pages/Home'
import Register from './pages/Register'
import SignIn from './pages/SignIn'
import { CheckSession } from './services/Auth'
import './styles/App.css'

function App() {
  const [authenticated, toggleAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  const checkToken = async () => {
    //If a token exists, sends token to localstorage to persist logged in user
    const session = await CheckSession()
    setUser(session)
    toggleAuthenticated(true)
  }

  const handleLogOut = () => {
    //Reset all auth related state and clear localstorage
    setUser(null)
    toggleAuthenticated(false)
    localStorage.clear()
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    // Check if token exists before requesting to validate the token
    if (token) {
      checkToken()
    }
  }, [])

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
          <Route
            path="/signin"
            component={(props) => (
              <SignIn
                {...props}
                setUser={setUser}
                toggleAuthenticated={toggleAuthenticated}
              />
            )}
          />
          <Route path="/register" component={Register} />
          <ProtectedRoute
            authenticated={authenticated}
            user={user}
            path="/feed"
            component={Feed}
          />
        </Switch>
      </main>
    </div>
  )
}

export default App
