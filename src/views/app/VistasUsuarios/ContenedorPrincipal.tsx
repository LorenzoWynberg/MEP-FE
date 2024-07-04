import React from 'react'
import { Col, Row, Container } from 'reactstrap'
import AppLayout from 'Layout/AppLayout'
import encargadoItems from './EncargadoItems'
import { useRouteMatch } from 'react-router-dom'

const ContenedorPrincipal = (props) => {
  const { path, url } = useRouteMatch()

  return (
    <AppLayout items={encargadoItems}>
      <div className='dashboard-wrapper'>
        <Container>
          <Row>
            <Col xs={12}>
              {
								{
								  /*
                                    0: <Inicio {...props}/>,
                                    1: <General {...props}/>,
                                    2: <Ofertas {...props}/>,
                                    3: <RecursoHumano {...props}/>,
                                    4: <Horarios {...props}/>,
                                    5: <Infraestructura {...props}/>,
                                    6: <OrganizacionAuxiliar {...props}/>,
                                    7: <Estadistica {...props}/>,
                                    8: <Grupos {...props}/>,
                                    9: <NormativaInterna {...props}/>, */
								}[props.active]
							}
            </Col>
          </Row>
        </Container>
      </div>
    </AppLayout>
  )
}

export default ContenedorPrincipal
