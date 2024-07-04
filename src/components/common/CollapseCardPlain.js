import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Collapse, Button } from 'reactstrap'
import IconButton from '@material-ui/core/IconButton'
import styled from 'styled-components'

const CollapseCardPlain = (props) => {
  const [activeOferta, setActiveOferta] = useState(props.openPlain || false)
  const { titulo, children } = props

  return (
    <div className='pt-1 pb-1 mt-3'>
      <div className='container-icon-oferta-plain'>
        <span style={{ fontSize: 13, fontWeight: 'bold' }}>{titulo}</span>
        <div className='display-flex'>
          <label className='icon-oferta ' htmlFor='icon-collapse-card'>
            <IconButton
              onClick={() => setActiveOferta(!activeOferta)}
              aria-expanded={activeOferta}
              color='primary'
              aria-label='Collapse Card'
              component='span'
            >
              {activeOferta
                ? (
                  <i className='simple-icon-arrow-up' />
                  )
                : (
                  <i className='simple-icon-arrow-down' />
                  )}
            </IconButton>
          </label>
        </div>
      </div>
      <Collapse isOpen={activeOferta}>{children}</Collapse>
    </div>
  )
}
CollapseCardPlain.prototype = {
  titulo: PropTypes.string
}
CollapseCardPlain.defaultProps = {
  titulo: ''
}

const AddButton = styled(Button)`
  margin: 4px;
  height: 30px;
  margin-top: 0;
  padding-top: 4px;
`
export default CollapseCardPlain
