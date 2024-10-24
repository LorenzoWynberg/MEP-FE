import React, { useState,useMemo } from 'react'
import styled from 'styled-components'
import { GetByName } from 'Redux/formularios/actions'
import {
	saveFormularioLocalizacion,
	updateFormularioLocalizacion,
	getFormsByCircuito,
	updateCircuito,
	getCircuitoById
} from 'Redux/configuracion/actions'
import Loader from 'Components/Loader'
import { CurrentCircuito } from '../../../../../../types/configuracion'
import useNotification from 'Hooks/useNotification'
import { withRouter } from 'react-router-dom'
import NavigationContainer from '../../../../../../components/NavigationContainer'
import LocationForm from 'Components/LocationForm'
import { Card, CardBody } from 'reactstrap'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'

type IProps = {
	currentCircuito: CurrentCircuito
	handleBack: Function
	hasEditAccess: boolean
	mapTitle: string
}

type SnackbarConfig = {
	variant: string
	msg: string
}

interface IState {
	configuracion: {
		currentCircuito: CurrentCircuito
	}
}

const UbicacionSaber = (props: IProps) => {
	const [pageData, setPageData] = React.useState({ layouts: [] })
	const [data, setData] = useState<{
		dropdownIds: {
			provincia: string
			canton: string
			distrito: string
			poblado: string
			direccionExacta: string
			longitude: string
			latitude: string
		}
		province: {
			id: number
			codigo: string
			nombre: string
			estado: boolean
		}
		canton: {
			id: number
			codigo: string
			nombre: string
			provinciasId: number
			estado: boolean
		}
		distrito: {
			id: number
			codigo: string
			nombre: string
			cantonesId: number
			codigoPostal: number
		}
		poblado: {
			id: number
			codigo: string
			nombre: string
			distritosId: number
			estado: boolean
		}
		direction: string
		longitude: string
		latitude: string
	}>(null)
	const [formResponse, setFormResponse] = React.useState<any>()
	const [loading, setLoading] = React.useState<boolean>(true)
	const [loadingRequest, setLoadingRequest] = React.useState<boolean>(false)
	const [categoriaForm, setCategoriaForm] = React.useState<number>(0)
	const [snackBarContent, setSnackbarContent] =
		React.useState<SnackbarConfig>({ variant: '', msg: '' })
	const [editable, setEditable] = useState(false)
	const [snackbar, handleClick] = useNotification()
	const { hasEditAccess = true } = props

	const state = useSelector((state: IState) => ({
		currentCircuito: state.configuracion.currentCircuito
	}))

	const actions = useActions({
		updateCircuito,
		getCircuitoById,
	})

	React.useEffect(() => {
		const fetchForm = async () => {
			setLoading(true)
			try {
				const form = await GetByName('ubicacionRegionCircuito')
				const response = await getFormsByCircuito(
					props.currentCircuito.id,
					form.formularioCategoriaId
				)
				if (response.length > 0) {
					const solucion = JSON.parse(response[0].solucion)
					setFormResponse({ ...solucion, id: response[0].id })
				}

				setCategoriaForm(form.formularioCategoriaId)
				setPageData(form.formulario)
			} catch (e) {
				setPageData({ layouts: [] })
			}
			setLoading(false)
		}
		fetchForm()
	}, [])

	const postData = async (values) => {
		setLoadingRequest(true)
		let reqData = {
			solucion: {
				[data.dropdownIds.provincia]: data.province.id,
				[data.dropdownIds.canton]: data.canton.id,
				[data.dropdownIds.distrito]: data.distrito.id,
				[data.dropdownIds.poblado]: data.poblado.id,
				[data.dropdownIds.direccionExacta]: data.direction,
				[data.dropdownIds.longitude]: data.longitude,
				[data.dropdownIds.latitude]: data.latitude,
				tablesData: {}
			},
			regionalId: null,
			circuitoId: props.currentCircuito.id,
			formularioCategoriaId: categoriaForm
		}
		reqData.solucion = JSON.stringify(reqData.solucion) as any
		let response = await saveFormularioLocalizacion(reqData)
		const solucion = JSON.parse(response.data.solucion)
		setFormResponse({ ...solucion, id: response.data.id })
		showNotification('success', 'Datos guardados con éxito')
		setLoadingRequest(false)
	}

	const putData = async (values) => {
		setLoadingRequest(true)
		/* let reqData = {
			solucion: {
				...formResponse,
				[data.dropdownIds.provincia]: data.province.id,
				[data.dropdownIds.canton]: data.canton.id,
				[data.dropdownIds.distrito]: data.distrito.id,
				[data.dropdownIds.poblado]: data.poblado.id,
				[data.dropdownIds.direccionExacta]: data.direction,
				[data.dropdownIds.longitude]: data.longitude,
				[data.dropdownIds.latitude]: data.latitude
			},
			circuitoId: null,
			regionalId: props.currentCircuito.id,
			formularioCategoriaId: categoriaForm
		}
		reqData.solucion = JSON.stringify(reqData.solucion)
		const response = await updateFormularioLocalizacion({
			...reqData,
			id: formResponse.id
		})
		const solucion = JSON.parse(response.data.solucion)
		setFormResponse({ ...solucion, id: response.data.id }) */
		let reqDataUbicacion: CurrentCircuito = {
			...state.currentCircuito,
			esActivo: state.currentCircuito.esActivo == 'Activo' ,
			//codigoDgsc2: undefined,
			//codigoDgsc: state.currentCircuito?.codigoDgsc,
			ubicacionGeograficaJson: JSON.stringify({
				[data.dropdownIds.provincia]: data.province.id,
				[data.dropdownIds.canton]: data.canton.id,
				[data.dropdownIds.distrito]: data.distrito.id,
				[data.dropdownIds.poblado]: data.poblado.id,
				[data.dropdownIds.direccionExacta]: data.direction,
				[data.dropdownIds.longitude]: data.longitude,
				[data.dropdownIds.latitude]: data.latitude,
			})
		}
		await actions.updateCircuito(reqDataUbicacion)
		actions.getCircuitoById(state.currentCircuito?.id)
		showNotification('success', 'Datos guardados con éxito')
		setLoadingRequest(false)
	}
	const showNotification = (variant: string, msg: string) => {
		setSnackbarContent({ variant, msg })
		handleClick()
	}

	const values = useMemo(() => {
		return state.currentCircuito.ubicacionGeograficaJson ? JSON.parse(state.currentCircuito.ubicacionGeograficaJson) : undefined
	}, [state.currentCircuito])

	return (
		<Wrapper>
			{snackbar(snackBarContent.variant, snackBarContent.msg)}
			<NavigationContainer
				goBack={props.handleBack}
			></NavigationContainer>
			{!loading ? (
				<Card>
					<CardBody>
						<LocationForm
							display="horizontal"
							loading={loadingRequest}
							title={props.mapTitle || 'Centro educativo'}
							values={values}
							setEditable={setEditable}
							editable={editable}
							hideButton={!hasEditAccess}
							handleChange={(d) => {
								setData(d)
							}}
							onSubmit={(d) => {
								//if (values) {
									putData(d)
								//} else {
								//	postData(d)
								//}
							}}
						/>
					</CardBody>
				</Card>
			) : (
				<Loader />
			)}
		</Wrapper>
	)
}

const Wrapper = styled.div`
	margin-top: 10px;
`

export default withRouter(UbicacionSaber)
