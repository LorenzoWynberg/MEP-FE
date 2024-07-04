import React, { useState } from 'react'
import HeaderTab from 'Components/Tab/Header'
import ContentTab from 'Components/Tab/Content'

import Timeline from 'Components/timeline'
import CentroEducativo from './_modals/oferta'

import './style.scss'
import withAuthorization from '../../../../Hoc/withAuthorization'
import { useTranslation } from 'react-i18next'

const AuthTimeline = withAuthorization({
  id: 12,
  Modulo: 'Expediente Estudiantil',
  Apartado: 'Oferta Educativa',
  Seccion: 'Historial de centros Educativos'
})(Timeline)

const Oferta = (props) => {
  const { t } = useTranslation()

  const [activeTab, setActiveTab] = useState(0)
  const [open, setOpen] = useState(false)
  const [centro, setCentroEducativo] = useState({})
  const [items, setItems] = useState(props.items)

  const optionsTab = [
    t('estudiantes>expediente>oferta_edu>nav>historial_ce', 'Historial de centros educativos'),
    t('estudiantes>expediente>oferta_edu>nav>info_acad', 'Información académica')
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
      <h2>{t('estudiantes>expediente>oferta_edu>titulo', 'Oferta educativa')}</h2>
      <HeaderTab options={optionsTab} activeTab={activeTab} setActiveTab={setActiveTab} />
      <ContentTab activeTab={activeTab} numberId={activeTab}>
        {
                    {
                      0: <AuthTimeline items={props.historialMatricula} handleClick={handleCentroEducativo} />,
                      1: <h2>{t('estudiantes>expediente>oferta_edu>info_acad>titulo', 'Información académica')}</h2>
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
