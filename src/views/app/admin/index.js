import React from 'react'
import { Col, Row, Container } from 'reactstrap'
import AppLayout from 'Layout/AppLayout'
import adminItems from 'Constants/adminMenu'
import RoleList from './Roles.tsx'

const ContenedorPrincipal = props => {
  return (
    <AppLayout items={adminItems}>
      <div className='dashboard-wrapper'>
        <Container>
          <Row>
            <Col xs={12}>
              <RoleList />
            </Col>
          </Row>
        </Container>
      </div>
    </AppLayout>
  )
}

export default ContenedorPrincipal
