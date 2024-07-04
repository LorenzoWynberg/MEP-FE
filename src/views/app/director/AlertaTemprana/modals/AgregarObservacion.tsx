import React from 'react'
import { ModalBody, Modal, ModalHeader, Button } from 'reactstrap'
import styled from 'styled-components'

type ComentariosAlertaProps = {
    visible: boolean,
    loading: boolean,
    handleCancel: Function,
    handleSave: Function,
}

const AgregarObservaciones: React.FC<ComentariosAlertaProps> = (props) => {
  const [observations, setObservations] = React.useState<string>('')

  const handleSave = () => {
    props.handleSave(observations)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setObservations(e.target.value)
  }

  return (
    <CustomModal
      isOpen={props.visible}
      centered
      size='md'
      backdrop
    >
      <Header>
        Agregar observación
      </Header>
      <StyledModalBody>
        <Textarea value={observations} cols='3' rows='5' onChange={handleChange} />
        <Actions>
          <Button className='mr-2' onClick={props.handleCancel} color='primary' outline>Cancelar</Button>
          <Button onClick={handleSave} color='primary'>Guardar</Button>
        </Actions>
        {props.loading ? <Loading><div className='single-loading' /></Loading> : null}
      </StyledModalBody>
    </CustomModal>
  )
}

const CustomModal = styled(Modal)`
    box-shadow: none;
`

const StyledModalBody = styled(ModalBody)`
    padding: 20px 30px !important;
`

const Loading = styled.div`
    position: absolute;
    background: rgba(255, 255, 255, 0.7);
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`

const Header = styled(ModalHeader)`
    padding: 15px 30px !important;
    border-bottom-width: 1px;
    border-bottom-color: #ddd;
`

const Textarea = styled.textarea`
    color: #333;
    width: 100%;
    border-color: #ddd;
    padding: 10px;
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
    margin: 10px auto;
`

export default AgregarObservaciones
