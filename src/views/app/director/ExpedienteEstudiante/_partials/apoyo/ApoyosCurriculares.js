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

import { getCatalogs } from 'Redux/selects/actions'
import { useActions } from 'Hooks/useActions'
import { catalogsEnumObj } from 'Utils/catalogsEnum'
import SimpleModal from 'Components/Modal/simple'

const categoria = {
	id: 4,
	nombre: 'Apoyos curriculares'
}

export const ApoyosCurriculares = () => {
	const [snackBar, handleClick] = useNotification()
	const [loading, setLoading] = useState(false)
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

	const handleFormDataChange = event => {
		setFormData({
			...formData,
			[event.target.name]: event.target.value
		})
	}

	const handleFechaAprobacionOnChange = event => {
		debugger
		const value = Number(event.target.value)
		//formValue
		//TODO JPBR refactorizar esa novatada de usar valores quemados
		if (value === 6558) {
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
			selects: store.selects
		}
	})

	useEffect(() => {
		const loadData = async () => {
			try {
				debugger
				setLoading(true)
				await actions.getTiposApoyos()
				//await actions.getDependenciasApoyos() //este no tiene permiso el usuario
				//await actions.getCategoriasApoyos() //este es el que encicla el loading

				const tiposDeApoyo = state.apoyos.tipos.filter(tipo => tipo.categoriaApoyoId === categoria.id)

				setTiposApoyo(tiposDeApoyo)

				!state.selects[catalogsEnumObj.TIPOCONDICIONAPOYO.name][0] &&
					(await actions.getCatalogs(catalogsEnumObj.TIPOCONDICIONAPOYO.id))
			} finally {
				setLoading(false)
			}
		}
		loadData()

		return () => {
			//actions.clearCurrentDiscapacidades()
		}
	}, [])

	useEffect(() => {
		const loadData = async () => {
			debugger
			setLoading(true)
			await actions.getApoyosByType(state.identification.data.id, 1, 5, categoria)
			setLoading(false)
		}

		loadData()
	}, [state.identification.data.id])

	const columns = useMemo(() => {
		return [
			{
				Header: 'Tipo de apoyo',
				column: 'parentesco',
				accessor: 'parentesco',
				label: ''
			},
			{
				Header: 'Detalle del apoyo',
				column: 'nombre',
				accessor: 'nombre',
				label: ''
			},
			{
				Header: 'Condición del apoyo',
				column: 'primerApellido',
				accessor: 'primerApellido',
				label: ''
			},
			{
				Header: 'Fecha de aprobación',
				column: 'segundoApellido',
				accessor: 'segundoApellido',
				label: ''
			},
			{
				Header: 'Registrado por',
				column: 'registradoPor',
				accessor: 'registradoPor',
				label: ''
			},
			{
				Header: 'Fecha y hora del registro',
				column: 'encargado',
				accessor: 'encargado',
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
								onClick={async () => {
									setLoading(true)
									await events.onEditarClick(fullRow.id)
									setLoading(false)
									// props.authHandler('modificar', () => {
									//   setMemberDetailOpen(true)
									// })
								}}
							>
								<Tooltip title='Actualizar'>
									<IconButton>
										<HiPencil style={{ fontSize: 30 }} />
									</IconButton>
								</Tooltip>
							</button>
							<button
								style={{
									border: 'none',
									background: 'transparent',
									cursor: 'pointer',
									color: 'grey'
								}}
								onClick={() => {
									swal({
										title: 'Eliminar Miembro',
										text: '¿Esta seguro de que desea eliminar el miembro del hogar?',
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
											const age = identification.data?.fechaNacimiento
												? moment().diff(identification.data?.fechaNacimiento, 'years', false)
												: 0
											if (
												age < 18 &&
												fullRow.encargado &&
												data.filter(el => el?.encargado).length === 1
											) {
												setSnackbarContent({
													msg: 'No se puede eliminar la relación de encargado con el estudiante, hasta que incluya un nuevo encargado',
													variant: 'error'
												})
												handleClick()

												return
											}
											if (
												(fullRow.encargadoLegal && data.length < 1) ||
												!fullRow.encargadoLegal
											) {
												setSnackbarContent({
													msg: 'No se puede eliminar la relación de encargado con el estudiante, hasta que incluya un nuevo encargado',
													variant: 'error'
												})
												handleClick()
											} else {
												setLoading(true)
												await events.onDeleteClick(fullRow.id)
												await loadFamilyMembers()
												setLoading(false)
											}
										}
									})
								}}
							>
								<Tooltip title='Deshabilitar relación'>
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

	const onConfirmSaveApoyo = event => {
		event.preventDefault()
		setLoading(true)

		let _data = {
			id: state.expedienteEstudiantil.currentStudent.matriculaId,
			detalle: formData.detalleApoyo,
			fechaInicio: formData.fechaDeAprobacion ? formData.fechaDeAprobacion : null,
			fechaFin: null,
			tipoDeApoyoId: parseInt(formData.tipoDeApoyo),
			dependenciasApoyosId: null,
			condicionApoyoId: parseInt(formData.condicionApoyo),
			identidadesId: state.identification.data.id
		}
		console.log('formData JP', _data)
	}

	const closeAgregarModal = () => {
		setShowNuevoApoyoModal(false)
	}

	//TODO JPBR refactorizar a un componente que se pueda usar en todas los tipos de apoyos cuando esten listos los endpoints
	return (
		<>
			<TableReactImplementationApoyo
				showAddButton
				msjButton='Agregar'
				onSubmitAddButton={() => onAgregarEvent()}
				data={data}
				columns={columns}
			/>

			<SimpleModal
				openDialog={showNuevoApoyoModal}
				onClose={() => closeAgregarModal()}
				onConfirm={onConfirmSaveApoyo}
				actions={false}
				title={'Registro de apoyo curricular'}
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
										/* innerRef={register({
										required: t('general>campo_requerido', 'El campo es requerido')
									})} */
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
										id='detalleDelApoyo'
										name='detalleDelApoyo'
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
