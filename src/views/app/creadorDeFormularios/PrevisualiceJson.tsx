import React from 'react'
import JSONFormParser from '../../../components/JSONFormParser/JSONFormParser.tsx'
import { withRouter } from 'react-router-dom'
import { Container, Row, Col, Button } from 'reactstrap'
import { exportToJson } from '../../../utils/JSONDownloader'
import './styles.scss'

const PrevisualiceJson = (props) => {
  const pageData = JSON.parse(localStorage.getItem('currentForm'))
  return (
    <Container>
      <Row style={{ margin: '3rem' }}>
        <Col xs={6}>
          <Button
            color='primary' onClick={() => {
              exportToJson(pageData)
            }}
          >
            Descargar
          </Button>
        </Col>
      </Row>
      <JSONFormParser
        pageData={pageData}
        mapFunctionObj={{}}
        postData={(data) => {
        }}
        putData={() => {}}
        deleteData={() => {}}
        data={[]}
        preview
        statusColor={() => {}}
      />
    </Container>
  )
}

export default withRouter(PrevisualiceJson)
