import React from 'react'
import { ModalBody, Modal, ModalHeader, Button } from 'reactstrap'
import styled from 'styled-components'

type CerrarAlertaProps = {
    visible: boolean,
    handleModal: Function,
    handleConfirm: Function
}

const InahabilarAlerta: React.FC<CerrarAlertaProps> = (props) => {
  const [description, setDescription] = React.useState<string>('')

  const handleSave = () => {
    props.handleConfirm(description)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value)
  }

  return (
    <CustomModal
      isOpen={props.visible}
      centered
      size='md'
      backdrop
    >
      <Header>
        Inhabilitar alerta
      </Header>
      <StyledModalBody>
        <FormGroup>
          <Label>Ingrese un comentario sobre la inhabilitación de la alerta</Label>
          <Description placeholder='Agregue un comentario' rows='4' onChange={handleChange} />
        </FormGroup>
        <Actions>
          <Button className='mr-2' color='primary' outline onClick={props.handleModal}>Cancelar</Button>
          <Button color='primary' onClick={handleSave}>Guardar</Button>
        </Actions>
      </StyledModalBody>
    </CustomModal>
  )
}

const CustomModal = styled(Modal)`
    box-shadow: none;
`

const StyledModalBody = styled(ModalBody)`
    padding: 20px 30px !important;
    height: 260px;
`

const Header = styled(ModalHeader)`
    padding: 15px 30px !important;
    border-bottom-width: 1px;
    border-bottom-color: #ddd;
`

const Label = styled.label`
    color: #716d6d;
    margin-bottom: 15px;
`

const FormGroup = styled.div`
    display: block;
    margin-bottom: 15px;
`

const Description = styled.textarea`
    padding: 10px;
    width: 100%;
    border: 1px #ddd solid;
    outline: 0;
    &:focus{
        outline: 0;
    }
`

const Actions = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 30%;
    justify-content: space-around;
    margin: 0 auto;
`

export default InahabilarAlerta
