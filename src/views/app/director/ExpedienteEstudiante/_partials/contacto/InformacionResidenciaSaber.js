import React, { useState, useEffect, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { FormGroup, Label, Input, Form, Button } from 'reactstrap'
import { connect } from 'react-redux'
import { getCantonesByProvincia } from '../../../../../../redux/cantones/actions'
import { getDistritosByCanton } from '../../../../../../redux/distritos/actions'
import { getPobladosByDistrito } from '../../../../../../redux/poblados/actions'
import { WebMapView } from './MapView'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import Select from 'react-select'
import styled from 'styled-components'
import useNotification from '../../../../../../hooks/useNotification'
import {
	createDirection,
	updateDirection
} from '../../../../../../redux/direccion/actions'
import { getCatalogs } from '../../../../../../redux/selects/actions'
import { getProvincias } from '../../../../../../redux/provincias/actions'
import { catalogsEnumObj } from '../../../../../../utils/catalogsEnum'
import Loader from '../../../../../../components/Loader'
import { EditButton } from '../../../../../../components/EditButton'
import { useForm } from 'react-hook-form'
import _ from 'lodash'
import RequiredSpan from '../../../../../../components/Form/RequiredSpan'

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1
	},
	control: {
		padding: theme.spacing(2)
	},
	paper: {
		borderRadius: 15,
		boxShadow: '2px 2px 5px rgba(228, 226, 226, 0.856)'
	}
}))

