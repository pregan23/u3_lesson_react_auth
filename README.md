# React Authentication

![](https://healthitsecurity.com/images/site/features/_normal/GettyImages-1206964126.jpg)

## Overview

In this lesson, we'll learn to to integrate authentication into our react client. We'll learn how to persist an authenticated user in our application and how to protect resources from unauthenticated users. This app was built with Semantic UI but we'll be focusing on only integrating the `axios` calls.

## Getting Started

- Fork and Clone
- `npm install`
- `npm run dev`
- `cd client`
- `npm install`
- `npm start`

## Understanding The LocalStorage API

In order to persist a users token, we'll need to use something called `localStorage`. `localStorage` is an in-browser memory store.

### What Is LocalStorage?

> localStorage is an API that allows JavaScript sites and apps to save key/value pairs in a web browser with no expiration date. This means the data stored in the browser will persist even after the browser window is closed.

### How Does LocalStorage Work?

To use localStorage in your web applications, there are five methods to choose from:

1. `setItem()`: Add key and value to localStorage
2. `getItem()`: This is how you get items from localStorage
3. `removeItem()`: Remove an item by key from localStorage
4. `clear()`: Clear all localStorage
5. `key()`: Passed a number to retrieve the key of a localStorage

We'll utilize `localStorage` to save the users `JWT` once they've signed into our app.

## Frontend State and Security

Contrary to belief, most frontends are not secure to the extent of our backend data. The purpose of the frontend is to display information to a user. As long as our backend is secure, the frontend will only conditonally display information based on certain criteria. With React, we'll use state and a special component called a `ProtectedRoute` to conditionally render specific parts of our UI once the user has successfully signed in. More often than not, your backend server will have more resources available to perform expensive computations and logic checks. We'll use that along with React's fast UI updates to build a seamless application for our users.

### Managing Visibility With State

Open your `App.js` file located within the `client` directory. At the top of the component, you'll find **2** pieces of state:

```js
const [authenticated, toggleAuthenticated] = useState(false)
const [user, setUser] = useState(null)
```

These two pieces of state are going to control the visibility of _private_ components for our entire application.

We'll use the `authenticated` state, to actually toggle the UI and the `user` state to store some kind of information about our user.

### Registering A User

Let's start by registering a user. Open the `Register` component located in the `pages` folder.

This component has been mostly filled out for you, however a very important aspect is still missing. Our `handleSubmit` function is currently incomplete:

```js
const handleSubmit = async (e) => {
  e.preventDefault()
}
```

In order to complete this function, we'll need to do a few things:

- Submit the users information to our backend via a service function
- Reset the populated form to empty once the request completes successfully
- Redirect the user to the login page. **(Never sign in a user after registering!)**

We'll start by importing our `RegisterUser` function from `services`:

```js
import { RegisterUser } from '../services/Auth'
```

The `RegisterUser` function accepts one argument of `data`. This `data` argument should be an object with the following information:
- name
- email
- password

Next we'll invoke this function in our `handleSubmit` and pass in the information from our form:

```js
await RegisterUser({
  name: formValues.name,
  email: formValues.email,
  password: formValues.password
})
```

After the API request succeeds, we'll reset the current state to it's initial value:

```js
setFormValues(iState)
```

**Note: Notice the use of `iState` here, an object was constructed for you to facilitate resetting state.**

Finally, we'll redirect the user to our Sign In page:

```js
props.history.push('/signin')
```

At this point, you can try to register a user.

### Signing In A User

Now that our registration functionality is set up, we can focus on letting a user sign in to our application.

We'll start by providing `setUser` and `toggleAuthenticated` to the `SignIn` component as props in `App.js`:

```jsx
<SignIn
  {...props}
  setUser={setUser}
  toggleAuthenticated={toggleAuthenticated}
/>
```

We'll utilize these methods to:
- Tell our protected route that someone is signed in.
- Update our UI to display different information in the `Nav` component.

Once we've passed these props to `SignIn`, open the `SignIn` component.
Just like the `Register` component, this one is just about done as well.

We need to make a few changes to this component before our app can function.

Start by importing `SignInUser` from `services`:

```js
import { SignInUser } from '../services/Auth'
```

`SignInUser` accepts one argument of data. Like register, `data` is an object containing the following information:
- email
- password

In the `handleSubmit`, we'll invoke the `SignInUser` function, provide the `formValues` state as an argument, and capture the return value with a variable called `payload`:

```js
const payload = await SignInUser(formValues)
```

Next we'll reset the form once the request completes successfully:

```js
setFormValues({ email: '', password: '' })
```

We then take the `payload` and use it to update our `user` state in `App.js` with the `setUser` method passed in as props:

```js
props.setUser(payload)
```

Once our user has been set, we'll toggle the `authenticated` state using `toggleAuthenticated`:

```js
props.toggleAuthenticated(true)
```

Finally, we'll redirect the user to a protected page with a URL of `/feed`:

```js
props.history.push('/feed')
```

### Storing the JWT

Now that our `handleSubmit` is set up, we should be able to sign in successfully. However, one problem: we never stored the users token!

Open the `Auth.js` file located in `services`. We need to make a change to `SignInUser`.

In this function, our API is returning two things:
- a user object
- a JWT

We're already returning the `user` object from this function, however it's also a good idea to store the token at this point. Add the following to `SignInUser` ***before*** the return statement:

```js
localStorage.setItem('token', res.data.token)
```

Here, we're using the `localStorage` API to store the user's authentication token with a key of `token`. `setItem` takes two arguments. **order matters**:
- Key to reference the data we store. In this case we're using `token`.
- Value to store. **(The value must always be a string)**

Now that we've set the ability to store the token, let's try signing in with the user you created earlier.

## Protected Routes

At this point, we should be navigated to `http://localhost:3000/feed` once we sign in. However we don't have a component to display just yet for that route. We'll create a component typically called `ProtectedRoute` to conditionally render any components we want to keep hidden from unauthorized users.

> Protected Routes are routes that can only be accessed if a condition is met (usually, if user is properly authenticated). It returns a Route that either renders a component or redirects a user to another route based on a set condition.

In `components`, create a file called `ProtectedRoute.js` or `ProtectedRoute.jsx`.

We'll start by importing React:

```js
import React from 'react'
```

Next we import **two** things from `react-router`:

- Route: Component that displays content based on a path
- Redirect: Component that redirects to provided path, typically used to keep unwanted guests from certain pages

```js
import { Redirect, Route } from 'react-router-dom'
```

Now we can set up the skeleton for our `ProtectedRoute`. We'll utilize destructuring to pick out specific props and keep others in a variable called `rest`:

```jsx
export default function ProtectedRoute({
  user,
  authenticated,
  component: Component,
  ...rest
}) {}
```

Next we'll set up the logic to conditionally render a specific component if our `user` and `authenticated` values are truthy:

```js
return (
  <Route
    {...rest}
    render={(props) =>
      user && authenticated ? (
        <Component {...props} /> // Render our chosen component if a user exists and they are authenticated
      ) : (
        <Redirect to="/signin" /> // Otherwise, use the Redirect component to return the user to the sign in screen
      )
    }
  />
)
```

Now that our `ProtectedRoute` component is complete, we can import it into `App.js` and place it below our current routes (we'll also import the provided Feed component while we're here):

```js
import ProtectedRoute from './components/ProtectedRoute'
import Feed from './pages/Feed'
```

We'll utilize a guard operator around our protected route to ensure that it sees the most up-to-date information from our state:

```jsx
{
  user && authenticated && (
    <ProtectedRoute
      authenticated={authenticated}
      user={user}
      path="/feed"
      component={Feed}
    />
  )
}
```

Let's try signing in again. Once you've signed in successfully, you should be redirected to the `/feed` path and a list of information should appear. Pay close attention to the navigation as well. The UI will change at this point.

Now that we can access the `Feed` component, we've completed our App! Well, not really. Theres a slight problem. Refresh your browser and observe the behavior...

How about if we navigate directly to the Feed component by changing the URL?

This brings us to the next part of our lesson and one of the most important ones!

## Persisting Logged In Users

Nothing is more frustrating to a user than an application that consistently kicks them back to a log in screen when they refresh. Luckily that's a simple fix.

Open the `App.js` file.

What we'll do here is add some logic to check if a token is already stored in localstorage. If it is, we'll make a request to a route in our backend that will validate and decrypt the currently stored token. This decrypted token will contain the same information about the user that we stored after signing in.

We'll start by importing the `CheckSession` function from our auth service:

```js
import { CheckSession } from './services/Auth'
```

Next, we'll create a method called `checkToken` that will make a `GET` request to our bakend with the currently stored token to check it's validity:

```js
const checkToken = async () => {
  //If a token exists, sends token to localstorage to persist logged in user
}
```

Here, we'll invoke the `CheckSession` function and store the returned information in a variable called `user`:

```js
const user = await CheckSession()
```

Next, we'll store this returned user in state using the `setUser` method:

```js
setUser(user)
```

Finally, we'll toggle the `authenticated` state:

```js
toggleAuthenticated(true)
```

We now need a way to trigger this function once our app loads. Let's import `useEffect` from React.

```js
import { useEffect, useState } from 'react'
```

We'll utilize `useEffect` to check if a token exists currently. If and **only** if a token exists, we'll invoke our `checkToken` function:

```js
useEffect(() => {
  const token = localStorage.getItem('token')
  // Check if token exists before requesting to validate the token
  if (token) {
    checkToken()
  }
}, [])
```

Let's try refreshing one more time...

Uh-oh, it's still not working! Luckily it's a simple problem to solve. Right now, we are sending a request to our backend to check the current token stored in localstorage... However, we never sent this token to the backend!

### Enter Interceptors

Lucky for us, we're using `Axios`. `Axios` has a really cool feature called `interceptors` that allows us to catch each request or response as we send or recieve them and modify certain information in the request/response!

Open the `api.js` file located in `services`.

Let's add the following **above** our export and **below** our `Client` instance:

```js
// Intercepts every request axios makes
Client.interceptors.request.use(
  (config) => {
    // Reads the token in localstorage
    const token = localStorage.getItem('token')
    // if the token exists, we set the authorization header
    if (token) {
        config.headers['authorization'] = `Bearer ${token}`
    }
    return config // We return the new config if the token exists or the default config if no token exists.
    // Provides the token to each request that passes through axios
  },
  (error) => Promise.reject(error)
```

With this bit of code we'll accomplish the following:
- Intercept every request our `Client`/instance of axios makes.
- Read the configuration for the request
- Read the token in `localStorage`
- If the token exists, we modify the request headers and provide our token in the `authorization` header with the standard JWT format of `Bearer {token}`
- We then return the config so that the request can complete successfully
- The second function will give us back any errors that occur during a request as normal.

Let's try refreshing one more time. You should now be able to access the `feed` page successully!

## Recap

In this lesson we learned how to integrate authentication and authorization into our client. Our client's view changes based on some kind of state that we store to track changes. Our client-facing application is not meant to be secure, thus we must rely on our backend to make sure that the requests are legitimate and authorized.

## Resources
- [Local Storage MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
