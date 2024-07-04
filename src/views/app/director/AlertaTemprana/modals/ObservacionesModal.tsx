import React from 'react'
import { ModalBody, Modal, ModalHeader, Button } from 'reactstrap'
import styled from 'styled-components'
import PerfectScrollbar from 'react-perfect-scrollbar'
import moment from 'moment'

type ComentariosAlertaProps = {
    visible: boolean,
    handleCancel: Function,
    observaciones: any,
}

const Observaciones: React.FC<ComentariosAlertaProps> = (props) => {
  return (
    <CustomModal
      isOpen={props.visible}
      centered
      size='lg'
      backdrop
    >
      <Header>
        Observaciones
      </Header>
      <StyledModalBody>
        <ComentariosLista>
          {
                        props.observaciones && props.observaciones.length > 0
                          ? props.observaciones.map((observacion: any, i: number) => (
                            <Comentario key={i}>
                              <Fecha>{moment(observacion.fechaInsercion).format('DD.MM.YYYY')}</Fecha>
                              <Informacion>
                                <Descripcion>{observacion.observacion}</Descripcion>
                              </Informacion>
                            </Comentario>
                          ))
                          : <NoResource>No hay ninguna observación asignada</NoResource>
                    }
        </ComentariosLista>
        <Actions>
          <Button onClick={props.handleCancel} color='primary' outline>Cerrar</Button>
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
    grid-template-columns: 15% 80%;
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

const Fecha = styled.span`color: #000; align-self: flex-start;;`

const Informacion = styled.div`
    color: #000;
`

const Descripcion = styled.p`color: #000;font-size: 16px;`

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

export default Observaciones