const InformacionResidenciaSaber = props => {
	const { handleSubmit } = useForm()
	const initialSelectOption = {
		value: null,
		label: 'Seleccionar'
	}
	const initialLocationCoordinates = {
		latitude: null,
		longitude: null
	}
	const [currentProvince, setCurrentProvince] = useState(initialSelectOption)
	const [currentCanton, setCurrentCanton] = useState(initialSelectOption)
	const [currentDistrito, setCurrentDistrito] = useState(initialSelectOption)
	const [currentPoblado, setCurrentPoblado] = useState(initialSelectOption)
	const [currentTerritory, setCurrentTerritory] = useState(initialSelectOption)
	const [errors, setErrors] = useState(initialSelectOption)
	const [search, setSearch] = useState(null)
	const [loadLocation, setLoadLocation] = useState(false)
	const [direccionArray, setDireccionArray] = useState([])
	const [direction, setDirection] = useState('')
	const [razon, setRazon] = useState('')
	const [snackbarMsg, setSnackbarMsg] = useState('')
	const [snackbarVariant, setSnackbarVariant] = useState('')
	const [location, setLocation] = useState({ latitude: 0, longitude: 0 })
	const [editDirection, setEditDirection] = useState({})
	const [editable, setEditable] = useState(false)
	const [loading, setLoading] = useState(true)
	const [ubicacion, setUbicacion] = useState({})
	let timeOut
	const classes = useStyles()
	const [sanackBar, handleClick] = useNotification()
	const [openViewMap, setOpenViewMap] = useState(false)
	const handleError = () => {
		setSnackbarMsg('Hubo un error en la carga de la informacion')
		setSnackbarVariant('error')
		handleClick()
	}
	const shiftedTerritories = [...props.selects.territoriosIndigenas]
	shiftedTerritories.forEach(function (item, i) {
		if (item.id === 144) {
			shiftedTerritories.splice(i, 1)
			shiftedTerritories.unshift(item)
		}
	})

	const setInitiaState = () => {
		setCurrentProvince(initialSelectOption)
		setCurrentCanton(initialSelectOption)
		setCurrentDistrito(initialSelectOption)
		setCurrentPoblado(initialSelectOption)
		setCurrentTerritory(initialSelectOption)
		setDirection('')
		setLocation({ latitude: null, longitude: null })
	}

	useEffect(() => {
		props.getProvincias()
		props.getCatalogs(catalogsEnumObj.TERRITORIOINDIGENA?.id)
	}, [])
	useEffect(() => {
		if (currentPoblado?.label && search?.searchTerm && !location?.latitude) {
			handleSearchBySelects(currentPoblado, 'poblado')
		}
	}, [currentPoblado, search, location])
	const loadData = useCallback(async () => {
		if (ubicacion.provincia) {
			const _direccionArray = [
				ubicacion.provincia,
				ubicacion.canton,
				ubicacion.distrito
			]
			setDireccionArray(_direccionArray)
			setLoadLocation(true)
			const _province = props.provinces.provincias.find(provincia => {
				const stringCompare = provincia?.nombre
					.normalize('NFD')
					.replace(/\p{Diacritic}/gu, '')
				return stringCompare == _direccionArray[0].trim()
			})
			const provinceResponse = await props.getCantonesByProvincia(_province?.id)
			if (provinceResponse.error) {
				return handleError()
			}
			setCurrentProvince({
				label: _province?.nombre,
				value: _province?.id
			})
			setLocation({
				latitude: location.latitude,
				longitude: location.longitude
			})
		}
	}, [ubicacion])
	useEffect(() => {
		loadData()
	}, [ubicacion])
	const loadDataBac = useCallback(async () => {
		const item = props?.identification.data.direcciones.find(
			item => item.temporal === props.temporal
		)
		if (item) {
			const _direccionArray = [
				item.provinciasId,
				item.cantonesId,
				item.distritosId,
				item.pobladosId
			]

			setDireccionArray(_direccionArray)
			setLoadLocation(true)
			const _province = props.provinces.provincias.find(
				item => item?.id == _direccionArray[0]
			)
			if (_province) {
				const provinceResponse = await props.getCantonesByProvincia(
					_province?.id
				)
				if (provinceResponse.error) {
					return handleError()
				}
				setCurrentProvince({
					label: _province?.nombre,
					value: _province?.id
				})
			}
			setEditDirection(item)
			  setDirection(item.direccionExacta)
			setLocation({
				latitude: item.latitud,
				longitude: item.longitud
			})
			setRazon(item.razon)
		} else {
			setLoading(false)
			setInitiaState()
		}
	}, [props?.identification.data, editable])
	//this effects parse the data when comes from the backend
	useEffect(() => {
		if (
			props?.identification.data.direcciones &&
			props?.identification.data.direcciones.length > 0
		) {
			loadDataBac()
		} else {
			setLoading(false)
			setInitiaState()
		}
	}, [props?.identification.data, editable])

	useEffect(() => {
		const loadDataC = async () => {
			const _canton = props.cantones.cantones.find(item => {
				if (isNaN(direccionArray[1])) {
					const stringCompare = item?.nombre
						.normalize('NFD')
						.replace(/\p{Diacritic}/gu, '')
					return stringCompare === direccionArray[1].trim()
				} else {
					return item?.id === direccionArray[1]
				}
			})
			if (_canton) {
				setCurrentCanton({ label: _canton?.nombre, value: _canton?.id })
				const cantonResponse = await props.getDistritosByCanton(_canton?.id)
				if (cantonResponse.error) {
					return handleError()
				}
			}
		}
		if (loadLocation && props.cantones.cantones.length > 0) {
			loadDataC()
		}
	}, [props.cantones.cantones])

	useEffect(() => {
		const loadData2 = async () => {
			const _distrito = props.distritos.distritos.find(item => {
				if (isNaN(direccionArray[2])) {
					const stringCompare = item?.nombre
						.normalize('NFD')
						.replace(/\p{Diacritic}/gu, '')
					return stringCompare === direccionArray[1].trim()
				} else {
					return item?.id === direccionArray[2]
				}
			})
			if (_distrito) {
				setCurrentDistrito({
					label: _distrito?.nombre,
					value: _distrito?.id
				})
				const distritoResponse = await props.getPobladosByDistrito(
					_distrito?.id
				)
				if (distritoResponse.error) {
					return handleError()
				}
			}
		}
		if (loadLocation && props.distritos.distritos.length > 1) {
			loadData2()
		}
	}, [props.distritos.distritos])

	useEffect(() => {
		const loadData3 = async () => {
			if (direccionArray[3]) {
				const _poblado = props.poblados.poblados.find(item => {
					if (isNaN(direccionArray[3])) {
						return item?.nombre === direccionArray[3].trim()
					} else {
						return item?.id === direccionArray[3]
					}
				})
				setCurrentPoblado({
					label: _poblado?.nombre,
					value: _poblado?.id
				})
			}
			setLoadLocation(false)
		}
		if (loadLocation && props.poblados.poblados.length > 1) {
			loadData3()
			setLoading(false)
		}
	}, [props.poblados.poblados])

	useEffect(() => {
		if (search && location.latitude !== '' && location.longitude !== '') {
			search.searchTerm = 'CRI'
			search.search([location.longitude, location.latitude]).then(response => {
				search.suggest().then(res => {
					const result = res?.results[0].results[0]
					if (result) {
						const firstResultArray = result.text.split(',')
						if (!(firstResultArray[firstResultArray.length - 1] === ' CRI')) {
							setSnackbarVariant('error')
							setSnackbarMsg('La ubicacion debe de estar dentro de costa rica')
							handleClick()
							setLocation(initialLocationCoordinates)
						}
					}
				})
			})
		}
	}, [location.latitude, location.longitude, search])

	useEffect(() => {
		if (props.selects.territoriosIndigenas[0] && editDirection?.id) {
			let territory = props.selects.territoriosIndigenas.find(
				element => element?.id === editDirection.territorioIndigenaId
			)
			territory &&
				setCurrentTerritory({
					...territory,
					value: territory?.id,
					label: territory?.nombre
				})
		}
	}, [
		props.selects.territoriosIndigenas,
		editDirection.territorioIndigenaId,
		editable
	])

	useEffect(() => {
		if (!editable) {
			setErrors([])
		}
	}, [editable])

	const handleSearchDirection = e => {
		setDirection(e.target.value)
	}

	const handleSearchBySelects = useCallback(()=>(data, name) => {
		if (search) {
			search.clear()
		}
		let _newDirection = ''
		switch (name) {
			case 'provincia':
				setCurrentProvince(data)
				setLocation(initialLocationCoordinates)
				_newDirection = `${data.label}`
				break
			case 'canton':
				setCurrentCanton(data)
				setLocation(initialLocationCoordinates)
				_newDirection = `${currentProvince.label}, ${data.label}`
				break
			case 'distrito':
				setCurrentDistrito(data)
				setLocation(initialLocationCoordinates)
				_newDirection = `${currentProvince.label}, ${currentCanton.label}, ${data.label}`
				break
			case 'poblado':
				_newDirection = `${currentProvince.label}, ${currentCanton.label}, ${currentDistrito.label}`
				setDirection('') 
				setCurrentPoblado(data)
				break
			default:
				return null
		}
		search.searchTerm = _newDirection
		//
		search.search(`${_newDirection}, CRI`)
		// search.suggest()
	},[])

	const handleChange = e => {
		setRazon(e.target.value)
	}

	const showSnackbar = (variant, msg) => {
		setSnackbarVariant(variant)
		setSnackbarMsg(msg)
		handleClick()
	}

	const validateData = data => {
		let _errors = []
		if (!currentPoblado.value) {
			_errors['poblado'] = 'Debe tener un poblado seleccionado'
		}
		if (!direction) {
			_errors['direccionExacta'] = 'Debe tener una dirección'
		}
		if (props.temporal && !data.razon) {
			_errors['razon'] = 'Debe tener una razón para su residencia temporal'
		}

		let error = _errors['poblado']
			? true
			: _errors['razon']
			? true
			: _errors['direccionExacta']
			? true
			: false
		setErrors(_errors)

		if (error) {
			showSnackbar('error', 'Todos los campos deben ser llenados')
		}
		return { error }
	}

	const sendData = async () => {
		let _data = {}
		let response
		if (editDirection?.id) {
			_data = {
				...editDirection,
				temporal: props.temporal,
				razon,
				latitud: location.latitude,
				longitud: location.longitude,
				pobladoId: currentPoblado.value,
				pobladosId: currentPoblado.value,
				cantonesId: currentCanton.value,
				provinciasId: currentProvince.value,
				distritosId: currentDistrito.value,
				identidadId: props?.identification.data?.id,
				direccionExacta: direction,
				territorioId: currentTerritory.value ? currentTerritory.value : 0,
				estado: true
			}
			if (!validateData(_data).error) {
				response = await props.updateDirection(_data, {
					identidadId: props?.identification.data?.id,
					tipo: props.temporal ? 1 : 0,
					json: {
						province: currentProvince,
						canton: currentCanton,
						distrito: currentDistrito,
						poblado: currentPoblado,
						latitude: location.latitude,
						longitude: location.longitude,
						razon,
						territorio: currentTerritory,
						identidadId: props?.identification.data?.id,
						temporal: props.temporal,
						direccionExacta: direction,
						estado: true
					}
				})
				if (response.error) {
					showSnackbar('error', 'Los datos no pudieron ser guardados')
				} else {
					showSnackbar('success', 'Datos guardados con éxito')
					setEditable(false)
				}
			}
		} else {
			_data = {
				temporal: props.temporal,
				razon,
				latitud: location.latitude,
				longitud: location.longitude,
				pobladoId: currentPoblado.value,
				pobladosId: currentPoblado.value,
				cantonesId: currentCanton.value,
				provinciasId: currentProvince.value,
				distritosId: currentDistrito.value,
				identidadId: props?.identification.data?.id,
				direccionExacta: direction,
				territorioId: currentTerritory.value ? currentTerritory.value : 0,
				estado: true
			}
			if (!validateData(_data).error) {
				response = await props.createDirection(_data, {
					identidadId: props?.identification.data?.id,
					tipo: props.temporal ? 1 : 0,
					json: {
						province: currentProvince,
						canton: currentCanton,
						distrito: currentDistrito,
						poblado: currentPoblado,
						latitude: location.latitude,
						longitude: location.longitude,
						razon,
						identidadId: props?.identification.data?.id,
						temporal: props.temporal,
						territorio: currentTerritory,
						direccionExacta: direction,
						estado: true
					}
				})
				if (response.error) {
					showSnackbar('error', 'Los datos no pudieron ser guardados')
				} else {
					showSnackbar('success', 'Datos guardados con éxito')
					setEditable(false)
				}
			}
		}
	}

	const setLocationIfEditable = value => {
		if (editable) {
			setLocation(value)
		}
	}

	const LoadingIndicator = () => {
		return <LoadingInput className="loadingInput" />
	}

	const LoadingMessage = () => {
		return <LoadingLabel>Cargando...</LoadingLabel>
	}

	return (
		<Grid container className={classes.root} spacing={2}>
			{sanackBar(snackbarVariant, snackbarMsg)}
			<Grid item xs={12}>
				<Form onSubmit={handleSubmit(sendData)}>
					<Paper className={classes.paper}>
						<Grid container>
							{loading ? (
								<LoaderContainer>
									<Loader />
								</LoaderContainer>
							) : (
								<>
									<Grid item xs={12} className={classes.control}>
										<h4>Información de residencia</h4>
									</Grid>

									<Grid item xs={12} md={6} className={classes.control}>
										{props.temporal && (
											<FormGroup>
												<Label for="razon">
													Razón <RequiredSpan />
												</Label>
												<Input
													type="textarea"
													style={{
														resize: 'none',
														height: 80
													}}
													name="razon"
													id="razon"
													placeholder="Razón"
													disabled={!editable}
													onChange={e => {
														handleChange(e)
													}}
													value={razon}
												/>
												<FormSpan>{errors['razon']}</FormSpan>
											</FormGroup>
										)}
										<FormGroup>
											<Label for="provincia">
												Provincia <RequiredSpan />
											</Label>
											<Select
												components={{
													Input: CustomSelectInput
												}}
												className="react-select"
												classNamePrefix="react-select"
												name="provincia"
												id="provincia"
												isDisabled={!editable}
												onChange={data => {
													props.getCantonesByProvincia(data?.value)
													handleSearchBySelects(data, 'provincia')
													setCurrentCanton(initialSelectOption)
													setCurrentDistrito(initialSelectOption)
													setCurrentPoblado(initialSelectOption)
												}}
												value={currentProvince}
												placeholder="Seleccionar"
												options={props.provinces.provincias.map(item => ({
													label: item?.nombre,
													value: item?.id
												}))}
											/>
										</FormGroup>
										<FormGroup>
											<Label for="canton">
												Cantón <RequiredSpan />
											</Label>
											<Select
												components={{
													Input: CustomSelectInput,
													LoadingIndicator: LoadingIndicator,
													LoadingMessage
												}}
												className="react-select"
												classNamePrefix="react-select"
												name="canton"
												id="canton"
												isDisabled={!currentProvince.value || !editable}
												onChange={data => {
													props.getDistritosByCanton(data.value)
													handleSearchBySelects(data, 'canton')
													setCurrentDistrito(initialSelectOption)
													setCurrentPoblado(initialSelectOption)
												}}
												value={currentCanton}
												placeholder="Seleccionar"
												options={props.cantones.cantones.map(item => ({
													label: item?.nombre,
													value: item?.id
												}))}
												isLoading={props.cantones.loadingCantones}
											/>
										</FormGroup>
										<FormGroup>
											<Label for="distrito">
												Distrito <RequiredSpan />
											</Label>
											<Select
												components={{
													Input: CustomSelectInput,
													LoadingIndicator: LoadingIndicator,
													LoadingMessage
												}}
												className="react-select"
												classNamePrefix="react-select"
												name="distrito"
												id="distrito"
												isDisabled={!currentCanton.value || !editable}
												value={currentDistrito}
												onChange={data => {
													props.getPobladosByDistrito(data.value)
													handleSearchBySelects(data, 'distrito')
													setCurrentPoblado(initialSelectOption)
												}}
												placeholder="Seleccionar"
												isLoading={props.distritos.loadingDistritos}
												options={props.distritos.distritos.map(item => ({
													label: item?.nombre,
													value: item?.id
												}))}
											/>
										</FormGroup>
										<FormGroup>
											<Label for="poblado">
												Poblado <RequiredSpan />
											</Label>
											<Select
												components={{
													Input: CustomSelectInput,
													LoadingIndicator: LoadingIndicator,
													LoadingMessage
												}}
												className="react-select"
												classNamePrefix="react-select"
												name="poblado"
												id="poblado"
												isDisabled={!currentDistrito.value || !editable}
												value={currentPoblado}
												onChange={data => {
													handleSearchBySelects(data, 'poblado')
												}}
												placeholder="Seleccionar"
												isLoading={props.poblados.loadingPoblados}
												options={props.poblados.poblados.map(item => ({
													label: item?.nombre,
													value: item?.id
												}))}
											/>
											<FormSpan>{errors['poblado']}</FormSpan>
										</FormGroup>
										<FormGroup>
											<Label for="dirExacta">
												Dirección exacta <RequiredSpan />
											</Label>
											<Input
												type="textarea"
												style={{
													resize: 'none',
													height: 80
												}}
												name="dirExacta"
												id="dirExacta"
												disabled={!currentPoblado.value || !editable}
												onChange={e => {
													clearTimeout(timeOut)
													handleSearchDirection(e)
												}}
												value={direction}
											/>
											<FormSpan>{errors['direccionExacta']}</FormSpan>
										</FormGroup>
										<FormGroup>
											<Label for="indigena">Territorio indígena</Label>
											<Select
												components={{
													Input: CustomSelectInput,
													LoadingIndicator: LoadingIndicator,
													LoadingMessage
												}}
												className="react-select"
												classNamePrefix="react-select"
												name="indigena"
												id="indigena"
												isDisabled={!editable}
												value={currentTerritory}
												options={shiftedTerritories
													.sort((a, b) => {
														if (a.id < b.id) return -1
														if (a.id > b.id) return 1
														return 0
													})
													.map(item => ({
														...item,
														label: item?.nombre,
														value: item?.id
													}))}
												onChange={data => {
													setCurrentTerritory(data)
												}}
											/>
										</FormGroup>
										<Grid container>
											<Grid item xs={12} style={{ paddingRight: 10 }}>
												<FormSpan>{errors['location']}</FormSpan>
											</Grid>
											<Grid item xs={6} style={{ paddingRight: 10 }}>
												<FormGroup>
													<Label for="latitud">Latitud</Label>
													<Input
														type="text"
														name="latitud"
														id="latitud"
														onChange={e => {
															const locationActual = {
																...location,
																latitude: e.target.value
															}
															_.debounce(
																setLocationIfEditable(locationActual),
																1500
															)
														}}
														disabled={!editable}
														value={location.latitude}
													/>
												</FormGroup>
											</Grid>
											<Grid item xs={6} style={{ paddingLeft: 10 }}>
												<FormGroup>
													<Label for="longitud">Longitud</Label>
													<Input
														type="text"
														name="longitud"
														id="longitud"
														onChange={e => {
															const locationActual = {
																...location,
																longitude: e.target.value
															}
															_.debounce(
																setLocationIfEditable(locationActual),
																1500
															)
														}}
														disabled={!editable}
														value={location.longitude}
													/>
												</FormGroup>
											</Grid>
										</Grid>
									</Grid>
								</>
							)}

							<MapContainer item md={6} xs={12} className={classes.control}>
								<WebMapView
									setLocation={setLocation}
									setSearch={setSearch}
									setUbicacion={setUbicacion}
									editable={editable}
								/>
							</MapContainer>
						</Grid>
						<Grid
							item
							xs={12}
							style={
								props.validations.modificar
									? { textAlign: 'center' }
									: { display: 'none' }
							}
							className={classes.control}
						>
							{editable ? (
								<Button
									style={{ marginRight: '10px' }}
									outline
									color="primary"
									onClick={() => {
										setInitiaState()
									}}
								>
									Limpiar campos
								</Button>
							) : null}
							<EditButton
								sendData={() => {
									props.authHandler('modificar', sendData)
								}}
								editable={editable}
								setEditable={value => {
									props.authHandler('modificar', () => setEditable(value))
								}}
								loading={props.direccion.loading}
							/>
						</Grid>
					</Paper>
				</Form>
			</Grid>
		</Grid>
	)
}

const LoadingLabel = styled.div`
	text-align: center;
	color: grey;
`
const LoadingInput = styled.span`
	position: unset;
`
const LoaderContainer = styled.div`
	height: 10vh;
	width: 100%;
`

InformacionResidenciaSaber.defaultProps = {
	temporal: false
}

const MapContainer = styled(Grid)`
	@media (max-width: 870px) {
		height: 29rem;
	}
`

const FormSpan = styled.span`
	color: red;
`

const mapStateToProps = state => {
	return {
		provinces: state.provincias,
		cantones: state.cantones,
		distritos: state.distritos,
		poblados: state.poblados,
		selects: state.selects,
		direccion: state.direccion
	}
}

const mapDispatchToProps = {
	getCantonesByProvincia,
	getDistritosByCanton,
	getPobladosByDistrito,
	createDirection,
	updateDirection,
	getCatalogs,
	getProvincias
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(InformacionResidenciaSaber)
