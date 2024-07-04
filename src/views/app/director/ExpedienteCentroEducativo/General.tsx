import React, { useState } from 'react'
import HeaderTab from 'Components/Tab/Header'
import ContentTab from 'Components/Tab/Content'
import PerfilCentro from './_partials/general/PerfilCentro'
import GeneralForm from './_partials/general/General'
// import Comparte from './_partials/general/Comparte.tsx';
import Contacto from './_partials/general/Contacto'
import DatosDirector from './_partials/general/DatosDirector'
import UbicacionGeoSaber from './_partials/general/UbicacionSaber'
import UbicacionAdmin from './_partials/general/Ubicacion'
import { Helmet } from 'react-helmet'
import Notification from '../../../../Hoc/Notificaction'
import { useTranslation } from 'react-i18next'

const General = (props) => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState(0)
  const optionsTab = [
    t('expediente_ce>informacion_general>nav>general', 'General'),
    t('expediente_ce>informacion_general>nav>perfil', 'Perfil del centro educativo'),
    // "Comparte",
    t('expediente_ce>informacion_general>nav>info', 'Información de contacto'),
    t('expediente_ce>informacion_general>nav>datos', 'Datos del director'),
    t('expediente_ce>informacion_general>nav>ubi_admin', 'Ubicación administrativa'),
    t('expediente_ce>informacion_general>nav>ubi_geo', 'Ubicación geográfica')
  ]
  return (
    <Notification>
      {(showSnackbar) => {
        return (
          <>
            <Helmet>
              <title>
                {t('expediente_ce>informacion_general>titulo', 'Información general')}
              </title>
            </Helmet>
            <h4>{t('expediente_ce>informacion_general>titulo', 'Información general')}</h4>
            <br />
            <HeaderTab
              options={optionsTab}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <ContentTab activeTab={activeTab} numberId={activeTab}>
              {activeTab === 0 && <GeneralForm {...props} />}
              {activeTab === 1 && <PerfilCentro {...props} />}
              {/* {activeTab === 2 && <Comparte {...props} showSnackbar={showSnackbar}/>} */}
              {activeTab === 2 && <Contacto {...props} />}
              {activeTab === 3 && <DatosDirector {...props} />}
              {activeTab === 4 && <UbicacionAdmin {...props} />}
              {activeTab === 5 && (
                <>
                  <UbicacionGeoSaber {...props} />
                </>
              )}
            </ContentTab>
          </>

        )
      }}
    </Notification>
  )
}

export default General
