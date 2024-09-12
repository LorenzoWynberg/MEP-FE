import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Subsidio from '../../_modals/beneficio'
import Tabla from './TablaMep'
import PropTypes from 'prop-types'
import IntlMessages from '../../../../../../helpers/IntlMessages'
import styled from 'styled-components'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import { FormGroup, Label, Input, CustomInput, Form, FormFeedback } from 'reactstrap'
import { EditButton } from 'Components/EditButton'
import { useForm } from 'react-hook-form'
import moment from 'moment'
import Select from 'react-select'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import { addSubsidio, deleteSubsidio, editSubsidio, editSubsidioBody, GetSubsidiosMEP } from 'Redux/beneficios/actions'
import useNotification from 'Hooks/useNotification'
import RequiredLabel from 'Components/common/RequeredLabel'
import BarLoader from 'Components/barLoader/barLoader'
import OptionModal from 'Components/Modal/OptionModal'
import { datePickerDefaultProps } from '@material-ui/pickers/constants/prop-types'
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
	},
	paper: {
		minHeight: 475,
		padding: 20,
		marginLeft: 10,
		marginBottom: 20,
		marginTop: 20
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
		GetSubsidiosMEP,
		data1,
		GetDependencias,
		GetTypes
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
	const [visualizing, setVisualizing] = useState(false)
	const [showButtons, setShowButtons] = useState(true)
	const [snackbar, handleClick] = useNotification()
	const { register, handleSubmit, reset, watch, setValue } = useForm()
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

	const actions = useActions({ addSubsidio, deleteSubsidio, editSubsidio, editSubsidioBody, GetSubsidiosMEP })
	const fromDate = watch('dateFrom')
	const toDate = watch('dateTo')
	const toDateInvalid = fromDate && toDate && moment(toDate, 'YYYY-MM-DD').isBefore(fromDate)

	useEffect(() => {
		setOrderedTypes(tipos)
	}, [tipos])

	useEffect(() => {
		setOrderedTypes(tipos)
	}, [currentBeneficio])

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

	const sendData = async data => {
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

		let hayError = false
		let validationMessage = ''

		if (isEmpty(dependencia)) {
			validationMessage = '\nLa dependencia es requerida'
			hayError = true
		}

		if (!prevSubsidio?.id || isNaN(prevSubsidio?.id)) {
			validationMessage += '\nEl tipo de subsidio es requerido'
			hayError = true
		}

		if (formData.dateFrom === '') {
			validationMessage += '\nLa fecha de inicio es requerida'
			hayError = true
		}

		if (formData.dateTo === '') {
			validationMessage += '\nLa fecha de fin es requerida'
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

		let response = null

		let _data = {
			identidadesId: state.identification.data?.id,
			tipoSubsidioId: prevSubsidio?.id,
			detalle: prevSubsidio?.detalle,
			recepcionVerificada: verificated,
			fechaInicio: moment(formData.dateFrom).toDate(),
			fechaFinal: moment(formData.dateTo).toDate()
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
		const response = await actions.deleteSubsidio(ids, state.identification.data.id)
		return response
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
		const prevSub = tipos.find(tipo => tipo?.nombre == e?.nombreTipoSubsidio)
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
			>
				<Grid container>
					<Grid item xs={12} className={classes.control}>
						<FormGroup>
							<Label for='dependencia'>
								Dependecia <RequiredSpan />{' '}
							</Label>
							<Select
								name='dependencia'
								className='react-select'
								classNamePrefix='react-select'
								value={dependencia}
								options={dependencias.map(item => ({
									...item,
									value: item.id,
									label: item.nombre
								}))}
								isDisabled={!editable}
								noOptionsMessage={() => 'No hay opciones'}
								onChange={data => {
									setDependencia(data)
									setOrderedTypes(tipos.filter(item => item.dependeciasSubsidioId === data.value))
									setPrevSubsidio(null)
								}}
							/>
						</FormGroup>
						<FormGroup>
							<Label for='tiposubsidio'>
								Tipo de subsidio MEP <RequiredSpan />
							</Label>
							<Input
								name='tiposubsidio'
								onClick={() => {
									handleSubsidio()
								}}
								value={prevSubsidio?.nombre || ''}
								disabled={!editable}
							/>
						</FormGroup>
						<FormGroup>
							<Label for='detSubsidio'>Detalle del subsidio MEP</Label>
							<Input
								type='textarea'
								style={{
									resize: 'none',
									height: 80
								}}
								name='detSubsidio'
								id='detSubsidio'
								disabled={true}
								//innerRef={register}
								value={formData?.detSubsidio || ''}
							/>
						</FormGroup>
						<FormGroup>
							<Label>Verificación de la recepción del apoyo</Label>
							<div>
								<CustomInput
									type='radio'
									label='Si'
									inline
									disabled={!editable || disabledRadio}
									checked={verificated}
									onClick={() => {
										setVerificated(true)
									}}
									value={verificated}
								/>
								<CustomInput
									type='radio'
									label='No'
									inline
									disabled={!editable || disabledRadio}
									checked={!verificated}
									onClick={() => {
										setVerificated(false)
									}}
									value={verificated}
								/>
							</div>
						</FormGroup>
					</Grid>
					<Grid container>
						<Grid item xs={12} className={classes.periodo}>
							<Label>Periodo activo</Label>
						</Grid>
						<Grid item xs={5} className={classes.control}>
							<FormGroup>
								<Label for='dateFrom'>
									Fecha inicio <RequiredSpan />
								</Label>
								<Input
									type='date'
									min={moment().startOf('year').format('YYYY-MM-DD')}
									max={moment().format('YYYY-MM-DD')}
									name='dateFrom'
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
						<Grid
							item
							xs={2}
							style={{
								textAlign: 'center',
								paddingTop: 40
							}}
							className={classes.control}
						>
							<FormGroup>
								<Label> al </Label>
							</FormGroup>
						</Grid>
						<Grid item xs={5} className={classes.control}>
							<FormGroup>
								<Label for='dateTo'>
									Fecha final <RequiredSpan />
								</Label>
								<Input
									min={moment().startOf('year').format('YYYY-MM-DD')}
									max={moment().format('YYYY-MM-DD')}
									type='date'
									name='dateTo'
									style={{
										paddingRight: '12%'
									}}
									invalid={toDateInvalid || state.beneficios.fields.fechaFinal}
									disabled={!editable}
									value={formData.dateTo}
									onChange={handleFormDataChange}
								/>
								<FormFeedback>
									{toDateInvalid && 'la fecha de inicio debe ser antes de la fecha de final'}
									{state.beneficios.fields.fechaFinal && state.beneficios.errors.fechaFinal}
								</FormFeedback>
							</FormGroup>
						</Grid>
					</Grid>
				</Grid>
			</OptionModal>
			<div>
				<h5>Por parte del MEP</h5>
				<Tabla
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

const NavigationContainer = styled.span`
	display: flex;
	cursor: pointer;
`

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
