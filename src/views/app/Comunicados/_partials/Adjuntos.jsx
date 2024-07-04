import React, { useState, useEffect } from 'react'
import { Row, Col } from 'reactstrap'
import { formatBytes } from '../../../../utils/index'

const Adjuntos = (props) => {
  const [data, setData] = useState([])

  useEffect(() => {
    if (props.adjuntos) { setData(JSON.parse(props.adjuntos)) }
  }, [props.adjuntos])

  return (
    <>
      {data?.length > 0
        ? <Row>
          <Col md='12'>
            <hr />
            <p><b>{`${data?.length} archivo${data?.length > 1 ? 's' : ''} adjunto${data?.length > 1 ? 's' : ''}`}</b></p>
            <div id='ul-adjuntos'>
              {data?.map((item, index) => {
                return (
                  <a href={item.Url} target='_blank' rel='noopener noreferrer' title={formatBytes(item.Size)}>{item.Name} <small> ({formatBytes(item.Size)})</small> </a>
                )
              })}
            </div>
          </Col>
        </Row>
        : ''}
    </>

  )
}

export default Adjuntos
