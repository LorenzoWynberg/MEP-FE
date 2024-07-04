import React from 'react'
import { ModalBody, Modal, ModalHeader, Button } from 'reactstrap'
import styled from 'styled-components'
import PerfectScrollbar from 'react-perfect-scrollbar'

type ComentariosAlertaProps = {
    visible: boolean,
    handleModal: any,
    stepIndex: number,
    files: any,
    currentStep: any
}

const StepFiles: React.FC<ComentariosAlertaProps> = (props) => {
  const data = props.files.pasos && props.files.pasos.find(file => file.paso?.numeroPaso == props.currentStep?.numeroPaso)

  const viewFile = (url: string) => {
    window.open(url, '_blank')
  }

  return (
    <CustomModal
      isOpen={props.visible}
      centered
      size='md'
      backdrop
    >
      <Header>
        Archivos Subidos
      </Header>
      <StyledModalBody>
        <ComentariosLista>
          {
                        data && data.recursos.length > 0
                          ? data.recursos.map((file: any, i: number) => (
                            <Button key={i} color='primary' className='mb-2' outline onClick={() => viewFile(file.url)}>
                              {file.recursoTitulo}
                            </Button>
                          ))
                          : <NoResource>No hay archivos cargado</NoResource>
                    }
        </ComentariosLista>
        <Actions>
          <Button onClick={props.handleModal} color='primary'>Cerrar</Button>
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
    justify-content: center;
    display: flex;
    flex-direction: column;
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

export default StepFiles
