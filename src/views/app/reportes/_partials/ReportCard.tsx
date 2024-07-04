import React from 'react'
import styled from 'styled-components'

interface IProp {
	titulo: string
	descripcion: string
	onClick: Function
}

const ReportCard: React.FC<IProp> = (props) => {
  const { titulo, descripcion, onClick } = props
  return (
    <Card onClick={onClick && (e => onClick(e))}>
      <Titulo>{titulo}</Titulo>
      <Descripcion>{descripcion}</Descripcion>
    </Card>
  )
}

const Card = styled.div`
	border-radius: 15px;
	width: 100%;
	background: ${props => props.theme.primary};/*linear-gradient(to right, #2c5885, #3b6e9c);*/
	padding: 20px;
	cursor: pointer;
`

const Titulo = styled.span`
    font-size: 1rem;
	color: WHITE;
	text-transform: uppercase;
	font-weight: bold;
`

const Descripcion = styled.p`
	margin-top: 1rem;
	color: WHITE;
`

export default ReportCard
