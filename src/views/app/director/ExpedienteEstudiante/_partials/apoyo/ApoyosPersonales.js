import React, { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Row, Col, Form, FormGroup, Label, Input, CustomInput } from 'reactstrap'
import DatePicker from 'react-datepicker'

import { TableReactImplementationApoyo } from 'Components/TableReactImplementationApoyo'
import useNotification from 'Hooks/useNotification'
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
import styles from './apoyos.css'
import Tooltip from '@mui/material/Tooltip'
import 'react-datepicker/dist/react-datepicker.css'
import { getCatalogs } from 'Redux/selects/actions'
import { useActions } from 'Hooks/useActions'
import { catalogsEnumObj } from 'Utils/catalogsEnum'
import SimpleModal from 'Components/Modal/simple'
import axios from 'axios'
import { envVariables } from '../../../../../../constants/enviroment'
import { IoMdTrash } from 'react-icons/io'
import IconButton from '@mui/material/IconButton'
import swal from 'sweetalert'
import { isNull } from 'lodash'
import BarLoader from 'Components/barLoader/barLoader'
import OptionModal from '../../../../../../components/Modal/OptionModal'
import RequiredSpan from '../../../../../../components/Form/RequiredSpan'

const categoria = {
	id: 1,
	nombre: 'Apoyos personales',
	addDispatchName: 'apoyospersonales1'
}

const tituloModal = 'Registro de apoyo personal'

const condicionSeRecibeNombre = 'Se recibe'

