import React from 'react'
import { Route } from 'react-router-dom'

const Layout = (props) => (
  <>
    <div className='fixed-background-saber' />
    <main>
      <div className='container'>{props.children}</div>
    </main>
  </>
)

const UserLayout = ({ component: Component, ...rest }) => {
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

export default UserLayout
