import React from 'react'
import { Col, Row, Container } from 'reactstrap'
import AppLayout from 'Layout/AppLayout'
import directorItems from 'Constants/directorMenu'

const Centro = React.lazy(() => import('./Centro.tsx'))
const Direcciones = React.lazy(() => import('./Direcciones.tsx'))
const Ofertas = React.lazy(() => import('./Ofertas.tsx'))
const Supervisiones = React.lazy(() => import('./Supervisiones.tsx'))
const Mallas = React.lazy(() => import('./Mallas.tsx'))
const Periodos = React.lazy(() => import('./Periodos'))

const ContenedorPrincipal = props => {
  return (
    <AppLayout items={directorItems}>
      <div className='dashboard-wrapper'>
        <Container>
          <Row>
            <Col xs={12}>
              {
                                {
                                  0: <Centro {...props} />,
                                  1: <Ofertas {...props} />,
                                  2: <Direcciones {...props} />,
                                  3: <Supervisiones {...props} />,
                                  4: <Mallas {...props} />,
                                  5: <Periodos {...props} />
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
