import React, { useEffect, useState } from 'react'
import { Col, Row, Container } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import TableStudents from './tableStudentsSCE'
import { useActions } from 'Hooks/useActions'
import Loader from 'components/LoaderContainer'
import { GetServicioComunalInfoById } from 'Redux/formularioCentroResponse/actions'
import styled from 'styled-components'

const ModalSCE = props => {
	const { t } = useTranslation()
	const [sce, setSCE] = useState({})
	const [caracteristicasString, setCaracteristicasString] = useState('')
	const [showProyecto, setShowProyecto] = useState(false)
	const [loading, setLoading] = useState(true)
	const actions = useActions({ GetServicioComunalInfoById })

	useEffect(() => {
		actions.GetServicioComunalInfoById(parseInt(props.servicioComunalId)).then(res => {
			if (res[0]?.caracteristicas) {
				setCaracteristicasString(() => {
					return res[0]?.caracteristicas
						.map(item => <span>{item.nombre}</span>)
						.reduce(
							(acc, x) =>
								acc === null ? (
									x
								) : (
									<>
										{acc}, {x}
									</>
								),
							null
						)
				})
			}
			setSCE(res[0])
			setLoading(false)
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

	return (
		<Container>
			{loading && <Loader />}
			{showProyecto && sce && (
				<div>
					<Row className='mt-2'>
						<Col sm={4} className='mb-3'>
							<strong>{t('informationcarddetalle>areaProyecto', 'Área de Proyecto')}:</strong>
							<br />
							<span>{sce.nombreAreaProyecto && sce.nombreAreaProyecto}</span>
						</Col>
						<Col sm={4} className='mb-3'>
							<strong>{t('informationcarddetalle>nombreProyecto', 'Nombre del proyecto')}:</strong>
							<br />
							<span>{sce.nombreProyecto && sce.nombreProyecto}</span>
						</Col>
						<Col sm={4} className='mb-3'>
							<strong>{t('informationcarddetalle>modalidad', 'Modalidad')}:</strong>
							<br />
							<span>{sce.nombreModalidad && sce.nombreModalidad}</span>
						</Col>
						<Col sm={4} className='mb-3'>
							<strong>{t('informationcarddetalle>caracteristicas', 'Caracteristicas')}:</strong>
							<br />
							{<span>{sce.caracteristicas && caracteristicasString}</span>}
						</Col>
						<Col sm={4} className='mb-3'>
							<strong>
								{t(
									'informationcarddetalle>organizaciónContraParte',
									'Tipo de organización contraparte'
								)}
								:
							</strong>
							<br />
							<span>{sce.nombreOrganizacionContraparte && sce.nombreOrganizacionContraparte}</span>
						</Col>
						<Col sm={4} className='mb-3'>
							<strong>
								{t('informationcarddetalle>docenteAcompana', 'Docente que acompaña el proyecto')}:
							</strong>
							<br />
							<span>{sce.nombreDocente && sce.nombreDocente}</span>
						</Col>
						<Col sm={4} className='mb-3'>
							<strong>{t('informationcarddetalle>fechaConclusion', 'Fecha de Conclusión')}:</strong>
							<br />
							<span>{sce.fechaConclusion && sce.fechaConclusion}</span>
						</Col>
						<Col sm={4} className='mb-3'>
							<strong>{t('informationcarddetalle>quienRegistra', 'Quién registra')}:</strong>
							<br />
							<span>{sce.usuarioFechaRegistro && sce.usuarioFechaRegistro}</span>
						</Col>
						<Col sm={4} className='mb-3'>
							<strong>
								{t('informationcarddetalle>fechaRegistro', ' fecha de registros(bitácora)')}:
							</strong>
							<br />
							<span>{sce.fechaInsercion && sce.fechaInsercion}</span>
						</Col>
						<Col sm={12} className='mb-1'>
							<strong>{t('informationcarddetalle>descripcion', 'Descripción')}:</strong>
							<br />
							<span>{sce.descripcion && sce.descripcion}</span>
						</Col>
					</Row>
				</div>
			)}
			{!loading && (
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
			)}
		</Container>
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

export default ModalSCE
