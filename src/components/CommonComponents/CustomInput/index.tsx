import React from 'react'
import styled from 'styled-components'

const CustomInput = (props) => {
  return (
    <Container>
      <Input type='checkbox' {...props} />
      <Label>{props.label}</Label>
    </Container>
  )
}
const Container = styled.div`
    display: flex;
    grid-template-columns: 1em 1fr;
    gap: 0.5em;
`
const Input = styled.input`
    /* Add if not using autoprefixer */
    -webkit-appearance: none;
    /* Remove most all native input styles */
    -moz-appearance: none;
        appearance: none;
    /* For iOS < 15 */
    background-color: white;
    /* Not removed via appearance */
    margin: 0;
    font: inherit;
    color: ${props => props.theme.primary};
    width: 1.15em;
    height: 1.15em;
    border: 0.15em solid gray;
    border-radius: 0.15em;
    transform: translateY(-0.075em);
    display: grid;
    place-content: center;
    outline: none;
    &:before {
        content: "";
        width: 0.65em;
        height: 0.65em;
        -webkit-clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
                clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
        transform: scale(0);
        transform-origin: bottom left;
        transition: 100ms transform ease-in-out;
        box-shadow: inset 1em 1em ${props => props.theme.primary};
        /* Windows High Contrast Mode */
        background-color: CanvasText;
    }
    &:checked:before {
        transform: scale(1);
    }
    &:focus {
        /*outline: max(2px, 0.15em) solid currentColor;
        outline-offset: max(2px, 0.15em);*/
    }
    
    &:disabled {
        --form-control-color: gray;
        color: gray;
        cursor: not-allowed;
    }
`
const Label = styled.label`

`

export default CustomInput
