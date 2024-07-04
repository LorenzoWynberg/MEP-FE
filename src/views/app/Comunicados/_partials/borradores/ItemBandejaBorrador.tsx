import React from 'react'
import { Row, Col, Input } from 'reactstrap'
import '../../../../../assets/css/sass/containerStyles/Comunicado.scss'
import moment from 'moment'
import 'moment/locale/es'
import { maxLengthString } from 'Utils/maxLengthString'

const ItemBandeja = (props) => {
  const handleClick = (item) => {
    props.handleItemSelected(item)
    props.handleIndexSelected(props.index)
  }
  return (
    <div
      className={'email-box ' + props.item.state + ' ' + props._selected}
      onClick={(e) => {
        if (e.target.tagName !== 'I' && e.target.tagName !== 'INPUT') {
          handleClick(props.item)
        }
      }}
    >
      {!props.enable
        ? (
          <Row>
            <Col md='10'>
              <Input
                className='check-item'
                type='checkbox'
                checked={props.checked}
                onClick={(e) => {
                  props.handleSelectItems(
                    e.target.checked,
                    false,
                    props.item,
                    'borradores'
                  )
                }}
              />
              <p style={{ paddingLeft: 8 }} className='hover-on'>
                {props.item.titulo}
              </p>
            </Col>
            <Col md='10'>
              <p style={{ paddingLeft: 8 }} className='hover-off'>
                Borrador
              </p>
            </Col>
            <Col md='2'>
              <div className='show-opciones-hover'>
                <i
                  title='Eliminar definitivamente'
                  onClick={() => {
                    props.actionEliminarPermanente(props.item.bandejaCorreoId)
                  }}
                  className='fas fa-trash'
                />
              </div>
            </Col>
          </Row>
          )
        : (
          <Row>
            <Col md='10'>
              <p>Para: {maxLengthString(props.item.destinatarios ? JSON.parse(props.item.destinatarios) : 'Sin destinatarios')}</p>
            </Col>

            <Col md='2'>
              <div className='show-opciones-hover'>
                <i
                  title='Eliminar definitivamente'
                  onClick={() => {
                    props.actionEliminarPermanente(props.item.bandejaCorreoId)
                  }}
                  className='fas fa-trash'
                />
              </div>
            </Col>
          </Row>
          )}
      <Row>
        <Col md='6'>
          <span>{props.item.usuarioRemitenteNombre}</span>
        </Col>
        <Col md='6'>
          <span>
            {moment().format('DDMMYYYY') ===
            moment(props.item.fechaInsercion).format('DDMMYYYY')
              ? moment(props.item.fechaInsercion).format('hh:mm  A')
              : moment(props.item.fechaInsercion)
                .locale('es')
                .format('D MMM YYYY')}
          </span>
        </Col>
      </Row>
    </div>
  )
}

export default ItemBandeja
