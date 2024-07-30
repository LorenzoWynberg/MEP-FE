import React, { useEffect } from 'react'
import styled from 'styled-components'
import ReactSelect from 'react-select'
import { Button } from 'reactstrap'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import Loader from 'Components/Loader'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

type Select = {
	key: string
	label: string
	items: { value: string; label: string }[]
	onChange: Function
}

interface IProp {
	titulo: string
	texto: string
	selects: Select[]
	loader?: boolean
	onBtnGenerarEvent?: (obj: any) => void
}

const ReportParameterCard: React.FC<IProp> = (props) => {
	const { t } = useTranslation()
	const { titulo, texto, selects, onBtnGenerarEvent } = props
	const [state, setState] = React.useState({})
	const onChangeEvent = (selected: any, key: any) => {
		setState({ ...state, [key]: selected })
	}
	const anioEducativo = useSelector((store: any) => (store.authUser.selectedActiveYear))
	React.useEffect(() => {
		if (!anioEducativo) return
		setState({})
	}, [anioEducativo])
	const onBtnGenerarReporteClick = () => {
		if (!onBtnGenerarEvent) return

		onBtnGenerarEvent(state)
	}
	useEffect(() => console.log('state', state), [state])
	return (
		<Contenedor>
			<Card style={{ position: 'relative' }}>
				<Titulo>{titulo}</Titulo>
				<Texto>{texto}</Texto>
				{props.loader && (
					<div
						style={{
							height: '100%',
							width: '100%',
							backgroundColor: 'rgba(182, 182, 182, 0.5)',
							position: 'absolute',
							top: 0,
							left: 0,
							zIndex: 20
						}}
					>
						<div
							style={{
								position: 'absolute',
								top: '50%',
								left: '50%',
								transform: 'translate(-50%, -50%)'
							}}
						>
							<Loader />
						</div>
					</div>
				)}
				{console.log('selects', selects)}
				{console.log('selects state', state)}
				{selects.map((select) => {
					return (
						<SelectContainer key={select.key}>
							<SelectText>{select.label}</SelectText>
							<ReactSelect
								className="react-select"
								classNamePrefix="react-select"
								placeholder=""
								noOptionsMessage={() =>
									t('general>no_opt', 'Sin opciones')
								}
								components={{ Input: CustomSelectInput }}
								value={state.hasOwnProperty(select.key) && select.items.some(item => item.label == state[select.key].label )
									? state[select.key]
									: null}
								options={select.items}
								onChange={(obj) => {
									onChangeEvent(obj, select.key)
									if (select.onChange) select.onChange(obj)
								}}
							/>
						</SelectContainer>
					)
				})}
				<div align="center">
					<Button
						style={{ marginTop: '10px' }}
						onClick={onBtnGenerarReporteClick}
						color="primary"
					>
						{t('general>boton>generar_reporte', 'Generar reporte')}
					</Button>
				</div>
			</Card>
		</Contenedor>
	)
}
const Contenedor = styled.div`
	display: flex;
	justify-content: center;
`
const Card = styled.div`
	border-radius: 15px;
	max-width: 60%;
	min-width: 500px;
	min-height: 100px;
	border-color: gray;
	background: white;
	padding: 15px;
`

const Titulo = styled.span`
	font-size: 1rem;
	font-weight: bold;
	margin-bottom: 10px;
`
const Texto = styled.p`
	font-weight: bold;
`

const SelectContainer = styled.div`
	margin-bottom: 1rem;
`

const SelectText = styled.span``

export default ReportParameterCard
