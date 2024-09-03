import React, { useEffect } from 'react'
import { Col, Row } from 'reactstrap'
import AppLayout from 'Layout/AppLayout'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useActions } from '../../../../hooks/useActions'
import { GetServicioComunalInfoByStudentId } from 'Redux/formularioCentroResponse/actions'
import BarLoader from 'Components/barLoader/barLoader'
import { Paper } from '@material-ui/core'

const ServicioComunalEstudiantil = props => {
	const { t } = useTranslation()
	const [servicioData, setServicioData] = React.useState(null)
	const [loading, setLoading] = React.useState(true)
	const actions = useActions({
		GetServicioComunalInfoByStudentId
	})

	const state = useSelector(store => {
		return {
			expedienteEstudiantil: store.expedienteEstudiantil,
			identification: store.identification,
			historialMatricula: store.identification.matriculaHistory,
			accessRole: store.authUser.currentRoleOrganizacion.accessRole,
			permisos: store.authUser.rolPermisos
		}
	})

	const tienePermiso = state.permisos.find(permiso => permiso.codigoSeccion == 'expedienteEstudianteSCE')

	useEffect(() => {
		let id = state.expedienteEstudiantil?.currentStudent?.idEstudiante
			? state.expedienteEstudiantil?.currentStudent?.idEstudiante
			: localStorage.getItem('state.expedienteEstudiantil.currentStudent.idEstudiante')
		actions
			.GetServicioComunalInfoByStudentId(id)
			.then(res => {
				setServicioData(res)
			})
			.finally(() => setLoading(false))
	}, [state.expedienteEstudiantil.currentStudent.idEstudiante])

	useEffect(() => {
		state.expedienteEstudiantil?.currentStudent?.idEstudiante &&
			localStorage.setItem(
				'state.expedienteEstudiantil.currentStudent.idEstudiante',
				state.expedienteEstudiantil.currentStudent.idEstudiante
			)
	}, [state.expedienteEstudiantil.currentStudent.idEstudiante])

	if (!tienePermiso || tienePermiso?.leer == 0) {
		return <h4>{t('No tienes permisos para acceder a esta sección')}</h4>
	}

	return (
		<div>
			{loading && <BarLoader />}
			<Paper className='p-5 mb-5'>
				<Row>
					<Col style={{ marginBottom: 16 }} sm={12}>
						<strong>
							<h3>Servicio comunal estudiantil</h3>
						</strong>
						<hr />
					</Col>
					<Col sm={4} className='mb-3'>
						<strong>{t('informationcarddetalle>areaProyecto', 'Área de proyecto')}:</strong>
						<br />
						<span>{servicioData?.areaProyecto}</span>
					</Col>
					<Col sm={4} className='mb-3'>
						<strong>{t('informationcarddetalle>nombreProyecto', 'Nombre del proyecto')}: </strong>
						<br />
						<span>{servicioData?.nombreProyecto}</span>
					</Col>
					<Col sm={4} className='mb-3'>
						<strong>{t('informationcarddetalle>modalidad', 'Tipo de proyecto')}:</strong>
						<br />
						<span>{servicioData?.modalidadProyecto}</span>
					</Col>
					<Col sm={4} className='mb-3'>
						<strong>
							{t('informationcarddetalle>organizaciónContraParte', 'Tipo de organización contraparte')}:
						</strong>
						<br />
						<span>{servicioData?.organizacionContraparte}</span>
					</Col>
					<Col sm={4} className='mb-3'>
						<strong>{t('informationcarddetalle>docenteAcompana', 'Acompañante de proyecto')}:</strong>
						<br />
						<span>{servicioData?.docenteAcompanante}</span>
					</Col>
					<Col sm={4} className='mb-3'>
						<strong>{t('informationcarddetalle>institucion', 'Institución')}: </strong>
						<br />
						<span>{servicioData?.nombreInstitucion}</span>
					</Col>
					<Col sm={4} className='mb-3'>
						<strong>{t('informationcarddetalle>instituci', 'Quién registra')}: </strong>
						<br />
						<span>{servicioData?.insertadoPor}</span>
					</Col>
					<Col sm={4} className='mb-3'>
						<strong>{t('informationcarddetalle>instituci', 'Fecha de registro')}: </strong>
						<br />
						<span>{servicioData?.fechaInsercion}</span>
					</Col>
					<Col sm={4} className='mb-3'>
						<strong>{t('informationcarddetalle>fechaConclusion', 'Fecha de conclusión')}:</strong>
						<br />
						<span>{servicioData?.fechaConclusionSCE}</span>
					</Col>
				</Row>
				<Row>
					<Col sm={4} className='mb-3'>
						<strong>
							{/* TODO: i18 */}
							{/* {t(
								'informationcarddetalle>institucion',
								'Institución'
							)} */}
							Descripción:
						</strong>
						<br />
						<span>{servicioData?.descripcion}</span>
					</Col>
				</Row>
			</Paper>
		</div>
	)
}

export default ServicioComunalEstudiantil
