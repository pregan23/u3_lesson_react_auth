import React from 'react'
import axios from 'axios'
import { BASE_URL } from '../globals'
import { Button, Card, Grid, Icon, Image } from 'semantic-ui-react'

const PostList = (props) => {
  const deleteItem = async (postId) => {
    try {
      let token = localStorage.getItem('token')
      const res = await axios.delete(`${BASE_URL}/posts/${postId}`, {
        headers: { authorization: `Bearer ${token}` }
      })
      let filtered = props.posts.filter(
        (post) => post.id !== parseInt(res.data.payload)
      )
      props.setPosts(filtered)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Grid padded columns={3} stackable relaxed>
      <Grid.Row>
        {props.posts.map((post) => (
          <Grid.Column key={post.id}>
            <Card>
              <Image src={post.image} />
              <Card.Content>
                <Card.Header>{post.title}</Card.Header>
                <Card.Description>{post.body}</Card.Description>
              </Card.Content>
              {props.authenticated ? (
                <Card.Content extra>
                  <Button
                    color="red"
                    icon
                    labelPosition="left"
                    onClick={() => deleteItem(post.id)}
                  >
                    <Icon name="trash" />
                    Delete
                  </Button>
                  <Button color="blue" icon labelPosition="right">
                    <Icon name="edit" />
                    Edit
                  </Button>
                </Card.Content>
              ) : null}
            </Card>
          </Grid.Column>
        ))}
      </Grid.Row>
    </Grid>
  )
}

export default PostList
