import React, { useState } from 'react'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu
} from 'reactstrap'
import TableCheck from './TableCheck'

const ModalPerfil = ({ modalOpen, toggle }) => {
  const [openModalExpediente, setOpenModalExpediente] = useState<'' | 'see-expediente'>('')

  const [estudiante, setEstudiante] = useState([
    {
      name: 'Expediente estudiantil',
      id: 0
    },
    {
      name: 'Expediente de Centro Educativo',
      id: 1
    },
    {
      name: 'Matrícula',
      id: 2
    },
    {
      name: 'Alerta Temprana',
      id: 3
    },
    {
      name: 'Reportes',
      id: 4
    },
    {
      name: 'Usuarios',
      id: 5
    },
    {
      name: 'Configuración',
      id: 6
    }
  ])
  const [selectedExpediente, setSelectedExpediente] = useState<String>(estudiante[0].name)

  return (
    <>
      <Modal
        size='lg'
        style={{ maxWidth: '1300px', width: '100%' }}
        isOpen={modalOpen === 'see-perfil'}
        toggle={() => {
          toggle('see-perfil')
        }}
      >
        <ModalHeader>Perfiles asociados</ModalHeader>
        <ModalBody>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h4 style={{ fontWeight: 'bolder' }}>ADMINISTRADOR</h4>{' '}
            <Dropdown
              isOpen={openModalExpediente === 'see-expediente'}
              toggle={() =>
                setOpenModalExpediente((prevState) =>
                  prevState === 'see-expediente' ? '' : 'see-expediente'
                )}
            >
              <DropdownToggle caret color='primary'>
                {selectedExpediente || 'Expediente estudiantil'}
              </DropdownToggle>
              <DropdownMenu>
                {estudiante.map((item) => (
                  <DropdownItem onClick={() => { setSelectedExpediente(item.name) }}>{item.name}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
          <h6 style={{ fontWeight: 'bolder' }}>Permisos</h6>
          <div><TableCheck /></div>
        </ModalBody>
        <ModalFooter style={{ display: 'flex', justifyContent: 'center' }}>
          <Button onClick={toggle} color='primary'>
            Regresar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default ModalPerfil
