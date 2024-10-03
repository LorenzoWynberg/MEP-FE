import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Collapse } from '@mui/material'
import Subsidio from '../../_modals/beneficio'
import Tabla from './TablaMep'
import PropTypes from 'prop-types'
import { FormGroup, Label, Input, CustomInput, FormFeedback } from 'reactstrap'
import { useForm } from 'react-hook-form'
import moment from 'moment'
import Select from 'react-select'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import {
	addSubsidio,
	deleteSubsidio,
	editSubsidio,
	editSubsidioBody
} from 'Redux/beneficios/actions'
import useNotification from 'Hooks/useNotification'
import BarLoader from 'Components/barLoader/barLoader'
import OptionModal from 'Components/Modal/OptionModal'
import { isNaN, isEmpty } from 'lodash'
import swal from 'sweetalert'
import RequiredSpan from 'Components/Form/RequiredSpan'

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1
	},
	control: {
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2)
	},
	periodo: {
		paddingLeft: theme.spacing(2)
	}
}))

const BeneficiosMEP = props => {
	const {
		data,
		tipos,
		dependencias,
		handleSearch,
		handlePagination,
		totalRegistros,
		GetSubsidiosMEP
	} = props
	const classes = useStyles()
	const [open, setOpen] = useState(false)
	const [view, setView] = useState(false)
	const [editable, setEditable] = useState(true)
	const [currentSubsidio, setCurrentSubsidio] = useState({})
	const [prevSubsidio, setPrevSubsidio] = useState({})
	const [verificated, setVerificated] = useState(false)
	const [dependencia, setDependencia] = useState({})
	const [orderedTypes, setOrderedTypes] = useState(tipos)
	const [snackbarContent, setSnackbarContent] = useState({
		msg: '',
		type: ''
	})
	const [disabledRadio, setDisabledRadio] = useState(false)
	const [currentBeneficio, setCurrentBeneficio] = useState({})
	const [hideFechaFinal, setHideFechaFinal] = useState(false)
	const [visualizing, setVisualizing] = useState(false)
	const [showButtons, setShowButtons] = useState(true)
	const [snackbar, handleClick] = useNotification()
	const { reset, watch } = useForm()
	const [loading, setLoading] = useState(false)
	const [dataTable, setDataTable] = useState({})
	const [formData, setFormData] = useState({
		dateFrom: '',
		dateTo: '',
		detSubsidio: ''
	})

	const cleanDataForm = () => {
		const data = {
			dateFrom: '',
			dateTo: '',
			detSubsidio: ''
		}
		setFormData(data)
	}

	const handleFormDataChange = event => {
		setFormData({
			...formData,
			[event.target.name]: event.target.value
		})
	}

	const state = useSelector(store => {
		return {
			identification: store.identification,
			beneficios: store.beneficios
		}
	})

	const actions = useActions({
		addSubsidio,
		deleteSubsidio,
		editSubsidio,
		editSubsidioBody,
		GetSubsidiosMEP
	})

	const fromDate = watch('dateFrom')
	const toDate = watch('dateTo')
	const toDateInvalid =
		fromDate && toDate && moment(toDate, 'YYYY-MM-DD').isBefore(fromDate)

	useEffect(() => {
		if (fromDate) {
			const fromDateParsed = moment(fromDate)
			if (moment().isSameOrBefore(fromDateParsed)) {
				setVerificated(false)
				setDisabledRadio(true)
			} else {
				setDisabledRadio(false)
			}
		}
	}, [fromDate])

	useEffect(() => {
		setOrderedTypes(tipos)
	}, [tipos])

	useEffect(() => {
		setOrderedTypes(tipos)
	}, [currentBeneficio])

	const handleSubsidio = () => {
		setOpen(!open)
	}

	const handleChangeSubsidio = item => {
		setFormData({
			...formData,
			detSubsidio: item.detalle
		})
		setCurrentSubsidio(item)
	}

	const toggleModal = (saveData = false) => {
		if (saveData) {
			setPrevSubsidio(currentSubsidio)
		}
		setOpen(!open)
		setCurrentSubsidio({})
	}

	const sendData = async () => {
		setLoading(true)
		if (moment(formData.dateTo, 'YYYY-MM-DD').isBefore(formData.dateFrom)) {
			swal({
				title: 'Error',
				text: 'La fecha de final no puede ser menor a la fecha de inicio',
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

		let isInvalid = false
		let validationMessage = ''

		if (isEmpty(dependencia)) {
			validationMessage = '\nLa dependencia es requerida'
			isInvalid = true
		}

		if (!prevSubsidio?.id || isNaN(prevSubsidio?.id)) {
			validationMessage += '\nEl tipo de subsidio es requerido'
			isInvalid = true
		}

		if (formData.dateFrom === '') {
			validationMessage += '\nLa fecha de aprobación es requerida'
			isInvalid = true
		}

		if (isInvalid) {
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

		let response = null

		let _data = {
			identidadesId: state.identification.data?.id,
			tipoSubsidioId: prevSubsidio?.id,
			detalle: prevSubsidio?.detalle,
			recepcionVerificada: verificated,
			fechaInicio: moment(formData.dateFrom).toDate(),
			fechaFinal: moment(formData.dateTo).toDate()
		}

		if (hideFechaFinal) {
			_data.fechaFinal = _data.fechaInicio
		}

		if (dataTable.id) {
			_data.id = dataTable.id
			response = await actions.editSubsidioBody(_data)
			setLoading(false)
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
				setView(false)
				clearData()
			}
		} else {
			_data.id = 0
			response = await actions.addSubsidio(_data)
			setLoading(false)
			if (response.error) {
				setSnackbarContent({
					msg: 'Hubo un error al crear',
					type: 'error'
				})
				handleClick()
			} else {
				setSnackbarContent({
					msg: 'Se ha creado el registro',
					type: 'success'
				})
				handleClick()
				setView(false)
				clearData()
			}
		}
	}

	const clearData = () => {
		reset()
		setCurrentSubsidio({})
		setPrevSubsidio({})
		setDependencia({})
		setVerificated(false)
		cleanDataForm()
	}

	const handleDeleteSubsidio = async ids => {
		try {
			const response = await actions.deleteSubsidio(
				ids,
				state.identification.data.id
			)
			toggleSnackbar('success', 'El subsidio se ha eliminado correctamente.')
		} catch (e) {
			toggleSnackbar('error', 'Error eliminando el subsidio.')
		}
	}

	const handleViewSubsidio = (e, show) => {
		setLoading(true)
		setDataTable(e)
		setDependencia({ label: e?.nombreDependecia, value: null })
		setFormData({
			...formData,
			dateFrom: moment(e?.fechaInicio).format('YYYY-MM-DD'),
			dateTo: moment(e?.fechaFinal).format('YYYY-MM-DD'),
			detSubsidio: e?.detalle
		})
		setVerificated(e?.recepcionVerificada == 'Si')
		setPrevSubsidio(tipos.find(tipo => tipo?.nombre == e?.nombreTipoSubsidio))
		setShowButtons(show)
		setView(true)
		setLoading(false)
	}

	const handleCreateToggle = () => {
		clearData()
		setView(true)
		setShowButtons(true)
		setVisualizing(false)
		setEditable(true)
	}

	const toggleSnackbar = (type, msg) => {
		setSnackbarContent({
			msg,
			type
		})
		handleClick()
	}

	const handleUpdateSubsidio = async (id, estado) => {
		let response = null
		response = await actions.editSubsidio(id, estado)
		if (!response?.error && estado === 0) {
			toggleSnackbar('success', 'Se ha deshabilitado correctamente.')
			await actions.GetSubsidiosMEP(state.identification.data?.id, 1, 10)
		} else if (!response?.error && estado === 1) {
			toggleSnackbar('success', 'Se ha activado correctamente.')
			await actions.GetSubsidiosMEP(state.identification.data?.id, 1, 10)
		} else if (response?.error) {
			toggleSnackbar('error', 'Error activando el subsidio.')
		}
	}

	if (loading || props.loading) return <BarLoader />
	return (
		<>
			{snackbar(snackbarContent.type, snackbarContent.msg)}
			<OptionModal
				isOpen={view}
				titleHeader={'Por parte del MEP'}
				hideCancel={visualizing}
				onConfirm={() => (!visualizing ? sendData(dataTable) : setView(false))}
				onCancel={() => setView(false)}
				textConfirm={'Guardar'}
			>
				<Grid container>
					<Grid item xs={12} className={classes.control}>
						<FormGroup>
							<Label for="dependencia">
								Dependencia <RequiredSpan />{' '}
							</Label>
							<Select
								name="dependencia"
								className="react-select"
								classNamePrefix="react-select"
								placeholder="Seleccione una dependencia"
								value={isEmpty(dependencia) ? '' : dependencia}
								options={dependencias.map(item => ({
									...item,
									value: item.id,
									label: item.nombre
								}))}
								isDisabled={!editable}
								noOptionsMessage={() => 'No hay opciones'}
								onChange={data => {
									setDependencia(data)
									setOrderedTypes(
										tipos.filter(
											item => item.dependeciasSubsidioId === data.value
										)
									)
									setHideFechaFinal(
										data.nombre ==
											'Departamento de apoyos educativos para el estudiantado con discapacidad, Dirección de Desarrollo Curricular (DDC)'
									)
									setPrevSubsidio({})
									setFormData({
										...formData,
										detSubsidio: ''
									})
								}}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="tiposubsidio">
								Tipo de subsidio MEP <RequiredSpan />
							</Label>
							<Input
								name="tiposubsidio"
								onClick={() => {
									handleSubsidio()
								}}
								value={prevSubsidio?.nombre || ''}
								disabled={!editable || isEmpty(dependencia)}
								onChange={() => {}}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="detSubsidio">Detalle del subsidio MEP</Label>
							<Input
								type="textarea"
								style={{
									resize: 'none',
									height: 80
								}}
								name="detSubsidio"
								id="detSubsidio"
								disabled={true}
								//innerRef={register}
								value={formData?.detSubsidio || ''}
								onChange={() => {}}
							/>
						</FormGroup>
						<FormGroup>
							<Label>Verificación de la recepción del apoyo</Label>
							<div>
								<CustomInput
									id={'verificated'}
									type="radio"
									label="Si"
									inline="true"
									disabled={!editable || disabledRadio}
									checked={verificated}
									onChange={() => {}}
									onClick={() => {
										setVerificated(!verificated)
									}}
									value={verificated}
								/>
								<CustomInput
									id={'verificated'}
									type="radio"
									label="No"
									inline="true"
									disabled={!editable || disabledRadio}
									checked={!verificated}
									onChange={() => {}}
									onClick={() => {
										setVerificated(!verificated)
									}}
									value={verificated}
								/>
							</div>
						</FormGroup>
					</Grid>
					<Grid container>
						<Grid item xs={6} className={classes.control}>
							<FormGroup>
								<Label for="dateFrom">
									Fecha inicio / Entrega <RequiredSpan />
								</Label>
								<Input
									type="date"
									min={moment()
										.subtract(1, 'year')
										.month(7)
										.date(1)
										.format('YYYY-MM-DD')}
									max={moment().format('YYYY-MM-DD')}
									name="dateFrom"
									style={{
										paddingRight: '12%'
									}}
									invalid={toDateInvalid || state.beneficios.fields.fechaInicio}
									disabled={!editable}
									value={formData.dateFrom}
									onChange={handleFormDataChange}
								/>
							</FormGroup>
						</Grid>
						<Grid item xs={6} className={classes.control}>
							<Collapse in={!hideFechaFinal} timeout={750} easing="easeInOut">
								<FormGroup>
									<Label for="dateTo">Fecha final ( Opcional )</Label>
									<Input
										min={moment().startOf('year').format('YYYY-MM-DD')}
										max={moment()
											.add(1, 'year')
											.month(5)
											.date(30)
											.format('YYYY-MM-DD')}
										type="date"
										name="dateTo"
										style={{
											paddingRight: '12%'
										}}
										invalid={
											toDateInvalid || state.beneficios.fields.fechaFinal
										}
										disabled={!editable}
										value={formData.dateTo}
										onChange={handleFormDataChange}
									/>
									<FormFeedback>
										{toDateInvalid &&
											'la fecha de inicio debe ser antes de la fecha de final'}
										{state.beneficios.fields.fechaFinal &&
											state.beneficios.errors.fechaFinal}
									</FormFeedback>
								</FormGroup>
							</Collapse>
						</Grid>
					</Grid>
				</Grid>
			</OptionModal>
			<div>
				<h5>Por parte del MEP</h5>
				<Tabla
					placeholder="Buscar por nombre"
					beneficios={state.beneficios}
					handlePagination={handlePagination}
					toggleSnackbar={toggleSnackbar}
					handleSearch={handleSearch}
					totalRegistros={totalRegistros}
					data={data}
					authHandler={props.authHandler}
					handleViewSubsidio={handleViewSubsidio}
					tipos={tipos}
					match={props.match}
					loading={loading}
					setEditable={setEditable}
					handleCreateToggle={handleCreateToggle}
					handleDeleteSubsidio={handleDeleteSubsidio}
					handleUpdateSubsidio={handleUpdateSubsidio}
					setVisualizing={setVisualizing}
					{...props}
				/>
			</div>
			<Subsidio
				open={open}
				tipos={orderedTypes}
				currentSubsidio={currentSubsidio}
				handleChangeSubsidio={handleChangeSubsidio}
				toggleModal={toggleModal}
			/>
		</>
	)
}

BeneficiosMEP.prototype = {
	data: PropTypes.array,
	tipos: PropTypes.array,
	loading: PropTypes.bool
}
BeneficiosMEP.defaultProps = {
	data: [],
	tipos: [],
	loading: false
}

export default BeneficiosMEP
