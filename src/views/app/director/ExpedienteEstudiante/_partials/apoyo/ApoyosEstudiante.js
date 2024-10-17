import React, { useState, useMemo, useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Row, Col, Form, FormGroup, Label, Input } from 'reactstrap'
import { SearchWithYearsTableReactImplementation } from 'Components/SearchWithYearsTableReactImplementation'
import useNotification from 'Hooks/useNotification'
import withAuthorization from '../../../../../../Hoc/withAuthorization'
import styled from 'styled-components'
import {
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
import 'react-datepicker/dist/react-datepicker.css'
import { getCatalogsByName } from 'Redux/selects/actions'
import { useActions } from 'Hooks/useActions'
import axios from 'axios'
import { envVariables } from '../../../../../../constants/enviroment'
import swal from 'sweetalert'
import { isNull, isUndefined, isEmpty } from 'lodash'
import Loader from 'Components/LoaderContainer'
import FormModal from 'Components/Modal/FormModal'
import OptionModal from 'Components/Modal/OptionModal'
import RequiredSpan from 'Components/Form/RequiredSpan'
import moment from 'moment'
import colors from 'assets/js/colors'
import { catalogsEnumByName } from '../../../../../../utils/catalogsEnum'
import { set } from 'lodash'

const condicionSeRecibeNombre = 'Se recibe'

const ApoyosEstudiante = props => {
	const categoria = props.categoria
	const { t } = useTranslation()
	const [snackbar, handleClick] = useNotification()
	const [loading, setLoading] = useState(true)
	const [showModalTiposApoyo, setShowModalTiposApoyo] = useState(false)
	const [data, setData] = useState([])
	const [showNuevoApoyoModal, setShowNuevoApoyoModal] = useState(false)
	const [tiposApoyo, setTiposApoyo] = useState([])
	const [tiposApoyoFilter, setTiposApoyoFilter] = useState([])
	const [showFechaAprobacion, setShowFechaAprobacion] = useState(false)
	const [radioValue, setRadioValue] = useState(0)
	const [editable, setEditable] = useState(false)
	const [snackbarContent, setSnackbarContent] = useState({
		msg: '',
		variant: ''
	})
	const [checkedValid, setCheckedValid] = useState(false)
	const [formData, setFormData] = useState({
		id: 0,
		tipoDeApoyo: 0,
		condicionApoyo: '',
		detalleApoyo: '',
		nombreApoyo: '',
		fechaDeAprobacion: ''
	})
	const [loadingData, setLoadingData] = useState(true)

	const primary = colors.primary

	const actions = useActions({
		getApoyosByType,
		addApoyo,
		deleteApoyo,
		editApoyo,
		getCatalogsByName
	})

	const state = useSelector(store => {
		return {
			expedienteEstudiantil: store.expedienteEstudiantil,
			identification: store.identification,
			selects: store.selects
		}
	})

	useEffect(() => {
		const loadData = async () => {
			try {
				setLoading(true)

				const tiposDeApoyo = props.apoyos.tipos.filter(
					tipo => tipo.categoriaApoyoId === categoria.id
				)

				setTiposApoyo(tiposDeApoyo)

				const condicionApoyo = props.catalogos.find(item => {
					return item.nombre === 'Condiciones de Apoyo'
				})

				if (!state.selects.tipoCondicionApoyo[0]) {
					await actions.getCatalogsByName(
						condicionApoyo.id,
						-1,
						-1,
						condicionApoyo.nombre
					)
				}
			} finally {
				setLoading(false)
			}
		}
		loadData()
	}, [])

	useEffect(() => {
		setLoadingData(true)

		axios
			.get(
				`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Apoyo/categoria/${categoria.id}/1/20?identidadId=${state.identification.data.id}`
			)
			.then(response => {
				setData(response.data.entityList)
				setLoadingData(false)
			})
			.catch(error => {
				console.log(error)
				setLoadingData(false)
			})
	}, [])

	useEffect(() => {
		filterTiposDeApoyo(tiposApoyo)
	}, [data])

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
		setCheckedValid(false)
	}

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

		let fechaAprobacion = formData.fechaDeAprobacion

		if (value === condicionSeRecibe.id) {
			setShowFechaAprobacion(true)
		} else {
			setShowFechaAprobacion(false)
			fechaAprobacion = ''
		}
		setFormData({
			...formData,
			condicionApoyo: value,
			fechaDeAprobacion: fechaAprobacion
		})
	}

	/*
		JP
	*/
	const errorToast = msg => {
		setSnackbarContent({ msg, variant: 'error' })
		handleClick()
	}

	const onAgregarEvent = () => {
		setShowNuevoApoyoModal(true)
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
			}
		]
	}, [state.expedienteEstudiantil.currentStudent])

	const onConfirmSaveApoyo = async event => {
		setCheckedValid(true)
		event.preventDefault()
		setLoading(true)

		let validationMessage = ''
		let hayError = false

		if (formData.tipoDeApoyo === 0 || isNaN(formData.tipoDeApoyo)) {
			hayError = true
		}

		if (formData.condicionApoyo === '' || isNaN(formData.condicionApoyo)) {
			hayError = true
		}

		if (formData.detalleApoyo === '') {
			hayError = true
		}

		const condicionesApoyo = state.selects.tipoCondicionApoyo

		const condicionSeRecibe = condicionesApoyo.find(
			o => o.nombre === condicionSeRecibeNombre
		)

		if (
			formData.fechaDeAprobacion === '' &&
			formData.condicionApoyo === condicionSeRecibe.id
		) {
			hayError = true
		}

		if (hayError) {
			errorToast('Faltan rellenar campos obligatorios')
			setLoading(false)
			return
		}

		let _data = {
			id: state.expedienteEstudiantil.currentStudent.idMatricula,
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

		const response = await actions.addApoyo(
			_data,
			categoria,
			categoria.addDispatchName,
			1
		)
		if (response.error) {
			setSnackbarContent({
				msg: 'Hubo un error al crear el registro',
				variant: 'error'
			})
			handleClick()
		} else {
			setSnackbarContent({
				msg: 'Se ha creado el registro',
				variant: 'success'
			})
			handleClick()
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
		closeAgregarModal()
	}

	const closeAgregarModal = () => {
		cleanFormData()
		setCheckedValid(false)
		setShowNuevoApoyoModal(false)
	}

	const filterTiposDeApoyo = tipos => {
		let filtro = tiposApoyo

		if (categoria.nombre === 'Apoyos curriculares') {
			setTiposApoyoFilter(filtro)
			return
		}

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

	if (loading || loadingData) {
		return <Loader />
	}
	return (
		<>
			{snackbar(snackbarContent.variant, snackbarContent.msg)}
			<SearchWithYearsTableReactImplementation
				placeholderText="Buscar por nombre"
				showAddButton={props.validations.agregar}
				msjButton="Agregar"
				onSubmitAddButton={() => onAgregarEvent()}
				data={data || []}
				columns={columns}
			/>

			<OptionModal isOpen={showModalTiposApoyo} radioValue={radioValue} onSelect={(item) => {handleChangeItem(item)}} selectedId={formData.tipoDeApoyo} onConfirm={() => setShowModalTiposApoyo(false)} titleHeader={'Tipos de apoyo'}   options={tiposApoyoFilter} />
  
			<FormModal
				isOpen={showNuevoApoyoModal && !showModalTiposApoyo}
				titleHeader={categoria.tituloModal}
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
							<Input
								style={{
									border:
										checkedValid && formData.tipoDeApoyo === 0
											? '1px solid red'
											: ''
								}}
								id="tipoDeApoyo"
								name="tipoDeApoyo"
								type="text"
								placeholder="Seleccionar"
								onClick={() => {
									setShowModalTiposApoyo(true)
								}}
								value={formData.nombreApoyo || 'Seleccionar'}
							></Input>
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
									style={{
										border:
											checkedValid &&
												(formData.condicionApoyo === '' ||
													isNaN(formData.condicionApoyo))
												? '1px solid red'
												: ''
									}}
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
											paddingRight: '12%',
											border:
												checkedValid && formData.fechaDeAprobacion === ''
													? '1px solid red'
													: ''
										}}
										value={moment(formData.fechaDeAprobacion).format(
											'YYYY-MM-DD'
										)}
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
									style={{
										border:
											checkedValid && formData.detalleApoyo === ''
												? '1px solid red'
												: ''
									}}
									rows="5"
									onChange={handleFormDataChange}
									value={formData.detalleApoyo}
								/>
							</FormGroup>
						</Col>
					</Row>
				</Form>
			</FormModal>
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
})(ApoyosEstudiante)
