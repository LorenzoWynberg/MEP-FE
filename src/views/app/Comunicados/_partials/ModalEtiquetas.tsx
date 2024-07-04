import React from 'react'

import {
  Row,
  Col,
  Input,
  FormGroup,
  Label
} from 'reactstrap'
import ModalView from './ModalView'

const ModalEtiquetas = (props) => {
  return (
    <ModalView
      open={props.openModalView}
      {...props.propsModalView}
      onClose={() => {
        props.setOpenModalView(false)
      }}
      action={() => {
        props.action()
      }}
      title='Etiquetas'
      textAceptar='Guardar'
    >
      <p className='pt-4'>Tipos de comunicados: </p>
      <Row>
        {props.tags?.map((item) => {
          return (
            <Col key={item.id} md='12'>
              <FormGroup check>
                <Label check>
                  <Input
                    checked={props.tipoTag === 0 && props.selectedTag?.id === item.id}
                    name='tag'
                    type='radio'
                    onClick={() => {
                      props.setSelectedTag(item)
                      props.setTipoTag(0)
                    }}
                  />
                  {item.nombre}
                </Label>
              </FormGroup>
            </Col>
          )
        })}
      </Row>

      <p className='pt-4'>Etiquetas personalizadas: </p>
      <Row>
        {props.customTags?.map((item) => {
          return (
            <Col key={item.id} md='12'>
              <FormGroup check>
                <Label check>
                  <Input
                    checked={props.tipoTag === 1 && props.selectedTag?.id === item.id}
                    name='tag'
                    type='radio'
                    onClick={() => {
                      props.setSelectedTag(item)
                      props.setTipoTag(1)
                    }}
                  />
                  {item.nombre}
                </Label>
              </FormGroup>
            </Col>
          )
        })}
      </Row>
    </ModalView>
  )
}

export default ModalEtiquetas
