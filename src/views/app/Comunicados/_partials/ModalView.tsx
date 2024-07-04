import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

const ModalView = (props) => {
  const {
    onClose,
    open,
    title,
    action,
    btnCancel,
    textCancelar,
    textAceptar,
    loading,
    icon,
    children,
    size
  } = props

  return (
    <Modal
      isOpen={open}
      toggle={onClose}
      size={size}
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
        {icon && <i className={'fas fa-' + icon} style={{ paddingRight: 20 }} />}
        <b>{title}</b>
      </ModalHeader>
      <ModalBody className='pt-0'>{children}</ModalBody>
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
            {textCancelar}
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
            {textAceptar}
          </Button>
        )}
      </ModalFooter>
    </Modal>
  )
}

ModalView.defaultProps = {
  btnCancel: true,
  open: false,
  loading: false,
  icon: 'exclamation-circle',
  textCancelar: 'Cancelar',
  textAceptar: 'Aceptar',
  size: 'lg', // sm, lg, xl
  onClose: () => { },
  action: () => { }
}
export default ModalView
