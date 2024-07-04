import React from 'react'
import Offers from './_partials/Ofertas/Offers'
import { Helmet } from 'react-helmet'

const Ofertas = (props) => {
  return (
    <div>
      <Helmet>
        <title>
          Ofertas
        </title>
      </Helmet>
      <Offers />
    </div>
  )
}

export default Ofertas
