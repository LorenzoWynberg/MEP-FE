import React from 'react'
import styled from 'styled-components'

interface IProps {
    picture?:string|Object
    fullname?:string
}

const UserPicAndName:React.FC<IProps> = (props) => {
  return (
    <MainContainer>
      <Leftside />
      <Rightside>{props.fullname}</Rightside>
    </MainContainer>
  )
}

const MainContainer = styled.div`
	display: flex;
	border-radius: 10px;
	overflow: hidden;
	border: 1px solid ${props => props.theme.primary};
	margintop: 1rem;
`
const Leftside = styled.div`
    background-color: ${props => props.theme.primary};
    padding: 1.5rem;
    width: 30%;
`
const Rightside = styled.div`
    margin-left: 1rem;
    justify-content: flex-start;
    align-items: center;
    display: flex;
    width: 100%;
`

export default UserPicAndName
