import React, { useEffect } from 'react'
import axios from 'axios'
import studentBreadcrumb from 'Constants/studentBreadcrumb'
import { useSelector } from 'react-redux'
import { getIdentification } from 'Redux/identificacion/actions'
import {
	getStudentDataFilter,
	loadStudent
} from 'Redux/expedienteEstudiantil/actions'
import { getDiscapacidades } from 'Redux/apoyos/actions'
import { Col, Row, Container } from 'reactstrap'
import Breadcrumb from 'Containers/navs/CustomBreadcrumb'
import EstudianteInformationCard from './_partials/EstudianteInformationCard'
import Loader from 'Components/Loader'
import { useActions } from 'Hooks/useActions'
import AppLayout from 'Layout/AppLayout'
import directorItems from 'Constants/directorMenu'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { isEmpty, rest } from 'lodash'
import { envVariables } from 'Constants/enviroment'
import BitacoraExpediente from './BitacoraExpediente'
import { catalogsEnumObj } from 'Utils/catalogsEnum'
import { getCatalogs, getCatalogsSet } from 'Redux/selects/actions'
import { validateSelectsData } from 'Utils/ValidateSelectsData'
import { mapOption } from 'Utils/mapeoCatalogos'

const Navegacion = React.lazy(() => import('./Navegacion'))
const Contacto = React.lazy(() => import('./Contacto'))
const General = React.lazy(() => import('./General'))
const Oferta = React.lazy(() => import('./Oferta'))
// const AreaCurricular = React.lazy(() => import('./AreaCurricular'))
const Hogar = React.lazy(() => import('./Hogar'))
const Beneficios = React.lazy(() => import('./Beneficios'))
const Apoyo = React.lazy(() => import('./Apoyo'))
const Salud = React.lazy(() => import('./Salud'))
const Buscador = React.lazy(() => import('./Buscador'))
const CuentaUsuarios = React.lazy(() => import('./CuentaUsuario'))
const ServicioComunalEstudiantil = React.lazy(
	() => import('./ServicioComunalEstudiantil')
)

