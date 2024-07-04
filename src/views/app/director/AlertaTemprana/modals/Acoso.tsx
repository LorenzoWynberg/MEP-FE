import React from 'react'
import { ModalBody, Modal, ModalHeader } from 'reactstrap'
import styled from 'styled-components'

import colors from '../../../../../assets/js/colors'

type AcosoProps = {
    visible: boolean,
    handleModal: any,
    title: string
}

const CerrarAlerta: React.FC<AcosoProps> = (props) => {
  return (
    <CustomModal
      isOpen={props.visible}
      centered
      size='md'
      backdrop
    >
      <StyledModalBody>
        <Title>Acoso y hostigamineto</Title>
        <Description>Persona estudiante que recibe acoso y hostigamiento sexual en el ambiente estudiantil, este incluye toda acción que se realice aislada o reiteradamente, escrita o verbal, gestual o física, indeseada para la persona estudiante, que provoca una interferencia substancial en el desempeño de su aprendizaje, creado un ambiente de trabajo o de estudio hostil, intimidante o discriminatorio.</Description>
        <ConfirmButton>Activar Alerta</ConfirmButton>
      </StyledModalBody>
    </CustomModal>
  )
}

const CustomModal = styled(Modal)`
    box-shadow: none;
    & .modal-content{
        border-radius: 10px;
    }
`

const StyledModalBody = styled(ModalBody)`
    padding: 20px 30px !important;
    border-radius: 5px !important;
`

const Title = styled.h4`
    color: ${colors.primary};
    text-decoration: underline;
    text-align: center;
    font-weight: bold;
    margin-top: 10px;
    margin-bottom: 20px;
`

const Description = styled.p`
    margin: 0;
`

const Header = styled(ModalHeader)`
    padding: 15px 30px !important;
    border-bottom-width: 1px;
    border-bottom-color: #ddd;
`

const ConfirmButton = styled.button`
    background: ${colors.primary};
    border-radius: 20px;
    color: #fff;
    border: 0;
    padding: 10px 20px;
    cursor: pointer;
    margin: 30px auto;
    display: block;
`

export default CerrarAlerta
