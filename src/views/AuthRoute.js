import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'

const AuthRoute = ({ component: Component, authUser, componentProps, exact, ...rest }) => {
  const state = useSelector((store) => {
    return {
      ...store
    }
  })

  const getRoleFromList = (roleLabel) => {
    let actualRol
    state.roles.map(role => {
      if (role.nombre === roleLabel) {
        actualRol = role.id
      }
    })
    return actualRol
  }

  const canAccess = (roleLabel) => {
    return (
      authUser.user && this.getRoleFromList(roleLabel) === 1
    )
  }

  // route.accessRoles.some(role =>
  //     canAccess(role),
  // )
  const token = authUser.user.token

  return (
    <Route
      {...rest}
      exact={exact}
      render={props =>
        token
          ? (
            <Component {...props} {...componentProps} />
            )
          : (
            <Redirect
              to={{
                pathname: '/user/login',
                state: { from: props.location }
              }}
            />
            )}
    />
  )
}

export default AuthRoute
