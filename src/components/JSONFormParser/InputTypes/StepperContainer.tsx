import React from 'react'
import { DisplayField } from '../utils/fieldsFunction.tsx'
import styled from 'styled-components'

const StepperContainer = (props) => {
  return (
    <StyledContainer direction={props.direction}>
      {props.fields.map((field) => {
        return <DisplayField field={field} {...props} />
      })}
    </StyledContainer>
  )
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: ${(props) => props.direction};
  justify-content: space-around;
  align-items: flex-start;
  flex-wrap: wrap;
  min-height: 344px;
`

export default StepperContainer
