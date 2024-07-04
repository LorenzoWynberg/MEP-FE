import React from 'react'
import styled from 'styled-components'
const Button = (props) => {
  return <DefButton {...props}>{props.children}</DefButton>
}
interface IProp {
	outline: boolean
}
const DefButton = styled.button<IProp>`
    ${(props: any) => {
		if (props.outline) {
 return `
			border: 1px solid ${props.theme.primary};
			background: white;
			color: black;
		`
} else {
 return `
			background: ${props.theme.primary}};
			border-style: none;
			color: white;
		`
}
	}}
    
    border-radius: 8px;
    padding: 12px 16px;
    /*width: 100%;*/
    flex-basis: fit-content;
    
`

export default Button
