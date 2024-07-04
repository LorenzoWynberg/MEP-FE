import React from 'react'
import Card from '@material-ui/core/Card'
import styled from 'styled-components'
import IconDimex from 'Assets/icons/RegisterPersonDimex'
import IconCedula from 'Assets/icons/RegisterPersonCedulaEjemplo'
//import IconCedulaNuevo from 'Assets/icons/ID.png'
import IconYisro from 'Assets/icons/RegisterPersonYiro'
import colors from 'Assets/js/colors'

interface IProps {
	id?: number
	isSelected: boolean
	type: string
	title: string
	desciption: string
	onClick: Function
}
const ItemNavRegistrarPersona: React.FC<IProps> = (props) => {
	const { type, title, desciption, id, onClick, isSelected } = props
	return (
		<Card className="mb-5">
			<CardContent
				onClick={() => onClick({ id, name: type })}
				bg={isSelected && colors.primary}
			>
				<Img>
					{
						{
							cedula: <IconCedula/>,
							dimex: <IconDimex />,
							yisro: <IconYisro />
						}[type]
					}
				</Img>
				<Desc>
					<Title>{title}</Title>
					<Description>{desciption}</Description>
				</Desc>
			</CardContent>
		</Card>
	)
}
ItemNavRegistrarPersona.defaultProps = {
	id: 0,
	isSelected: false,
	type: 'yisro',
	title: '',
	desciption: '',
	onClick: () => {}
}
const CardContent = styled.div<{ bg?: string }>`
	display: flex;
	align-items: center;
	flex-flow: revert;
	padding: 5px;
	width: 100%;
	cursor: pointer;
	background: ${(props) => props.bg};
	color: ${(props) => (props.bg ? '#fff' : '#000')};
`
const Img = styled.div`
	width: 166px;
	flex: 0;
`
const Desc = styled.div`
	padding: 10px;
	height: 100%;
	width: auto;
	flex: 1;
`
const Title = styled.h5`
	font-weight: 800;
	font-size: 15px !important;
`
const Description = styled.label`
	font-size: 13px;
`

export default ItemNavRegistrarPersona
