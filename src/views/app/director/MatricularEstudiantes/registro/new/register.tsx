import CancelIcon from '@mui/icons-material/Cancel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import colors from 'Assets/js/colors'
import GoBack from 'Components/goBack'
import Loader from 'Components/LoaderContainer'
import ConfirmModal from 'Components/Modal/ConfirmModal'
import SimpleModal from 'Components/Modal/simple'
import { useActions } from 'Hooks/useActions'
import useNotification from 'Hooks/useNotification'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Col, Container, Row, Modal } from 'reactstrap'
import { getDiscapacidades } from 'Redux/apoyos/actions'
import { getEstudiantesByNivelOferta } from 'Redux/grupos/actions'
import { clearWizardDataStore, clearWizardNavDataStore } from 'Redux/identidad/actions'
import { clearCurrentDiscapacidades,clearCurrentApoyosRecibidos,clearCurrentApoyosNoRecibidos, getTiposApoyosRecibidos,
	getTiposApoyosNoRecibidos} from 'Redux/matricula/apoyos/actions'
import {
	actualizarEstadoMatricula,
	clearEstudianteMatricula,
	createMatriculaWithAdditionalData,
	getEstudianteMatricula,
	removerEstudianteMatricula,
	updateMatriculaWithAdditionalData,
	updateEstadoMatriculaWithAlertas,
} from 'Redux/matricula/actions'
import { getCatalogs } from 'Redux/selects/actions'
import styled from 'styled-components'
import { catalogsEnumObj } from 'Utils/catalogsEnum'
import { getYearsOld } from 'Utils/years'
import WizardRegisterIdentityModal from 'Views/app/configuracion/Identidad/_partials/wizardRegisterIdentityModal'
import { getCantidadTrasladosByMatriculaId } from 'Redux/traslado/actions'
import FormData from './formData'
import HeaderFinder from './header'
import TableStudents from './tableStudents'
import VerEstudiante from './verEstudiante'
import RegistrarAlerta from 'Views/app/director/AlertaTemprana/Registrar'
import Typography from '@material-ui/core/Typography'
import { useTranslation } from 'react-i18next'

