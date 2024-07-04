import ContentTab from 'Components/Tab/Content'
import HeaderTab from 'Components/Tab/Header'
import React, { useState } from 'react'
import { Helmet } from 'react-helmet'

import Notification from '../../../../../Hoc/Notificaction'
import {
  Asistencia,
  Calificaciones,
  Conducta
} from './_partials/AreaCurricular'

const AreaCurricular = () => {
  const [activeTab, setActiveTab] = useState(0)
  const optionsTab = ['Asistencia', 'Calificaciones', 'Conducta']

  return (
    <Notification>
      {(showSnackbar) => {
        return (
          <>
            <Helmet>
              <title>Área Curricular</title>
            </Helmet>
            <br />
            <HeaderTab
              options={optionsTab}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <ContentTab activeTab={activeTab} numberId={activeTab}>
              {activeTab === 0 && <Asistencia />}
              {activeTab === 1 && <Calificaciones />}
              {activeTab === 2 && <Conducta />}
            </ContentTab>
          </>
        )
      }}
    </Notification>
  )
}
export default AreaCurricular
