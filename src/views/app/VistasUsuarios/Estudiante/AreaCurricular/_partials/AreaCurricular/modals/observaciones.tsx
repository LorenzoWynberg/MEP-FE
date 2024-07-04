import React, { useState } from 'react'
import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap'
import styled from 'styled-components'
import { MdDownload } from 'react-icons/md'

const Observaciones = ({ openModal, toggleModal, data }) => {
  const [inputValues, setInputValues] = useState({ files: '2' })
  return (
    <div>
      <Modal
        isOpen={openModal === 'see-obs'}
        toggle={() => {
          toggleModal('see-obs')
        }}
      >
        <ModalHeader>Observaciones</ModalHeader>
        <ModalBody>
          <Margin>
            <P>Fecha</P>
            {data.fecha}
          </Margin>
          <Margin>
            <P>Tipo de falta</P>
            {data.tipoFalta}
          </Margin>
          <Margin>
            <P>Tipo de incumplimiento</P>
            {data.tipoIncumplimiento}
          </Margin>
          <Margin>
            <P> Descripción de la falta:</P>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Molestiae
            labore neque soluta alias quos at ex consequuntur minus impedit vero
            omnis harum, reprehenderit unde. Iure aliquid qui consectetur
            assumenda beatae.
          </Margin>
          <div>
            <P>Archivo</P>
            {inputValues.files.length > 0 && (
              <Button color='primary'>
                <MdDownload color='#fff' size='20px' />
                Ver (
                {inputValues.files.length} archivo
                {inputValues.files.length > 1 && 's'}
                )
              </Button>
            )}
          </div>
        </ModalBody>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            onClick={() => {
              toggleModal()
            }}
            color='primary'
          >
            Cerrar
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default Observaciones

const Margin = styled.div`
  margin-bottom: 1rem;
  font-weight: bolder;
`
const P = styled.p`
  margin: 0;
  font-weight: lighter;
`
