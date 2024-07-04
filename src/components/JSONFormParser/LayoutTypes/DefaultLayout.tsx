import React from 'react'
import { Col } from 'reactstrap'

const LayoutContainer = props => {
  const { currentLayout, children, parentIsRow, className } = props

  return (
    <Col
      key={currentLayout.i || currentLayout.id}
      className={currentLayout.config.relleno && 'bg-white__radius'}
      md={currentLayout.config.size || 6}
    >
      {children}
    </Col>
  )
}

export default LayoutContainer
