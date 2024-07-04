import React from 'react'
import { Modal, Button, ModalBody, ModalHeader } from 'reactstrap'

const ModalConfirmacion = (props) => {
  const {
    numeroSolicitud,
    cancelarSolicitudTraslado,
    openModal,
    setOpenModal
  } = props

  return (
    <Modal isOpen={openModal} size='lg'>
      <ModalHeader>
        Cancelar solicitud de traslado : {numeroSolicitud}
      </ModalHeader>
      <ModalBody>
        ¿Seguro que deseas cancelar esta solicitud?
        <div className='wizard-buttons justify-content-center'>
          <Button
            color='primary'
            outline
            onClick={() => {
              setOpenModal(false)
            }}
          >
            No
          </Button>
          <Button
            color='primary'
            onClick={() => {
              cancelarSolicitudTraslado()
            }}
          >
            Aceptar
          </Button>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default ModalConfirmacion
