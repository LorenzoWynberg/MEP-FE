import ContentTab from 'Components/Tab/Content'
import HeaderTab from 'Components/Tab/Header'
import React, { useState } from 'react'
import { Helmet } from 'react-helmet'

import Notification from '../../../../../Hoc/Notificaction'
import {
  HistorialEducativo,
  InfoAcademica
} from './_partials/OfertasEducativas'

const OfertaEducativa = (props) => {
  const [activeTab, setActiveTab] = useState(0)
  const optionsTab = [
    'Historial de centros educativos',
    'Información académica'
  ]

  return (
    <Notification>
      {(showSnackbar) => {
        return (
          <>
            <Helmet>
              <title>Oferta educativa</title>
            </Helmet>
            <br />
            <h2>Oferta educativa</h2>
            <HeaderTab
              options={optionsTab}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <ContentTab activeTab={activeTab} numberId={activeTab}>
              {activeTab === 0 && <HistorialEducativo {...props} />}
              {activeTab === 1 && <InfoAcademica />}
            </ContentTab>
          </>
        )
      }}
    </Notification>
  )
}

export default OfertaEducativa
