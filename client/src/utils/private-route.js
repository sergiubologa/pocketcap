import React from 'react'
import {Route, Redirect} from 'react-router-dom'
import type {Props} from '../flow-types/react-generic'

// Inspiration: https://www.youtube.com/watch?v=ojYbcon588A
const PrivateRoute = ({component: Component, ...rest}) => {
  // TODO - replace this with LoginStore property
  const isAuthenticated = true;
  return (
    <Route {...rest} render={(props: Props) => (
      isAuthenticated === true
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )}/>
  )
}

export default PrivateRoute