export const ApoyosPersonales = () => {
	const [snackBar, handleClick] = useNotification()
	const [loading, setLoading] = useState(true)
	const [showModalTiposApoyo, setShowModalTiposApoyo] = useState(false)
	const [data, setData] = useState([])
	const [showNuevoApoyoModal, setShowNuevoApoyoModal] = useState(false)
	const [tiposApoyo, setTiposApoyo] = useState([])
	const [tiposApoyoFilter, setTiposApoyoFilter] = useState([])
	const [sortedYearList, setSortedYearList] = useState(null)
	const [showFechaAprobacion, setShowFechaAprobacion] = useState(false)
	const [formData, setFormData] = useState({
		tipoDeApoyo: '',
		condicionApoyo: '',
		detalleApoyo: '',
		fechaDeAprobacion: ''
	})

	const cleanFormData = () => {
		const data = {
			tipoDeApoyo: '',
			condicionApoyo: '',
			detalleApoyo: '',
			fechaDeAprobacion: ''
		}
		setFormData(data)
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

		const condicionSeRecibe = condicionesApoyo.find(o => o.nombre === condicionSeRecibeNombre)

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

	useEffect(() => {
		const loadData = async () => {
			try {
				setLoading(true)
				await actions.getTiposApoyos()

				//dropdown
				const tiposDeApoyo = state.apoyos.tipos.filter(tipo => tipo.categoriaApoyoId === categoria.id)

				setTiposApoyo(tiposDeApoyo)

				!state.selects[catalogsEnumObj.TIPOCONDICIONAPOYO.name][0] &&
					(await actions.getCatalogs(catalogsEnumObj.TIPOCONDICIONAPOYO.id))
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

	useEffect(() => {
		if (isNull(sortedYearList)) {
			const yearList = state.activeYears.map(year => {
				return { id: year.id, name: year.nombre }
			})

			const sortedYears = yearList.sort((a, b) => b.name.localeCompare(a.name))
			setSortedYearList(sortedYears)
		}

		//const activeYear = sortedYearList[0].name
		//console.log('activeYear', activeYear)
		filterTiposDeApoyo(tiposApoyo, parseInt(state.activeYear.nombre))
	}, [data])

	const deleteApoyoById = apoyoId => {
		setLoading(true)
		try {
			axios
				.delete(`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Apoyo/${apoyoId}`)
				.then(response => {
					axios
						.get(
							`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Apoyo/categoria/${categoria.id}/1/20?identidadId=${state.identification.data.id}`
						)
						.then(response => {
							setData(response.data.entityList)
							setLoading(false)
						})
						.catch(error => {
							setLoading(false)
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
								style={{
									border: 'none',
									background: 'transparent',
									cursor: 'pointer',
									color: 'grey'
								}}
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
								<Tooltip title='Eliminar'>
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

	const onAgregarEvent = () => {
		setShowNuevoApoyoModal(true)
	}

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

		if (formData.fechaDeAprobacion === '' && formData.condicionApoyo === 6558) {
			validationMessage += '\nLa fecha de aprobación es requerida'
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
			id: state.expedienteEstudiantil.currentStudent.idMatricula,
			detalle: formData.detalleApoyo,
			fechaInicio: formData.fechaDeAprobacion ? formData.fechaDeAprobacion : null,
			fechaFin: null,
			tipoDeApoyoId: parseInt(formData.tipoDeApoyo),
			dependenciasApoyosId: null,
			condicionApoyoId: parseInt(formData.condicionApoyo),
			identidadesId: state.identification.data.id
		}

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

		await actions.addApoyo(_data, categoria, categoria.addDispatchName, 1)

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
		setShowNuevoApoyoModal(false)
	}

	const filterTiposDeApoyo = (tipos, currentYear) => {
		let filtro = tiposApoyo

		if (tipos.length > 0) {
			filtro = tipos.filter(
				tipoApoyo =>
					!data.some(
						apoyoEstudiante =>
							apoyoEstudiante.sb_TiposDeApoyoId === tipoApoyo.id &&
							new Date(apoyoEstudiante.fechaInsercion).getFullYear() === parseInt(currentYear)
					)
			)
		}

		setTiposApoyoFilter(filtro)
	}

	return (
		<>
			{loading && <BarLoader />}
			<TableReactImplementationApoyo
				showAddButton
				msjButton='Agregar'
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
				{tiposApoyoFilter.map((item, i) => {
					return (
						<Row key={i}>
							<Col xs={3} className='modal-detalle-subsidio-col'>
								<div>
									<CustomInput
										type='checkbox'
										label={item.nombre}
										inline
										onClick={() => handleChangeItem(item)}
										checked={false}
									/>
								</div>
							</Col>
							<Col xs={9} className='modal-detalle-subsidio-col'>
								<div>
									<p>{item.detalle ? item.detalle : 'Elemento sin detalle actualmente'}</p>
								</div>
							</Col>
						</Row>
					)
				})}
			</OptionModal>
			<OptionModal
				isOpen={showNuevoApoyoModal && !showModalTiposApoyo}
				titleHeader={tituloModal}
				onConfirm={onConfirmSaveApoyo}
				onCancel={() => closeAgregarModal()}
			>
				<Form onSubmit={onConfirmSaveApoyo}>
					<Row>
						<Col md={6}>
							<Label for='tipoDeApoyo'>
								Tipo de apoyo <RequiredSpan />{' '}
							</Label>
							<StyledInput
								id='tipoDeApoyo'
								name='tipoDeApoyo'
								type='text'
								placeholder='Seleccionar'
								onClick={() => {
									// alert()
									setShowModalTiposApoyo(true)
								}}
							>
								{formData.tipoDeApoyo || 'Seleccionar'}
							</StyledInput>
						</Col>
						<Col md={6}>
							<FormGroup>
								<Label for='condicionDeApoyo'>Condición del apoyo</Label>
								<StyledInput
									id='condicionApoyo'
									name='condicionApoyo'
									type='select'
									onChange={handleFechaAprobacionOnChange}
									placeholder='Seleccionar'
								>
									<option value={null}>{t('general>seleccionar', 'Seleccionar')}</option>
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
									<Label for='fechaDeAprobacion'>Fecha de aprobación</Label>
									<DatePicker
										style={{
											zIndex: 99999
										}}
										popperPlacement={'right'}
										dateFormat='dd/MM/yyyy'
										selected={formData.fechaDeAprobacion}
										onChange={date => setFormData({ ...formData, fechaDeAprobacion: date })}
										minDate={new Date(new Date().getFullYear(), 0, 1)}
										maxDate={new Date(new Date().getFullYear(), 11, 31)}
									/>
								</FormGroup>
							</Col>
						</Row>
					)}
					<Row>
						<Col md={12}>
							<FormGroup>
								<Label for='detalleDelApoyo'>Detalle del apoyo (opcional)</Label>
								<Input
									type='textarea'
									id='detalleApoyo'
									name='detalleApoyo'
									rows='5'
									onChange={handleFormDataChange}
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
