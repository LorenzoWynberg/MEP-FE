import React, { useState } from 'react'
import Timeline from 'Components/timeline'
import CentroEducativo from '../../../../../director/ExpedienteEstudiante/_modals/oferta'

const HistorialEducativo = (props) => {
  const [open, setOpen] = useState(false)
  const [centro, setCentroEducativo] = useState({})
  /*   const AuthTimeline = withAuthorization({
    id: 1,
    Modulo: "Expediente Estudiantil",
    Apartado: "Oferta Educativa",
    Seccion: "Historial de centros Educativos"
})(Timeline) */
  const data = [
    {
      institucion: 'Centro Educativo',
      nivel: 'Nivel',
      anioEducativo: 'Fecha ingreso',
      grupo: ''
    },
    {
      institucion: 'Centro Educativo',
      nivel: 'Nivel',
      anioEducativo: 'Fecha ingreso',
      grupo: ''
    },
    {
      institucion: 'Centro Educativo',
      nivel: 'Nivel',
      anioEducativo: 'Fecha ingreso',
      grupo: ''
    },
    {
      institucion: 'Centro Educativo',
      nivel: 'Nivel',
      anioEducativo: 'Fecha ingreso',
      grupo: ''
    }
  ]
  const handleCentroEducativo = (item) => {
    setOpen(true)
    setCentroEducativo(item)
  }
  const toggleModal = () => {
    setOpen(!open)
  }
  return (
    <div>
      <Timeline items={data} handleClick={handleCentroEducativo} />

      {open && (
        <CentroEducativo
          open={open}
          centro={{ codigoInstitucion: '201432-000' }}
          toggleModal={toggleModal}
        />
      )}
    </div>
  )
}

export default HistorialEducativo
