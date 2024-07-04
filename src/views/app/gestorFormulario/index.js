import React from 'react'
import AppLayoutGestorFormulario from 'Layout/AppLayoutGestorFormulario'
import { Helmet } from 'react-helmet'
import directorItems from 'Constants/directorMenu'
import withRouter from 'react-router-dom/withRouter'

const Index = (props) => {
  return (
    <AppLayoutGestorFormulario items={directorItems}>
      <Helmet>
        <title>
          Gestor formularios
        </title>
      </Helmet>
    </AppLayoutGestorFormulario>
  )
}
export default withRouter(Index)
