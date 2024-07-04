import React from 'react'
import { Route } from 'react-router-dom'

const Layout = (props) => (
  <>
    <div className='fixed-background-register' />
    <main>
      <div className='container'>{props.children}</div>
    </main>
  </>
)

const RegisterLayout = ({ component: Component, ...rest }) => {
  React.useEffect(() => {
    document.body.className = 'background'
    return () => { document.body.className = '' }
  })

  return (
    <Route
      {...rest} render={props => (
        <Layout>
          <Component {...props} />
        </Layout>
      )}
    />
  )
}

export default RegisterLayout
