import React from 'react'
import { Row, Col, ListGroup, ListGroupItem, Badge } from 'reactstrap'
import IntlMessages from 'Helpers/IntlMessages'
import { injectIntl } from 'react-intl'

const FromDB = (props) => {
  const { messages } = props.intl
  return (
    <div className='fuente-predefinida'>
      <Row>
        <Col md={5}>
          <ListGroup className='lista'>
            {Object.keys(props.selects).map((item) => {
              const catalogo = props.selects[item]
              const label = `catalogo.${item}`

              return (
                <ListGroupItem
                  className={`justify-content-between ${
                    props.optionSelected?.id === item
                      ? 'list-group-item-active'
                      : ''
                  }`}
                  onClick={() => {
                    props.handleOptionsChange('definedb', {
                      id: item,
                      label: messages[label],
                      options: catalogo
                    })
                  }}
                >
                  <IntlMessages id={label} />{' '}
                  <Badge pill>{catalogo.length}</Badge>
                </ListGroupItem>
              )
            })}
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
                <h4>Elige una de las listas</h4>
              </div>
              )}
        </Col>
      </Row>
    </div>
  )
}

export default injectIntl(FromDB)