interface IProps {
	dataNivel: any
	goBack: Function
	hasAddAccess: boolean
	onlyViewModule: boolean
	hasEditAccess: boolean
}
type SnackbarConfig = {
	variant: string
	msg: string
}
const RegisterStudentForm: React.FC<IProps> = props => {
	const { t } = useTranslation()
	const { dataNivel, goBack, hasAddAccess = true, hasEditAccess, onlyViewModule } = props
	const [estudiantes, setEstudiantes] = useState([])
	const [noEncontradoModal, setNoEncontradoModal] = useState(false)
	const [eliminarModal, setEliminarModal] = useState(false)
	const [registrarModal, setRegistrarModal] = useState(false)
	const [verEstudianteModal, setVerEstudianteModal] = useState(false)
	const [student, setStudent] = useState(null)
	const [selectedStudent, setSelectedStudent] = useState<any>({})
	const [dataModalDuplicado, setDataModalDuplicado] = useState<any>({})
	const [modalDuplicado, setModalDuplicado] = useState<any>(false)
	const [loadingRegistrarModal, setLoadingRegistrarModal] = useState(false)
	const [confirmModal, setConfirmModal] = useState<boolean>(false)
	const [contentModal, setContentModal] = useState<{
		type: number
		title: string
		description: string
		icon?: string
	}>({
		title: '',
		type: 1,
		description: '',
		icon: ''
	})
	const [dataSend, setDataSend] = useState<any>({})
	const [modalAlertas, setModalAlertas] = useState<any>(false)

	const [alerta, setAlerta] = useState<any>(false)

	const [snackBarContent, setSnackbarContent] = React.useState<SnackbarConfig>({
		variant: '',
		msg: ''
	})

	const [snackbar, handleClick] = useNotification()

	const { nivelOfertaId } = useParams<any>()

	const state = useSelector((store: any) => {
		return {
			institution: store.authUser.currentInstitution,
			students: store.grupos.allGroupMembers
		}
	})

	useEffect(() => {
		setEstudiantes(state.students)
	}, [state.students])

	const showNotification = (variant: string, msg: string) => {
		setSnackbarContent({ variant, msg })
		handleClick()
	}

	const closeModalNoEncontrado = () => {
		setNoEncontradoModal(false)
	}
	const actions = useActions({
		getDiscapacidades,
		getTiposApoyosRecibidos,
		getTiposApoyosNoRecibidos,
		getCatalogs,
		updateMatriculaWithAdditionalData,
		createMatriculaWithAdditionalData,
		getEstudiantesByNivelOferta,
		updateEstadoMatriculaWithAlertas,
		removerEstudianteMatricula,
		getEstudianteMatricula,
		clearEstudianteMatricula,
		actualizarEstadoMatricula,
		clearWizardDataStore,
		clearWizardNavDataStore,
		clearCurrentDiscapacidades,
		getCantidadTrasladosByMatriculaId,
		clearCurrentApoyosRecibidos,
		clearCurrentApoyosNoRecibidos,
	})

	useEffect(() => {
		const fetch = async () => {
			await actions.getCatalogs(catalogsEnumObj.DISCAPACIDADES.id)
			await actions.getCatalogs(catalogsEnumObj.ESTATUSMIGRATORIO.id)
			await actions.getCatalogs(catalogsEnumObj.TIPODIMEX.id)
			await actions.getCatalogs(catalogsEnumObj.TIPOYISRO.id)
			await actions.getCatalogs(catalogsEnumObj.TIPOSAPOYOS.id)
		}
		fetch()
	}, [])

	useEffect(() => {
		const fetch = async () => {
			await actions.getEstudiantesByNivelOferta(nivelOfertaId, '(1,3,4,5)')
		}
		if (nivelOfertaId) {
			fetch()
		}
	}, [nivelOfertaId])

	useEffect(() => {
		const fetch = async () => {
			debugger
			if (student) {
				await actions.getDiscapacidades(student.id)
			} else {
				await actions.clearCurrentDiscapacidades()
			}
		}
		fetch()
	}, [student])
	
	useEffect(() => {
		const fetch = async () => {
			debugger
			if (student) {
				await actions.getTiposApoyosRecibidos(student.id)
			} else {
				await actions.clearCurrentApoyosRecibidos()
			}
		}
		fetch()
	}, [student])

	useEffect(() => {
		const fetch = async () => {
			debugger
			if (student) {
				await actions.getTiposApoyosNoRecibidos(student.id)
			} else {
				await actions.clearCurrentApoyosNoRecibidos()
			}
		}
		fetch()
	}, [student])
	const onMatricular = async data => {
		try {
			if (onlyViewModule) {
				return
			}
			if (student.esFallecido) {
				showNotification('warning', 'El estudiante se encuentra fallecido.')
				return
			}
			debugger
			const _data = {
				IdentidadesId: student.id,
				nivelOFertaId: nivelOfertaId,
				entidadMatriculaId: dataNivel.entidadMatriculaId,
				esRepitente: data.esRepitente,
				esRefugiado: data.esRefugiado,
				esIndigena: data.esIndigena,
				conectividad: data.conectividad,
				tieneDispositivo: data.tieneDispositivo,
				ayudaConectividad: data.ayudaConectividad,
				numeroAyudaConectividad: data.numeroAyudaConectividad,
				DiscapacidadesId: data.discapacidades,
				TiposApoyosId: data.tiposApoyos,
				TiposApoyosNoRecibidosId:data.tiposApoyosNoRecibidos,
				InstitucionId: state.institution.id,
				estadosDeMatriculaId: 1, // Estado interno del sistema
				condicionEstudianteCursoId: 1 // Condición Regular al matricular
			}

			const response = await actions.createMatriculaWithAdditionalData(_data)
			if (!response.error) {
				setStudent(null)
				setContentModal({
					title: 'Estudiante matriculado',
					type: 1,
					description: 'El estudiante ha sido matriculado con éxito',
					icon: 'info-circle'
				})
				setConfirmModal(true)

				await actions.getEstudiantesByNivelOferta(nivelOfertaId, '(1,3,4,5)')
				return true
			} else {
				if (response.tipoError === 3) {
					const modelJSON = JSON.parse(response.mensaje)
					setDataModalDuplicado(modelJSON)
					setModalDuplicado(true)
				} else if (response.tipoError === 2) {
					setContentModal({
						title: 'Estudiante matriculado:Error',
						type: 2,
						description: response.mensaje
					})
					setConfirmModal(true)
				} else {
					showNotification(
						'error',
						'Este estudiante ya esta matriculado en otro centro educativo'
					)
				}
				return false
			}
		} catch (e) {
			showNotification('error', 'Oops, Algo ha salido mal')
			return false
		}
	}

	const onRemoverMatricula = async () => {
		if (onlyViewModule) {
			return
		}
		if (selectedStudent.id) {
			const response = await actions.removerEstudianteMatricula(selectedStudent.id)
			setEliminarModal(false)
			if (!response.error) {
				await actions.getEstudiantesByNivelOferta(nivelOfertaId, '(1,3,4,5)')
				setDataSend(null)
				setSelectedStudent(null)
				setContentModal({
					title: t(
						'estudiantes>registro_matricula>desmatricular>titulo',
						'Estudiante removido'
					),
					type: 1,
					description: t(
						'estudiantes>registro_matricula>desmatricular>texto',
						'El estudiante ha sido removido con éxito'
					)
				})
				setConfirmModal(true)
			} else {
				showNotification('error', 'Oops, Algo ha salido mal')
			}
		}
	}

	const onEdit = async data => {
		if (onlyViewModule) {
			return
		}
		const response = await actions.updateMatriculaWithAdditionalData(data)
		//
		if (response.error) {
			showNotification('error', 'Oops, Algo ha salido mal')
		} else {
			showNotification('success', '¡Los datos se han actualizado con éxito!')
		}
		return !response.error
	}

	const guardarNuevaPersona = async _student => {
		await actions.clearWizardDataStore()
		await actions.clearWizardNavDataStore()
		setStudent(_student)
		setRegistrarModal(false)
		setLoadingRegistrarModal(false)
	}

	const onFindStudent = student => {
		if (!student) {
			setNoEncontradoModal(true)
		} else {
			setStudent(student)
		}
	}
	const clearPersonaEncontrada = () => {
		setStudent(null)
	}

	const onCloseInformationModal = async () => {
		setConfirmModal(false)
		setDataSend(null)
		setSelectedStudent(null)
		await actions.clearWizardDataStore()
		await actions.clearWizardNavDataStore()
		await actions.clearCurrentDiscapacidades()
		await actions.clearCurrentApoyosRecibidos()
		await actions.clearCurrentApoyosNoRecibidos()
	}

	const closeVerEstudianteModal = async () => {
		setVerEstudianteModal(false)
		await actions.clearEstudianteMatricula()
	}

	const onSelectedStudent = async (row, action) => {
		if (onlyViewModule) {
			return
		}
		const dta = {
			IdentidadId: row.identidadId,
			MatriculaId: row.matriculaId,
			action,
			EstadoAnteriorId: row.estadoId
		}

		const trasladosCount = await actions.getCantidadTrasladosByMatriculaId(row.id)
		if (trasladosCount > 0 && action != 'see') {
			setSnackbarContent({
				msg: 'No puede desmatricular o excluir estudiantes que tiene traslados activos',
				variant: 'error'
			})
			handleClick()
			return
		}
		setSelectedStudent(row)
		setDataSend(dta)

		switch (action) {
			case 'see':
				await actions.getEstudianteMatricula(row.id)
				setVerEstudianteModal(true)
				return

			case 'remove':
				setEliminarModal(true)
				return

			case '1': // Regular. OJO: La variable se llama estadoId, pero realmente es el codigo del estado de la matricula.
				if (row.estadoId === 3 || row.estadoId === 4) {
					setModalAlertas(true)
				} else {
					await updateStateMatricula(dta, row)
				}
				return
			case '3': // Riesgo de exclusión
				setAlerta(true)
				return
			case '4': // Excluído
				setAlerta(true)
				return
			case '5': // Fallecido
				if (row.estadoId === 3 || row.estadoId === 4) {
					setModalAlertas(true)
				} else {
					await updateStateMatricula(dta, row)
				}
		}
	}

	const updateStateMatricula = async (dataSend, selectedStudent) => {
		if (onlyViewModule) {
			return
		}
		if (!dataSend || !selectedStudent) {
			return
		}
		const response = await actions.actualizarEstadoMatricula({
			matriculaId: dataSend?.MatriculaId,
			estadoId: dataSend?.action,
			estadoAnteriorId: selectedStudent.estadoId
		})

		setDataSend(null)
		setSelectedStudent(null)

		if (response.error) {
			showNotification(
				'error',
				'Ha ocurrido un error al tratar de actualizar el registro del estudiante. Intente más tarde.'
			)
		} else if (response.data && !response.error) {
			showNotification('success', 'El estado del estudiante ha sido actualizado con éxito.')
			await actions.getEstudiantesByNivelOferta(nivelOfertaId, '(1,3,4,5)')
		} else if (!response.data && !response.error) {
			showNotification('error', 'No se ha podido actualizar el registro del estudiante.')
		}
	}

	const closeModalDuplicado = () => {
		setDataModalDuplicado({})
		setModalDuplicado(false)
		setStudent(null)
	}
	const closeRegistrarPersona = async () => {
		await actions.clearWizardDataStore()
		await actions.clearWizardNavDataStore()
		await actions.clearCurrentDiscapacidades()
		await actions.clearCurrentApoyosRecibidos()
		await actions.clearCurrentApoyosNoRecibidos()
		setStudent(null)
		setRegistrarModal(false)
	}

	const saveAlertasCenso = async alertas => {
		const dta = {
			MatriculaId: dataSend?.MatriculaId,
			IdentidadId: dataSend?.IdentidadId,
			estadoId: Number(dataSend?.action),
			estadoAnteriorId: selectedStudent.estadoId,
			alertas: alertas.map(e => {
				return {
					e,
					observacion: e.observacion,
					alertaId: e.id
				}
			})
		}

		const response = await actions.updateEstadoMatriculaWithAlertas(dta)
		setDataSend(null)
		setSelectedStudent(null)

		response.error
			? showNotification('error', 'Oops, Algo ha salido mal')
			: showNotification('success', 'Se ha actualizado el estado del estudiante')
		if (!response.error) {
			await actions.getEstudiantesByNivelOferta(nivelOfertaId, '(1,3,4,5)')
			setAlerta(false)
			setSelectedStudent(null)
		}
	}

	const goBackAlerta = () => {
		setSelectedStudent(null)
		setDataSend(null)
		setAlerta(false)
	}

	const closeModalAlertas = () => {
		setSelectedStudent(null)
		setDataSend(null)
		setModalAlertas(false)
	}

	const continuarCensoUpdate = () => {
		updateStateMatricula(dataSend, selectedStudent)
		setModalAlertas(false)
	}

	return (
		<Container>
			{snackbar(snackBarContent.variant, snackBarContent.msg)}
			<ConfirmModal
				openDialog={modalAlertas}
				onClose={closeModalAlertas}
				title='Alertas asociadas'
				onConfirm={continuarCensoUpdate}
				btnCancel
				txtBtn='Aceptar'
			>
				<Typography variant='body1' className='my-4'>
					Cualquier alerta temprana registrada no será eliminada, éstas deben ser
					atendidas desde el módulo de alerta temprana.
				</Typography>
			</ConfirmModal>
			<SimpleModal
				openDialog={alerta}
				onClose={goBackAlerta}
				title={t(
					'estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>acciones>riesgo>registro',
					'Registro de alerta temprana'
				)}
				subTitle={t(
					'estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>acciones>riesgo>texto',
					'Permite registrar la alerta temprana a una persona estudiante.'
				)}
				actions={false}
			>
				<RegistrarAlerta
					dataInstitution={state.institution}
					dataNivel={dataNivel}
					dataStudent={selectedStudent}
					goBack={goBackAlerta}
					onConfirm={saveAlertasCenso}
				/>
			</SimpleModal>

			<Row>
				<GoBack onClick={() => goBack()} />
			</Row>
			<Row>
				<HeaderFinder
					onlyViewModule={onlyViewModule}
					data={student}
					dataNivel={dataNivel}
					setStudent={onFindStudent}
					clearPersonaEncontrada={clearPersonaEncontrada}
				/>
				<FormData
					onlyViewModule={onlyViewModule}
					data={student}
					hasAddAccess={hasAddAccess}
					onMatricular={onMatricular}
				/>
				<TableStudents
					onlyViewModule={onlyViewModule}
					data={estudiantes}
					hasEditAccess={hasEditAccess}
					onSelectedStudent={onSelectedStudent}
					closeContextualMenu={verEstudianteModal}
				/>
			</Row>

			<SimpleModal
				openDialog={noEncontradoModal}
				onClose={closeModalNoEncontrado}
				onConfirm={() => {
					closeModalNoEncontrado()
					setRegistrarModal(true)
				}}
				txtBtn={t('boton>general>registrar', 'Registrar')}
				title={t(
					'estudiantes>registro_matricula>matricula_estudian>buscar>persona_no_encontrada',
					'Persona no encontrada'
				)}
			>
				<>
					<p>
						{t(
							'estudiantes>registro_matricula>matricula_estudian>buscar>persona_no_encontrada>texto',
							'No se ha encontrado una persona con el número de identificación ingresado'
						)}
					</p>
					<p>
						{t(
							'estudiantes>registro_matricula>matricula_estudian>buscar>persona_no_encontrada>texto2',
							'Puede registrarlo haciendo click en "Registrar"'
						)}
					</p>
				</>
			</SimpleModal>
			<SimpleModal
				openDialog={eliminarModal}
				onClose={() => setEliminarModal(false)}
				onConfirm={() => {
					onRemoverMatricula()
				}}
				txtBtn={t('boton>general>eliminar', 'Eliminar')}
				title={t(
					'estudiantes>registro_matricula>matricula_estudian>des_matricular>confim_eliminacion',
					'Confirmar eliminación'
				)}
			>
				<TextModal>
					<p>
						{t(
							'estudiantes>registro_matricula>matricula_estudian>des_matricular>confim_eliminacion>texto',
							'Estimado director(a), esta acción eliminará TODA la información del estudiante existente en el sistema y es irreversible, ¿está seguro que desea ELIMINAR los datos del estudiante en el sistema?'
						)}
					</p>
					<span>
						{t(
							'estudiantes>registro_matricula>matricula_estudian>des_matricular>confim_eliminacion>texto2',
							'*Se creará un registro de sus datos asociados a esta eliminación, para que pueda justificarlo posteriormente.'
						)}
					</span>
				</TextModal>
			</SimpleModal>
			<SimpleModal
				openDialog={registrarModal}
				onClose={() => closeRegistrarPersona()}
				actions={false}
				title={t(
					'estudiantes>registro_matricula>matricula_estudian>buscar>registrar_persona',
					'Registrar persona'
				)}
			>
				<>
					<WizardRegisterIdentityModal onConfirm={guardarNuevaPersona} />
					{loadingRegistrarModal && <Loader />}
				</>
			</SimpleModal>
			<SimpleModal
				openDialog={modalDuplicado}
				onClose={() => closeModalDuplicado()}
				title='El estudiante ya se encuentra matriculado'
				actions={false}
			>
				<div style={{ width: '100%' }}>
					<Row>
						<Col lg='12'>
							<h5>
								Está intentando registrar un estudiante, que ya se encuentra
								matriculado en otro Centro Educativo, a continuación, le brindamos
								más información sobre el estudiante para su consideración.
							</h5>
						</Col>
						<Col lg='12'>
							<RowStyled>
								<Col lg='4'>
									<div>
										<LabelAzul>IDENTIFICACIÓN</LabelAzul>
										<span>
											{dataModalDuplicado.Identificacion
												? dataModalDuplicado.Identificacion
												: '--------'}
										</span>
									</div>
								</Col>
								<Col lg='4'>
									<div>
										<LabelAzul>NOMBRE COMPLETO</LabelAzul>
										<span>
											{dataModalDuplicado.NombreCompleto
												? dataModalDuplicado.NombreCompleto
												: '--------'}
										</span>
									</div>
								</Col>
								<Col lg='4'>
									<LabelAzul>EDAD</LabelAzul>
									<span>
										{dataModalDuplicado.Edad
											? getYearsOld(dataModalDuplicado.Edad)
											: '--------'}
									</span>
								</Col>
							</RowStyled>
							<Row>
								<Col lg='6'>
									<div>
										<LabelAzul>CENTRO EDUCATIVO</LabelAzul>
										<span>
											{dataModalDuplicado.CentroEducativo
												? dataModalDuplicado.CentroEducativo
												: '--------'}
										</span>
									</div>
									<div>
										<LabelAzul>CÓDIGO</LabelAzul>
										<span>
											{dataModalDuplicado.Codigo
												? dataModalDuplicado.Codigo
												: '--------'}
										</span>
									</div>
									<div>
										<LabelAzul>CÓDIGO PRESUPUESTARIO</LabelAzul>
										<span>
											{dataModalDuplicado.CodigoPresupuestario
												? dataModalDuplicado.CodigoPresupuestario
												: '--------'}
										</span>
									</div>
									<div>
										<LabelAzul>TIPO DE CENTRO</LabelAzul>
										<span>
											{dataModalDuplicado.TipoCentro
												? dataModalDuplicado.TipoCentro
												: '--------'}
										</span>
									</div>
									<div>
										<LabelAzul>UBICACIÓN ADMINISTRATIVA</LabelAzul>
										<span>
											{dataModalDuplicado.UAdministrativa
												? dataModalDuplicado.UAdministrativa
												: '--------'}
										</span>
									</div>
								</Col>
								<Col lg='6'>
									<div>
										<LabelAzul>UBICACIÓN GEOGRÁFICA</LabelAzul>
										<span>
											{dataModalDuplicado.UGeografica
												? dataModalDuplicado.UGeografica
												: '--------'}
										</span>
									</div>
									<div>
										<LabelAzul>DIRECTOR</LabelAzul>
										<span>
											{dataModalDuplicado.Director
												? dataModalDuplicado.Director
												: '--------'}
										</span>
									</div>
									<div>
										<LabelAzul>TELÉFONO</LabelAzul>
										<span>
											{dataModalDuplicado.Telefono
												? dataModalDuplicado.Telefono
												: '--------'}
										</span>
									</div>
									<div>
										<LabelAzul>CORREO</LabelAzul>
										<span>
											{dataModalDuplicado.Correo
												? dataModalDuplicado.Correo
												: '--------'}
										</span>
									</div>
								</Col>
							</Row>
						</Col>
					</Row>
				</div>
			</SimpleModal>

			<SimpleModal
				openDialog={verEstudianteModal}
				onClose={() => closeVerEstudianteModal()}
				actions={false}
				title={t(
					'estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>ver>ver_estudiante',
					'Ver estudiante'
				)}
			>
				<VerEstudiante
					data={selectedStudent}
					editable={false}
					hasEditAccess={hasEditAccess}
					onEdit={onEdit}
					closeVerEstudianteModal={() => closeVerEstudianteModal()}
				/>
			</SimpleModal>
			<ConfirmModal
				openDialog={confirmModal}
				onClose={onCloseInformationModal}
				onConfirm={onCloseInformationModal}
				title={contentModal.title}
				txtBtn='Cerrar'
				icon={contentModal?.icon || undefined}
				btnCancel={false}
			>
				<Container>
					<CenterDiv>
						{contentModal.type === 2 && (
							<CancelIcon
								style={{ fontSize: 150, color: colors.primary }}
								color='primary'
								className='my-3'
							/>
						)}
						{contentModal.type !== 2 && (
							<CheckCircleIcon
								style={{ fontSize: 150, color: colors.primary }}
								color='primary'
								className='my-3'
							/>
						)}
					</CenterDiv>
					<h5 className=' text-left'>{contentModal.description}</h5>
				</Container>
			</ConfirmModal>
		</Container>
	)
}
const CenterDiv = styled.div`
	display: flex;
	width: 100%;
	justify-content: center;
	align-items: center;
`
const LabelAzul = styled.div`
	color: ${colors.primary};
`
const TextModal = styled.div`
	min-width: 500px;
	width: 500px;
`
const RowStyled = styled(Row)`
	border-top: 1px solid #000;
	border-bottom: 1px solid #000;
	padding: 10px 0;
	margin: 10px 0;
`
export default RegisterStudentForm
