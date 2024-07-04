import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import AddIcon from '@material-ui/icons/Add'
import {
  Card,
  CardBody,
  Collapse,
  Button
} from 'reactstrap'
import IconButton from '@material-ui/core/IconButton'
import styled from 'styled-components'

const OfertasEducativas = (props) => {
  const [activeOferta, setActiveOferta] = useState(false)
  const { titulo, children, showAddButton, showContent } = props

  useEffect(() => {
    setActiveOferta(showContent)
  }, [showContent])

  return (
    <Card className='pt-1 pb-1 mt-3'>
      <CardBody>
        <div className='container-icon-oferta'>
          <span>{titulo}</span>
          <div className='display-flex'>
            {activeOferta && showAddButton
              ? props.label
                ? <AddButton
                    onClick={() => {
                      props.addItem()
                    }}
                    color='primary'
                  >
                  {props.label}
                  </AddButton>
                : <label className='icon-oferta mr-1' htmlFor='icon-add'>
                  <IconButton
                    onClick={() => {
                      props.addItem()
                    }}
                    color='primary'
                    aria-label='Add'
                    component='span'
                  >
                    <AddIcon style={{ color: '#fff' }} />
                  </IconButton>
                </label>
              : null}
            <label className='icon-oferta ' htmlFor='icon-collapse-card'>
              <IconButton
                onClick={() => setActiveOferta(!activeOferta)}
                aria-expanded={activeOferta}
                color='primary' aria-label='Collapse Card'
                component='span'
              >
                {
                                    activeOferta
                                      ? <i className='simple-icon-arrow-up' />
                                      : <i className='simple-icon-arrow-down' />
                                }
              </IconButton>
            </label>
          </div>
        </div>
        <Collapse isOpen={activeOferta}>
          {children}
        </Collapse>
      </CardBody>
    </Card>
  )
}
OfertasEducativas.prototype = {
  titulo: PropTypes.string
}
OfertasEducativas.defaultProps = {
  titulo: '',
  showAddButton: true,
  showContent: false
}

const AddButton = styled(Button)`
    margin: 4px;
    height: 30px;
    margin-top: 0;
    padding-top: 4px;
`
export default OfertasEducativas
