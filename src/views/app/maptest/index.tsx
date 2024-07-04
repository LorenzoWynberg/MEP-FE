import React from 'react'
import GoogleMapsLocation from 'Components/GoogleMapsLocation'
const MapTest = () => {
  return (
    <div>
      <h1>ENTRO AL COMPONENTE</h1>
      <GoogleMapsLocation id='map1' />
      <GoogleMapsLocation id='map2' />
    </div>
  )
}

export default MapTest
