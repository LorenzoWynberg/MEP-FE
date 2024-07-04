import React, { useState, useEffect } from 'react'
import { Row, Col, Input } from 'reactstrap'
import moment from 'moment'
import 'moment/locale/es'
import { useActions } from 'Hooks/useActions'
import { CambiarEstadoComunicado } from '../../../../../redux/comunicados/actions'
import { useTranslation } from 'react-i18next'

const ItemBadejaList = (props) => {
  const [selected, setSelected] = useState('')
  const [areColored, setColor] = useState(props.item.esFavorito)
  const [handleFav, setHandleFav] = useState(false)
  const { t } = useTranslation()

  const actions = useActions({ CambiarEstadoComunicado })

  useEffect(() => {
    const _selected =
      props.item.bandejaCorreoId === props.itemSelected.bandejaCorreoId
        ? 'selected'
        : ''

    setSelected(_selected)
  }, [props.item, props.itemSelected, handleFav])

  const handleChangeColor = (id, estado) => {
    setColor(estado)
    props.marcarFavorito(id, estado)
    setHandleFav(true)
  }

  return (
    <div
      className={'email-box ' + props.state + ' ' + selected}
      onClick={(e) => {
        
        if (e.target.tagName !== 'I' && e.target.tagName !== 'INPUT') {
          props.setItemSelected(props.item)
          if (props.item.estadoCodigo == '1') {
            props.marcarComoRecibido(props.item.bandejaCorreoId)
          }
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
                'recibidos'
              )
            }}
          />
          <p style={{ paddingLeft: 8 }}>{props.item.titulo}</p>
        </Col>
        <Col md='2' style={{ padding: 0 }}>
          {props.state === 'new'
            ? (
              <>
                <i
                  className='fas fa-envelope hide-opciones-hover'
                  title={t('comunicados>bandeja>nuevo', 'Nuevo')}
                />

                <div className='show-opciones-hover'>
                  <i
                    title={t('comunicados>bandeja>enviar_papelera', 'Enviar a papelera')}
                    onClick={() => {
                      props.enviarPapelera(props.item.bandejaCorreoId)
                    }}
                    className='fas fa-trash'
                  />
                  <i
                    title='Marcar como leído'
                    onClick={() => {
                      props.marcarComoRecibido(props.item.bandejaCorreoId)
                    }}
                    className='fas fa-envelope-open-text'
                  />
                </div>
              </>
              )
            : (
              <>
                <div className='show-opciones-hover'>
                  <i
                    title={t('comunicados>bandeja>enviar_papelera', 'Enviar a papelera')}
                    onClick={() => {
                      props.enviarPapelera(props.item.bandejaCorreoId)
                    }}
                    className='fas fa-trash'
                  />
                  <i className='fas fa-envelope-op  en-text' />
                  <i
                    title={t('comunicados>bandeja>marcar_no_leido', 'Marcar como no leído')}
                    className='fas fa-envelope-square'
                    onClick={() =>
                      props.marcarComoNoLeido(props.item.bandejaCorreoId)}
                  />
                </div>
              </>
              )}
        </Col>
      </Row>
      <Row>
        <Col md='8'>
          <span>{props.item.usuarioRemitenteNombre}</span>
        </Col>
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

export default ItemBadejaList
