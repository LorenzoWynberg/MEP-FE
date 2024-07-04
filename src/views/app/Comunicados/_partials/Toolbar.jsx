import React from 'react'
import { Row, Col, Input } from 'reactstrap'

const Toolbar = (props) => {
  return (
    <Row
      style={{
        background: '#ffffff',
        height: 40,
        // marginTop: -10,
        marginLeft: 0
      }}
    >
      <Col col='12' id='bar-bandeja'>
        <Input
          type='checkbox'
          title='Seleccionar todos'
          id='check-select-all'
          onChange={(e) => {
            props.handleSelectItems(e.target.checked, true, null, props.bandeja)
          }}
        />

        {props.selectedItems.length > 0
          ? (
            <>
              {props.bandeja === 'papelera' || props.bandeja === 'borradores'
                ? <i
                    className='fas fa-trash'
                    title='Eliminar Definitivamente'
                    onClick={() => {
                      props.handleToolbarItem('EliminarDefinitivamente', props.bandeja)
                    }}
                  />
                : <i
                    className='fas fa-trash'
                    title='Eliminar'
                    onClick={() => {
      props.handleToolbarItem('Eliminar', props.bandeja)
    }}
                />

                }
              {props.bandeja !== 'papelera' && props.bandeja !== 'borradores'
                ? <>
                  <i
                    className=' fas fa-envelope-square'
                    title='Marcar como no leído'
                    onClick={() => {
                      props.handleToolbarItem('MarcarNoLeido', props.bandeja)
                    }}
                  />
                  <i
                    className=' fas fa-tag'
                    title='Etiquetas'
                    onClick={() => {
                      props.handleToolbarItem('Etiquetas', props.bandeja)
                    }}
                  />
                  <i
                    className=' fas fa-star'
                    title='Destacar'
                    onClick={() => {
                      props.handleToolbarItem('Destacar', props.bandeja)
                    }}
                  />
                </>
                : ''}
            </>
            )
          : (
            <i
              className='fas fa-redo-alt'
              title='Actualizar'
              onClick={() => {
                props.handleToolbarItem('Actualizar', props.bandeja)
              }}
            />
            )}
      </Col>
    </Row>
  )
}

export default Toolbar
