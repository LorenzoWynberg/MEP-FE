import React from 'react'
import { Col, Row, Container } from 'reactstrap'
import AppLayout from 'Layout/AppLayout'
import directorItems from 'Constants/directorMenu'
import EditUserForm from './EditUserForm'

const EditUser = (props) => {
  return (
    <AppLayout items={directorItems}>
      <div className='dashboard-wrapper'>
        <Container>
          <Row>
            <Col xs={12}>
              <EditUserForm />
            </Col>
          </Row>
        </Container>
      </div>
    </AppLayout>
  )
}

export default EditUser
