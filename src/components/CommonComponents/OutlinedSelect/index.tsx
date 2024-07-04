import React from 'react'
import styled from 'styled-components'
import Select from 'react-select'
const OutlinedSelect = (props) => {
  return (
    <StyledSelect 
    {...props} /* {props.children} */ 
    placeholder='' 
    classNamePrefix='SelectReact'
    styles={{
      control: (styles) => ({
        ...styles,
        width: '11rem'
      })
    }}/>
  )
}

const StyledSelect = styled(Select)`
& .SelectReact-container{
		
}
& .SelectReact__control {
  border-radius: 2rem;
  background: ${props => props.theme.primary};
  color: white;
  &:hover {
    border-color: transparent;
  }
  box-shadow: none;
  min-width: 100px;
}
.SelectReact__control--is-focused {
  border: none;
}
.SelectReact__control--menu-is-open {
  border: none;
}
& .SelectReact__value-container{

}
& .SelectReact__menu{
  color:darkgray;
}
& .SelectReact__menu-list{
  
}
& .SelectReact__option{
  
}
& .SelectReact__option--is-focused{
  background: ${(props) => props.theme.primary};
  color:white;
}
& .SelectReact__option--is-selected{
  background: ${(props) => props.theme.primary};
  color:white;
}
& .SelectReact__single-value{
  color:white;
}
& .SelectReact__indicator {
  color: white;
}
& .SelectReact__dropdown-indicator {
  color: white;
}
`

export default OutlinedSelect
