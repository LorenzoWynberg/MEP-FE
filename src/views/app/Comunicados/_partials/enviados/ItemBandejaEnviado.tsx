import React from 'react'
import { Row, Col, Input } from 'reactstrap'
import '../../../../../assets/css/sass/containerStyles/Comunicado.scss'
import moment from 'moment'
import 'moment/locale/es'

const ItemBandejaEnviado = (props) => {
  const handleClick = (item) => {
    props.handleItemSelected(item)
    props.handleIndexSelected(props.index)
  }

  return (
    <div
      className={'email-box ' + props.item.state + ' ' + props.selected}
      onClick={(e) => {
        if (e.target.tagName !== 'I' && e.target.tagName !== 'INPUT') {
          handleClick(props.item)
        }
      }}
    >
      {!props.enable ? (
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
                  'enviados'
                )
              }}
            />
            <p style={{ paddingLeft: 8 }}>{props.item.titulo}</p>
          </Col>
          <Col md='2'>
            <div className='show-opciones-hover'>
              {props.item.state === 'new'
                ? (
                  <i className='fas fa-envelope' />
                  )
                : (
                  <>
                    <i className='fas fa-envelope-open-text' />
                  </>
                  )}
            </div>
          </Col>
        </Row>
      ) : (
        <Row>
          {/* <Col md="9">
            <p>Para: {props.item.usuarioRemitenteEmail}</p>
          </Col> */}
          <Col md='10'>
            <p>{props.item.titulo}</p>
          </Col>
          <Col md='2'>
            <div className='show-opciones-hover'>
              {props.item.state === 'new'
                ? (
                  <i className='fas fa-envelope' />
                  )
                : (
                  <>
                    <i className='fas fa-envelope-open-text' />
                  </>
                  )}
            </div>
          </Col>
        </Row>
      )}
      <Row>
        {props.item.destinatarios.length > 50
          ? (
            <div>
              <Col md='8'>
                <span>
                  {' '}
                  Para:
                  {props.item.destinatarios
                    .replace('[', '')
                    .replace(']', '')
                    .replace('"', '')
                    .replace('"', '')
                    .substr(-props.item.destinatarios.length, 20) + '...'}{' '}
                </span>
              </Col>
            </div>
            )
          : (
            <div>
              <Col md='8'>
                <span>
                  {' '}
                  Para:{' '}
                  {props.item.destinatarios
                    .replace('[', '')
                    .replace(']', '')
                    .replace('"', '')
                    .replace('"', '')}
                </span>
              </Col>
            </div>
            )}
        <Col md='4'>
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

export default ItemBandejaEnviado
