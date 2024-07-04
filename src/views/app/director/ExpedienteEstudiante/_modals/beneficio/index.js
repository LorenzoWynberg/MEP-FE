import React from 'react'
import { Modal, ModalHeader, ModalBody, Button, Row, Col, Container, Input, Label } from 'reactstrap'

import styled from 'styled-components'

const Subsidio = (props) => {
  const { open, titulo, toggleModal } = props

  return (
    <div>
      <Modal
        isOpen={open} toggle={() => {
          toggleModal()
        }} size='lg'
      >
        <ModalHeader toggle={() => {
          toggleModal()
        }}
        >Tipo de subsidio MEP
        </ModalHeader>
        <ModalBody>
          <Container className='modal-detalle-subsidio'>
            <Row>
              <Col xs={12}>
                {props.tipos.map((item) => {
                  return (
                    <Row>
                      <Col xs={3} className='modal-detalle-subsidio-col'>
                        <div>
                          <Label className='cursor-pointer'>
                            <Input
                              type='radio'
                              inline
                              onClick={() => props.handleChangeSubsidio(item)}
                              checked={props.currentSubsidio.id === item.id}
                            />

                            <p>{item.nombre}</p>
                          </Label>
                        </div>
                      </Col>
                      <Col xs={9} className='modal-detalle-subsidio-col'>
                        <div>
                          <p>
                            {item.detalle
                              ? item.detalle
                              : item.descripcion ? item.descripcion : 'Elemento sin detalle actualmente'}
                          </p>
                        </div>
                      </Col>
                    </Row>
                  )
                })}
              </Col>
            </Row>
            <Row>
              <CenteredCol xs='12'>
                <Button
                  onClick={() => {
                    toggleModal()
                  }}
                  color='primary'
                  outline
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    toggleModal(true)
                  }}
                  color='primary'
                >
                  Guardar
                </Button>
              </CenteredCol>
            </Row>
          </Container>
        </ModalBody>
      </Modal>
    </div>
  )
}

const CenteredCol = styled(Col)`
  display: flex;
  justify-content: center;
  align-items: center;
`

export default Subsidio
