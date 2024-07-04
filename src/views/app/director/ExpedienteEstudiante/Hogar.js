import React, { useState } from 'react'
import HeaderTab from 'Components/Tab/Header'
import ContentTab from 'Components/Tab/Content'

import RefactorMiembrosHogar from './_partials/hogar/refactorMiembrosHogar'
import SocioeconomicoForm from './_partials/hogar/OtrosDatos'
import MiembrosHogar from './_partials/hogar/MiembrosHogar'
import { useTranslation } from 'react-i18next'

const Hogar = (props) => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState(0)

  const optionsTab = [
    t('estudiantes>expediente>hogar>nav>otros_datos', 'Otros datos del estudiante'),
    t('estudiantes>expediente>hogar>nav>miembros_hogar', 'Miembros del hogar'),
    // 'refactorMiembrosHogar'
  ]

  return (
    <>
      <h4>{t('estudiantes>expediente>hogar>titulo', 'Información del hogar')}</h4>
      <HeaderTab options={optionsTab} activeTab={activeTab} setActiveTab={setActiveTab} />
      <ContentTab activeTab={activeTab} numberId={activeTab}>
        {
          {
            0: <SocioeconomicoForm />,
            // 1: <MiembrosHogar />,
            1: <RefactorMiembrosHogar />
          }[activeTab]
        }
      </ContentTab>
    </>
  )
}

export default Hogar
