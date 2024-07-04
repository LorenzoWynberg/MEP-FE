import React from 'react'
import PropTypes from 'prop-types'

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

const MensajeModal = (props) => {
  const {
    children,
    onAceptar,
    onClose,
    openDialog,
    title,
    texto,
    action,
    btnCancel,
    pregunta,
    textoAceptar,
    password,
    loading,
    icon,
    correos
  } = props

  return (
    <Modal
      isOpen={openDialog}
      toggle={onClose}
      size='lg'
      centered
      style={{ boxShadow: 'none' }}
    >
      <ModalHeader
        className='p-3  header-custom'
        style={{
          borderBottom: '1px solid #d9d6d6;',
          paddingBottom: 10,
          width: '100%',
          fontSize: '20px'
        }}
        toggle={onClose}
      >
        <i className={'fas fa-' + icon} style={{ paddingRight: 20 }} />
        {title}
      </ModalHeader>
      <ModalBody className='pt-0'>
        <p style={{ marginTop: 10 }}>
          <div
            dangerouslySetInnerHTML={{
              __html: texto
            }}
          />
        </p>

        {correos && correos.length > 0 && (
          <p>Correos electrónicos notificados:</p>
        )}

        <ul>
          {correos.map((item) => {
            return (
              <li>
                <b>{item.label}</b>:{item.email}
              </li>
            )
          })}
        </ul>

        {children}
      </ModalBody>
      <ModalFooter className='container-center w-100 p-3 border-none'>
        {btnCancel && (
          <Button
            className='mr-3 cursor-pointer'
            outline
            onClick={() => {
              onClose()
            }}
            color='primary'
          >
            Cancelar
          </Button>
        )}
        {loading && <div className='loading loading-form ml-4' />}
        {!loading && (
          <Button
            className='mr-3 cursor-pointer'
            onClick={() => {
              btnCancel ? action() : onClose()
            }}
            color='primary'
          >
            {textoAceptar}
          </Button>
        )}
      </ModalFooter>
    </Modal>
  )
}
MensajeModal.propTypes = {
  msg: PropTypes.string,
  title: PropTypes.string,
  txtBtn: PropTypes.string,
  colorBtn: PropTypes.string,
  openDialog: PropTypes.bool,
  btnCancel: PropTypes.bool,
  onConfirm: PropTypes.func,
  onSolicitar: PropTypes.func,
  onClose: PropTypes.func
}

MensajeModal.defaultProps = {
  msg: 'dialog.deleteInfo',
  title: 'dialog.deleteTitle',
  txtBtn: 'button.remove',
  colorBtn: 'danger',
  btnCancel: true,
  openDialog: false,
  pregunta: '',
  texto: '',
  password: '',
  loading: false,
  icon: 'exclamation-circle',
  textoAceptar: '',
  onConfirm: () => {},
  onSolicitar: () => {},
  onClose: () => {},
  correos: []
}
export default MensajeModal
