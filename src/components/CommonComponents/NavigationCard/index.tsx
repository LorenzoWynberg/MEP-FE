import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
const NavigationCard = (props) => {
  return (
    <Container to={props.href}>
      <LeftSide>{props.children}</LeftSide>
      <RightSide>{props.title}</RightSide>
    </Container>
  )
}

const Container = styled(Link)`
    display: flex;
    width: 100%;
    max-width: 300px;
    margin: 16px;
    border: solid 1px ${props => props.theme.gray};
    border-radius: 14px;
    &:hover {
        cursor: pointer;
    }
`
const LeftSide = styled.div`
    display: flex;
    margin: 0;
    background: ${props => props.theme.primary};
    color: ${props => props.theme.primaryText};
    border-radius: 14px 0 0 14px;
    width: 60px;
    padding: 8px;
    
`
const RightSide = styled.div`
    display: flex;
    border-radius: 0 14px 14px 0;
    font-size: 1rem;
    align-items: center;
    margin-left: 5px;
`

export default NavigationCard
