import React from 'react'
import { Row, Col, Card, CardBody, Container } from 'reactstrap'
import styled from 'styled-components'
import withRouter from 'react-router-dom/withRouter'
import colors from '../../../../../assets/js/colors'
import { injectIntl } from 'react-intl'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import AppLayout from 'Layout/AppLayout'
import Typography from '@material-ui/core/Typography'
import directorItems from 'Constants/directorMenu'
import { useTranslation } from 'react-i18next'

const Navigator = props => {
	const { onlyViewModule } = props
	const { t } = useTranslation()
	const state = useSelector((store: any) => {
		return {
			periodosLectivos: store.authUser.periodosLectivos,
			institution: store.authUser.currentInstitution
		}
	})

	if (state.institution?.id == -1) {
		return (
			<AppLayout items={directorItems}>
				<Helmet>
					<title>Registro Estudiante</title>
				</Helmet>
				<div className='dashboard-wrapper'>
					<Container>
						<Row>
							<Typography variant='h5' className='mb-3'>
								{t(
									'estudiantes>traslados>gestion_traslados>seleccionar',
									'Debe seleccionar un centro educativo en el buscador de centro educativo.'
								)}
							</Typography>
						</Row>
					</Container>
				</div>
			</AppLayout>
		)
	}

	let nav: any = [
		{
			section: t(
				'estudiantes>traslados>gestion_traslados>inicio>solicitar_hacia_mi_centro',
				'SOLICITAR UN TRASLADO HACIA MI CENTRO EDUCATIVO'
			),
			description: t(
				'estudiantes>traslados>gestion_traslados>solicitar_hacia_mi_centro>mensaje',
				'El estudiante se encuentra en otro centro educativo y requiero trasladarlo a mi centro educativo'
			),
			link: '/director/traslados/solicitarTrasladosHaciaCentro',
			icon: <i className={`far icon-3-fs fa-arrow-alt-circle-left`} />
		},
		{
			section: t(
				'estudiantes>traslados>gestion_traslados>inicio>solicitar_desde_mi_centro',
				'SOLICITAR UN TRASLADO DESDE MI CENTRO EDUCATIVO'
			),
			description: t(
				'estudiantes>traslados>gestion_traslados>solicitar_desde_mi_centro>mensaje',
				'El estudiante se encuentra en mi centro educativo y requiero trasladarlo a otro centro educativo'
			),
			link: '/director/traslados/solicitarTrasladosDesdeCentro',
			icon: <i className={`far icon-3-fs fa-arrow-alt-circle-right`} />
		},
		{
			section: t(
				'estudiantes>traslados>gestion_traslados>inicio>traslados_centro_no_identificado',
				'TRASLADOS A CENTRO EDUCATIVO NO IDENTIFICADO'
			),
			description: t(
				'estudiantes>traslados>gestion_traslados>traslados_centro_no_identificado>mensaje',
				'Permite realizar los movimientos de traslados a un centro educativo no acreditado o fuera del país'
			),
			link: '/director/traslados/trasladosACentroEducativoNoIdentificado',

			icon: <img src='/assets/img/centro-no-identificado.svg' alt='' />
		},
		{
			section: t(
				'estudiantes>traslados>gestion_traslados>inicio>traslados_internos',
				'TRASLADOS INTERNOS'
			),
			description: t(
				'estudiantes>traslados>gestion_traslados>traslados_internos>mensaje',
				'Permite realizar los movimientos de traslado entre ofertas, especialidades o niveles del mismo centro educativo'
			),
			link: '/director/traslados/trasladosInternos',
			icon: <i className='fas fa-desktop icon-3-fs' />
		},
		{
			section: t(
				'estudiantes>traslados>gestion_traslados>inicio>solicitudes',
				'SOLICITUDES DE TRASLADOS'
			),
			description: t(
				'estudiantes>traslados>gestion_traslados>solicitar_desde_mi_centro>mensaje',
				'El estudiante se encuentra en mi centro educativo y requiero trasladarlo a otro centro educativo'
			),
			link: '/director/traslados/solicitudes',
			icon: <i className='far fa-pause-circle icon-3-fs' />
		}
	]

	if (onlyViewModule) {
		nav = [nav[nav.length - 1]]
	}

	return (
		<>
			<Row>
				{nav.map((item, i) => {
					return (
						<Col key={i} xs={12} md={8}>
							<NavLink to={item.link}>
								<StyledCard>
									<StyledCardBody>
										<div className='iconsContainer'>{item.icon}</div>
										<div className='cardText'>
											<h5>{item.section}</h5>
											<p>{item.description}</p>
										</div>
									</StyledCardBody>
								</StyledCard>
							</NavLink>
						</Col>
					)
				})}
			</Row>
		</>
	)
}

const StyledCardBody = styled(CardBody)`
	width: 100%;
	padding: 0 !important;
	display: flex;
`

const StyledCard = styled(Card)`
	margin: 1rem;
	overflow: hidden;

	.cardText {
		padding-top: 0.5rem;
	}

	.iconsContainer {
		min-width: 80px;
		margin-right: 1rem;
		color: white;
		padding: 0.5rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: ${colors.primary};
	}
`

export default injectIntl(withRouter(Navigator))
