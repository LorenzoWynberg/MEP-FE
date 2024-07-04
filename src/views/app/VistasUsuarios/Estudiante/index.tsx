import React from 'react'
import { Col, Row, Container } from 'reactstrap'
import AppLayout from 'Layout/AppLayout'
import estudianteItems from './EstudianteItems'
import { useRouteMatch } from 'react-router-dom'
import ExpedienteEstudiante from './ExpedienteEstudiante'
import AreaCurricular from './AreaCurricular'
// import withAuthorization from 'Hoc/withAuthorization'
const ContenedorPrincipal = (props) => {
  const { path, url } = useRouteMatch()

  return (
    <AppLayout items={estudianteItems}>
      <div className='dashboard-wrapper'>
        <Container>
          <Row>
            <Col xs={12}>
              {props.active === 0 && <ExpedienteEstudiante {...props} />}
              {props.active === 1 && <AreaCurricular {...props} />}
            </Col>
          </Row>
        </Container>
      </div>
    </AppLayout>
  )
}

export default ContenedorPrincipal
