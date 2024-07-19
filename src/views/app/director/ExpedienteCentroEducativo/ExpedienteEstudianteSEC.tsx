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
import TableStudents from '../MatricularEstudiantes/registro/new/tableStudentsSCE'
import { Button } from '@material-ui/core'
import { useActions } from 'Hooks/useActions'
import InformationCardDetalle from './_partials/InformationCardDetalle'
import { GetServicioComunalInfoById } from '../../../../redux/formularioCentroResponse/actions'
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

const ExpedienteEstudianteSEC = props => {
	const { t } = useTranslation()
	const [sce, setSCE] = useState()
	const [showProyecto, setShowProyecto] = useState(false)

	centroBreadcrumb.map((item, idx) => {
		item.active = props.active === idx
		return item
	})

	const actions = useActions({ GetServicioComunalInfoById })
	useEffect(() => {
		actions.GetServicioComunalInfoById(parseInt(props.servicioComunalId)).then(res => {
			setSCE(res[0])
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
			accessor: 'nacionalidad',
			label: '',
			column: ''
		},
		{
			Header: t('servicio_comunal>registro_servicio_comunal>genero', 'genero'),
			accessor: 'genero',
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
			Header: t('servicio_comunal>registro_servicio_comunal>edad', 'Edad'),
			accessor: 'edad',
			label: '',
			column: ''
		},

		{
			Header: t('servicio_comunal>registro_servicio_comunal>discapacidad', 'Discapacidad'),
			accessor: 'discapacidad',
			label: '',
			column: ''
		}
	]

	const state = useSelector(store => {
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
				<div className='dashboard-wrapper'>
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
			<div className='dashboard-wrapper'>
				<Container>
					{showProyecto && (
						<div>
							<Row>
								<Col style={{ marginBottom: 16 }} sm={12}>
									<strong>Detalle del Servicio Comunal Estudiantil:</strong>
								</Col>
							</Row>
							<Row>
								<Col sm={4}>
									<strong>{t('informationcarddetalle>areaProyecto', 'Área de Proyecto')}:</strong>{' '}
									<span>{sce.nombreAreaProyecto}</span>
								</Col>
								<Col sm={4}>
									<strong>{t('informationcarddetalle>caracteristicas', 'Caracteristicas')}:</strong>{' '}
									<span>{sce.caracteristicas}</span>
								</Col>
								<Col sm={4}>
									<strong>
										{t(
											'informationcarddetalle>docenteAcompana',
											'Docente que acompaña el proyecto'
										)}
										:
									</strong>{' '}
									<span>{sce.nombreDocente}</span>
								</Col>
							</Row>
							<Row>
								<Col sm={4}>
									<strong>
										{t('informationcarddetalle>nombreProyecto', 'Nombre del Proyecto')}:
									</strong>
									<span>{sce.nombreProyecto}</span>
								</Col>
								<Col sm={4}>
									<strong>
										{t(
											'informationcarddetalle>quienRegistra',
											'Quién registra y fecha de registros(bitácora)'
										)}
										:
									</strong>{' '}
									<span>{sce.usuarioFechaRegistro}</span>
								</Col>
								<Col sm={4}>
									<strong>
										{t('informationcarddetalle>fechaConclusion', 'Fecha de Conclusión')}:
									</strong>{' '}
									<span>{sce.fechaConclusion}</span>
								</Col>
							</Row>{' '}
							<Row>
								<Col sm={4}>
									<strong>{t('informationcarddetalle>modalidad', 'Modalidad')}:</strong>{' '}
									<span>{sce.nombreModalidad}</span>
								</Col>
								<Col sm={4}>
									<strong>
										{t(
											'informationcarddetalle>organizaciónContraParte',
											'Tipo de organización contraparte'
										)}
										:
									</strong>{' '}
									<span>{sce.nombreOrganizacionContraparte}</span>
								</Col>
							</Row>
						</div>
					)}
					<TableStudents
						noMargin={true}
						onlyViewModule={true}
						avoidSearch={true}
						columns={columns}
						data={sce?.listaEstudiantes ? sce.listaEstudiantes : []}
						hasEditAccess={true}
						// handleGetData={() => { showBuscador ? setShowBuscador(false) : setShowBuscador(true) }}
						// setEstudiantes={setEstudiantes} estudiantes={estudiantes}
						closeContextualMenu={false}
					></TableStudents>
				</Container>
			</div>
		</AppLayout>
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
