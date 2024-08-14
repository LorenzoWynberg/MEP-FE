import React, { useEffect } from 'react'
import axios from 'axios'
import studentBreadcrumb from 'Constants/studentBreadcrumb'
import { useSelector } from 'react-redux'
import { getIdentification } from 'Redux/identificacion/actions'
import { getStudentDataFilter, loadStudent } from 'Redux/expedienteEstudiantil/actions'
import { getDiscapacidades } from '../../../../redux/apoyos/actions'
import { Col, Row, Container } from 'reactstrap'
import Breadcrumb from 'Containers/navs/CustomBreadcrumb'
import EstudianteInformationCard from './_partials/EstudianteInformationCard'
import Loader from '../../../../components/Loader'
import { useActions } from '../../../../hooks/useActions'
import AppLayout from 'Layout/AppLayout'
import directorItems from 'Constants/directorMenu'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { isEmpty, rest } from 'lodash'
import { envVariables } from 'Constants/enviroment'
import style from 'styled-components'
import { Navbar } from 'react-bootstrap'

const Navegacion = React.lazy(() => import('./Navegacion'))
const Contacto = React.lazy(() => import('./Contacto'))
const General = React.lazy(() => import('./General'))
const Oferta = React.lazy(() => import('./Oferta'))
const AreaCurricular = React.lazy(() => import('./AreaCurricular'))
const Hogar = React.lazy(() => import('./Hogar'))
const Beneficios = React.lazy(() => import('./Beneficios'))
const Apoyo = React.lazy(() => import('./Apoyo'))
const Salud = React.lazy(() => import('./Salud'))
const Buscador = React.lazy(() => import('./Buscador'))
const Sinirube = React.lazy(() => import('./Sinirube'))
const CuentaCorreo = React.lazy(() => import('./CuentaCorreo'))
const CuentaUsuarios = React.lazy(() => import('./CuentaUsuario'))
const ServicioComunalEstudiantil = React.lazy(() => import('./ServicioComunalEstudiantil'))

