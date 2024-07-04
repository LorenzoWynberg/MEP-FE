import GoBack from 'Components/goBack'
import { useActions } from 'Hooks/useActions'
import useNotification from 'Hooks/useNotification'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import { Col, Row, Button } from 'reactstrap'
import {
	getEstudiantesCensoFinalNivelOferta,
	actualizarCensoFinalMatricula
} from 'Redux/matricula/actions'
import Loader from 'Components/LoaderContainer'
import styled from 'styled-components'
import HeaderPage from 'Components/common/Header'
import InputWrapper from 'Components/wrappers/InputWrapper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TableStudents from './tableStudents'
import TableStudentsBloqueada from './tableStudentsBloqueada'
import PrintIcon from '@material-ui/icons/Print'
import { uniqBy } from 'lodash'
import style from 'styled-components'
import SimpleModal from 'Components/Modal/simple'
import ReportCensoFinal from 'Views/app/reportes/Censo/censoFinal'
import { usePrevious } from 'Hooks'


interface IProps {
	dataNivel: any
	goBack: Function
}
type SnackbarConfig = {
	variant: string
	msg: string
}
const RegisterStudentForm: React.FC<IProps> = (props) => {
	const { dataNivel, goBack } = props

	const [estudiantes, setEstudiantes] = useState([])
	const [selectedStudent, setSelectedStudent] = useState(null)
	const [dataSend, setDataSend] = useState<any>(null)
	const [loading, setLoading] = useState(false)
	const [printModal, setPrintModal] = useState(false)
	const [verEstudianteModal, setVerEstudianteModal] = useState(false)
	const [onlyViewModule, setOnlyViewModule] = useState<boolean>(true)
	const [modalAlertas, setModalAlertas] = useState<any>(false)
	const [alerta, setAlerta] = useState<any>(false)
	const history = useHistory()
	const [snackBarContent, setSnackbarContent] =
		React.useState<SnackbarConfig>({
			variant: '',
			msg: ''
		})
	const [snackbar, handleClick] = useNotification()

	const { nivelOfertaId } = useParams<any>()

	const state = useSelector((store: any) => {
		return {
			institution: store.authUser.currentInstitution,
			students: store.matricula.estudiantesCensoFinal,
			estadosMatricula: store.matricula.CondicionEstudianteCurso || []
		}
	})

	const ACTIVE_YEAR = useSelector((store: any) => store.authUser.selectedActiveYear)

	const PREV_ACTIVE_YEAR: any = usePrevious(ACTIVE_YEAR)

	useEffect(() => {
		setOnlyViewModule(!ACTIVE_YEAR.esActivo)
		if (PREV_ACTIVE_YEAR?.id) {
			if (PREV_ACTIVE_YEAR?.id !== ACTIVE_YEAR?.id)
				history.push('/director/censo-final')
		}
	}, [ACTIVE_YEAR])

	useEffect(() => {
		setEstudiantes(state.students)
	}, [state.students, ACTIVE_YEAR])

	const showNotification = (variant: string, msg: string) => {
		setSnackbarContent({ variant, msg })
		handleClick()
	}

	const actions = useActions({
		getEstudiantesCensoFinalNivelOferta,
		actualizarCensoFinalMatricula
	})

	useEffect(() => {
		debugger
		const fetch = async () => {
			await actions.getEstudiantesCensoFinalNivelOferta(nivelOfertaId)
		}
		if (nivelOfertaId) {
			fetch()
		}
	}, [nivelOfertaId, ACTIVE_YEAR])

	const actualizarEstado = async (dataSend, estadoId) => {
		try {
			if (!dataSend) {
				return
			}
			setLoading(true)

			let dta = {
				MatriculaId: dataSend.matriculaId,
				IdentidadId: dataSend.identidadId,
				EstadoId: estadoId
			}

			let response = await actions.actualizarCensoFinalMatricula(dta)

			response.error
				? showNotification('error', 'Oops, Algo ha salido mal')
				: showNotification(
						'success',
						'Se ha actualizado el estado del censo final'
				  )

			setDataSend(null)
			setSelectedStudent(null)

			await actions.getEstudiantesCensoFinalNivelOferta(nivelOfertaId)
			setLoading(false)
			return true
		} catch (e) {
			showNotification('error', 'Oops, Algo ha salido mal')
			setLoading(false)
			return false
		}
	}

	const contarCensos = () => {
		let _estudiantes = uniqBy(estudiantes, 'matriculaId')
		_estudiantes = _estudiantes.filter(
			(e) =>
				Boolean(e.condicionFinalId) &&
				(e.estadoId === 1 || e.estadoId === 3)
		)
		return _estudiantes.length
	}

	const contarEStudiantes = () => {
		
		let _estudiantes = uniqBy(estudiantes, 'matriculaId')
		_estudiantes = _estudiantes.filter(
			(e) => e.estadoId === 1 || e.estadoId === 3
		)
		return _estudiantes.length
	}
	const validaAnio =() =>{
	
		let _anio = uniqBy(estudiantes, 'matriculaId')
		_anio = _anio.filter( (v)=> v.anioEstado === 1)
     return _anio.length
		
	}
	if (validaAnio()) {
		
		return (
			<>
				{snackbar(snackBarContent.variant, snackBarContent.msg)}
				<Row>
					<Col xs={12}>
						<HeaderPage
							title={`Registro de condición del estudiante (Censo final)`}
							subHeader={
								'Esta pantalla permite realizar el registro de la condición de la persona estudiante en la actualidad.'
							}
							className={{ separator: 'mb-2' }}
						/>
					</Col>
	
					<Col xs={12}>
						<GoBack onClick={() => goBack()} />
					</Col>
					<Col xs={12} md={6}>
						<Card>
							<InputWrapper
								classNames={` backgroundCard backgroundCard-blue`}
							>
								<div
									style={{
										height: '100%',
										cursor: 'pointer'
									}}
								>
									<Grid xs={12} container>
										<Grid
											xs={12}
											direction="row"
											className={'mt-3'}
											container
										>
											<Grid
												container
												direction="column"
												xs={8}
											>
												<Grid item xs container>
													<Grid
														xs={12}
														direction="row"
														container
													>
														<Typography
															gutterBottom
															variant="subtitle1"
														>
															{dataNivel.nivelNombre}
														</Typography>
													</Grid>
													<Grid
														xs={12}
														direction="row"
														container
													>
														<Typography variant="body2">
															{dataNivel.ofertaNombre}
														</Typography>
													</Grid>
													<Grid
														xs={12}
														direction="row"
														container
													>
														<Typography variant="body2">
															{
																dataNivel.modalidadNombre
															}
														</Typography>
													</Grid>
													<Grid
														xs={12}
														direction="row"
														container
													>
														<Typography variant="body2">
															{
																dataNivel.especialidadNombre
															}
														</Typography>
													</Grid>
													<Grid
														xs={12}
														direction="row"
														container
													>
														<Typography variant="body2">
															{
																dataNivel.servicioNombre
															}
														</Typography>
													</Grid>
												</Grid>
											</Grid>
											<Grid item xs={4} container>
												<Grid
													xs={12}
													direction="row"
													container
												>
													<Typography variant="body2">
														{contarEStudiantes()}{' '}
														Estudiantes
													</Typography>
												</Grid>
												<Grid
													xs={12}
													direction="row"
													container
												>
													<Typography variant="body2">
														{contarCensos()} Estudiantes
														Censados
													</Typography>
												</Grid>
												<Grid
													xs={12}
													direction="row"
													container
												>
													<Typography variant="body2">
														{contarEStudiantes() -
															contarCensos()}{' '}
														Estudiantes Pendientes
													</Typography>
												</Grid>
	
												<Grid
													xs={12}
													direction="row"
													container
												>
													<Typography
														variant="body2"
														className={'mr-1'}
													>
														<i className="simple-icon-user-female"></i>{' '}
														{dataNivel.mujeres}
													</Typography>
													<Typography variant="body2">
														<i className="simple-icon-user"></i>{' '}
														{dataNivel.hombres}
													</Typography>{' '}
												</Grid>
											</Grid>
										</Grid>
									</Grid>
								</div>
							</InputWrapper>
						</Card>
					</Col>
					<Col xs={12} md={6}>
						<div className="d-flex justify-content-end">
							<Button
								onClick={() => setPrintModal(true)}
								variant="contained"
								color="primary"
								style={{ display: 'flex', alignItems: 'center' }}
							>
								<PrintIcon className="mr-1" /> Imprimir Censo
							</Button>
						</div>
					</Col>
					
					<TableStudents
						onConfirm={actualizarEstado}
						data={estudiantes}
						states={state?.estadosMatricula}
						hasEditAccess={true}
						closeContextualMenu={verEstudianteModal}
							/>
				</Row>
				{loading && (
					<Row>
						<Loader />
					</Row>
				)}
				<SimpleModal
					openDialog={printModal}
					title="Censo final"
					actions={false}
					onClose={() => {
						setPrintModal(false)
					}}
				>
					<div style={{ minWidth: '500px' }}>
						<ReportCensoFinal
							nivelOfertaId={nivelOfertaId}
							dataNivel={dataNivel}
						/>
					</div>
				</SimpleModal>
			</>
		)
		
	}else{
		return (
			<>
				{snackbar(snackBarContent.variant, snackBarContent.msg)}
				<Row>
					<Col xs={12}>
						<HeaderPage
							title={`Registro de condición del estudiante (Censo final)`}
							subHeader={
								'Esta pantalla permite realizar el registro de la condición de la persona estudiante en la actualidad.'
							}
							className={{ separator: 'mb-2' }}
						/>
					</Col>
	
					<Col xs={12}>
						<GoBack onClick={() => goBack()} />
					</Col>
					<Col xs={12} md={6}>
						<Card>
							<InputWrapper
								classNames={` backgroundCard backgroundCard-blue`}
							>
								<div
									style={{
										height: '100%',
										cursor: 'pointer'
									}}
								>
									<Grid xs={12} container>
										<Grid
											xs={12}
											direction="row"
											className={'mt-3'}
											container
										>
											<Grid
												container
												direction="column"
												xs={8}
											>
												<Grid item xs container>
													<Grid
														xs={12}
														direction="row"
														container
													>
														<Typography
															gutterBottom
															variant="subtitle1"
														>
															{dataNivel.nivelNombre}
														</Typography>
													</Grid>
													<Grid
														xs={12}
														direction="row"
														container
													>
														<Typography variant="body2">
															{dataNivel.ofertaNombre}
														</Typography>
													</Grid>
													<Grid
														xs={12}
														direction="row"
														container
													>
														<Typography variant="body2">
															{
																dataNivel.modalidadNombre
															}
														</Typography>
													</Grid>
													<Grid
														xs={12}
														direction="row"
														container
													>
														<Typography variant="body2">
															{
																dataNivel.especialidadNombre
															}
														</Typography>
													</Grid>
													<Grid
														xs={12}
														direction="row"
														container
													>
														<Typography variant="body2">
															{
																dataNivel.servicioNombre
															}
														</Typography>
													</Grid>
												</Grid>
											</Grid>
											<Grid item xs={4} container>
												<Grid
													xs={12}
													direction="row"
													container
												>
													<Typography variant="body2">
														{contarEStudiantes()}{' '}
														Estudiantes
													</Typography>
												</Grid>
												<Grid
													xs={12}
													direction="row"
													container
												>
													<Typography variant="body2">
														{contarCensos()} Estudiantes
														Censados
													</Typography>
												</Grid>
												<Grid
													xs={12}
													direction="row"
													container
												>
													<Typography variant="body2">
														{contarEStudiantes() -
															contarCensos()}{' '}
														Estudiantes Pendientes
													</Typography>
												</Grid>
	
												<Grid
													xs={12}
													direction="row"
													container
												>
													<Typography
														variant="body2"
														className={'mr-1'}
													>
														<i className="simple-icon-user-female"></i>{' '}
														{dataNivel.mujeres}
													</Typography>
													<Typography variant="body2">
														<i className="simple-icon-user"></i>{' '}
														{dataNivel.hombres}
													</Typography>{' '}
												</Grid>
											</Grid>
										</Grid>
									</Grid>
								</div>
							</InputWrapper>
						</Card>
					</Col>
					<Col xs={12} md={6}>
						<div className="d-flex justify-content-end">
							<Button
								onClick={() => setPrintModal(true)}
								variant="contained"
								color="primary"
								style={{ display: 'flex', alignItems: 'center' }}
							>
								<PrintIcon className="mr-1" /> Imprimir Censo
							</Button>
						</div>
					</Col>
					
					<TableStudentsBloqueada
						onConfirm={actualizarEstado}
						data={estudiantes}
						states={state?.estadosMatricula}
						hasEditAccess={true}
						closeContextualMenu={verEstudianteModal}
							/>
				</Row>
				{loading && (
					<Row>
						<Loader />
					</Row>
				)}
				<SimpleModal
					openDialog={printModal}
					title="Censo final"
					actions={false}
					onClose={() => {
						setPrintModal(false)
					}}
				>
					<div style={{ minWidth: '500px' }}>
						<ReportCensoFinal
							nivelOfertaId={nivelOfertaId}
							dataNivel={dataNivel}
						/>
					</div>
				</SimpleModal>
			</>
		)

	}
	
}

const Card = styled.div``
const StyledModalBody = styled.div``

export default RegisterStudentForm
