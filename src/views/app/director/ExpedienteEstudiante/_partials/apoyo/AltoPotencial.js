import React, { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import {
	Row,
	Col,
	Form,
	FormGroup,
	Label,
	Input,
	CustomInput
} from 'reactstrap'
import { TableReactImplementationApoyo } from 'Components/TableReactImplementationApoyo'
import useNotification from 'Hooks/useNotification'
import withAuthorization from '../../../../../../Hoc/withAuthorization'
import styled from 'styled-components'
import { addApoyo, deleteApoyo, editApoyo } from 'Redux/apoyos/actions'
import {
	Checkbox,
	FormControl,
	FormControlLabel,
	FormLabel,
	Radio,
	RadioGroup,
	Typography
} from '@material-ui/core'
import Tooltip from '@mui/material/Tooltip'
import 'react-datepicker/dist/react-datepicker.css'
import { getCatalogs, getCatalogsByName } from 'Redux/selects/actions'
import { useActions } from 'Hooks/useActions'
import axios from 'axios'
import { envVariables } from '../../../../../../constants/enviroment'
import { IoMdTrash } from 'react-icons/io'
import IconButton from '@mui/material/IconButton'
import { HiPencil } from 'react-icons/hi'
import swal from 'sweetalert'
import Loader from 'Components/LoaderContainer'
import OptionModal from 'Components/Modal/OptionModal'
import RequiredSpan from 'Components/Form/RequiredSpan'
import colors from 'assets/js/colors'
import { Rtt } from '@mui/icons-material'

const categoria = {
	id: 5,
	nombre: 'Condición alto potencial',
	addDispatchName: 'condiciónaltopotencial5'
}

const tituloModal = 'Registros de alto potencial'

const AltoPotencial = props => {
	const [loading, setLoading] = useState(true)
	const [showModalTiposApoyo, setShowModalTiposApoyo] = useState(false)
	const [showModalTalento, setShowModalTalento] = useState(false)
	const [data, setData] = useState([])
	const [showNuevoApoyoModal, setShowNuevoApoyoModal] = useState(false)
	const [tiposApoyo, setTiposApoyo] = useState([])
	const [talentos, setTalentos] = useState([])
	const [estrategias, setEstrategias] = useState([])
	const [editable, setEditable] = useState(false)
	const [radioValueTalento, setRadioValueTalento] = useState(0)
	const [radioValueApoyo, setRadioValueApoyo] = useState(0)
	const [snackbar, handleClick] = useNotification()
	const [snackbarContent, setSnackbarContent] = useState({
		msg: '',
		type: ''
	})
	const [aniosDeteccion, setAnionsDeteccion] = useState([])
	const [formData, setFormData] = useState({
		id: 0,
		tipoDeApoyo: 0,
		talentoId: '',
		nombreTalento: '',
		anioAprobacion: 0,
		estrategias: [],
		nombreApoyo: '',
		fechaDeAprobacion: ''
	})

	const primary = colors.primary

	const { t } = useTranslation()

	const actions = useActions({
		addApoyo,
		deleteApoyo,
		editApoyo,
		getCatalogs,
		getCatalogsByName
	})

	const state = useSelector(store => {
		return {
			expedienteEstudiantil: store.expedienteEstudiantil,
			identification: store.identification,
			selects: store.selects
		}
	})

	const loadTalentos = async () => {
		try {
			debugger
			const catalogoTalentos = props.catalogos.find(item => {
				return item.nombre === 'Talentos'
			})

			if (!state.selects.talentos[0]) {
				await actions.getCatalogsByName(
					catalogoTalentos.id,
					-1,
					-1,
					catalogoTalentos.nombre
				)
			}
			console.log('Talentos JP', state.selects.talentos)

			setTalentos(state.selects.talentos)
		} finally {
			setLoading(false)
		}
	}

	const loadEstrategias = async () => {
		try {
			debugger
			const catalogoEstategias = props.catalogos.find(item => {
				return item.nombre === 'Estrategias de flexibilización curricular'
			})

			if (!state.selects.estrategiasFlexibilidadCurricular[0]) {
				await actions.getCatalogsByName(
					catalogoEstategias.id,
					-1,
					-1,
					catalogoEstategias.nombre
				)
			}

			console.log(
				'Estrategias JP',
				state.selects.estrategiasFlexibilidadCurricular
			)

			console.log('Selects JP', state.selects)

			setEstrategias(state.selects.estrategiasFlexibilidadCurricular)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadEstrategias()
		loadTalentos()
	}, [])

	useEffect(() => {
		const currentYear = new Date().getFullYear()
		let anios = []
		for (let i = 2015; i <= currentYear; i++) {
			anios.push({
				id: i,
				nombre: i
			})
		}
		setAnionsDeteccion(anios)
	}, [])

	useEffect(() => {
		const loadData = async () => {
			try {
				debugger
				setLoading(true)

				const tiposDeApoyo = props.apoyos.tipos.filter(
					tipo => Number(tipo.categoriaApoyoId) === categoria.id
				)

				setTiposApoyo(tiposDeApoyo)
			} finally {
				setLoading(false)
			}
		}
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

	const cleanFormData = () => {
		const data = {
			id: 0,
			tipoDeApoyo: 0,
			talentoId: '',
			nombreTalento: '',
			anioAprobacion: 0,
			estrategias: [],
			nombreApoyo: '',
			fechaDeAprobacion: ''
		}
		setFormData(data)
		setRadioValueTalento(0)
		setRadioValueApoyo(0)
	}

	const handleFechaAprobacionOnChange = event => {
		const anio = Number(event.target.value)

		const fechaInicio = '01/01/' + anio

		setFormData({
			...formData,
			fechaDeAprobacion: fechaInicio,
			anioAprobacion: anio
		})
	}

	const handleClickEstrategias = item => {
		let estrategias = formData.estrategias

		const filteredEstrategias = estrategias.filter(
			estrategia => estrategia === item.id
		)

		if (filteredEstrategias.length > 0) {
			estrategias = estrategias.filter(estrategia => estrategia !== item.id)
			setFormData({
				...formData,
				estrategias: estrategias
			})
		} else {
			estrategias.push(item.id)
			setFormData({
				...formData,
				estrategias: estrategias
			})
		}
	}

	const deleteApoyoById = apoyoId => {
		setLoading(true)
		try {
			axios
				.delete(
					`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Apoyo/${apoyoId}`
				)
				.then(response => {
					axios
						.get(
							`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Apoyo/categoria/${categoria.id}/1/20?identidadId=${state.identification.data.id}`
						)
						.then(response => {
							setData(response.data.entityList)
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

		setRadioValueApoyo(row.sb_TiposDeApoyoId)
		setRadioValueTalento(row.sB_TalentoId)

		let anioAprobacion = null
		if (row.fechaInicio) {
			anioAprobacion = new Date(row.fechaInicio).getFullYear()
		}

		setFormData({
			id: row.id,
			tipoDeApoyo: row.sb_TiposDeApoyoId,
			nombreApoyo: row.sb_TiposDeApoyo,
			talentoId: row.sB_TalentoId,
			nombreTalento: row.sB_TalentoDesc,
			estrategias: row.estrategias,
			anioAprobacion: anioAprobacion,
			fechaDeAprobacion: row.fechaInicio
		})
	}

	const columns = useMemo(() => {
		return [
			{
				Header: 'Condición',
				column: 'sb_TiposDeApoyo',
				accessor: 'sb_TiposDeApoyo',
				label: ''
			},
			{
				Header: 'Talento',
				column: 'sB_TalentoDesc',
				accessor: 'sB_TalentoDesc',
				label: ''
			},
			{
				Header: 'Estrategias de flexibilización',
				column: 'estrategiasDesc',
				accessor: 'estrategiasDesc',
				label: ''
			},
			{
				Header: 'Registrado por (Usuario)',
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

		if (formData.tipoDeApoyo === 0 || isNaN(formData.tipoDeApoyo)) {
			validationMessage = '\nEl tipo de apoyo es requerido'
			hayError = true
		}

		if (formData.talentoId === '' || isNaN(formData.talentoId)) {
			validationMessage += '\nEl talento es requerido'
			hayError = true
		}

		if (formData.anioAprobacion === 0) {
			validationMessage += '\nEl año de aprobación es requerido'
			hayError = true
		}

		if (formData.estrategias.length === 0) {
			validationMessage +=
				'\nDebe seleccionar al menos una estrategia de flexibilización'
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
			fechaInicio: formData.fechaDeAprobacion
				? formData.fechaDeAprobacion
				: null,
			//fechaFin: null,
			dependenciasApoyosId: null,
			sb_TiposDeApoyoId: parseInt(formData.tipoDeApoyo),
			//condicionApoyoId: parseInt(formData.condicionApoyo),
			identidadesId: state.identification.data.id,
			sb_TalentoId: parseInt(formData.talentoId),
			estrategias: formData.estrategias
		}

		let create = true
		//create
		if (formData.id === 0) {
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

	const handleChangeItem = item => {
		setRadioValueApoyo(item.id)
		setFormData({
			...formData,
			tipoDeApoyo: item.id,
			nombreApoyo: item.nombre
		})
	}

	const handleChangeTalento = item => {
		setRadioValueTalento(item.id)
		setFormData({
			...formData,
			talentoId: item.id,
			nombreTalento: item.nombre
		})
	}

	if (
		loading &&
		state.selects.talentos.length === 0 &&
		state.selects.estrategiasFlexibilidadCurricular.length === 0
	) {
		return <Loader />
	}

	return (
		<>
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
							value={radioValueApoyo}
						>
							{tiposApoyo.map((item, i) => (
								<Row key={i} style={{ marginTop: '10px' }}>
									<Col
										style={{
											display: 'flex',
											textAlign: 'left',
											justifyContent: 'left',
											alignItems: 'left'
										}}
										sm={4}
									>
										<FormControlLabel
											value={formData.tipoDeApoyo}
											onClick={(e, v) => {
												e.persist()
												handleChangeItem(item)
											}}
											checked={radioValueApoyo == item.id}
											control={<Radio style={{ color: primary }} />}
											label={item.nombre}
										/>
									</Col>
									<Col sm={8}>{item.detalle}</Col>
								</Row>
							))}
						</RadioGroup>
					</FormControl>
				</div>
			</OptionModal>
			{/* Talentos */}
			<OptionModal
				isOpen={showModalTalento}
				titleHeader={'Talentos'}
				onConfirm={() => setShowModalTalento(false)}
				onCancel={() => setShowModalTalento(false)}
			>
				<div>
					<FormControl>
						<RadioGroup
							aria-labelledby="demo-radio-buttons-group-label"
							name="radio-buttons-group"
							value={radioValueTalento}
						>
							{state.selects.talentos.map((item, i) => (
								<Row key={i} style={{ marginTop: '10px' }}>
									<Col
										style={{
											display: 'flex',
											textAlign: 'left',
											justifyContent: 'left',
											alignItems: 'left'
										}}
										sm={4}
									>
										<FormControlLabel
											value={formData.talentoId}
											onClick={(e, v) => {
												e.persist()
												handleChangeTalento(item)
											}}
											checked={radioValueTalento == item.id}
											control={<Radio style={{ color: primary }} />}
											label={item.nombre}
										/>
									</Col>
									<Col sm={8}>{item.descripcion}</Col>
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
						<Col md={4}>
							<Label for="tipoDeApoyo">
								Condición de alto potencial <RequiredSpan />
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
						<Col md={4}>
							<Label for="talentoId">
								Talentos <RequiredSpan />
							</Label>
							<StyledInput
								id="talentoId"
								name="talentoId"
								type="text"
								placeholder="Seleccionar"
								onClick={() => {
									setShowModalTalento(true)
								}}
								value={formData.nombreTalento || 'Seleccionar'}
							></StyledInput>
						</Col>

						<Col md={4}>
							<Label for="anioIdentificacion">
								Año de identificación de la condición <RequiredSpan />
							</Label>
							<StyledInput
								id="anioIdentificacion"
								name="anioIdentificacion"
								type="select"
								onChange={handleFechaAprobacionOnChange}
								placeholder="Seleccionar"
								value={formData.anioAprobacion}
							>
								<option value={null}>
									{t('general>seleccionar', 'Seleccionar')}
								</option>
								{aniosDeteccion.map(tipo => {
									return <option value={tipo.id}>{tipo.nombre}</option>
								})}
							</StyledInput>
						</Col>
					</Row>

					<Row className="mt-4">
						<Col md={12}>
							<span>
								Estrategias de flexibilización curricular <RequiredSpan />
							</span>
						</Col>
					</Row>

					<Row className="mt-3">
						{state.selects.estrategiasFlexibilidadCurricular.map((item, i) => (
							<Col md={3}>
								<FormGroup>
									<FormControlLabel
										control={
											<Checkbox
												id={i}
												color="primary"
												checked={formData.estrategias.some(
													obj => obj === item.id
												)}
												onClick={() => handleClickEstrategias(item)}
											/>
										}
										label={
											<Typography variant="body2">{item.nombre}</Typography>
										}
									/>
								</FormGroup>
							</Col>
						))}
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
})(AltoPotencial)