const ContenedorPrincipal = props => {
	const { t } = useTranslation()
	const { idEstudiante } = useParams()
	const [active, setActive] = React.useState(0)
	const [loading, setLoading] = React.useState(false)
	const [aplicaSCE, setAplicaSCE] = React.useState(false)
	const [breadcrumbs, setBreadcrumbs] = React.useState([])
	const idInstitucion = localStorage.getItem('idInstitucion')
	const [identidadData, setIdentidadData] = React.useState({})
	const [infoCard, setInfoCard] = React.useState({})

	studentBreadcrumb.map((item, idx) => {
		item.active = props.active === idx
		return item
	})

	const actions = useActions({
		getIdentification,
		getStudentDataFilter,
		loadStudent,
		getDiscapacidades
	})

	const state = useSelector(store => {
		return {
			expedienteEstudiantil: store.expedienteEstudiantil,
			identification: store.identification,
			historialMatricula: store.identification.matriculaHistory,
			apoyos: store.apoyos
		}
	})

	const estudianteEnContexto = () => {
		return localStorage.getItem('currentStudent') ? true : false
	}

	const blockeo = () => {
		return <h3>Debe seleccionar un estudiante en el buscador de estudiantes.</h3>
	}

	useEffect(() => {
		setActive(props.active)
	}, [props.active])

	useEffect(() => {
		const fetch = async () => {
			const _id = idEstudiante
			idEstudiante && setActive(1)
			setLoading(true)
			const response = await actions.getStudentDataFilter(_id, 'identificacion')

			if (response.data) {
				await actions.loadStudent(response.data[0])
			}
			setLoading(false)
		}

		idEstudiante && fetch()
	}, [idEstudiante])

	useEffect(() => {
		const fetch = async () => {
			const _id = state.expedienteEstudiantil.currentStudent.idEstudiante
			setLoading(true)
			await actions.getIdentification(_id)
			setLoading(false)

			setInfoCard(prevState => {
				return {
					...prevState,
					...state.expedienteEstudiantil.currentStudent,
					datos: state.identification.data.datos
				}
			})
		}

		if (state.expedienteEstudiantil.currentStudent?.idEstudiante) {
			fetch()
		}
	}, [state.expedienteEstudiantil.currentStudent])

	useEffect(() => {
		const loadData = async () => {
			setLoading(true)
			const discapacidades = await actions.getDiscapacidades(
				state.expedienteEstudiantil.currentStudent.idEstudiante
			)
			setLoading(false)

			const tieneDiscapacidades = !isEmpty(discapacidades) ? 'SI' : 'NO'

			setInfoCard(prevState => {
				return {
					...prevState,
					tieneDiscapacidades: tieneDiscapacidades
				}
			})
		}
		if (state.expedienteEstudiantil.currentStudent?.idEstudiante) {
			loadData()
		}
	}, [state.expedienteEstudiantil.currentStudent])

	useEffect(() => {
		const loadData = async () => {
			try {
				const datosAdicionales = await axios.get(
					`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Expediente/GetDatosAdicionalesMatricula/${state.expedienteEstudiantil.currentStudent.idEstudiante}`
				)

				const esIndigena = datosAdicionales.data?.esIndigena ? 'SI' : 'NO'
				setInfoCard(prevState => {
					return {
						...prevState,
						esIndigena: esIndigena,
						estadoMatricula: datosAdicionales.data?.estadoMatricula
					}
				})
			} catch (err) {}
		}

		if (state.expedienteEstudiantil.currentStudent?.idEstudiante) {
			loadData()
		}
	}, [state.expedienteEstudiantil.currentStudent])

	const validarEstudianteSCE = async () => {
		try {
			const response = await axios.post(
				`https://mep-saber.azurewebsites.net/api/ServicioComunal/VerificarEstudianteAplicaSCE?idInstitucion=${idInstitucion}&idEstudiante=${state.expedienteEstudiantil.currentStudent.idEstudiante}`
			)
			setAplicaSCE(response.data)
		} catch (error) {
			console.error('API error:', error)
		}
	}

	const validarAcceso = async () => {
		await Promise.all([validarEstudianteSCE()])
		setLoading(false)
	}

	useEffect(() => {
		const newBreadcrumbs = studentBreadcrumb.map((item, idx) => ({
			...item
		}))

		if (!aplicaSCE) {
			newBreadcrumbs.splice(11, 1)
		}

		setBreadcrumbs(newBreadcrumbs)
	}, [aplicaSCE])

	useEffect(() => {
		setLoading(true)
		validarAcceso()
	}, [])

	return (
		<AppLayout items={directorItems}>
			<div className='dashboard-wrapper'>
				<Container>
					{active !== 0 && estudianteEnContexto() && <EstudianteInformationCard fixed data={infoCard} />}

					<Row style={{ paddingTop: 100 }}>
						{active !== 0 && estudianteEnContexto() && (
							<Col xs={12}>
								<Breadcrumb
									header={t('expediente_estudiantil>titulo', 'Expediente Estudiantil')}
									data={breadcrumbs}
								/>
								<br />
							</Col>
						)}
						{loading ? (
							<Loader />
						) : (
							<div style={{ width: '100%' }}>
								<>
									{
										{
											0: <Buscador {...props} />,
											1: estudianteEnContexto() ? (
												<Navegacion {...props} aplicaSCE={aplicaSCE} />
											) : (
												blockeo()
											),
											2: estudianteEnContexto() ? <General {...props} /> : blockeo(),
											3: estudianteEnContexto() ? <Contacto {...props} /> : blockeo(),
											4: estudianteEnContexto() ? <Hogar {...props} /> : blockeo(),
											5: estudianteEnContexto() ? <Beneficios {...props} /> : blockeo(),
											6: estudianteEnContexto() ? <Apoyo {...props} /> : blockeo(),
											7: estudianteEnContexto() ? <AreaCurricular {...props} /> : blockeo(),
											8: estudianteEnContexto() ? <Salud {...props} /> : blockeo(),
											9: estudianteEnContexto() ? (
												<Oferta {...props} historialMatricula={state.historialMatricula} />
											) : (
												blockeo()
											),
											// 	10: <Sinirube {...props} />,
											//10: <CuentaCorreo {...props} />,
											10: estudianteEnContexto() ? (
												<CuentaUsuarios
													{...props}
													expedienteEstudiantil={state.expedienteEstudiantil}
												/>
											) : (
												blockeo()
											),
											11:
												estudianteEnContexto() && aplicaSCE ? (
													<ServicioComunalEstudiantil {...props} />
												) : (
													blockeo()
												)
										}[active]
									}
								</>
							</div>
						)}
					</Row>
				</Container>
			</div>
		</AppLayout>
	)
}

export default ContenedorPrincipal
