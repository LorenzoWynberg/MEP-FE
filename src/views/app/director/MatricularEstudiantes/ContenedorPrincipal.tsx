import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import { Col, Row, Container, Modal, ModalBody, Button } from 'reactstrap'
import Breadcrumb from 'Containers/navs/CustomBreadcrumb'
import AppLayout from 'Layout/AppLayout'
import directorItems from 'Constants/directorMenu'
import MatricularEstudiantesWizard from './MatricularEstudiantesWizard'
import IdentificacionForm from './_partials/IdentificacionForm'
import { useForm } from 'react-hook-form'
import useNotification from 'Hooks/useNotification'
import ModalConfirmacion from './_partials/ModalConfirmacion'
import styled from 'styled-components'

import { catalogsEnumObj } from '../../../../utils/catalogsEnum'
import DatosEducativosTable from './_partials/DatosEducativosTable'
import {
	createDirection,
	updateDirection,
	deleteDirection
} from '../../../../redux/direccion/actions'
import moment from 'moment'
import { useTranslation } from 'react-i18next'

import {
	setMatriculaWizardPasos,
	setMatriculaWizardIdentidad,
	setMatriculaWizardIdentidadDatos,
	getNiveles,
	createMatricula,
	getDatosEducativos,
	getStudentByIdentification,
	updateOtrosDatos,
	updateContactoInfo,
	updateIdentidadDireccion,
	getInformacionMatriculaActual,
	getInformacionRegistral,
	selectEntidadMatriculaId,
	cleanStudent
} from '../../../../redux/matricula/actions'

import {
	getTiposApoyos,
	getDependenciasApoyos,
	getCategoriasApoyos,
	getDiscapacidades,
	getCondiciones,
	getResources,
	getApoyosByType
} from '../../../../redux/matricula/apoyos/actions'
import { getCatalogs } from '../../../../redux/selects/actions'

