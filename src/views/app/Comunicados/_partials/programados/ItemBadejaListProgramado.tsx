import React, { useState, useEffect } from 'react'
import { Row, Col, Input } from 'reactstrap'
import moment from 'moment'
import 'moment/locale/es'

const ItemBadejaListProgramado = (props) => {
  const [selected, setSelected] = useState('')

  useEffect(() => {
    const _selected =
      props.item.bandejaCorreoId === props.itemSelected.bandejaCorreoId
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
                'programados'
              )
            }}
          />
          <p style={{ paddingLeft: 8 }}>{props.item.titulo}</p>
        </Col>
        <Col md='2'>
          <div className='show-opciones-hover'>
            <i
              className='fas fa-trash'
              onClick={() => {
                props.enviarPapelera(props.item.bandejaCorreoId)
              }}
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col md='6'>
          <span>{props.item.titulo}</span>
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

export default ItemBadejaListProgramado
