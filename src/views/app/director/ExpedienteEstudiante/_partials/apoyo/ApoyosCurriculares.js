import React, { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Row, Col, Form, FormGroup, Label, Input, Button, Container } from 'reactstrap'

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
import Tooltip from '@mui/material/Tooltip'

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

const categoria = {
	id: 4,
	nombre: 'Apoyos curriculares',
	addDispatchName: 'apoyoscurriculares4'
}

const tituloModal = 'Registro de apoyo curricular'

const condicionSeRecibeNombre = 'Se recibe'

export const ApoyosCurriculares = () => {
	const [snackBar, handleClick] = useNotification()
	const [loading, setLoading] = useState(true)
	const [data, setData] = useState([])
	const [showNuevoApoyoModal, setShowNuevoApoyoModal] = useState(false)
	const [tiposApoyo, setTiposApoyo] = useState([])
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
			activeYear: store.authUser.selectedActiveYear
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
				setLoading(false)
				setData(response.data.entityList)
			})
			.catch(error => {
				setLoading(false)
				console.log(error)
			})
	}, [])

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
				className: 'text-alert-modal'
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
				className: 'text-alert-modal'
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

			<SimpleModal
				openDialog={showNuevoApoyoModal}
				onClose={() => closeAgregarModal()}
				onConfirm={onConfirmSaveApoyo}
				actions={false}
				title={tituloModal}
			>
				<Container width='100%' className='modal-detalle-subsidio'>
					<Form onSubmit={onConfirmSaveApoyo}>
						<Row>
							<Col md={6}>
								<Label for='tipoDeApoyo'>Tipo de apoyo (requerido) </Label>
								<StyledInput
									id='tipoDeApoyo'
									/* innerRef={register({
										required: t('general>campo_requerido', 'El campo es requerido')
									})} */
									name='tipoDeApoyo'
									type='select'
									//invalid={errors[`${props.storedValuesKey}Tipos`]}
									placeholder='Seleccionar'
									onChange={handleFormDataChange}
								>
									<option value={null}>{t('general>seleccionar', 'Seleccionar')}</option>
									{tiposApoyo.map(tipo => {
										return <option value={tipo.id}>{tipo.nombre}</option>
									})}
								</StyledInput>
								{/* <FormFeedback>
									{errors[`${props.storedValuesKey}Tipos`] &&
										errors[`${props.storedValuesKey}Tipos`].message}
								</FormFeedback> */}
							</Col>
							<Col md={6}>
								<FormGroup>
									<Label for='condicionDeApoyo'>Condición del apoyo</Label>
									<StyledInput
										id='condicionApoyo'
										name='condicionApoyo'
										type='select'
										onChange={handleFechaAprobacionOnChange}
										//invalid={errors[`${props.storedValuesKey}Tipos`]}
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

						{showFechaAprobacion && (
							<Row>
								<Col md={6}>
									<FormGroup>
										<Label for='fechaDeAprobacion'>Fecha de aprobación</Label>
										<Input
											type='date'
											id='fechaDeAprobacion'
											name='fechaDeAprobacion'
											onChange={handleFormDataChange}
										/>
									</FormGroup>
								</Col>
							</Row>
						)}

						<Row>
							<Col md={12}>
								<Button onClick={() => closeAgregarModal()} color='secondary' type='button'>
									Cancelar
								</Button>
								<Button color='primary' type='submit'>
									Confirmar
								</Button>
							</Col>
						</Row>
					</Form>
				</Container>
			</SimpleModal>
		</>
	)
}

const StyledInput = styled(Input)`
	width: 100% !important;
	margin-top: 1rem;
	margin-bottom: 1rem;
	padding-right: 12%;
`
