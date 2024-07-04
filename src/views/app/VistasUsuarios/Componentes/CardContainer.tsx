import React from 'react'
import styled from 'styled-components'
interface IProps {
    children?:any
}
const CardContainer:React.FC<IProps> = ({ children }) => {
  return (
    <CardDiv>
      {children}
    </CardDiv>
  )
}

const CardDiv = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 10px;
    margin-bottom: 2.5rem;
    margin-top: 1rem;
`

export default CardContainer
