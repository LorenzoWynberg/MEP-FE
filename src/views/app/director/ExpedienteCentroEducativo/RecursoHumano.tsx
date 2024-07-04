import ContentTab from 'Components/Tab/Content'
import HeaderTab from 'Components/Tab/Header'
import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'

import Notification from '../../../../Hoc/Notificaction'
import FuncionariosInst from './_partials/RecursoHumano/FuncionariosInst'
import FuncionariosIntegra from './_partials/RecursoHumano/FuncionariosIntegra'

const RecursoHumano = (props) => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState(0)
  const optionsTab = [ 
    t('expediente_ce>recurso_humano>fun_ce', 'Funcionarios del centro educativo')
  ]

  return (
    <Notification>
      {(showSnackbar) => {
			  return (
  <>
    <Helmet>
      <title>{t('configuracion>superviciones_circuitales>agregar>informacion_general', 'Información general')}</title>
    </Helmet>
    <br />
    <HeaderTab
      options={optionsTab}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    />
    <ContentTab activeTab={activeTab} numberId={activeTab}>
      {/* {activeTab === 0 && <FuncionariosIntegra />} */}
      {activeTab === 0 && <FuncionariosInst {...props} />}
    </ContentTab>
  </>
		  )
      }}
    </Notification>
  )
}

export default RecursoHumano
