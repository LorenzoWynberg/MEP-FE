import React from 'react'
import { Row, Col } from 'reactstrap'
import IntlMessages from '../../../../../../../helpers/IntlMessages'
import styled from 'styled-components'

const ApoyoItem = (props) => {
  return (
    <Row>
      {props.apoyosMateriales && <Col>
        <HeaderLabelContainer>
          <IntlMessages id='apoyo.dependencies' />
        </HeaderLabelContainer>
      </Col>}
      <Col>
        <HeaderLabelContainer>
          <IntlMessages id='apoyo.types' />
        </HeaderLabelContainer>
      </Col>
      <Col>
        <HeaderLabelContainer>
          <IntlMessages id='apoyo.detail' />
        </HeaderLabelContainer>
      </Col>
      {props.apoyosMateriales && <Col>
        <HeaderLabelContainer>
          <IntlMessages id='apoyo.verified' />
        </HeaderLabelContainer>
      </Col>}
      <Col>
        <HeaderLabelContainer>
          <IntlMessages id='apoyo.dateFrom' />(requerido)
        </HeaderLabelContainer>
      </Col>
      <Col>
        <HeaderLabelContainer>
          <IntlMessages id='apoyo.dateTo' />(requerido)
        </HeaderLabelContainer>
      </Col>
      <Col xs={1} />
    </Row>
  )
}

const HeaderLabelContainer = styled.div`
    text-align: center;
`

export default ApoyoItem
