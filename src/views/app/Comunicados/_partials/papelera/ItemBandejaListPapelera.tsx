import React, { useState, useEffect } from 'react'
import { Row, Col, Input } from 'reactstrap'
import moment from 'moment'
import 'moment/locale/es'

const ItemBandejaListPapelera = (props) => {
  const [selected, setSelected] = useState('')

  useEffect(() => {
    const _selected =
      props.item.comunicadoId === props.itemSelected.comunicadoId
        ? 'selected'
        : ''

    setSelected(_selected)
  }, [props.item, props.itemSelected])

  return (
    <div
      className={'email-box ' + props.item.state + ' ' + selected}
      onClick={(e) => {
        if (e.target.tagName !== 'I' && e.target.tagName !== 'INPUT') {
          props.setItemSelected(props.item)
        }
      }}
    >
      <Row>
        <Col md='10'>
          <Input
            className='check-item'
            type='checkbox'
            checked={props.checked}
            onClick={(e) => {
              props.handleSelectItems(
                !e.target.checked,
                false,
                props.item,
                'papelera'
              )
            }}
          />
          <p style={{ paddingLeft: 8 }}>{props.item.titulo}</p>
        </Col>
        <Col md='2'>
          <div className='show-opciones-hover'>
            <i
              title='Restaurar Mensaje'
              onClick={() => {
                props.restaurarMensaje(props.item)
              }}
              className='fas fa-trash-restore'
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
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

export default ItemBandejaListPapelera
