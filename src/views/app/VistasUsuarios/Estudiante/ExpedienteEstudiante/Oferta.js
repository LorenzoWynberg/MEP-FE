import React, { useState } from 'react'
import HeaderTab from 'Components/Tab/Header'
import ContentTab from 'Components/Tab/Content'

import Timeline from 'Components/timeline'
import CentroEducativo from './_modals/oferta'

import './style.scss'
import withAuthorization from '../../../../../Hoc/withAuthorization'

const AuthTimeline = withAuthorization({
  id: 1,
  Modulo: 'Expediente Estudiantil',
  Apartado: 'Oferta Educativa',
  Seccion: 'Historial de centros Educativos'
})(Timeline)

const Oferta = (props) => {
  const [activeTab, setActiveTab] = useState(0)
  const [open, setOpen] = useState(false)
  const [centro, setCentroEducativo] = useState({})
  const [items, setItems] = useState(props.items)

  const optionsTab = [
    'Historial de centros educativos',
    'Información académica'
  ]

  const handleCentroEducativo = (item) => {
    setOpen(true)
    setCentroEducativo(item)
  }
  const toggleModal = () => {
    setOpen(!open)
  }

  return (
    <>
      <h2>Oferta educativa</h2>
      <HeaderTab options={optionsTab} activeTab={activeTab} setActiveTab={setActiveTab} />
      <ContentTab activeTab={activeTab} numberId={activeTab}>
        {
                    {
                      0: <AuthTimeline items={props.historialMatricula} handleClick={handleCentroEducativo} />,
                      1: <h2>Información académica</h2>
                    }[activeTab]
                }
        {open && <CentroEducativo
          open={open}
          centro={centro}
          toggleModal={toggleModal}
                 />}
      </ContentTab>
    </>
  )
}

export default Oferta
