import React from 'react'
import styled from 'styled-components'
import { Container } from 'reactstrap'

import HeaderTab from 'Components/Tab/Header'
import ContentTab from 'Components/Tab/Content'

import AlertasRecibidas from './Recibidas'
import AlertasEnRevision from './EnRevision'
import AlertasAprobadas from './Aprobadas'
import AlertasRechazadas from './Rechazadas'

type AlertaProps = {

}

const Solicitudes: React.FC<AlertaProps> = (props) => {
  const [activeTab, setActiveTab] = React.useState<number>(0)
  const optionsTab: Array<string> = ['Recibidas', 'En revisión', 'Aprobadas', 'Rechazadas']
  return (
    <Container>
      <Title>Solicitudes de creación de alertas</Title>
      <HeaderTab
        options={optionsTab}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <ContentTab activeTab={activeTab} numberId={activeTab}>
        {activeTab === 0 && <AlertasRecibidas {...props} />}
        {activeTab === 1 && <AlertasEnRevision {...props} />}
        {activeTab === 2 && <AlertasAprobadas {...props} />}
        {activeTab === 3 && <AlertasRechazadas {...props} />}
      </ContentTab>
    </Container>
  )
}

const Title = styled.strong`
    color: #000;
    font-size: 17px;
    margin: 15px 0px 20px;
    display: block;
`

export default Solicitudes
