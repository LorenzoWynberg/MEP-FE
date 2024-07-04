import React from 'react'
import { Label } from 'reactstrap'
import styled from 'styled-components'

const RequiredLabel = (props) => {
  return (
    <Label for={props.for}>
      {props.optional && (
        <RequiredSpan optional>
          {' (De no poseer puede dejarlo vacio)'}
        </RequiredSpan>
      )}
      <br />
      {props.children}<span>{' *'}</span>
    </Label>
  )
}

const RequiredSpan = styled.span`
  font-size: 10px;
  color: ${(props) => (props.optional ? 'blue' : 'grey')};
`

export default RequiredLabel
