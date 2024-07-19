import React, { useEffect } from 'react'
import centroBreadcrumb from 'Constants/centroBreadcrumb'
import { Col, Row, Container } from 'reactstrap'
import Breadcrumb from 'Containers/navs/CustomBreadcrumb'
import AppLayout from 'Layout/AppLayout'
import directorItems from 'Constants/directorMenu'
import Grupos from './_partials/GruposProyeccion/Grupos'
import { Helmet } from 'react-helmet'
import Horarios from './Horarios'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useActions } from '../../../../hooks/useActions'
import { GetServicioComunalInfoByStudentId } from 'Redux/formularioCentroResponse/actions'

import InformationCard from './_partials/InformationCard'

import studentBreadcrumb from 'Constants/studentBreadcrumb'

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

const ContenedorExpSCE = (props) => {
	const { t } = useTranslation()
	const [servicioData, setServicioData] = React.useState(null)
	const actions = useActions({

		GetServicioComunalInfoByStudentId

	})
	studentBreadcrumb.map((item, idx) => {
		item.active = props.active === idx
		return item
	})
	const storeIs = useSelector((store) =>
		store

	)

	const state = useSelector((store) => {
		return {
			expedienteEstudiantil: store.expedienteEstudiantil,
			identification: store.identification,
			historialMatricula: store.identification.matriculaHistory
		}
	})
	useEffect(() => {
		let id = state.expedienteEstudiantil?.currentStudent?.idEstudiante ? state.expedienteEstudiantil?.currentStudent?.idEstudiante : localStorage.getItem('state.expedienteEstudiantil.currentStudent.idEstudiante')
		actions.GetServicioComunalInfoByStudentId(id).then((res) => {
			console.log('res', res)
			setServicioData(res)
		})
	}, [state.expedienteEstudiantil.currentStudent.idEstudiante])
	useEffect(() => {
		state.expedienteEstudiantil?.currentStudent?.idEstudiante && localStorage.setItem('state.expedienteEstudiantil.currentStudent.idEstudiante', state.expedienteEstudiantil.currentStudent.idEstudiante);

	}, [state.expedienteEstudiantil.currentStudent.idEstudiante])

	console.log('state storeIs', storeIs)
	console.log('state state', state)
	if (state.currentInstitucion?.id == -1) {
		return (
			<AppLayout items={directorItems}>
				<div className="dashboard-wrapper">
					<section>
						<Container>
							<Row>
								<Col xs={12}>
									<h3>
										{t(
											'estudiantes>traslados>gestion_traslados>seleccionar',
											'Debe seleccionar un centro educativo en el buscador de centro educativo.'
										)}
									</h3>
								</Col>
							</Row>
						</Container>
					</section>
				</div>
			</AppLayout>
		)
	}

	return (
		<AppLayout items={directorItems}>
			<Helmet>
				<title>Expediente de institución</title>
			</Helmet>
			<div className="dashboard-wrapper">
				<Container>
					<Row>
						<InformationCard
							data={state.expedienteEstudiantil.currentStudent}
						/>
						{props.active !== 0 && (
							<Col xs={12}>
								<Breadcrumb
									header={t(
										'expediente_mostrar_sce>titulo',
										'Expediente Estudiantil'
									)}
									data={studentBreadcrumb}
								/>
								<br />
							</Col>
						)}
						<Col xs={12}>
							{
								{
									0: <Buscador {...props} />,
									1: <Navegacion {...props} />,
									2: <General {...props} />,
									3: <Contacto {...props} />,
									4: <Hogar {...props} />,
									5: <Beneficios {...props} />,
									6: <Apoyo {...props} />,
									7: <AreaCurricular {...props} />,
									8: <Salud {...props} />,
									9: (
										<Oferta
											{...props}
											historialMatricula={
												state.historialMatricula
											}
										/>
									),
									// 	10: <Sinirube {...props} />,
									//10: <CuentaCorreo {...props} />,
									10: (
										<CuentaUsuarios
											{...props}
											expedienteEstudiantil={
												state.expedienteEstudiantil
											}
										/>
									),
									11: <ContenedorExpSCE   {...props} />,
								}[props.active]
							}
						</Col>
					</Row>


					<div>
						<Row>
							<Col style={{ marginBottom: 16 }} sm={12}>
								<strong><h2>Servicio Comunal</h2></strong>
							</Col>
							<Col sm={4}>
								<strong>{t('informationcarddetalle>areaProyecto', 'Área de Proyecto')}:</strong>{' '}
								<span>{servicioData?.areaProyecto}</span>
							</Col>

							<Col sm={4}>
								<strong>
									{t('informationcarddetalle>nombreProyecto', 'Nombre del Proyecto')}:{' '}
								</strong>
								<span>{servicioData?.modalidadProyecto}</span>
							</Col>

							<Col sm={4}>
								<strong>{t('informationcarddetalle>modalidad', 'Modalidad')}:</strong>{' '}

								<span>{servicioData?.modalidadProyecto}</span>
							</Col>

							<Col sm={4}>
								<strong>
									{t('informationcarddetalle>fechaConclusion', 'Fecha de Conclusión')}:
								</strong>{' '}

								<span>{servicioData?.fechaConclusionSCE}</span>
							</Col>

							<Col sm={4}>
								<strong>
									{t(
										'informationcarddetalle>organizaciónContraParte',
										'Tipo de organización contraparte'
									)}:{' '}</strong>

									<span>{servicioData?.organizacionContraparte}</span>
								

							</Col>

							<Col sm={4}>
								<strong>
									{t(
										'informationcarddetalle>docenteAcompana',
										'Docente que acompaña el proyecto'
									)}:{' '}
								</strong>
									<span>{servicioData?.docenteAcompanante}</span>

							</Col>

							<Col sm={4}>
								<strong>
									{t(
										'informationcarddetalle>institucion',
										'Institución'
									)}:{' '}
								</strong>

									<span>{servicioData?.nombreInstitucion}</span>

							</Col>

						</Row>
					</div>
				</Container>
			</div>
		</AppLayout>
	)
}

export default ContenedorExpSCE
