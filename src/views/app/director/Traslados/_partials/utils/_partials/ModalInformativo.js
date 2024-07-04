import React from 'react'
import { Modal, Button, ModalBody, ModalHeader } from 'reactstrap'
import FinalizarSolicitud from '../../FinalizarSolicitud'
import { WithWizard } from 'react-albus'

const ModalInformativo = (props) => {
  const {
    onClickPrev,
    director, // state.infoDirectorRevisor
    modalConfirmacion,
    closeModalAlert
  } = props

  return (
    <Modal isOpen size='lg'>
      <ModalHeader>{props.intl.messages['traslado.confirmTitle']}</ModalHeader>
      <ModalBody>
        <FinalizarSolicitud
          director={director}
          modalConfirmacion={modalConfirmacion}
        />
        <WithWizard
          render={({ next, previous, step, steps }) => (
            <div className='wizard-buttons ' style={{ paddingLeft: '40%' }}>
              <Button
                color='primary'
                onClick={() => {
                  closeModalAlert()
                }}
              >
                Aceptar
              </Button>
            </div>
          )}
        />
      </ModalBody>
    </Modal>
  )
}

export default ModalInformativo
