import React from 'react'
import IntlMessages from 'Helpers/IntlMessages'
import PropTypes from 'prop-types'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap'

const AddNewModal = (props) => {
  if (props.centerOrientation) {
    return (
      <Modal isOpen={props.modalOpen} toggle={props.toggleModal}>
        <ModalHeader toggle={props.toggleModal}>
          {props.title}
        </ModalHeader>
        <ModalBody>
          {props.children}
        </ModalBody>
      </Modal>
    )
  } else {
    return (
      <div className='modal-right'>
        <Modal
          isOpen={props.modalOpen}
          toggle={props.toggleModal}
          wrapClassName='modal-right'
          className='modal-dialog-scrollable'
        >
          <ModalHeader toggle={props.toggleModal}>
            {props.title}
          </ModalHeader>
          {
            props.modalfooter
              ? <ModalBody>
                {props.children || <IntlMessages id='Contenido del modal' />}
                </ModalBody>
              : props.children || <IntlMessages id='Contenido del modal' />

          }
          {
            props.modalfooter &&
              <ModalFooter>
                <Button color='secondary' outline onClick={props.toggleModal ? props.toggleModal : () => { }}>
                  <IntlMessages id='button.cancel' />
                </Button>{' '}
                {
                !props.loading &&
                  <Button
                    color='primary'
                    disabled={props.children.props.buttonDisbled}
                    onClick={props.children.props.handleSubmit(props.children.props.onSubmit)}
                  >
                    <IntlMessages id='button.save' />
                  </Button>
              }
                {
                props.loading &&
                  <div className='loading loading-form ml-4' />
              }
              </ModalFooter>
          }
        </Modal>
      </div>
    )
  }
}
AddNewModal.propTypes = {
  modalfooter: PropTypes.bool,
  loading: PropTypes.bool
}
AddNewModal.defaultProps = {
  modalfooter: false,
  loading: false
}
export default AddNewModal
