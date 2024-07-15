import React, { useEffect, useMemo, useState } from 'react'
import centroBreadcrumb from 'Constants/centroBreadcrumb'
import { Col, Row, Container } from 'reactstrap'
import Breadcrumb from 'Containers/navs/CustomBreadcrumb'
import AppLayout from 'Layout/AppLayout'
import directorItems from 'Constants/directorMenu'
import Grupos from './_partials/GruposProyeccion/Grupos'
import { Helmet } from 'react-helmet'
import Horarios from './Horarios'
import { useSelector } from 'react-redux'
import colors from 'Assets/js/colors'
import { useTranslation } from 'react-i18next'
import TableStudents from '../MatricularEstudiantes/registro/new/tableStudents'
import { Button } from '@material-ui/core'
import { useActions } from 'Hooks/useActions'
import InformationCardDetalle from './_partials/InformationCardDetalle'
import {
	GetServicioComunalInfoById
} from '../../../../redux/formularioCentroResponse/actions'
import styled from 'styled-components'
const Inicio = React.lazy(() => import('./Inicio'))
const General = React.lazy(() => import('./General'))
const Estadistica = React.lazy(() => import('./Estadistica'))
const Ofertas = React.lazy(() => import('./Ofertas'))
const RecursoHumano = React.lazy(() => import('./RecursoHumano'))
const Infraestructura = React.lazy(() => import('./Infraestructura'))
const OrganizacionAuxiliar = React.lazy(() => import('./OrganizacionAuxiliar'))
const InformationCardExpediente = React.lazy(() => import('./_partials/InformationCardExpediente'))
const NormativaInterna = React.lazy(() => import('./NormativaInterna'))

