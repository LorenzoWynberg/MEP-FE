import React from 'react'
import styled from 'styled-components'
import colors from 'assets/js/colors'

const SelectItem = (props) => {
  return (<ItemSpan>{props.item.nombre}</ItemSpan>)
}

const ItemSpan = styled.span`
    background-color: ${colors.primary};
    padding-left: 8px;
    padding-right: 8px;
    border-radius: 15px;

`

export default SelectItem
