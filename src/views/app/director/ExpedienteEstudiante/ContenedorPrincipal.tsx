import React, { useEffect } from 'react'
import studentBreadcrumb from 'Constants/studentBreadcrumb'
import { useSelector } from 'react-redux'
import { getIdentification } from 'Redux/identificacion/actions'
import { getStudentDataFilter, loadStudent } from 'Redux/expedienteEstudiantil/actions'
import { Col, Row, Container } from 'reactstrap'
import Breadcrumb from 'Containers/navs/CustomBreadcrumb'
import InformationCard from './_partials/InformationCard'
import Loader from '../../../../components/Loader'
import { useActions } from '../../../../hooks/useActions'
import AppLayout from 'Layout/AppLayout'
import directorItems from 'Constants/directorMenu'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ContenedorExpSCE from './ContenedorExpSCE'

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
	studentBreadcrumb.map((item, idx) => {
		item.active = props.active === idx
		return item
	})

	const actions = useActions({
		getIdentification,
		getStudentDataFilter,
		loadStudent
	})

	const state = useSelector(store => {
		return {
			expedienteEstudiantil: store.expedienteEstudiantil,
			identification: store.identification,
			historialMatricula: store.identification.matriculaHistory
		}
	})

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
		}

		if (state.expedienteEstudiantil.currentStudent?.idEstudiante) {
			fetch()
		}
	}, [state.expedienteEstudiantil.currentStudent])

	return (
		<AppLayout items={directorItems}>
			<div className='dashboard-wrapper'>
				<Container>
					{active !== 0 && <InformationCard data={state.expedienteEstudiantil.currentStudent} />}
					<Row>
						{active !== 0 && (
							<Col xs={12}>
								<Breadcrumb
									header={t('expediente_estudiantil>titulo', 'Expediente Estudiantil')}
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
											1: <Navegacion {...props} />,
											2: <General {...props} />,
											3: <Contacto {...props} />,
											4: <Hogar {...props} />,
											5: <Beneficios {...props} />,
											6: <Apoyo {...props} />,
											7: <AreaCurricular {...props} />,
											8: <Salud {...props} />,
											9: <Oferta {...props} historialMatricula={state.historialMatricula} />,
											// 	10: <Sinirube {...props} />,
											//10: <CuentaCorreo {...props} />,
											10: (
												<CuentaUsuarios
													{...props}
													expedienteEstudiantil={state.expedienteEstudiantil}
												/>
											),
											11: <ServicioComunalEstudiantil {...props} />
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
