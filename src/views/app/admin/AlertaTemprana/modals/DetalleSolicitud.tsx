import React from 'react'
import { ModalBody, Modal, ModalHeader, Button } from 'reactstrap'
import styled from 'styled-components'

type SolicitudProps = {
    visible: boolean,
    alert: any,
    handleCancel: Function,
}

const DetalleSolicitud: React.FC<SolicitudProps> = (props) => {
  const recurso = props.alert.recursos && props.alert.recursos.length > 0 && props.alert.recursos[0] || ''
  return (
    <CustomModal
      isOpen={props.visible}
      centered
      size='md'
      backdrop
    >
      <Header>
        Detalles de la solicitud
      </Header>
      <StyledModalBody>
        <Item>
          <ItemTitle>Nombre de solicitud:</ItemTitle>
          <ItemDescription>{props.alert.nombre}</ItemDescription>
        </Item>
        <Item>
          <ItemTitle>Justifiación:</ItemTitle>
          <ItemDescription>{props.alert.justificacion}</ItemDescription>
        </Item>
        <Item>
          <ItemTitle>Descripción:</ItemTitle>
          <ItemDescription>{props.alert.justificacion}</ItemDescription>
        </Item>
        <Item>
          <ItemTitle>Archivo adjunto:</ItemTitle>
          <Enlace onClick={() => window.open(recurso.url, '_blank')}>Ver archivo</Enlace>
        </Item>
        <Actions>
          <Button onClick={props.handleCancel} color='primary' outline>Cancelar</Button>
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
`

const Header = styled(ModalHeader)`
    padding: 15px 30px !important;
    border-bottom-width: 1px;
    border-bottom-color: #ddd;
`

const Actions = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 30%;
    justify-content: space-around;
    margin: 10px auto;
`

const Item = styled.div`
    margin-bottom: 15px;
`

const ItemTitle = styled.strong`
    color: #000;
`

const ItemDescription = styled.p`
    margin: 0px;
`

const Enlace = styled.p`
    color: #000;
    font-size: 14px; 
    text-decoration: underline;
    cursor: pointer;
`

export default DetalleSolicitud
