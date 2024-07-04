import React from 'react'
import { Row, Container } from 'reactstrap'
import styled from 'styled-components'

import HeaderTab from '../../../../../components/Tab/Header'
import ContentTab from '../../../../../components/Tab/Content'

import InvitacionesEnviadas from './InvitacionesEnviadas.tsx'
import UsuariosRegistrados from './UsuariosRegistrados.tsx'

type InvitacionesProps = {}

type IState = {}

const Invitaciones: React.FC<InvitacionesProps> = (props) => {
  const [activeTab, setActiveTab] = React.useState<number>(0)
  const optionsTab: Array<string> = [
    'Invitaciones enviadas',
    'Usuarios registrados'
  ]
  return (
    <Container>
      <Row>
        <Title>Invitaciones</Title>
        <HeaderTab
          options={optionsTab}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <TabsSections>
          <ContentTab activeTab={activeTab} numberId={activeTab}>
            {activeTab === 0 && <InvitacionesEnviadas {...props} />}
            {activeTab === 1 && <UsuariosRegistrados {...props} />}
          </ContentTab>
        </TabsSections>
      </Row>
    </Container>
  )
}

const Title = styled.h1`
	color: #000;
	width: 100%;
	margin: 0;
	padding-bottom: 0;
`

const TabsSections = styled.div`
	display: block;
	width: 100%;
`

export default Invitaciones
