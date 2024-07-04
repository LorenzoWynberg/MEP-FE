import React, { useState } from 'react'
import { TabContent, TabPane, Row, Col } from 'reactstrap'
import { format, parseISO } from 'date-fns'
import styled from 'styled-components'
import { useTheme } from '@material-ui/core/styles'
import NavigationContainer from 'Components/NavigationContainer'

import CursosLectivos from './CursosLectivos'
import Years from './Years'

const Main = (props) => {
  const theme = useTheme()
  const [currentTab, setCurrentTab] = useState(0)

  const { hasAddAccess = true, hasEditAccess = true, hasDeleteAccess = true } = props

  const goBack = () => {
    setCurrentTab(0)
    props.setCurrentYear(null)
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
          <SelectedYear color={theme.palette.primary.main}>
            <h2 style={{}}>Año educativo: {props.currentYear.nombre}</h2>
            {props.currentYear.fechaInicio && (
              <p>
                Inicia:{' '}
                {format(parseISO(props.currentYear.fechaInicio), 'dd/MM/yyyy')}{' '}
                - Finaliza:{' '}
                {format(parseISO(props.currentYear.fechaFin), 'dd/MM/yyyy')}
              </p>
            )}
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
            <CursosLectivos
              currentYear={props.currentYear}
              hasAddAccess={hasAddAccess}
              hasEditAccess={hasEditAccess}
              hasDeleteAccess={hasDeleteAccess}
            />
          </TabPane>
          <TabPane tabId={2}>
            <CursosLectivos
              currentYear={props.currentYear}
              hasAddAccess={hasAddAccess}
              hasEditAccess={hasEditAccess}
              hasDeleteAccess={hasDeleteAccess}
            />
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

export default Main
