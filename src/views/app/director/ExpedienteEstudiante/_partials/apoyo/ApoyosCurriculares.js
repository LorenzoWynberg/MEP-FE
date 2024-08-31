import React, { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import useNotification from 'Hooks/useNotification'
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
	}, [state.expedienteEstudiantil.currentStudent]) //TODO JPBR ver dependencia del use memo

	const onAgregarEvent = () => {
		setShowNuevoApoyoModal(true)
	}

	const closeAgregarModal = () => {
		setShowNuevoApoyoModal(false)
	}

	return (
		<>
			<TableReactImplementation
				showAddButton
				msjButton='Agregar'
				onSubmitAddButton={() => onAgregarEvent()}
				data={data}
				columns={columns}
			/>

			<SimpleModal
				openDialog={showNuevoApoyoModal}
				onClose={() => closeAgregarModal()}
				onConfirm={() => closeAgregarModal()}
				actions={false}
				title={'Registro de apoyo curricular'}
			>
				<>
					<div>
						<Form>
							<Row>
								<Col md={6}>
									<FormGroup>
										<Label for='tipoDeApoyo'>Tipo de Apoyo</Label>
										<Input type='select' id='tipoDeApoyo' name='tipoDeApoyo'>
											<option value=''>Seleccione una opción</option>
											<option value='1'>Opción 1</option>
											<option value='2'>Opción 2</option>
											<option value='3'>Opción 3</option>
										</Input>
									</FormGroup>
								</Col>
								<Col md={6}>
									<FormGroup>
										<Label for='condicionDeApoyo'>Condición de Apoyo</Label>
										<Input type='select' id='condicionDeApoyo' name='condicionDeApoyo'>
											<option value=''>Seleccione una opción</option>
											<option value='1'>Opción 1</option>
											<option value='2'>Opción 2</option>
										</Input>
									</FormGroup>
								</Col>
							</Row>
							<Row>
								<Col md={12}>
									<FormGroup>
										<Label for='detalleDelApoyo'>Detalle del Apoyo</Label>
										<Input type='textarea' id='detalleDelApoyo' name='detalleDelApoyo' rows='5' />
									</FormGroup>
								</Col>
							</Row>
							<Row>
								<Col md={6}>
									<FormGroup>
										<Label for='fechaDeAprobacion'>Fecha de Aprobación</Label>
										<Input type='date' id='fechaDeAprobacion' name='fechaDeAprobacion' />
									</FormGroup>
								</Col>
							</Row>
							<Row>
								<Col md={12}>
									<Button color='secondary' type='button'>
										Cancelar
									</Button>
									<Button color='primary' type='submit'>
										Confirmar
									</Button>
								</Col>
							</Row>
						</Form>
					</div>
					{/* <WizardRegisterIdentityModal onConfirm={guardarNuevaPersona} /> /*}
					{/*{loadingRegistrarModal && <Loader /> */}
				</>
			</SimpleModal>
		</>
	)
}
