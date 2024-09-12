import React from 'react'
import { Modal, ModalHeader, ModalBody, Button, Row, Col, Container, Input, Label } from 'reactstrap'

import styled from 'styled-components'
import OptionModal from '../../../../../../components/Modal/OptionModal'

const Subsidio = (props) => {
  const { open, titulo, toggleModal } = props

  return (
    <OptionModal isOpen={open} titleHeader={titulo || 'Tipo de subsidio MEP'} onCancel={toggleModal} onConfirm={() => toggleModal(true)}>
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
      </Container>
    </OptionModal>
  )
}


export default Subsidio
