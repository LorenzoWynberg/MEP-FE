import React from 'react'
import styled from 'styled-components'

import { getContexts, getStatisticsAlerts, getStatisticsAlertsEnrollment, getStatisticsAlertsPercent, getStatisticsAlertsIncidents } from '../../../../../redux/alertaTemprana/actions'
import { useActions } from 'Hooks/useActions'
import { useSelector } from 'react-redux'

import Contextos from './Contextos'
import CantidadAlertas from './CantidadAlertas'
import AlertasDimensiones from './AlertasDimensiones'

type IProps = {};

export const Estadisticas: React.FC<IProps> = (props) => {
  const [activeYear, setActiveYear] = React.useState<number>(2021)
  const [requesting, setRequesting] = React.useState<boolean>(false)
  const actions = useActions({ getContexts, getStatisticsAlerts, getStatisticsAlertsEnrollment, getStatisticsAlertsPercent, getStatisticsAlertsIncidents })

  React.useEffect(() => {
    getAlertContexts()
    getAlerts()
  }, [])

  const getAlertContexts = async () => {
    await actions.getContexts('Interno')
    await actions.getContexts('Externo')
  }

  const getAlerts = async () => {
    await actions.getStatisticsAlerts(activeYear)
    await actions.getStatisticsAlertsEnrollment()
    await actions.getStatisticsAlertsPercent()
    await actions.getStatisticsAlertsIncidents()
  }

  const state = useSelector(store => {
    return {
      alerta: store.alertaTemprana
    }
  })

  const handleChangeYear = async (currentYear: number) => {
    setRequesting(true)
    await actions.getStatisticsAlerts(currentYear)
    setTimeout(() => {
      setRequesting(false)
    }, 200)
  }

  return (
    <Wrapper>
      <Title>Estadísticas de alerta temprana</Title>
      <Section>
        <Contextos interno={state.alerta.contextoInterno} externo={state.alerta.contextoExterno} />
        <CantidadAlertas requesting={requesting} alerts={state.alerta.countAlerts} alertsEnrollment={state.alerta.alertsEnrollment} handleChangeYear={handleChangeYear} />
        <AlertasDimensiones alertsPercent={state.alerta.alertsPercent} incidents={state.alerta.alertsIncidents} />
      </Section>
    </Wrapper>
  )
}

const Wrapper = styled.div`

`

const Title = styled.strong`
    color: #000;
    font-size: 17px;
    margin: 35px 0px 20px;
    display: block;
`

const Section = styled.div`
    margin-top: 5px;
`

export default Estadisticas
