import React, { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Row, Col, Form, FormGroup, Label, Input } from 'reactstrap'
import { TableReactImplementationApoyo } from 'Components/TableReactImplementationApoyo'
import useNotification from 'Hooks/useNotification'
import withAuthorization from '../../../../../../Hoc/withAuthorization'
import styled from 'styled-components'
import {
	getTiposApoyos,
	getDependenciasApoyos,
	getCategoriasApoyos,
	getApoyosByType,
	addApoyo,
	deleteApoyo,
	editApoyo
} from 'Redux/apoyos/actions'
import {
	FormControl,
	FormControlLabel,
	Radio,
	RadioGroup
} from '@material-ui/core'
import styles from './apoyos.css'
import Tooltip from '@mui/material/Tooltip'
import 'react-datepicker/dist/react-datepicker.css'
import { getCatalogs } from 'Redux/selects/actions'
import { useActions } from 'Hooks/useActions'
import axios from 'axios'
import { envVariables } from '../../../../../../constants/enviroment'
import { IoMdTrash } from 'react-icons/io'
import IconButton from '@mui/material/IconButton'
import { HiPencil } from 'react-icons/hi'
import swal from 'sweetalert'
import { isNull, isUndefined, isEmpty } from 'lodash'
import Loader from 'Components/LoaderContainer'
import OptionModal from 'Components/Modal/OptionModal'
import RequiredSpan from 'Components/Form/RequiredSpan'
import moment from 'moment'
import colors from 'assets/js/colors'

const categoria = {
	id: 2,
	nombre: 'Apoyos organizativos',
	addDispatchName: 'apoyosorganizativos2'
}

const tituloModal = 'Registro de apoyos organizativos'
const condicionSeRecibeNombre = 'Se recibe'

