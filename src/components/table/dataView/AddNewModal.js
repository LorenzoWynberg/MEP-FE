import React from 'react'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap'
import IntlMessages from 'Helpers/IntlMessages'

const AddNewModal = (props) => {
  if (props.centerOrientation) {
    return (
      <Modal isOpen={props.modalOpen} toggle={props.toggleModal}>
        <ModalHeader toggle={props.toggleModal}>
          <IntlMessages id='modal.modal-title' />
        </ModalHeader>
        {props.children}
      </Modal>
    )
  } else {
    return (
      <div className='modal-right'>
        <Modal
          isOpen={props.modalOpen}
          toggle={props.toggleModal}
          wrapClassName='modal-right'
          backdrop='static'
        >
          <ModalHeader toggle={props.toggleModal}>
            <IntlMessages id='pages.add-new-modal-title' />
          </ModalHeader>
          <ModalBody>
            {props.children}
          </ModalBody>
          <ModalFooter>
            <Button color='secondary' outline onClick={props.toggleModal}>
              <IntlMessages id='button.cancel' />
            </Button>
            <Button
              color='primary'
              onClick={
                props.children
                  ? props.children.props
                    ? props.children.props.handleSubmit(props.children.props.onSubmit)
                    : () => { }
                  : () => { }
              }
            >
              <IntlMessages id='button.submit' />
            </Button>{' '}
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default AddNewModal
