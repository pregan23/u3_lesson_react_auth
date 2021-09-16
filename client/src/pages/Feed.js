import React, { useEffect, useState } from 'react'
import { GetPosts } from '../services/PostServices'

export default function Feed() {
  const [posts, setPosts] = useState([])

  const handlePosts = async () => {
    const data = await GetPosts()
    setPosts(data)
  }
  useEffect(() => {
    handlePosts()
  }, [])
  return (
    <div className="grid col-4">
      {posts.map((post) => (
        <div className="card" key={post.id}>
          <h3>{post.title}</h3>
          <div>
            <img src={post.image} />
          </div>
          <p>{post.body.substring(0, 80)}...</p>
        </div>
      ))}
    </div>
  )
}
