import React from 'react'
import { ModalBody, Modal, ModalHeader, Button } from 'reactstrap'
import styled from 'styled-components'
import PerfectScrollbar from 'react-perfect-scrollbar'

type ComentariosAlertaProps = {
    visible: boolean,
    handleModal: any,
    currentAlert: any
}

const Normativas: React.FC<ComentariosAlertaProps> = (props) => {
  return (
    <CustomModal
      isOpen={props.visible}
      centered
      size='md'
      backdrop
    >
      <Header>
        Normativas
      </Header>
      <StyledModalBody>
        <ComentariosLista>
          {
                        props.currentAlert && props.currentAlert.normativas && props.currentAlert.normativas.length > 0
                          ? props.currentAlert.normativas.map((normativa: any, i: number) => (
                            <Comentario key={i}>
                              <Nombre>{normativa.nombre}</Nombre>
                              <Enlace onClick={() => {
                                if (normativa.url !== null) {
                                  window.open(normativa.url, '_blank')
                                }
                              }}
                              >Enlance
                              </Enlace>
                            </Comentario>
                          ))
                          : <NoResource>No hay ninguna observación asignada</NoResource>
                    }
        </ComentariosLista>
        <Actions>
          <Button onClick={props.handleModal} color='primary' outline>Cerrar</Button>
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

const ComentariosLista = styled(PerfectScrollbar)`
    padding: 20px 0px;
`

const Comentario = styled.div`
    display: grid;
    grid-template-columns: 40% 50%;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px #ddd solid;
    padding: 15px 0 0;
    &:first-child{
        padding: 0;
    }
    &:last-child{
        border-bottom: none;
    }
`

const Nombre = styled.span`color: #000; align-self: flex-start;;`

const Enlace = styled.p`
    color: #000;
    font-size: 16px; 
    text-decoration: underline;
    cursor: pointer;
`

const NoResource = styled.span`
    color: #000;
    text-align: center;
    display: block;
    font-size: 15px;
`

const Actions = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 30%;
    justify-content: space-around;
    margin: 10px auto;
`

export default Normativas
