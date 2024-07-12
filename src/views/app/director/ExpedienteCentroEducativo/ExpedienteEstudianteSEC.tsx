import React from 'react'
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

const Inicio = React.lazy(() => import('./Inicio'))
const General = React.lazy(() => import('./General'))
const Estadistica = React.lazy(() => import('./Estadistica'))
const Ofertas = React.lazy(() => import('./Ofertas'))
const RecursoHumano = React.lazy(() => import('./RecursoHumano'))
const Infraestructura = React.lazy(() => import('./Infraestructura'))
const OrganizacionAuxiliar = React.lazy(() => import('./OrganizacionAuxiliar'))
const InformationCard = React.lazy(() => import('./_partials/InformationCard'))
const NormativaInterna = React.lazy(() => import('./NormativaInterna'))

const ContenedorPrincipal = (props) => {
	const { t } = useTranslation()
	centroBreadcrumb.map((item, idx) => {
		item.active = props.active === idx
		return item
	})
	const state = useSelector((store) => {
		return {
			currentInstitucion: store.authUser.currentInstitution
		}
	})
	/* centroBreadcrumb.map((item, idx) => {
		let _label =
			item.label === 'auxOrganization'
				? state.currentInstitucion?.esPrivado
					? 'auxinformacion'
					: item.label
				: item.label

		item.active = props.active === idx
		item.label = _label
		return item
	}) */

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
						<InformationCard data={{}} />
						{props.active !== 0 && (
							<Col xs={12}>
								<Breadcrumb
									header={t(
										'expediente_ce>titulo',
										'Expediente Centro educativo'
									)}
									data={centroBreadcrumb}
								/>
								<br />
							</Col>
						)}
						<Col xs={12}>
							{
								{
									0: <Inicio {...props} />,
									1: <General {...props} />,
									2: <Ofertas {...props} />,
									3: <RecursoHumano {...props} />,
									4: <Horarios {...props} />,
									5: <Infraestructura {...props} />,
									6: <OrganizacionAuxiliar {...props} />,
									7: <Estadistica {...props} />,
									8: <Grupos {...props} />,
									9: <NormativaInterna {...props} />
								}[props.active]
							}
						</Col>
					</Row>
				</Container>
			</div>
		</AppLayout>
	)
}

export default ContenedorPrincipal
