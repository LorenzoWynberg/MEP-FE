import React from 'react'
import { ModalBody, Modal, ModalHeader } from 'reactstrap'
import styled from 'styled-components'
import colors from '../../../../../assets/js/colors'
import Error from '@material-ui/icons/ErrorOutline'

type IProps = {
    visible: boolean,
    handleModal: any,
}

const SinIdentificacion: React.FC<IProps> = (props) => {
  return (
    <CustomModal
      isOpen={props.visible}
      centered
      size='md'
      backdrop
    >
      <Header>
        <HeaderSection>
          <Error color='#000' />
          <HeaderTitle>Atención</HeaderTitle>
        </HeaderSection>
      </Header>
      <StyledModalBody>
        <Description>No se ha podido encontrar a ninguna persona con el número de identificación solicitado.</Description>
        <Description>Por favor ingrese un número de identificación válido.</Description>
        <Actions>
          <CancelButton onClick={props.handleModal}>¡Entendido!</CancelButton>
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

const HeaderSection = styled.div`
    display: flex;
    align-items: center;
`

const HeaderTitle = styled.span`
    color: #000;
    padding-left: 10px;
`

const Description = styled.p`
    color: #000;
    font-size: 14px;
`

const Actions = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 60%;
    justify-content: space-around;
    margin: 20px auto 0px;
`

const CancelButton = styled.button`
    border: 1px ${colors.secondary} solid;
    background: transparent;
    border-radius: 20px;
    color: ${colors.secondary};
    padding: 10px 20px;
    margin-right: 10px;
    cursor: pointer;
`

export default SinIdentificacion
