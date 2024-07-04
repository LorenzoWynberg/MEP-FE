import React from 'react'
import { Row, Col, ListGroup, ListGroupItem, Badge } from 'reactstrap'

const Predefinida = (props) => {
  return (
    <div className='fuente-predefinida'>
      <Row>
        <Col md={5}>
          <ListGroup className='lista'>
            {props.listasPredefinidas.map((item, i) => (
              <ListGroupItem
                className={`justify-content-between ${
                  props.optionSelected?.id === item.id
                    ? 'list-group-item-active'
                    : ''
                }`}
                onClick={() => {
                  props.handleOptionsChange('define', item)
                }}
              >
                {item.label} <Badge pill>{item.options.length}</Badge>
              </ListGroupItem>
            ))}
          </ListGroup>
        </Col>
        <Col md={7}>
          {props.optionSelected?.options
            ? (
              <div className='lista-definida'>
                <ListGroup className='lista'>
                  {props.optionSelected?.options.map((item, i) => (
                    <ListGroupItem className='justify-content-between '>
                      {item.nombre}
                    </ListGroupItem>
                  ))}
                </ListGroup>
              </div>
              )
            : (
              <div className='lista-nodefinida'>
                <h4>Elige una de las listas predeterminadas</h4>
              </div>
              )}
        </Col>
      </Row>
    </div>
  )
}

export default Predefinida
