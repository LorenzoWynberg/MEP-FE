import React, { useState } from 'react'
import HeaderTab from 'Components/Tab/Header'
import ContentTab from 'Components/Tab/Content'
import MallasCurriculares from './_partials/Mallas/MallasCurriculares'
import TiposAsignatura from './_partials/Mallas/TiposAsignatura'
import Asignatura from './_partials/Mallas/Asignatura'
import ComponentesCalificacion from './_partials/Mallas/ComponentesCalificacion'
import IndicadoresAprendizaje from './_partials/Mallas/IndicadoresAprendizaje'
import { useTranslation } from 'react-i18next'

const ContenedorPrincipal = (props) => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState(0)
  const optionsTab = [
    t('menu>configuracion>mallas', 'Mallas curriculares'),
    t('menu>configuracion>tipo_asignatura', 'Tipos de asignatura/figura afín'),
    t('menu>configuracion>asignatura_afin', 'Asignatura/figura afín'),
    t('menu>configuracion>camponente_calificacion', 'Componentes de la calificación'),
    t('menu>configuracion>indicadores_aprendizaje_esperado', 'Indicadores de aprendizaje esperado')
  ]
  return (
    <div>
      <h4>{t('configuracion>mallas_curriculares>mallas_curriculares', 'Mallas curriculares')}</h4>
      <HeaderTab
        options={optionsTab}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <ContentTab activeTab={activeTab} numberId={activeTab}>
        {
          {
            0: <MallasCurriculares {...props} />,
            1: <TiposAsignatura {...props} />,
            2: <Asignatura {...props} />,
            3: <ComponentesCalificacion {...props} />,
            4: <IndicadoresAprendizaje {...props} />
          }[activeTab]
        }
      </ContentTab>
    </div>
  )
}

export default ContenedorPrincipal
