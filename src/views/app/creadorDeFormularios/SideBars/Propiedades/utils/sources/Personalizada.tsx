import React from 'react'
import {
  Form,
  Row,
  Col,
  Input,
  InputGroup,
  InputGroupAddon
} from 'reactstrap'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'

const Personalizada = (props) => {
  const { options } = props
  return (
    <div className='fuente-personalizada'>
      <Form>
        {options.length > 0
          ? (
              options.map((item, i) => {
                return (
                  <Row>
                    <Col md={8}>
                      <InputGroup size='sm'>
                        <Input
                          type='text'
                          value={item.label}
                          placeholder='Opción'
                          onChange={(e) =>
                            props.handleOptionsChange(
                              'changetext',
                              item,
                              e.target.value
                            )}
                        />
                        <InputGroupAddon
                          addonType='append'
                          className='delete-button'
                          onClick={() =>
                            props.handleOptionsChange('delete', item.id)}
                        >
                          X
                        </InputGroupAddon>
                      </InputGroup>
                    </Col>
                  </Row>
                )
              })
            )
          : (
            <div
              className='lista-nodefinida'
              onClick={() => props.handleOptionsChange('add')}
            >
              <h4>Haz click para agregar una opción</h4>
            </div>
            )}

        <Row className='button-add'>
          <Col md={12}>
            <Fab
              color='primary'
              aria-label='add'
              onClick={() => props.handleOptionsChange('add')}
            >
              <AddIcon />
            </Fab>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default Personalizada
