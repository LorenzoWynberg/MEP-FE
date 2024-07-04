import React, { useState } from 'react'
import { TabContent, TabPane, Row, Col } from 'reactstrap'
import { format, parseISO } from 'date-fns'
import styled from 'styled-components'
import { useTheme } from '@material-ui/core/styles'
import NavigationContainer from 'Components/NavigationContainer'
import { useActions } from 'Hooks/useActions'
import CursosLectivosNav from './CursosLectivosNav'
import CursosLectivos from './CursosLectivos'
import Years from './Years'

import {
  setCursoLectivoActive,
  setCursoLectivoCalendarActive,
  clearCalendarsActive
} from 'Redux/cursoLectivo/actions'

import {
  setAnioEducativoSelected,
  clearNivelesOferta
} from 'Redux/anioEducativo/actions'

import { clearPeriodos } from 'Redux/periodos/actions'

const Index = (props) => {
  const theme = useTheme()
  const [currentTab, setCurrentTab] = useState(0)
  const { hasAddAccess = true, hasEditAccess = true, hasDeleteAccess = true } = props

  const actions = useActions({
    setCursoLectivoActive,
    setCursoLectivoCalendarActive,
    setAnioEducativoSelected,
    clearCalendarsActive,
    clearNivelesOferta,
    clearPeriodos
  })

  const goBack = () => {
    switch (currentTab) {
      case 1:
        setCurrentTab(0)
        props.setCurrentYear(null)
        actions.setAnioEducativoSelected(null)
        actions.setCursoLectivoActive(null)
        actions.clearCalendarsActive()
        actions.clearNivelesOferta()
        break
      case 2:
        setCurrentTab(1)
        actions.setCursoLectivoCalendarActive(null)
        actions.clearCalendarsActive()
        actions.clearPeriodos()
        actions.clearNivelesOferta()
        break
      default:
        setCurrentTab(0)
    }
  }

  return (
    <Row>
      {Boolean(currentTab !== 0) && (
        <Col xs={12}>
          <MarginStyled>
            <NavigationContainer goBack={goBack} />
          </MarginStyled>
        </Col>
      )}

      {props.currentYear?.id && (
        <Col xs={12} md={6} style={{ textAlign: 'right' }}>
          <SelectedYear color={theme.palette.primary.Index}>
            <h2 style={{}}>Año educativo: {props.currentYear.nombre}</h2>
            <p>
              Inicia:{' '}
              {props.currentYear.fechaInicio
                ? format(parseISO(props.currentYear.fechaInicio), 'dd/MM/yyyy')
                : 'No definido'}{' '}
              - Finaliza:{' '}
              {props.currentYear.fechaFin
                ? format(parseISO(props.currentYear.fechaFin), 'dd/MM/yyyy')
                : 'No definido'}
            </p>
          </SelectedYear>
        </Col>
      )}

      <Col xs={12}>
        <TabContent activeTab={currentTab} style={{ width: '100%' }}>
          <TabPane tabId={0}>
            <Years
              setCurrentTab={setCurrentTab}
              setCurrentYear={props.setCurrentYear}
              hasAddAccess={hasAddAccess}
              hasEditAccess={hasEditAccess}
              hasDeleteAccess={hasDeleteAccess}
            />
          </TabPane>
          <TabPane tabId={1}>
            {Number(currentTab) === 1 && (
              <CursosLectivos setCurrentTab={setCurrentTab} hasAddAccess={hasAddAccess} hasEditAccess={hasEditAccess} hasDeleteAccess={hasDeleteAccess} />
            )}
          </TabPane>
          <TabPane tabId={2}>
            {Number(currentTab) === 2 && <CursosLectivosNav goBack={goBack} />}
          </TabPane>
        </TabContent>
      </Col>
    </Row>
  )
}
const SelectedYear = styled.div<{ color: string }>`
  text-align: right;
  display: flex;
  justify-content: flex-start;
  align-items: baseline;
  flex-flow: column;
  padding: 10px;
  background: ${(props) => props.color};
  color: #fff !important;
  border-radius: 10px;
  width: 300px;
  margin-bottom: 15px;
`
const MarginStyled = styled.div`
  margin: 15px 0;
`

export default Index
