import React, { useState } from 'react'
import './Asistencia.css'
import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from 'reactstrap'
import styled from 'styled-components'

const ModalAsignacion = () => {
  const [modalAsignacion, setModalAsignacion] = useState(false)
  const toggle = () => {
    setModalAsignacion(!modalAsignacion)
  }

  return (
    <>
      <button onClick={toggle} className='link'>
        Ver tabla para la asignación de porcentaje
      </button>
      <Modal
        size='lg'
        style={{ maxWidth: '600px', width: '100%' }}
        isOpen={modalAsignacion}
        toggle={toggle}
      >
        <ModalHeader toggle={toggle}>
          Tabla para la asignación de porcentaje
        </ModalHeader>
        <ModalBody>
          <table>
            <thead>
              <Th0>
                Porcentaje de ausencias injustificadas del total de lecciones
                impartidas en el periodo
              </Th0>
              <Th1>Asignación de porcentaje</Th1>
            </thead>
            <tbody>
              <tr>
                <Td0>0% a menos del 1% de ausencias</Td0>
                <Td0 style={{ textAlign: 'center' }}> 10%</Td0>
              </tr>
              <tr>
                <Td1>Del 1% a menos del 10%</Td1>
                <Td1 style={{ textAlign: 'center' }}> 9%</Td1>
              </tr>
              <tr>
                <Td0>Del 10% a menos de 20%</Td0>
                <Td0 style={{ textAlign: 'center' }}> 8%</Td0>
              </tr>
              <tr>
                <Td1>Del 20% a menos del 30%</Td1>
                <Td1 style={{ textAlign: 'center' }}> 7%</Td1>
              </tr>
              <tr>
                <Td0>Del 30% a menos del 40%</Td0>
                <Td0 style={{ textAlign: 'center' }}> 6%</Td0>
              </tr>
              <tr>
                <Td1>Del 40% a menos del 50%</Td1>
                <Td1 style={{ textAlign: 'center' }}> 5%</Td1>
              </tr>
              <tr>
                <Td0>Del 50% a menos del 60%</Td0>
                <Td0 style={{ textAlign: 'center' }}> 4%</Td0>
              </tr>
              <tr>
                <Td1>Del 60% a menos del 70%</Td1>
                <Td1 style={{ textAlign: 'center' }}> 3%</Td1>
              </tr>
              <tr>
                <Td0>Del 70% a menos del 80%</Td0>
                <Td0 style={{ textAlign: 'center' }}> 2%</Td0>
              </tr>
              <tr>
                <Td1>Del 80% a menos del 90%</Td1>
                <Td1 style={{ textAlign: 'center' }}> 1%</Td1>
              </tr>
              <tr>
                <Td0>Del 90% a 100% de ausencias</Td0>
                <Td0 style={{ textAlign: 'center' }}> 0%</Td0>
              </tr>
            </tbody>
          </table>
        </ModalBody>
        <ModalFooter style={{ display: 'flex', justifyContent: 'center' }}>
          <Button color='primary' onClick={toggle}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default ModalAsignacion

const Th0 = styled.th`
  background: #145388;
  color: #fff;
  font-weight: lighter;
  height: 3rem;
  border-top-left-radius: 5px;
  border-right: 1px solid #fff;
  padding-left: 5px;
`

const Th1 = styled.th`
  background: #145388;
  color: #fff;
  font-weight: lighter;
  height: 3rem;
  border-top-right-radius: 5px;
  padding: 10px;
  text-align: center;
`

const Td0 = styled.td`
  font-weight: lighter;
  height: 2.5rem;
  padding-left: 5px;
  border-right: 2px solid rgba(236, 236, 236, 0.932);
  border-left: 2px solid rgba(236, 236, 236, 0.932);
`

const Td1 = styled.td`
  font-weight: lighter;
  background: rgba(236, 236, 236, 0.932);
  height: 2.5rem;
  padding-left: 5px;
  border-right: 2px solid rgba(236, 236, 236, 0.932);
  border-left: 2px solid rgba(236, 236, 236, 0.932);
`
