import React, { useState, useEffect } from 'react'
import { Row, Col, Button } from 'reactstrap'
import { Colxx } from 'Components/common/CustomBootstrap'

import moment from 'moment'
import 'moment/locale/es'
import Adjuntos from '../Adjuntos'

const MensajeView = (props) => {
  const [data, setData] = useState({
    bandejaCorreoId: 0,
    titulo: '',
    mensaje: '',
    fechaInsercion: '',
    usuarioRemitenteNombre: '',
    usuarioRemitenteEmail: ''
  })

  useEffect(() => {
    setData(props.data)
  }, [props.data])

  return (
    <Colxx xxs='9' id='mail-view-box' style={{ background: 'white' }}>
      <Row>
        <Col md='12'>
          <Row>
            <Col md='9'>
              <h2>{data.titulo}</h2>
            </Col>
            <Col md='3'>
              <div style={{ float: 'right' }} />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col md='12'>
          <Row>
            <Col md='8'>
              <div className='card-contact'>
                <img
                  src='/assets/img/profile-pic-generic.png'
                  className='mail-view-user-image'
                />
                <b>{data.usuarioRemitenteNombre}</b>
                <span>{data.usuarioRemitenteEmail}</span>
              </div>
            </Col>
            <Col md='4'>
              {' '}
              <div style={{ float: 'right' }}>
                {data.fechaInsercion
                  ? moment(data.fechaInsercion).locale('es').format('LL') + ' - ' + moment(data.fechaInsercion).locale('es').format('LT')
                  : ''}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col md='12'>
          <div
            dangerouslySetInnerHTML={{
              __html: data.mensaje
            }}
          />
        </Col>
      </Row>
      <Adjuntos adjuntos={data.adjuntos} />
      <Row>
        <Col md='12' className='options-button'>
          <Button
            color='danger'
            outline
            onClick={(e) => {
              props.actionEliminarPermanente(data.bandejaCorreoId)
            }}
          >
            Eliminar permanentemente
          </Button>
        </Col>
      </Row>
    </Colxx>
  )
}

export default MensajeView
