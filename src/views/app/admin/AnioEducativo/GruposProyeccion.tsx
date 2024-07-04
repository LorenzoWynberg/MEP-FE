import React, { useState } from 'react'
import Grupos from './_partials/GruposProyeccion/Grupos'

const options = [
  'Grupos',
  'Niveles',
  'Grupos por nivel'
]

const GruposProyeccion = () => {
  const [currentTab, setCurrentTab] = useState(0)
  return (
    <div>
      <Grupos />
    </div>
  )
}

export default GruposProyeccion
