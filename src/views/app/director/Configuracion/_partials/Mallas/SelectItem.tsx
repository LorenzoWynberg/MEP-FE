import React from 'react'
import styled from 'styled-components'
import colors from 'Assets/js/colors'
import { maxLengthString } from 'Utils/maxLengthString'

const SelectItem = (props) => {
  return (<ItemSpan>{maxLengthString(props.item.nombre)}</ItemSpan>)
}

const ItemSpan = styled.span`
    background-color: ${colors.primary};
    padding-left: 8px;
    padding-right: 8px;
    border-radius: 15px;
    padding-top: 3%;
    text-align: center;
    height: 2rem;
`

export default SelectItem
