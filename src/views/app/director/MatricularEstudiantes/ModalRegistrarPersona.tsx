import React from 'react'
import 'react-tagsinput/react-tagsinput.css'
import { makeStyles } from '@material-ui/core/styles'
import styled from 'styled-components'
import { IconButton } from '@material-ui/core'
import colors from '../../../../assets/js/colors'
import { Col, Modal, ModalHeader, ModalBody } from 'reactstrap'

const RegistrarPersona = React.lazy(
  () => import('../../configuracion/Identidad/RegistrarPersona')
)

const ModalRegistrarPersona = (props) => {
  const { open, toggle, onClose } = props
  return (
    <Modal isOpen={open} size='lg'>
      <ModalHeader
        toggle={() => {
          onClose(false)
        }}
      >
        {props.encargado
          ? 'Registrar nuevo encargado'
          : 'Registrar nuevo estudiante'}
      </ModalHeader>
      <ModalBody>
        <RegistrarPersona
          matricula={{
            matricula: true,
            closeModal: () => {
              onClose(false)
            }
          }}
          onRegistrarPersona={props.onRegistrarPersona}
        />
      </ModalBody>
    </Modal>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: 125,
    '& > *': {
      margin: theme.spacing(1)
    }
  },
  control: {
    padding: theme.spacing(2)
  },
  paper: {
    minHeight: 475,
    padding: 20,
    marginLeft: 10
  },
  input: {
    display: 'none'
  },
  avatar: {
    width: '150px',
    height: '150px',
    boxShadow:
      '0 1px 2px 0 rgba(0, 0, 0, 0.15), 0 1px 3px 1px rgba(0, 0, 0, 0.15) !important',
    marginRight: '0.9rem'
  },
  icon: {
    width: '70px',
    height: '70px',
    color: '#fff'
  }
}))
const StyledImgFieldsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  .fields_div {
    width: 100%;
  }
`
const StyledIconButton = styled(IconButton)`
  cursor: ${(props) => (props.isDisabled ? 'auto' : 'pointer')} !important;
  background: ${(props) => (props.isDisabled ? 'grey' : colors.primary)};
  width: 150px;
  margin-right: 0.9rem;
  height: 150px;
  &:hover {
    background-color: ${(props) => (props.isDisabled ? 'grey' : '#0c3253')};
  }
`

const CenteredRow = styled(Col)`
  display: flex;
  justify-content: center;
  align-items: center;
`
export default ModalRegistrarPersona
