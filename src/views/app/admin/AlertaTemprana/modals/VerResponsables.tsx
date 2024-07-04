import React from 'react'
import { ModalBody, Modal, ModalHeader, Button } from 'reactstrap'
import styled from 'styled-components'

type ResponsableProps = {
    visible: boolean;
    currentAlert: any,
    handleCancel: Function,
}

const VerResponsables: React.FC<ResponsableProps> = (props) => {
  return (
    <CustomModal
      isOpen={props.visible}
      centered
      size='md'
      backdrop
    >
      <Header>
        Ver responsbles
      </Header>
      <StyledModalBody>
        <Label>Responsable de recibir la alerta</Label>
        <Content>
          {
                        props.currentAlert.responsables.map((responsable: any, i: number) => (
                          <Button key={i} color='primary' size='sm'>{responsable.roleNombre}</Button>
                        ))
                    }
        </Content>
        <Actions>
          <Button className='mr-2' onClick={props.handleCancel} color='primary'>Cerrar</Button>
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

const Label = styled.label`
    color: #000;
    margin-bottom: 5px;
`

const Actions = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 30%;
    justify-content: space-around;
    margin: 10px auto;
`

const Content = styled.div`
    border: 1px #ddd solid;
    padding: 15px 10px;
    margin: 5px 0px 10px;
`

export default VerResponsables