const ContenedorPrincipal = props => {
	const { t } = useTranslation()
	const { idEstudiante } = useParams()
	const [active, setActive] = React.useState(0)
	const [loading, setLoading] = React.useState(true)
	const idInstitucion = localStorage.getItem('idInstitucion')
	const [infoCard, setInfoCard] = React.useState({})

	studentBreadcrumb.map((item, idx) => {
		item.active = props.active === idx
		return item
	})

	const actions = useActions({
		getIdentification,
		getStudentDataFilter,
		loadStudent,
		getDiscapacidades,
		getCatalogs,
		getCatalogsSet
	})

	const state = useSelector(store => {
		return {
			expedienteEstudiantil: store.expedienteEstudiantil,
			identification: store.identification,
			historialMatricula: store.identification.matriculaHistory,
			apoyos: store.apoyos,
			selects: store.selects
		}
	})

	const estudianteEnContexto = () => {
		return localStorage.getItem('currentStudent') ? true : false
	}

	const blockeo = () => {
		return (
			<h3>Debe seleccionar un estudiante en el buscador de estudiantes.</h3>
		)
	}

	useEffect(() => {
		setActive(props.active)
	}, [props.active])

	useEffect(() => {
		setLoading(true)
		const fetch = async () => {
			const _id = idEstudiante
			idEstudiante && setActive(1)
			const response = await actions.getStudentDataFilter(_id, 'identificacion')

			if (response.data) {
				await actions.loadStudent(response.data[0])
			}
			setLoading(false)
		}

		idEstudiante && fetch()
	}, [idEstudiante])

	useEffect(() => {
		setLoading(true)
		const fetch = async () => {
			const _id = state.expedienteEstudiantil.currentStudent.idEstudiante
			const response = await actions.getIdentification(_id)

			const catalogsNamesArray = [
				catalogsEnumObj.GENERO.name,
				catalogsEnumObj.NATIONALITIES.name
			]

			let nacionalidad = ''
			let genero = ''

			if (validateSelectsData(state.selects, catalogsNamesArray)) {
				const _item = {
					nacionalidad: mapOption(
						response.data.data.datos,
						state.selects,
						catalogsEnumObj.NATIONALITIES.id,
						catalogsEnumObj.NATIONALITIES.name
					),
					genero: mapOption(
						response.data.data.datos,
						state.selects,
						catalogsEnumObj.GENERO.id,
						catalogsEnumObj.GENERO.name
					)
				}

				nacionalidad = _item.nacionalidad.label ? _item.nacionalidad.label : ''
				genero = _item.genero.label ? _item.genero.label : ''
			}

			setInfoCard(prevState => {
				return {
					...prevState,
					...state.expedienteEstudiantil.currentStudent,
					nacionalidad: nacionalidad,
					genero: genero,
					datos: state.identification.data.datos
				}
			})
			setLoading(false)
		}

		if (state.expedienteEstudiantil.currentStudent?.idEstudiante) {
			fetch()
		}
	}, [state.expedienteEstudiantil.currentStudent])

	useEffect(() => {
		setLoading(true)
		const loadData = async () => {
			const discapacidades = await actions.getDiscapacidades(
				state.expedienteEstudiantil.currentStudent.idEstudiante
			)
			const tieneDiscapacidades = !isEmpty(discapacidades) ? 'SI' : 'NO'

			setInfoCard(prevState => {
				return {
					...prevState,
					tieneDiscapacidades: tieneDiscapacidades
				}
			})
			setLoading(false)
		}
		if (state.expedienteEstudiantil.currentStudent?.idEstudiante) {
			loadData()
		}
	}, [state.expedienteEstudiantil.currentStudent])

	useEffect(() => {
		setLoading(true)
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
			setLoading(false)
		}

		if (state.expedienteEstudiantil.currentStudent?.idEstudiante) {
			loadData()
		}
	}, [state.expedienteEstudiantil.currentStudent])

	return (
		<AppLayout items={directorItems}>
			<div className="dashboard-wrapper">
				<Container>
					{active !== 0 && estudianteEnContexto() && (
						<EstudianteInformationCard fixed data={infoCard} />
					)}

					{/* <Row style={{ paddingTop: active !== 0 && estudianteEnContexto() ? 100 : 0 }}> */}
					<Row>
						{active !== 0 && estudianteEnContexto() && (
							<Col xs={12}>
								<Breadcrumb
									header={t(
										'expediente_estudiantil>titulo',
										'Expediente Estudiantil'
									)}
									data={studentBreadcrumb}
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
												<Navegacion {...props} />
											) : (
												blockeo()
											),
											2: estudianteEnContexto() ? (
												<General {...props} />
											) : (
												blockeo()
											),
											3: estudianteEnContexto() ? (
												<Contacto {...props} />
											) : (
												blockeo()
											),
											4: estudianteEnContexto() ? (
												<Hogar {...props} />
											) : (
												blockeo()
											),
											5: estudianteEnContexto() ? (
												<Beneficios {...props} />
											) : (
												blockeo()
											),
											6: estudianteEnContexto() ? (
												<Apoyo {...props} />
											) : (
												blockeo()
											),
											// 7: estudianteEnContexto() ? (
											// 	<AreaCurricular {...props} />
											// ) : (
											// 	blockeo()
											// ),
											7: estudianteEnContexto() ? (
												<Salud {...props} />
											) : (
												blockeo()
											),
											8: estudianteEnContexto() ? (
												<Oferta
													{...props}
													historialMatricula={state.historialMatricula}
												/>
											) : (
												blockeo()
											),
											// 	10: <Sinirube {...props} />,
											//10: <CuentaCorreo {...props} />,
											9: estudianteEnContexto() ? (
												<CuentaUsuarios
													{...props}
													expedienteEstudiantil={state.expedienteEstudiantil}
												/>
											) : (
												blockeo()
											),
											10: estudianteEnContexto() ? (
												<ServicioComunalEstudiantil {...props} />
											) : (
												blockeo()
											),
											11: estudianteEnContexto() ? (
												<BitacoraExpediente {...props} />
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
