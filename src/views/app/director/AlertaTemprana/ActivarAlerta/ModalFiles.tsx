import React from 'react'
import { ModalBody, Modal, ModalHeader, Button } from 'reactstrap'
import styled from 'styled-components'
import PerfectScrollbar from 'react-perfect-scrollbar'
import DeleteIcon from '@material-ui/icons/Delete'
import FileIcon from '@material-ui/icons/AttachFile'

type ComentariosAlertaProps = {
    visible: boolean,
    handleModal: any,
    files: any,
    handleDelete: Function
}

const ModalFiles: React.FC<ComentariosAlertaProps> = (props) => {
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
                        props.files && props.files.length > 0
                          ? props.files.map((file: any, i: number) => (
                            <FileItem key={i}>
                              <Resource onClick={() => viewFile(file.url)}>
                                <FileIcon />
                                <FileName>{file.titulo}</FileName>
                              </Resource>
                              <DeleteAction onClick={() => props.handleDelete(i)} />
                            </FileItem>

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

const FileItem = styled.div`
    flex-direction: row;
    justify-content: space-between;
    display: flex;
`

const Resource = styled.strong`
   color: #145388;
   cursor: pointer;
   display: flex;
   align-items: center;
`

const FileName = styled.span`
    padding-left: 5px;
`

const DeleteAction = styled(DeleteIcon)`
    color: #cf2c2c;
    cursor: pointer;
`

export default ModalFiles
