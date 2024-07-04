import React, { useState } from 'react'
import HeaderTab from 'Components/Tab/Header'
import ContentTab from 'Components/Tab/Content'
import { useTranslation } from 'react-i18next'

const Modalidades = React.lazy(() => import('./_partials/Ofertas/Modalidades.tsx'))
const Servicios = React.lazy(() => import('./_partials/Ofertas/Servicios.tsx'))
const Especialidades = React.lazy(() => import('./_partials/Ofertas/Especialidades.tsx'))
const Niveles = React.lazy(() => import('./_partials/Ofertas/Niveles.tsx'))
const ModeloOfertas = React.lazy(() => import('./_partials/Ofertas/ModeloOfertas.tsx'))
const OfertasEducativas = React.lazy(() => import('./_partials/Ofertas/Ofertas.tsx'))

const Ofertas = (props) => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState(0)
  const optionsTab = [
    t('menu>configuracion>ofertas_educativas', 'Ofertas Educativas'),
    t('configuracion>ofertas_educativas>modalidades>editar>modalidad', 'Modalidades'),
    t('configuracion>ofertas_educativas>servicios>servicios', 'Servicioss'),
    t('configuracion>ofertas_educativas>especialidades>especialidades', 'Especialidades'),
    t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>ofertas_relacionadas>columna_acciones>editar>nivelese', 'Niveles'),
    t('configuracion>ofertas_educativas>modelo_de_ofertas', 'Modelo de ofertas')
  ]
  const { hasAddAccess = true, hasEditAccess = true, hasDeleteAccess = true } = props
  return (
    <div>
      <h4>
        {t('configuracion>ofertas_educativas>ofertas_educativas>ofertas_educativas', 'Ofertas Educativas')}
      </h4>
      <HeaderTab
        options={optionsTab}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <ContentTab activeTab={activeTab} numberId={activeTab}>
        {
                    {
                      0: <OfertasEducativas {...props} hasAddAccess={hasAddAccess} hasEditAccess={hasEditAccess} hasDeleteAccess={hasDeleteAccess} />,
                      1: <Modalidades {...props} hasAddAccess={hasAddAccess} hasEditAccess={hasEditAccess} hasDeleteAccess={hasDeleteAccess} />,
                      2: <Servicios {...props} hasAddAccess={hasAddAccess} hasEditAccess={hasEditAccess} hasDeleteAccess={hasDeleteAccess} />,
                      3: <Especialidades {...props} hasAddAccess={hasAddAccess} hasEditAccess={hasEditAccess} hasDeleteAccess={hasDeleteAccess} />,
                      4: <Niveles {...props} hasAddAccess={hasAddAccess} hasEditAccess={hasEditAccess} hasDeleteAccess={hasDeleteAccess} />,
                      5: <ModeloOfertas {...props} hasAddAccess={hasAddAccess} hasEditAccess={hasEditAccess} hasDeleteAccess={hasDeleteAccess} />
                    }[activeTab]
                }
      </ContentTab>
    </div>
  )
}

export default Ofertas
