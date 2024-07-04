import React, { useState } from 'react'
import { TabContent, TabPane, Row, Col } from 'reactstrap'
import { useSelector } from 'react-redux'
import { useTheme } from '@material-ui/core/styles'
import HeaderTab from 'Components/Tab/Header'
import Calendario from './Calendario'
import Periodos from '../Periodos/'
import Offers from '../Ofertas/Offers'
import { useTranslation } from 'react-i18next'

const CursosLectivosNav = (props) => {
  const { t } = useTranslation()

  const theme = useTheme()
  const [currentTab, setCurrentTab] = useState(0)

  const state = useSelector((store: any) => {
    return {
      currentCalendar: store.cursoLectivo.calendarioActivo,
      currentCursoElectivo: store.cursoLectivo.cursoLectivoActivo,
      currentYear: store.educationalYear.anioEducativoSeleccionado
    }
  })
  const options = [t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>datos_generales', 'Datos generales'), t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>periodos', 'Periodos'), t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>ofertas_relacionadas', 'Ofertas relacionadas')]
  return (
    <Row>
      <Col xs={12}>
        <h3>{`${t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>cursos_lectivos', 'Cursos lectivos')} > ${state.currentCursoElectivo?.nombre} > ${t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>calendarios_asociados', 'Calendarios asociados')}`}</h3>
        <p>
          {t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>mensaje', 'En esta sección se debe configurar los diferentes cursos lectivos que conforman el año educativo.')}
        </p>
        <br />
      </Col>
      <Col xs={12}>
        <HeaderTab
          options={options}
          activeTab={currentTab}
          setActiveTab={setCurrentTab}
          setParentTab={props.setCurrentTab}
        />
      </Col>
      <Col xs={12}>
        <TabContent activeTab={currentTab} style={{ width: '100%' }}>
          <TabPane tabId={0}>
            <Calendario goBack={props.goBack} />
          </TabPane>
          <TabPane tabId={1}>
            <Periodos setCurrentTab={setCurrentTab} setCurrentYear={() => {}} />
          </TabPane>
          <TabPane tabId={2}>
            <Offers match={{}} />
          </TabPane>
        </TabContent>
      </Col>
    </Row>
  )
}

export default CursosLectivosNav
