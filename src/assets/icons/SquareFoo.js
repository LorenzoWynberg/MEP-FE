import React from 'react'
import styled from 'styled-components'

const SquareFoot = (props) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 55 55' space='preserve' {...props}>
      <g transform='translate(0.142 0.059)'>
        <StyledARect width='60' height='60' transform='translate(-0.142 -0.059)' />
        <g transform='translate(9.98 9.98)'>
          <StyledBPath d='M38.083,38.083l-2.645,2.645-1.772-1.772,2.645-2.645-4.84-4.84-2.645,2.645-1.772-1.772L29.7,29.7l-4.84-4.84L22.214,27.5l-1.772-1.772,2.645-2.645-4.865-4.865-2.645,2.645L13.806,19.1,16.45,16.45l-4.84-4.84L8.965,14.255,7.194,12.483,9.839,9.839,4,4V38.931a5,5,0,0,0,4.99,4.99H43.921Zm-26.6-1.647V22.064L25.857,36.436Z' transform='translate(-4 -4)' />
        </g>
      </g>
    </svg>

  )
}

const StyledARect = styled.rect`
    fill:none;
`
const StyledBPath = styled.path`
    fill:#fff;
`

export default SquareFoot
