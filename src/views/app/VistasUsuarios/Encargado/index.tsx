import React from 'react'
import { Col, Row, Container } from 'reactstrap'
import AppLayout from 'Layout/AppLayout'
import encargadoItems from './EncargadoItems'
import { useRouteMatch } from 'react-router-dom'
import StudentList from './StudentList'
import ExpedientEstudiante from '../Estudiante/ExpedienteEstudiante'

const ContenedorPrincipal = (props) => {
  const { path, url } = useRouteMatch()
  // useVistasUsuarios()

  return (
    <AppLayout items={encargadoItems}>
      <div className='dashboard-wrapper'>
        <Container>
          <Row>
            <Col xs={12}>
              {props.active === 0 && <StudentList {...props} />}
              {props.active === 1 && <ExpedientEstudiante {...props} />}
            </Col>
          </Row>
        </Container>
      </div>
    </AppLayout>
  )
}

export default ContenedorPrincipal
