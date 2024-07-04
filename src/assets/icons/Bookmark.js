import React from 'react'
import styled from 'styled-components'

const Bookmar = (props) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 55 55' space='preserve' {...props}>
      <StyledAPath class='a' d='M34.941,3H9.99A4.984,4.984,0,0,0,5.025,7.99L5,47.912l17.466-7.485,17.466,7.485V7.99A5,5,0,0,0,34.941,3Z' transform='translate(7.475 4.485)' />
    </svg>
  )
}

const StyledAPath = styled.path`
    fill:#fff;
`
const StyledBPath = styled.path`
    fill:none;
`

export default Bookmar
