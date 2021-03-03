import { useEffect, useState } from 'react'
import './styles/App.css'
import Login from './components/Login'
import Nav from './components/Nav'
import Register from './components/Register'
import { Container } from 'semantic-ui-react'
import PostList from './components/PostList'
import CreatePost from './components/CreatePost'
import axios from 'axios'
import { BASE_URL } from './globals'

function App() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loginOpen, toggleLoginOpen] = useState(false)
  const [registerOpen, toggleRegisterOpen] = useState(false)
  const [createPostOpen, toggleCreatePostOpen] = useState(false)
  const [newPost, setNewPost] = useState({ title: '', body: '', image: '' })
  const [posts, setPosts] = useState([])

  const getToken = () => {
    let token = localStorage.getItem('token')
    if (token) {
      return setAuthenticated(true)
    }
  }

  const getPosts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/posts`)
      setPosts(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const logOut = () => {
    setAuthenticated(false)
    localStorage.clear()
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewPost({ ...newPost, [name]: value })
  }

  const submitPost = async (e) => {
    try {
      let token = localStorage.getItem('token')
      const res = await axios.post(`${BASE_URL}/posts`, newPost, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      setPosts([...posts, res.data])
      setNewPost({ title: '', body: '', image: '' })
      toggleCreatePostOpen(false)
    } catch (error) {
      console.log(error)
    }
  }

  const closeCreate = () => {
    toggleCreatePostOpen(false)
    setNewPost({ title: '', body: '', image: '' })
  }

  useEffect(() => {
    getToken()
    getPosts()
  }, [])

  return (
    <div className="App">
      <Nav
        toggleLogin={toggleLoginOpen}
        toggleRegister={toggleRegisterOpen}
        toggleCreate={toggleCreatePostOpen}
        authenticated={authenticated}
        logOut={logOut}
      />
      <Login
        loginOpen={loginOpen}
        toggleLogin={toggleLoginOpen}
        toggleAuthenticated={setAuthenticated}
      />
      <Register
        registerOpen={registerOpen}
        toggleRegister={toggleRegisterOpen}
      />
      <Container>
        <PostList
          authenticated={authenticated}
          posts={posts}
          setPosts={setPosts}
        />
        <CreatePost
          handleChange={handleChange}
          submitPost={submitPost}
          newPost={newPost}
          modalOpen={createPostOpen}
          closeModal={closeCreate}
        />
      </Container>
    </div>
  )
}

export default App
