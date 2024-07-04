import React from 'react'
import { Modal, Button, ModalBody, ModalHeader } from 'reactstrap'

const ModalFaltaInformacion = (props) => {
  const { openModal, setOpenModal } = props

  return (
    <Modal isOpen={openModal} size='lg'>
      <ModalHeader>Alerta, Falta información</ModalHeader>
      <ModalBody>
        Para poder finalizar el proceso de traslado, debe completar los datos
        del nivel de la oferta académica donde se ubicará el estudiante.
        <div className='wizard-buttons justify-content-center'>
          <Button
            color='primary'
            onClick={() => {
              setOpenModal(false)
            }}
          >
            Aceptar
          </Button>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default ModalFaltaInformacion