const ExpedienteEstudianteSEC = (props) => {
	const { t } = useTranslation()
	const [sce, setSCE] = useState();
	const [showProyecto, setShowProyecto] = useState(false);

	centroBreadcrumb.map((item, idx) => {
		item.active = props.active === idx
		return item
	})

	const actions = useActions({ GetServicioComunalInfoById })
	useEffect(() => {

		actions.GetServicioComunalInfoById(
			parseInt(props.servicioComunalId)

		).then((res) => {
			setSCE(res[0]);
			setShowProyecto(true)
		})
	}, [props.servicioComunalId])

	const columns = [
		{
			Header: t(
				'estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>colum_id',
				'Identificación'
			),
			accessor: 'identificacion',
			label: '',
			column: ''
		},
		{
			Header: t(
				'estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>colum_nombre',
				'Nombre completo'
			),
			accessor: 'nombreEstudiante',
			label: '',
			column: ''
		},
		{
			Header: t(
				'estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>colum_nacionalidad',
				'Nacionalidad'
			),
			accessor: 'nacionalidadShow',
			label: '',
			column: ''
		},
		{
			Header: t(
				'servicio_comunal>registro_servicio_comunal>genero',
				'genero'
			),
			accessor: 'generoShow',
			label: '',
			column: ''
		},
		{
			Header: t(
				'estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>colum_fecha_nacimi',
				'Fecha de nacimiento'
			),
			accessor: 'fechaNacimiento',
			label: '',
			column: ''
		},
		{
			Header: t(
				'servicio_comunal>registro_servicio_comunal>edad',
				'Edad'
			),
			accessor: 'edad',
			label: '',
			column: ''
		},

		{
			Header: t(
				'servicio_comunal>registro_servicio_comunal>discapacidad',
				'Discapacidad'
			),
			accessor: 'tieneDiscapacidad',
			label: '',
			column: '',
		}
	]

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
				<title>Registro</title>
			</Helmet>
			<div className="dashboard-wrapper">
				<Container>
					{showProyecto &&
						<>
						<Row>
							<strong>Detalle del Servicio Comunal Estudiantil:</strong>
						</Row>
							<Row >
								<Col sm={4}>

									<strong>{t('informationcarddetalle>areaProyecto', 'Área de Proyecto')}:</strong> {sce.nombreAreaProyecto}
								</Col>
								<Col sm={4}>
									<strong>{t('informationcarddetalle>caracteristicas', 'Caracteristicas')}:</strong> {sce.caracteristicas}

								</Col>
								<Col sm={4}>
									<strong>{t('informationcarddetalle>docenteAcompana', 'Docente que acompaña el proyecto')}:</strong> {sce.nombreDocente}
								</Col>


							</Row >


							<Row >
								<Col sm={4}>

									<strong>{t('informationcarddetalle>nombreProyecto', 'Nombre del Proyecto')}:</strong> {sce.nombreProyecto}
								</Col>
								<Col sm={4}>
									<strong>{t('informationcarddetalle>quienRegistra', 'Quién registra y fecha de registros(bitácora)')}:</strong> {sce.usuarioFechaRegistro}
								</Col>
								<Col sm={4}>
									<strong>{t('informationcarddetalle>fechaConclusion', 'Fecha de Conclusión')}:</strong> {sce.fechaConclusion}


								</Col>

							</Row >	<Row >
								<Col sm={4}>
									<strong>{t('informationcarddetalle>modalidad', 'Modalidad')}:</strong> {sce.nombreModalidad}

								</Col>
								<Col sm={4}>
									<strong>{t('informationcarddetalle>organizaciónContraParte', 'Tipo de organización contraparte')}:</strong> {sce.nombreOrganizacionContraparte}

								</Col>
							</Row ></>

					}
					<Row>
						<Col sm={12}>
							<TableStudents
								onlyViewModule={true}
								avoidSearch={true}
								data={[
									{
										"identificacion": "123210049",
										"nombreEstudiante": "NATASHA CASTILLO  ROJAS",
										"nacionalidad": "COSTARRICENSE",
										"nacionalidadShow": "COSTARRICENSE",
										"genero": "MUJER",
										"generoShow": "MUJER",
										"fechaNacimiento": new Date("10/01/2019").toISOString(),
										"edad": "5 años y 6 meses",
										"tieneDiscapacidad": "NO"
									},
									{
										"identificacion": "123130198",
										"nombreEstudiante": "AINARA LOPEZ  ROJAS",
										"nacionalidad": "COSTARRICENSE",
										"nacionalidadShow": "COSTARRICENSE",
										"genero": "MUJER",
										"generoShow": "MUJER",
										"fechaNacimiento": new Date("11/09/2018").toISOString(),
										"edad": "5 años y 10 meses",
										"tieneDiscapacidad": "NO"
									},
									{
										"identificacion": "123050055",
										"nombreEstudiante": "RIHANNA JOYSIE MORALES  MORALES",
										"nacionalidad": "COSTARRICENSE",
										"nacionalidadShow": "COSTARRICENSE",
										"genero": "MUJER",
										"generoShow": "MUJER",
										"fechaNacimiento": new Date("11/05/2018").toISOString(),
										"edad": "6 años y 2 meses",
										"tieneDiscapacidad": "NO"
									}
								]}
								columns={columns}
								// data={[
								// 	{
								// 		"idEstudiante": 1495875,
								// 		"nombreEstudiante": "CASTILLO  NAVARRO AARON",
								// 		"identificacion": "113420854",
								// 		"fotografiaUrl": "",
								// 		"conocidoComo": "",
								// 		"nacionalidad": null,
								// 		"idInstitucion": null,
								// 		"idMatricula": null,
								// 		"institucion": "",
								// 		"codigoinstitucion": "",
								// 		"modalidad": null,
								// 		"grupo": "",
								// 		"fallecido": false,
								// 		"tipoInstitucion": null,
								// 		"regional": "/",
								// 		"fechaNacimiento": "1988-02-05T00:00:00",
								// 		"nivel": null,
								// 		"tipoIdentificacion": "CÉDULA"
								// 	}
								// ]}
								hasEditAccess={true}
								// handleGetData={() => { showBuscador ? setShowBuscador(false) : setShowBuscador(true) }}
								// setEstudiantes={setEstudiantes} estudiantes={estudiantes}
								closeContextualMenu={false}
							></TableStudents>
						</Col>
					</Row>
				</Container>
			</div>
		</AppLayout >
	)
}
const DivContainer = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr 1fr 1fr;
//   background: ${props => props.theme.primary};
  border-radius: 50px;
  width: 100%;
  padding: 5px 10px;
  color: ${props => props.theme.primaryText};
  align-items: center;
`
const Columna = styled.div`
  display: flex;
  flex-direction: column;
`

export default ExpedienteEstudianteSEC

