import React, { useState } from 'react'
import Terrenos from './_partials/infraestructura/Terrenos'
import Edificaciones from './_partials/infraestructura/Edificaciones'
import HeaderTab from 'Components/Tab/Header'
import ContentTab from 'Components/Tab/Content'
import Servicios from './_partials/infraestructura/Servicios'
import ObrasSuplementarias from './_partials/infraestructura/ObrasSuplementarias'
import { Helmet } from 'react-helmet'
import Comparte from './_partials/general/Comparte'
import Notification from '../../../../Hoc/Notificaction'
import { useTranslation } from 'react-i18next'

const Infraestructura = (props) => {
  const [activeTab, setActiveTab] = useState(0)
  const { t } = useTranslation()
  const optionsTab = [
    t('expediente_ce>infraestructura>optionTab1', 'Terrenos'),
    t('expediente_ce>infraestructura>optionTab2', 'Edificaciones'),
    t('expediente_ce>infraestructura>optionTab3', 'Obras complementarias'),
    t('expediente_ce>infraestructura>optionTab4', 'Servicios públicos'),
    t('expediente_ce>infraestructura>optionTab5', 'Comparte')
  ]
  return (
    <>
      <Notification>
        {(showSnackbar) => {
				  return (
  <>
    <Helmet>
      <title>
        {t(
									  'expediente_ce>infraestructura>titulo',
									  'Infraestructura'
        )}
      </title>
    </Helmet>
    <h4>
      {t(
								  'expediente_ce>infraestructura>titulo',
								  'Infraestructura'
      )}
    </h4>
    <br />
    <HeaderTab
      options={optionsTab}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    />

    <ContentTab
      activeTab={activeTab}
      numberId={activeTab}
    >
      {activeTab === 0 && <Terrenos {...props} />}
      {activeTab === 1 && (
        <Edificaciones {...props} />
      )}
      {activeTab === 2 && (
        <ObrasSuplementarias {...props} />
      )}
      {activeTab === 3 && <Servicios {...props} />}
      {activeTab === 4 && (
        <Comparte
          {...props}
          showSnackbar={showSnackbar}
        />
      )}
    </ContentTab>
  </>
				  )
        }}
      </Notification>
    </>
  )
}

export default Infraestructura
