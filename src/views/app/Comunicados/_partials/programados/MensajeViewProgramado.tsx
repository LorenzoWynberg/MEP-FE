import React, { useState, useEffect } from 'react'
import { Row, Col } from 'reactstrap'
import { Colxx } from 'Components/common/CustomBootstrap'

import moment from 'moment'
import 'moment/locale/es'
import Adjuntos from '../Adjuntos'

const MensajeViewProgramado = (props) => {
  const [data, setData] = useState({
    bandejaCorreoId: 0,
    titulo: '',
    mensaje: '',
    fechaInsercion: '',
    fechaProgramado: null,
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
                {data.fechaProgramado
                  ? moment(data.fechaProgramado).locale('es').format('LLL A')
                  : ''}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>

      <hr />
      <Row>
        <Col md='12' className='box-cancel-schedule'>
          <p>
            <i className='fas fa-clock' /> Envío programado para:{' '}
            {data.fechaProgramado
              ? moment(data.fechaProgramado).locale('es').format('LL') + ' - ' + moment(data.fechaProgramado).locale('es').format('LT')
              : ''}
            <a
              style={{ cursor: 'pointer' }}
              onClick={() => {
                props.cancelarEnvio(data.bandejaCorreoId)
              }}
            >
              Cancelar envío
            </a>
          </p>
        </Col>
      </Row>
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
        <Col md='12' className='options-button' />
      </Row>
    </Colxx>
  )
}

export default MensajeViewProgramado
