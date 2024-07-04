import React, { Suspense } from 'react'
import { Switch, Redirect, Route } from 'react-router-dom'
import UserLayout from '../../layout/UserLayout'
import RegisterLayout from '../../layout/RegisterLayout'

const Login = React.lazy(() =>
  import(/* webpackChunkName: "user-login" */ './login')
)
const ForgotPassword = React.lazy(() =>
  import(/* webpackChunkName: "user-forgot-password" */ './forgot-password')
)
const IsFirstLogin = React.lazy(() =>
  import(/* webpackChunkName: "user-login" */ './IsFirstLogin')
)
const Registration = React.lazy(() =>
  import(/* webpackChunkName: "user-login" */ './Registration/main.tsx')
)

const User = ({ match }) => {
  return (
    <Suspense fallback={<div className='loading' />}>
      <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/login`} />
        <Route
          path={`${match.url}/login`}
          component={Login}
        />
        <UserLayout
          path={`${match.url}/isFirstLogin`}
          component={IsFirstLogin}
        />
        <RegisterLayout
          path={`${match.url}/registration`}
          component={Registration}
        />
        <UserLayout path={`${match.url}/forgot-password/:name`} component={ForgotPassword} />
        <UserLayout path={`${match.url}/forgot-password`} component={ForgotPassword} />
        <Redirect to='/error' />
      </Switch>
    </Suspense>
  )
}

export default User
