import React from 'react'
import Horarios from './Horarios'
import { Helmet } from 'react-helmet'
import AppLayout from 'Layout/AppLayout'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Col, Row, Container } from 'reactstrap'
import directorItems from 'Constants/directorMenu'
import Grupos from './_partials/GruposProyeccion/Grupos'
import Breadcrumb from 'Containers/navs/CustomBreadcrumb'
import centroBreadcrumb from 'Constants/centroBreadcrumb'

const Inicio = React.lazy(() => import('./Inicio'))
const General = React.lazy(() => import('./General'))
const Ofertas = React.lazy(() => import('./Ofertas'))
const Inventario = React.lazy(() => import('./Inventario'))
const Orientacion = React.lazy(() => import('./Orientacion'))
const Estadistica = React.lazy(() => import('./Estadistica'))
const RecursoHumano = React.lazy(() => import('./RecursoHumano'))
const Infraestructura = React.lazy(() => import('./Infraestructura'))
const NormativaInterna = React.lazy(() => import('./NormativaInterna'))
const OrganizacionAuxiliar = React.lazy(() => import('./OrganizacionAuxiliar'))
const InformationCard = React.lazy(() => import('./_partials/InformationCard'))
const ServicioComunalEstudiantil = React.lazy(
	() => import('./ServicioComunalEstudiantil')
)

const ContenedorPrincipal = props => {
	const { t } = useTranslation()

	centroBreadcrumb.map((item, idx) => {
		item.active = props.active === idx
		return item
	})

	const currentInstitucion = useSelector(
		store => store.authUser.currentInstitution
	)

	if (currentInstitucion?.id == -1) {
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
							<Col xs={12} className="mt-3">
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
									9: <NormativaInterna {...props} />,
									10: <ServicioComunalEstudiantil {...props} />,
									11: <Inventario {...props} />,
									12: <Orientacion {...props} />
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