const ContenedorPrincipal = props => {
	const { t } = useTranslation()
	const [loading, setLoading] = useState(false)

	const [snackbarContent, setSnackbarContent] = useState({
		variant: 'error',
		msg: 'hubo un error'
	})
	const [snackbar, handleClick] = useNotification()
	const [showConfirmacionModal, setShowConfirmacionModal] = useState(false)
	const [showSuccessModal, setShowSuccessModal] = useState(false)
	const [institucion, setInstitucion] = useState({ nombre: '', id: 0 })
	const [showWizard, setShowWizard] = useState(false)
	const [miembros, setMiembros] = useState([])
	const {
		// handleSubmit,
		register,
		setValue,
		errors,
		watch,
		setError,
		clearErrors,
		unregister,
		trigger,
		getValues
	} = useForm()

	const state = useSelector(store => {
		return {
			selects: store.selects,
			matricula: store.matricula,
			apoyos: store.matriculaApoyos,
			identification: store.matricula,
			authUser: store.authUser,
			activeYear: store.authUser.selectedActiveYear,
			miembro: store.miembro,
			informacionMatricula: store.matricula.informacionMatricula
		}
	})
	useEffect(() => {
		if (state.authUser.currentInstitution) {
			setInstitucion(state.authUser.currentInstitution)
		}
	}, [state.authUser.currentInstitution, state.activeYear])

	useEffect(() => {
		setMiembros(state.miembro.members)
	}, [state.miembro.members])

	const actions = useActions({
		setMatriculaWizardPasos,
		setMatriculaWizardIdentidad,
		setMatriculaWizardIdentidadDatos,
		getResources,
		getTiposApoyos,
		getDependenciasApoyos,
		getCategoriasApoyos,
		getCondiciones,
		getCatalogs,
		getDiscapacidades,
		getApoyosByType,
		getNiveles,
		createMatricula,
		getDatosEducativos,
		getStudentByIdentification,
		updateOtrosDatos,
		updateContactoInfo,
		createDirection,
		updateDirection,
		deleteDirection,
		updateIdentidadDireccion,
		getInformacionMatriculaActual,
		getInformacionRegistral,
		selectEntidadMatriculaId,
		cleanStudent
	})

	// Navegacion del wizar y validaciones
	const onClickNext = async (goToNext, steps, step) => {
		step.isDone = true
		if (steps.length - 1 <= steps.indexOf(step)) {
			return
		}

		setLoading(true)

		const valid = await trigger()
		// Valores del formulario, del paso actual
		const formValues = getValues()

		if (valid) {
			if (step.id !== 'step5') {
				// goToNext()
			}
		} else {
			setSnackbarContent({
				variant: 'error',
				msg: t(
					'estudiantes>matricula_estudiantil>matricular_estudiante>advertencia',
					'Debe completar los datos obligatorios para poder continuar!!!S'
				)
			})
			handleClick()
			setLoading(false)
			return
		}

		const _dataId = {
			identificacion: formValues.identificacion,
			nombre: formValues.nombre,
			primerApellido: formValues.primerApellido,
			segundoApellido: formValues.segundoApellido,
			conocidoComo: formValues.conocidoComo,
			edad: formValues.edad
		}

		const datos = [
			{
				id: 0,
				elementoId: parseInt(formValues.genero),
				codigoCatalogo: catalogsEnumObj.GENERO.id,
				catalogoId: catalogsEnumObj.GENERO.id,
				nombreCatalogo: 'Genero'
			}
		]
		actions.setMatriculaWizardIdentidad(_dataId)
		actions.setMatriculaWizardIdentidadDatos(datos)

		switch (step.id) {
			case 'step1':
				/// Actualizar estado para otros datos
				var _dataStep1 = {
					lesco: formValues.lesco,
					telefono: formValues.telefono,
					telefonoSecundario: formValues.telefonoSecundario,
					email: formValues.email,
					emailSecundario: formValues.emailSecundario
				}
				var _datosStep1 = [
					{
						id: 0,
						elementoId: parseInt(formValues.migracionStatus.value),
						codigoCatalogo: catalogsEnumObj.ESTATUSMIGRATORIO.id,
						catalogoId: catalogsEnumObj.ESTATUSMIGRATORIO.id,
						nombreCatalogo: 'Estatus Migratorio'
					},
					{
						id: 0,
						elementoId: parseInt(formValues.etnia.value),
						codigoCatalogo: catalogsEnumObj.ETNIAS.id,
						catalogoId: catalogsEnumObj.ETNIAS.id,
						nombreCatalogo: 'Grupo Etnico'
					},
					{
						id: 0,
						elementoId: parseInt(formValues.lenguaIndigena.value),
						codigoCatalogo: catalogsEnumObj.LENGUASINDIGENAS.id,
						catalogoId: catalogsEnumObj.LENGUASINDIGENAS.id,
						nombreCatalogo: 'Lengua Indigena'
					},
					{
						id: 0,
						elementoId: parseInt(formValues.lenguaMaterna.value),
						codigoCatalogo: catalogsEnumObj.LENGUAMATERNA.id,
						catalogoId: catalogsEnumObj.LENGUAMATERNA.id,
						nombreCatalogo: 'Lengua Materna'
					},
					{
						id: 0,
						elementoId: parseInt(formValues.estadoCivil.value),
						codigoCatalogo: catalogsEnumObj.ESTADOCIVIL.id,
						catalogoId: catalogsEnumObj.ESTADOCIVIL.id,
						nombreCatalogo: 'Estado Civil'
					}
				]

				const otrosDatos = [
					parseInt(formValues.genero),
					parseInt(formValues.migracionStatus.value),
					parseInt(formValues.etnia.value),
					parseInt(formValues.lenguaIndigena.value),
					parseInt(formValues.lenguaMaterna.value),
					parseInt(formValues.estadoCivil.value)
				]

				const requestStep1 = {
					Id: state.matricula.data.id,
					Identificacion: state.matricula.data.identificacion,
					Lesco: _dataStep1.lesco,
					TelefonoPrincipal: _dataStep1.telefono,
					TelefonoAlternativo: _dataStep1.telefonoSecundario,
					CorreoPrincipal: _dataStep1.email,
					CorreoAlternativo: _dataStep1.emailSecundario,
					ElementosNoRequiridosIds: otrosDatos
				}

				actions.setMatriculaWizardPasos(_dataStep1, 1)
				actions.setMatriculaWizardIdentidadDatos(_datosStep1)

				await actions.updateOtrosDatos(requestStep1)
				await actions.updateContactoInfo(requestStep1)

				goToNext()

				break

			case 'step2':
				/// Actualizar estado para Informacion de Residencia
				const isTemp = formValues.requiereInformacionTemp
				const _datastep2 = []

				const _direcciones = state.matricula.data.direcciones
				let _idResidencia = -1
				let _idResidenciaTemp = -1
				if (_direcciones.length > 0) {
					const _direccion = _direcciones.find(x => x.temporal === false)
					if (_direccion !== undefined) {
						_idResidencia = _direccion.id
					}
					const _tempDireccion = _direcciones.find(x => x.temporal === true)
					if (_tempDireccion !== undefined) {
						_idResidenciaTemp = _tempDireccion.id
					}
				}
				const _direcion = {
					id: _idResidencia,
					direccionExacta: formValues.direction,
					latitud: formValues.latitude || 0.0,
					longitud: formValues.longitude || 0.0,
					paisId: formValues.countryId || 0.0,
					areaAdministrativaNivel1: formValues.administrativeAreaLevel1,
					areaAdministrativaNivel12: formValues.administrativeAreaLevel2,
					// pobladoId: formValues.poblado.value,
					razon: '',
					temporal: false
					// territorioIndigenaId: formValues.indigena.id
				}
				_datastep2.push(_direcion)

				if (isTemp) {
					const _direcionTem = {
						id: _idResidenciaTemp,
						// direccionExacta: formValues.dirExactaTemp,
						direccionExacta: formValues.directionTemp,
						latitud: formValues.latitudeTemp || 0.0,
						longitud: formValues.longitudeTemp || 0.0,
						paisId: formValues.countryIdTemp,
						areaAdministrativaNivel1: formValues.administrativeAreaLevel1Temp,
						areaAdministrativaNivel2: formValues.administrativeAreaLevel2Temp,
						// pobladoId: formValues.pobladoTemp?.value,
						// provinciasId: formValues.provinciaTemp?.value,
						// cantonesId: formValues.cantonTemp?.value,
						// distritosId: formValues.distritoTemp?.valuSe,
						razon: formValues.razon,
						temporal: true
						// territorioIndigenaId: formValues.indigenaTemp.id
					}
					_datastep2.push(_direcionTem)
				}

				actions.setMatriculaWizardPasos(_datastep2, 2)

				const _dataResidencia: any = {
					temporal: false,
					razon: '',
					paisId: formValues.countryId,
					areaAdministrativaNivel1: formValues.administrativeAreaLevel1,
					areaAdministrativaNivel2: formValues.administrativeAreaLevel2,
					direccionExacta: formValues.direction,
					latitud: formValues.latitude || 0.0,
					longitud: formValues.longitude || 0.0,
					// pobladoId: formValues.poblado.value,
					// provinciasId: formValues.provincia.value,
					// cantonesId: formValues.canton.value,
					// distritosId: formValues.distrito.value,
					identidadId: state.matricula.data.id,
					// direccionExacta: formValues.dirExacta,
					// territorioId: formValues.indigena.id,
					estado: true
				}
				if (_idResidencia > 0) {
					_dataResidencia.id = _idResidencia
					await actions.updateDirection(_dataResidencia)
				} else {
					const resp = await actions.createDirection(_dataResidencia)
					if (!resp.error) {
						const data = resp.response
						actions.updateIdentidadDireccion(data)
					}
				}

				if (isTemp) {
					const _dataTemp = {
						id: _idResidenciaTemp,
						temporal: true,
						razon: formValues.razon,
						latitud: formValues.latitudeTemp || 0.0,
						longitud: formValues.longitudeTemp || 0.0,
						paisId: formValues.countryIdTemp,
						areaAdministrativaNivel1: formValues.administrativeAreaLevel1Temp,
						areaAdministrativaNivel2: formValues.administrativeAreaLevel2Temp,
						direccionExacta: formValues.directionTemp,
						// pobladoId: formValues.pobladoTemp.value,
						identidadId: state.matricula.data.id,
						// direccionExacta: formValues.dirExactaTemp,
						// territorioId: formValues.indigenaTemp.id,
						estado: true
					}
					if (_idResidenciaTemp > 0) {
						await actions.updateDirection(_dataTemp)
					} else {
						const resp = await actions.createDirection(_dataTemp)
						if (!resp.error) {
							const data = resp.response
							actions.updateIdentidadDireccion(data)
						}
					}
				} else {
					if (_idResidenciaTemp > 0) {
						await actions.deleteDirection(_idResidenciaTemp)
					}
				}

				goToNext()

				break
			case 'step3':
				/// Actualizar estado para Informacion de Encargados
				var _dataStep3 = {
					identificadorRegistral1: formValues.identificadorRegistral1,
					identificadorRegistral2: formValues.identificadorRegistral2,
					nombreRegistral1: formValues.nombreRegistral1,
					nombreRegistral2: formValues.nombreRegistral2
				}

				if (state.matricula.data.fechaNacimiento) {
					const edadYears = moment().diff(
						state.matricula.data.fechaNacimiento,
						'years',
						false
					)

					const _miembros = miembros.length

					if (edadYears < 18 && _miembros === 0) {
						setSnackbarContent({
							variant: 'error',
							msg: 'Debe ingresar al menos un encargado.'
						})
						handleClick()
						return
					}
				}

				actions.setMatriculaWizardPasos(_dataStep3, 3)

				goToNext()

				break
			case 'step4':
				/// Actualizar estado para Informacion de Encargados
				//  var _data = {}
				//  actions.setMatriculaWizardPasos(_data, 1)

				goToNext()
				break
			case 'step5':
				/// Mostrar formulario de confirmacion

				if (
					state.matricula.entidadMatriculaId &&
					state.matricula.entidadMatriculaId !== 0 &&
					state.matricula.entidadMatriculaId !== null
				) {
					setShowConfirmacionModal(true)
				} else {
				}

				break

			default:
				break
		}

		setLoading(false)
	}

	const onClickPrev = (goToPrev, steps, step) => {
		// Se limpian los errores al regresar
		clearErrors(['provincia', 'canton', 'distrito', 'poblado'])
		unregister(['provincia', 'canton', 'distrito', 'poblado'])

		if (steps.indexOf(step) <= 0) {
			return
		}

		goToPrev()
	}

	const topNavClick = (stepItem, push) => {
		// push(stepItem.id)
	}

	const onMatricular = async () => {
		if (state.matricula.data.esFallecido) {
			setSnackbarContent({
				variant: 'error',
				msg: 'El estudiante se encuentra fallecido.'
			})
			handleClick()

			return
		}

		const _data = {
			IdentidadesId: state.matricula.data.id,
			entidadMatriculaId: state.matricula.entidadMatriculaId,
			esRepitente: false,
			esRefugiado: false,
			estadosDeMatriculaId: 1, // Estado interno del sistema
			condicionEstudianteCursoId: 1 // Condicion Regular al matricular
		}

		const response = await actions.createMatricula(_data)

		if (response.error) {
			setSnackbarContent({
				variant: 'error',
				msg: response.mensaje
			})
			handleClick()
		} else {
			setShowConfirmacionModal(false)
			setShowSuccessModal(true)
			actions.selectEntidadMatriculaId(null)
			actions.cleanStudent('')
		}
	}

	useEffect(() => {
		const identificacion = props.match.params.idStudent

		if (identificacion) {
			const getIdentidad = async () => {
				await actions.getStudentByIdentification(identificacion)
				setShowWizard(true)
			}
			getIdentidad()
		}
	}, [])

	useEffect(() => {
		const loadData = async () => {
			await actions.getTiposApoyos()
			await actions.getDependenciasApoyos()
			await actions.getCategoriasApoyos()
			if (state.identification.data.id) {
				await actions.getDatosEducativos(state.identification.data.id)
				await actions.getResources('discapacidades', state.identification.data.id)
				await actions.getResources('condiciones', state.identification.data.id)
				await actions.getCondiciones(state.identification.data.id)

				!state.selects[catalogsEnumObj.OTRASCONDICIONES.name][0] &&
					(await actions.getCatalogs(catalogsEnumObj.OTRASCONDICIONES.id))
				!state.selects[catalogsEnumObj.DISCAPACIDADES.name][0] &&
					(await actions.getCatalogs(catalogsEnumObj.DISCAPACIDADES.id))
				await actions.getDiscapacidades(state.identification.data.id)

				if (state.matricula.cursoLectivo && state.matricula.cursoLectivo.value !== null) {
					await actions.getNiveles(institucion.id, state.matricula.cursoLectivo.value)
				}
			}
		}
		loadData()
	}, [state.identification.data.id, loading])

	useEffect(() => {
		if (state.matricula.cursoLectivo && state.matricula.cursoLectivo.value !== null) {
			const fetch = async () => {
				await actions.getInformacionMatriculaActual(state.matricula.cursoLectivo.value)
			}
			fetch()
		}
	}, [])

	useEffect(() => {
		const loadData = async () => {
			for (const category of state.apoyos.categorias) {
				await actions.getApoyosByType(state.identification.data.id, 1, 5, category)
			}
		}
		if (state.apoyos.categorias[0]) {
			loadData()
		}
	}, [state.apoyos.categorias])

	useEffect(() => {
		if (
			state.matricula.entidadMatriculaId !== 0 &&
			state.matricula.entidadMatriculaId !== null
		) {
			setShowConfirmacionModal(true)
		}
	}, [state.matricula.entidadMatriculaId])

	const closeConfirmarModal = value => {
		setShowConfirmacionModal(value)
		actions.selectEntidadMatriculaId(null)
	}
	return (
		<AppLayout items={directorItems}>
			<div className='dashboard-wrapper'>
				{snackbar(snackbarContent.variant, snackbarContent.msg)}
				<Container>
					<Row>
						<Col xs={12}>
							<Breadcrumb
								header={t(
									'estudiantes>matricula_estudiantil>matricula_estudiantes',
									'Matrícula de estudiantes'
								)}
								hideSpace
								hidePadding
							/>
							<hr />
						</Col>
						<Col xs={12}>
							<IdentificacionForm
								{...props}
								watch={watch}
								loading={loading}
								register={register}
								setValue={setValue}
								data={state.matricula.data}
								errors={errors}
								setError={setError}
								state={state}
							/>
							<DatosEducativosTable
								{...props}
								watch={watch}
								loading={loading}
								register={register}
								setValue={setValue}
								data={state.matricula.data}
								errors={errors}
								setError={setError}
								state={state}
							/>
							{showWizard ? (
								<MatricularEstudiantesWizard
									state={state}
									disableNext={loading}
									register={register}
									unregister={unregister}
									setValue={setValue}
									data={state.matricula.data}
									errors={errors}
									setError={setError}
									onClickNext={onClickNext}
									onClickPrev={onClickPrev}
									topNavClick={topNavClick}
									clearErrors={clearErrors}
									{...props}
								/>
							) : (
								<div />
							)}
						</Col>
					</Row>
				</Container>

				<ModalConfirmacion
					open={showConfirmacionModal}
					state={state.matricula}
					selects={state.selects}
					toggle={closeConfirmarModal}
					onMatricular={onMatricular}
				/>

				<Modal isOpen={showSuccessModal}>
					<ModalBody>
						<div className='container-success-modal'>
							<i className='simple-icon-check' />
							<h1>¡Excelente trabajo!</h1>
							<p>Has matriculado al estudiante exitosamente</p>
						</div>
						<Row>
							<CenteredRow xs='12'>
								<Button
									style={{ marginLeft: 20 }}
									color='primary'
									onClick={() => {
										setShowSuccessModal(false)
										setShowConfirmacionModal(false)
										actions.selectEntidadMatriculaId(null)
										props.history.push('/director/matricular-estudiantes')
									}}
								>
									OK
								</Button>
							</CenteredRow>
						</Row>
					</ModalBody>
				</Modal>
			</div>
		</AppLayout>
	)
}

const CenteredRow = styled(Col)`
	display: flex;
	justify-content: center;
	align-items: center;
`

export default ContenedorPrincipal
