import React, { useState, useEffect } from 'react'
import {
  Row, Col, Button, Card,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Tooltip
} from 'reactstrap'
import { Colxx } from 'Components/common/CustomBootstrap'
import MensajeEdit from '../MensajeEdit'

import moment from 'moment'
import 'moment/locale/es'
import '../../../../../assets/css/sass/containerStyles/Carpetas.scss'
import Adjuntos from '../Adjuntos'
import { ScrollToBottom } from '../../../../../utils/index'

const MensajeView = (props) => {
  const [data, setData] = useState({
    titulo: '',
    mensaje: '',
    fechaInsercion: '',
    usuarioRemitenteNombre: '',
    usuarioRemitenteEmail: ''
  })
  const [reply, setReply] = useState(false)
  const [resend, setReSend] = useState(false)
  const [areColored, setColor] = useState(props.data.esFavorito)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [printer, setPrinter] = React.useState<boolean>(false)
  useEffect(() => {
    setData(props.data)
    setReply(false)
    setReSend(false)
  }, [props.data])
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const toggle = () => setTooltipOpen(!tooltipOpen)
  const [tooltipOpens, setTooltipOpens] = useState(false)

  const toggles = () => setTooltipOpens(!tooltipOpens)
  const handleChangeColor = (id, estado) => {
    setColor(estado)
    props.marcarFavorito(id, estado)
  }
  const handlePrint = () => {
    const printContents = document.getElementById('cuerpoEmail').innerHTML
    const w = window.open()
    w.document.write(printContents)
    w.document.close()
    w.focus()
    w.print()
    w.close()
    return true
  }

  return (
    <Colxx xxs='9' id='mail-view-box' style={{ background: 'white' }}>
      <Row>
        <Col md='12'>
          <Row>
            <Col md='9'>
              <h2>{data.titulo}</h2>
            </Col>
            <Col md='3'>
              <div style={{ float: 'right' }}>
                <Tooltip
                  placement='auto'
                  isOpen={tooltipOpens}
                  target='favorito'
                  toggle={toggles}
                >
                  Destacar
                </Tooltip>

                <Tooltip
                  placement='auto'
                  isOpen={tooltipOpen}
                  target='responder'
                  toggle={toggle}
                >
                  Responder
                </Tooltip>

                <i
                  id='favorito'
                  className='fas fa-star'
                  onClick={() =>
                    handleChangeColor(props.data.bandejaCorreoId, !areColored)}
                  style={
                    props.data.esFavorito
                      ? { color: '#145388' }
                      : { color: 'grey' }
                  }
                />
                <i
                  id='responder'
                  className='fas fa-reply'
                  onClick={(e) => {
                    setReply(!resend)
                    setReSend(false)
                    if (!resend) {
                      ScrollToBottom()
                    }
                  }}
                />
                <Dropdown
                  isOpen={dropdownOpen}
                  toggle={() => setDropdownOpen(!dropdownOpen)}
                >
                  <DropdownToggle className='btnDropDownComu'>
                    <div
                      className='tresPuntosComu'
                      style={{ color: '#1a1c1f' }}
                    >
                      <i className='fas fa-ellipsis-v' />
                    </div>
                  </DropdownToggle>
                  <div className='dropClass'>
                    <DropdownMenu>
                      <DropdownItem
                        onClick={() => {
                          setReply(!reply)
                          setReSend(false)
                          if (!reply) {
                            ScrollToBottom()
                          }
                        }}
                      >
                        Responder
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => {
                          setReSend(!resend)
                          setReply(false)
                          if (!reply) {
                            ScrollToBottom()
                          }
                        }}
                      >
                        Reenviar
                      </DropdownItem>
                      <DropdownItem onClick={handlePrint}>
                        Imprimir
                      </DropdownItem>
                      <DropdownItem
                        onClick={() =>
                          props.enviarPapelera(props.data.bandejaCorreoId)}
                      >
                        Eliminar
                      </DropdownItem>
                    </DropdownMenu>
                  </div>
                </Dropdown>
              </div>
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
        <Col id='cuerpoEmail' md='12'>
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
            color='primary'
            outline
            onClick={(e) => {
              setReply(!reply)
              setReSend(false)
              if (!reply) {
                ScrollToBottom()
              }
            }}
          >
            <i className='fas fa-reply' />
            Responder
          </Button>
          <Button
            color='primary'
            outline
            onClick={(e) => {
              setReSend(!resend)
              setReply(false)
              if (!resend) {
                ScrollToBottom()
              }
            }}
          >
            <i className='fas fa-arrow-right' />
            Reenviar
          </Button>
        </Col>
      </Row>
      <Row>
        {reply && (
          <Col md='12' className='pt-4'>
            <Card className='pb-3'>
              <MensajeEdit
                onSendMensaje={() => {
                  setReply(false)
                }}
                onSendMensajeBorrador={() => {}}
                data={{}}
                snackBarShow={props.snackBarShow}
                to={[data.usuarioRemitenteEmail]}
                subject={'RE: ' + data.titulo}
                replyMensajeId={props.data.id}
                minHeight={250}
                onTrashIcon={() => setReply(false)}
              />
            </Card>
          </Col>
        )}

        {resend && (
          <Col md='12' className='pt-4'>
            <Card className='pb-3'>
              <MensajeEdit
                onSendMensaje={() => {
                  setReSend(false)
                }}
                onSendMensajeBorrador={() => {}}
                data={{}}
                snackBarShow={props.snackBarShow}
                to={[]}
                subject={'RV: ' + data.titulo}
                minHeight={250}
                onTrashIcon={() => setReSend(false)}
              />
            </Card>
          </Col>
        )}
      </Row>
    </Colxx>
  )
}

export default MensajeView