const ApoyosOrganizativos = props => {
	const [loading, setLoading] = useState(true)
	const [showModalTiposApoyo, setShowModalTiposApoyo] = useState(false)
	const [data, setData] = useState([])
	const [showNuevoApoyoModal, setShowNuevoApoyoModal] = useState(false)
	const [tiposApoyo, setTiposApoyo] = useState([])
	const [tiposApoyoFilter, setTiposApoyoFilter] = useState([])
	const [sortedYearList, setSortedYearList] = useState(null)
	const [showFechaAprobacion, setShowFechaAprobacion] = useState(false)
	const [editable, setEditable] = useState(false)
	const [radioValue, setRadioValue] = useState(0)
	const [snackbar, handleClick] = useNotification()
	const [snackbarContent, setSnackbarContent] = useState({
		msg: '',
		type: ''
	})
	const [formData, setFormData] = useState({
		id: 0,
		tipoDeApoyo: 0,
		condicionApoyo: '',
		detalleApoyo: '',
		nombreApoyo: '',
		fechaDeAprobacion: ''
	})

	const cleanFormData = () => {
		const data = {
			id: 0,
			tipoDeApoyo: 0,
			condicionApoyo: '',
			detalleApoyo: '',
			nombreApoyo: '',
			fechaDeAprobacion: ''
		}
		setFormData(data)
		setRadioValue(0)
		setShowFechaAprobacion(false)
	}

	const primary = colors.primary

	const handleFormDataChange = event => {
		setFormData({
			...formData,
			[event.target.name]: event.target.value
		})
	}

	const handleFechaAprobacionOnChange = event => {
		const value = Number(event.target.value)

		const condicionesApoyo = state.selects.tipoCondicionApoyo

		const condicionSeRecibe = condicionesApoyo.find(
			o => o.nombre === condicionSeRecibeNombre
		)

		if (value === condicionSeRecibe.id) {
			setShowFechaAprobacion(true)
		} else {
			setShowFechaAprobacion(false)
		}
		setFormData({
			...formData,
			condicionApoyo: value
		})
	}

	const { t } = useTranslation()

	const actions = useActions({
		getTiposApoyos,
		getDependenciasApoyos,
		getCategoriasApoyos,
		getApoyosByType,
		addApoyo,
		deleteApoyo,
		editApoyo,
		getCatalogs
	})

	const state = useSelector(store => {
		return {
			expedienteEstudiantil: store.expedienteEstudiantil,
			identification: store.identification,
			apoyos: store.apoyos,
			selects: store.selects,
			activeYear: store.authUser.selectedActiveYear,
			activeYears: store.authUser.activeYears
		}
	})

	const loadData = async () => {
		try {
			setLoading(true)
			const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/TipoApoyo`
			)

			const tiposDeApoyo = response.data.filter(
				tipo => tipo.categoriaApoyoId === categoria.id
			)

			setTiposApoyo(tiposDeApoyo)

			const condicionApoyo = props.catalogos.find(item => {
				return item.nombre === 'Condiciones de Apoyo'
			})
			if (!state.selects.tipoCondicionApoyo[0]) {
				await actions.getCatalogs(condicionApoyo.id)
			}
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadData()
	}, [])

	useEffect(() => {
		setLoading(true)

		axios
			.get(
				`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Apoyo/categoria/${categoria.id}/1/20?identidadId=${state.identification.data.id}`
			)
			.then(response => {
				setData(response.data.entityList)
				setLoading(false)
			})
			.catch(error => {
				console.log(error)
				setLoading(false)
			})
	}, [])

	useEffect(() => {
		filterTiposDeApoyo(tiposApoyo)
	}, [data])

	const deleteApoyoById = apoyoId => {
		setLoading(true)
		try {
			axios
				.delete(
					`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Apoyo/${apoyoId}`
				)
				.then(() => {
					loadData()
					axios
						.get(
							`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Apoyo/categoria/${categoria.id}/1/20?identidadId=${state.identification.data.id}`
						)
						.then(res => {
							setData(res.data.entityList)
							setLoading(false)
							setSnackbarContent({
								msg: 'Se ha eliminado el registro',
								type: 'success'
							})
							handleClick()
						})
						.catch(error => {
							setLoading(false)
							setSnackbarContent({
								msg: 'Hubo un error al eliminar el registro',
								type: 'error'
							})
							handleClick()
							console.log(error)
						})
				})
				.catch(error => {
					setLoading(false)
					console.log('Error', error)
				})
		} catch (e) {
			setLoading(false)
		}
	}

	const onAgregarEvent = () => {
		setEditable(false)
		setShowNuevoApoyoModal(true)
	}

	const onEditarEvent = row => {
		setEditable(true)
		setShowNuevoApoyoModal(true)

		if (
			!isNull(row.fechaInicio) &&
			!isUndefined(row.fechaInicio) &&
			!isEmpty(row.fechaInicio)
		) {
			setShowFechaAprobacion(true)
		}

		setFormData({
			id: row.id,
			tipoDeApoyo: row.sb_TiposDeApoyoId,
			condicionApoyo: row.condicionApoyoId,
			detalleApoyo: row.detalle,
			nombreApoyo: row.sb_TiposDeApoyo,
			fechaDeAprobacion: row.fechaInicio
		})
	}

	const columns = useMemo(() => {
		return [
			{
				Header: 'Tipo de apoyo',
				column: 'sb_TiposDeApoyo',
				accessor: 'sb_TiposDeApoyo',
				label: ''
			},
			{
				Header: 'Detalle del apoyo',
				column: 'detalle',
				accessor: 'detalle',
				label: ''
			},
			{
				Header: 'Condición del apoyo',
				column: 'condicionApoyo',
				accessor: 'condicionApoyo',
				label: ''
			},
			{
				Header: 'Fecha de aprobación',
				column: 'fechaInicio',
				accessor: 'fechaInicio',
				label: ''
			},
			{
				Header: 'Registrado por',
				column: 'usuarioRegistro',
				accessor: 'usuarioRegistro',
				label: ''
			},
			{
				Header: 'Fecha y hora del registro',
				column: 'fechaInsercion',
				accessor: 'fechaInsercion',
				label: ''
			},
			{
				Header: t('general>acciones', 'Acciones'),
				column: '',
				accessor: '',
				label: '',
				Cell: ({ _, row, data }) => {
					const fullRow = data[row.index]

					return (
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								alignContent: 'center'
							}}
						>
							<button
								style={
									!props.validations.modificar
										? { display: 'none' }
										: {
												border: 'none',
												background: 'transparent',
												cursor: 'pointer',
												color: 'grey'
										  }
								}
								onClick={() => {
									onEditarEvent(row.original)
								}}
							>
								<Tooltip title="Actualizar">
									<IconButton>
										<HiPencil style={{ fontSize: 30 }} />
									</IconButton>
								</Tooltip>
							</button>
							<button
								style={
									!props.validations.eliminar
										? { display: 'none' }
										: {
												border: 'none',
												background: 'transparent',
												cursor: 'pointer',
												color: 'grey'
										  }
								}
								onClick={() => {
									swal({
										title: 'Eliminar Apoyo',
										text: '¿Esta seguro de que desea eliminar el apoyo?',
										icon: 'warning',
										className: 'text-alert-modal',
										buttons: {
											cancel: 'Cancelar',
											ok: {
												text: 'Eliminar',
												value: true,
												className: 'btn-alert-color'
											}
										}
									}).then(async result => {
										if (result) {
											deleteApoyoById(row.original.id)
										}
									})
								}}
							>
								<Tooltip title="Eliminar">
									<IconButton>
										<IoMdTrash style={{ fontSize: 30 }} />
									</IconButton>
								</Tooltip>
							</button>
						</div>
					)
				}
			}
		]
	}, [state.expedienteEstudiantil.currentStudent])

	const onConfirmSaveApoyo = async event => {
		event.preventDefault()
		setLoading(true)

		let validationMessage = ''
		let hayError = false

		if (formData.tipoDeApoyo === '' || isNaN(formData.tipoDeApoyo)) {
			validationMessage = '\nEl tipo de apoyo es requerido'
			hayError = true
		}

		if (formData.condicionApoyo === '' || isNaN(formData.condicionApoyo)) {
			validationMessage += '\nLa condición de apoyo es requerida'
			hayError = true
		}

		if (formData.detalleApoyo === '') {
			validationMessage += '\nEl detalle es requerido'
			hayError = true
		}

		if (hayError) {
			swal({
				title: 'Error al registrar el apoyo',
				text: validationMessage,
				icon: 'error',
				className: 'text-alert-modal',
				buttons: {
					ok: {
						text: 'Ok',
						value: true,
						className: 'btn-alert-color'
					}
				}
			})
			setLoading(false)
			return
		}

		let _data = {
			//
			detalle: formData.detalleApoyo,
			fechaInicio: formData.fechaDeAprobacion
				? formData.fechaDeAprobacion
				: null,
			fechaFin: null,
			dependenciasApoyosId: null,
			sb_TiposDeApoyoId: parseInt(formData.tipoDeApoyo),
			condicionApoyoId: parseInt(formData.condicionApoyo),
			identidadesId: state.identification.data.id,
			sb_TalentoId: null,
			estrategias: null
		}

		let create = true
		//create
		if (formData.id === 0) {
			const existeApoyo = data.find(item => {
				if (item.sb_TiposDeApoyoId === _data.tipoDeApoyoId) {
					const date = new Date(item.fechaInicio)
					const anioApoyoExistente = date.getFullYear()

					let anioAprobacion = null

					if (isNull(_data.fechaInicio)) {
						anioAprobacion = parseInt(state.activeYear.nombre)
					} else {
						anioAprobacion = new Date(_data.fechaInicio).getFullYear()
					}

					if (anioApoyoExistente === anioAprobacion) {
						return item
					} else {
						return null
					}
				}
			})

			if (existeApoyo) {
				swal({
					title: 'Error al registrar el apoyo',
					text: 'Ya existe un apoyo para el año ingresado.',
					icon: 'error',
					className: 'text-alert-modal',
					buttons: {
						ok: {
							text: 'Ok',
							value: true,
							className: 'btn-alert-color'
						}
					}
				})
				setLoading(false)
				return
			}

			_data = {
				..._data,

				id: state.expedienteEstudiantil.currentStudent.idMatricula
			}
		} else {
			//update
			create = false

			_data = {
				..._data,
				tipoDeApoyoId: parseInt(formData.tipoDeApoyo),
				id: formData.id
			}
		}

		if (create) {
			const response = await actions.addApoyo(
				_data,
				categoria,
				categoria.addDispatchName,
				1
			)
			if (response.error) {
				setSnackbarContent({
					msg: 'Hubo un error al crear el registro',
					type: 'error'
				})
				handleClick()
			} else {
				setSnackbarContent({
					msg: 'Se ha creado el registro',
					type: 'success'
				})
				handleClick()
			}
		} else {
			const response = await actions.editApoyo(
				_data,
				categoria,
				categoria.addDispatchName,
				1
			)
			if (response.error) {
				setSnackbarContent({
					msg: 'Hubo un error al editar',
					type: 'error'
				})
				handleClick()
			} else {
				setSnackbarContent({
					msg: 'Se ha editado el registro',
					type: 'success'
				})
				handleClick()
			}
		}

		axios
			.get(
				`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Apoyo/categoria/${categoria.id}/1/20?identidadId=${state.identification.data.id}`
			)
			.then(response => {
				setLoading(false)
				setData(response.data.entityList)
				loadData()
			})
			.catch(error => {
				setLoading(false)
				console.log(error)
			})

		cleanFormData()
		setLoading(false)
		closeAgregarModal()
	}

	const closeAgregarModal = () => {
		cleanFormData()
		setShowNuevoApoyoModal(false)
	}

	const filterTiposDeApoyo = tipos => {
		let filtro = tiposApoyo
		if (tipos && tipos.length > 0) {
			const currentYear = moment().year()
			filtro = tipos.filter(tipoApoyo => {
				const hasApoyoThisYear = data.some(apoyoEstudiante => {
					const insertionYear = moment(
						apoyoEstudiante.fechaInsercion,
						'DD/MM/YYYY'
					).year()
					const isSameTipoApoyo =
						apoyoEstudiante.sb_TiposDeApoyoId === tipoApoyo.id
					const isCurrentYear = insertionYear === currentYear
					return isSameTipoApoyo && isCurrentYear
				})
				return !hasApoyoThisYear
			})
		}
		setTiposApoyoFilter(filtro)
	}

	const handleChangeItem = item => {
		setRadioValue(item.id)
		setFormData({
			...formData,
			tipoDeApoyo: item.id,
			nombreApoyo: item.nombre
		})
	}

	return (
		<>
			{/*loading && <BarLoader />*/}
			{loading && <Loader />}
			{snackbar(snackbarContent.type, snackbarContent.msg)}
			<TableReactImplementationApoyo
				placeholderText="Buscar por nombre"
				showAddButton={props.validations.agregar}
				msjButton="Agregar"
				onSubmitAddButton={() => onAgregarEvent()}
				data={data || []}
				columns={columns}
			/>
			<OptionModal
				isOpen={showModalTiposApoyo}
				titleHeader={'Tipos de apoyo'}
				onConfirm={() => setShowModalTiposApoyo(false)}
				onCancel={() => setShowModalTiposApoyo(false)}
			>
				<div>
					<FormControl>
						<RadioGroup
							aria-labelledby="demo-radio-buttons-group-label"
							name="radio-buttons-group"
							value={radioValue}
						>
							{tiposApoyoFilter.map((item, i) => (
								<Row key={i} style={{ marginTop: '10px' }}>
									<Col
										style={{
											display: 'flex',
											textAlign: 'left',
											justifyContent: 'left',
											alignItems: 'left'
										}}
										sm={12}
									>
										<FormControlLabel
											value={formData.tipoDeApoyo}
											onClick={(e, v) => {
												e.persist()
												handleChangeItem(item)
											}}
											checked={radioValue == item.id}
											control={<Radio style={{ color: primary }} />}
											label={item.nombre}
										/>
									</Col>
								</Row>
							))}
						</RadioGroup>
					</FormControl>
				</div>
			</OptionModal>
			<OptionModal
				isOpen={showNuevoApoyoModal && !showModalTiposApoyo}
				titleHeader={tituloModal}
				onConfirm={onConfirmSaveApoyo}
				onCancel={() => closeAgregarModal()}
				textConfirm="Guardar"
			>
				<Form onSubmit={onConfirmSaveApoyo}>
					<Row>
						<Col md={6}>
							<Label for="tipoDeApoyo">
								Tipo de apoyo <RequiredSpan />
							</Label>
							<StyledInput
								id="tipoDeApoyo"
								name="tipoDeApoyo"
								type="text"
								placeholder="Seleccionar"
								onClick={() => {
									setShowModalTiposApoyo(true)
								}}
								value={formData.nombreApoyo || 'Seleccionar'}
							></StyledInput>
						</Col>
						<Col md={6}>
							<FormGroup>
								<Label for="condicionDeApoyo">
									Condición del apoyo <RequiredSpan />
								</Label>
								<StyledInput
									id="condicionApoyo"
									name="condicionApoyo"
									type="select"
									onChange={handleFechaAprobacionOnChange}
									placeholder="Seleccionar"
									value={formData.condicionApoyo}
								>
									<option value={null}>
										{t('general>seleccionar', 'Seleccionar')}
									</option>
									{state.selects.tipoCondicionApoyo.map(tipo => {
										return <option value={tipo.id}>{tipo.nombre}</option>
									})}
								</StyledInput>
							</FormGroup>
						</Col>
					</Row>
					{showFechaAprobacion && (
						<Row>
							<Col md={6}>
								<FormGroup>
									<Label for="fechaDeAprobacion">
										Fecha de aprobación <RequiredSpan />
									</Label>
									<Input
										type="date"
										min={moment().startOf('year').format('YYYY-MM-DD')}
										max={moment().format('YYYY-MM-DD')}
										name="fechaDeAprobacion"
										style={{
											paddingRight: '12%'
										}}
										value={formData.fechaDeAprobacion}
										onChange={handleFormDataChange}
									/>
								</FormGroup>
							</Col>
						</Row>
					)}
					<Row>
						<Col md={12}>
							<FormGroup>
								<Label for="detalleDelApoyo">
									Detalle del apoyo <RequiredSpan />
								</Label>
								<Input
									type="textarea"
									id="detalleApoyo"
									name="detalleApoyo"
									rows="5"
									onChange={handleFormDataChange}
									value={formData.detalleApoyo}
								/>
							</FormGroup>
						</Col>
					</Row>
				</Form>
			</OptionModal>
		</>
	)
}

const StyledInput = styled(Input)`
	width: 100% !important;
`
export default withAuthorization({
	id: 9,
	Modulo: 'Expediente Estudiantil',
	Apartado: 'Apoyos Educativos',
	Seccion: 'Apoyos Educativos'
})(ApoyosOrganizativos)
