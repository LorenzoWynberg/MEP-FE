import React, { useEffect, useState } from 'react'
import AppLayout from 'Layout/AppLayout'
import directorItems from 'Constants/directorMenu'
import { Container, Row, Col } from 'reactstrap'
import Navigator from './_partials/Navigator'
import withRouter from 'react-router-dom/withRouter'
import Redirect from 'react-router-dom/Redirect'
import { NavLink, useHistory } from 'react-router-dom'
import TrasladosAEInternoCentro from './_partials/TrasladosAEInternoCentro'
import TrasladosInternosCentro from './_partials/TrasladosInternosCentro'
import TrasladosDesdeCentro from './_partials/TrasladosDesdeCentro'
import Solicitudes from './_partials/Solicitudes'
import { useSelector } from 'react-redux'
import { injectIntl } from 'react-intl'
import { useActions } from 'Hooks/useActions'
import { updatePeriodosLectivos } from '../../../../redux/auth/actions'
import { useTranslation } from 'react-i18next'
import { usePrevious } from 'Hooks'

const sections = [
	'inicio',
	'solicitarTrasladosHaciaCentro',
	'solicitarTrasladosDesdeCentro',
	'trasladosACentroEducativoNoIdentificado',
	'solicitudes',
	'trasladosInternos'
]

const renderOptions: JSX.Element = (section: string, props: object, onlyViewModule: boolean) => {
	// debugger
	switch (section) {
		case sections[0]:
			return <Navigator {...props} onlyViewModule={onlyViewModule} />
		case sections[1]:
			return <TrasladosAEInternoCentro {...props} tipoTraslado={2} />
		case sections[2]:
			return <TrasladosDesdeCentro {...props} />
		case sections[3]:
			return (
				<TrasladosInternosCentro
					{...props}
					tipoTraslado={0}
					type='trasladosACentroNoIdentificado'
				/>
			)
		case sections[4]:
			return <Solicitudes {...props} onlyViewModule={onlyViewModule} />
		case sections[5]:
			return <TrasladosInternosCentro {...props} tipoTraslado={0} />
		default:
			return <Redirect to='/error' />
	}
}

const Main = props => {
	const { t } = useTranslation()
	const [onlyViewModule, setOnlyViewModule] = useState<boolean>(true)
	const history = useHistory()
	const ACTIVE_YEAR = useSelector((store: any) => store.authUser.selectedActiveYear)
	const PREV_ACTIVE_YEAR: any = usePrevious(ACTIVE_YEAR)

	let sectionIdentifier: any = {
		inicio: { title: '', description: null },
		solicitarTrasladosHaciaCentro: {
			title: t(
				'estudiantes>traslados>gestion_traslados>solicitar_hacia_mi_centro',
				'Solicitar un traslado hacia mi centro educativo'
			),
			description: t(
				'estudiantes>traslados>gestion_traslados>solicitar_hacia_mi_centro>mensaje',
				'El estudiante se encuentra en otro centro educativo y requiero trasladarlo a mi centro educativo'
			),
			route: '/director/traslados/solicitarTrasladosHaciaCentro'
		},
		solicitarTrasladosDesdeCentro: {
			title: t(
				'estudiantes>traslados>gestion_traslados>solicitar_desde_mi_centro',
				'Solicitar un traslado desde mi centro educativo'
			),
			description: t(
				'estudiantes>traslados>gestion_traslados>solicitar_desde_mi_centro>mensaje',
				'El estudiante se encuentra en mi centro educativo y requiero trasladarlo a otro centro educativo'
			),
			route: '/director/traslados/solicitarTrasladosDesdeCentro'
		},
		solicitudes: {
			title: t(
				'estudiantes>traslados>gestion_traslados>solicitudes',
				'Solicitudes de traslado'
			),
			description: t(
				'estudiantes>traslados>gestion_traslados>solicitudes>mensaje',
				'Aquí puedes dar seguimiento a las solicitudes que se realicen o que se han recibido'
			),
			route: '/director/traslados/solicitudes'
		},
		trasladosInternos: {
			title: t(
				'estudiantes>traslados>gestion_traslados>traslados_internos',
				'Traslado interno'
			),
			description: t(
				'estudiantes>traslados>gestion_traslados>traslados_internos>mensaje',
				'Permite realizar los movimientos de traslado entre ofertas, especialidades o niveles del mismo centro educativo'
			),
			route: '/director/traslados/trasladosInternos'
		},
		trasladosACentroEducativoNoIdentificado: {
			title: t(
				'estudiantes>traslados>gestion_traslados>traslados_centro_no_identificado',
				'Traslado a centro educativo no identificado'
			),
			description: t(
				'estudiantes>traslados>gestion_traslados>traslados_centro_no_identificado>mensaje',
				'Permite realizar los movimientos de traslados a un centro educativo no acreditado o fuera del país'
			),
			route: '/director/traslados/trasladosACentroEducativoNoIdentificado'
		}
	}

	const actions = useActions({
		updatePeriodosLectivos
	})

	const state = useSelector(store => {
		return {
			periodosLectivos: store.authUser.periodosLectivos,
			currentInstitucion: store.authUser.currentInstitution
		}
	})

	useEffect(() => {
		loadPeriodosLectivos()
	}, [])

	useEffect(() => {
		setOnlyViewModule(!ACTIVE_YEAR.esActivo)

		if (PREV_ACTIVE_YEAR?.id) {
			if (PREV_ACTIVE_YEAR?.id !== ACTIVE_YEAR?.id) history.push('/director/traslados/inicio')
		}
	}, [ACTIVE_YEAR])

	const loadPeriodosLectivos = async () => {
		await actions.updatePeriodosLectivos(state.currentInstitucion?.id)
	}

	if (state.currentInstitucion?.id == -1) {
		return (
			<AppLayout items={directorItems}>
				<div className='dashboard-wrapper'>
					<section>
						<Container>
							<Row>
								<Col xs={12}>
									<h3>
										{t(
											'estudiantes>traslados>gestion_traslados>seleccionar',
											'Debe seleccionar un centro educativo en el buscador de centros educativos.'
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
			<div className='dashboard-wrapper'>
				<section>
					<Container>
						<Row>
							<Col xs={12}>
								<h3>
									{t(
										'estudiantes>traslados>gestion_traslados>gestion_traslados',
										'Gestión de traslados'
									)}
								</h3>
							</Col>
						</Row>
						<Row>
							<Col xs={12}>
								<div className='d-flex'>
									<NavLink
										to='/director/traslados/inicio'
										activeClassName='active_nav'
										exact
									>
										<p
											className={`${
												props.match.params.section !== sections[0] &&
												'last-border cursor-pointer'
											}`}
										>
											{t('estudiantes>expediente>nav>inicio', 'Inicio')}
										</p>
									</NavLink>
									<NavLink
										to={
											sectionIdentifier[props.match.params.section].route ||
											''
										}
										exact
										activeClassName='active_nav'
									>
										<p>{sectionIdentifier[props.match.params.section].title}</p>
									</NavLink>
								</div>
							</Col>
							<Col xs={12}>
								<h5>{sectionIdentifier[props.match.params.section].title}</h5>
								<p>{sectionIdentifier[props.match.params.section].description}</p>
							</Col>
						</Row>
						<Row>
							<Col xs={12}>
								{renderOptions(props.match.params.section, props, onlyViewModule)}
							</Col>
						</Row>
					</Container>
				</section>
			</div>
		</AppLayout>
	)
}

export default withRouter(injectIntl(Main))
