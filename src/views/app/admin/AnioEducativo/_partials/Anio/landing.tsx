import React from 'react'
import Icon from 'Assets/icons/calendarioPreviewCursoLectivos'
import styled from 'styled-components'

interface IProps {
  txt: string
}
const Landing: React.FC<IProps> = (props) => {
  const { txt } = props
  return (
    <ContainerLanding>
      <Icon />
      <LabelStyled>{txt}</LabelStyled>
    </ContainerLanding>
  )
}

const ContainerLanding = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  flex-flow: column;
  padding: 30px 10px;
  background: #f2f2f2;
`
const LabelStyled = styled.label`
  width: 308px;
  text-align: center;
  margin: auto;
  font-size: 16px;
  margin-top: 10px;
  line-height: 16px;
`

export default Landing
