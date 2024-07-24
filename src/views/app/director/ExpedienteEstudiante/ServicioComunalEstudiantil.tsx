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
			historialMatricula: store.identification.matriculaHistory
		}
	})
	useEffect(() => {
		let id = state.expedienteEstudiantil?.currentStudent?.idEstudiante
			? state.expedienteEstudiantil?.currentStudent?.idEstudiante
			: localStorage.getItem('state.expedienteEstudiantil.currentStudent.idEstudiante')
		actions
			.GetServicioComunalInfoByStudentId(id)
			.then(res => {
				console.log('res', res)
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

	return (
		<div>
			{loading && <BarLoader />}
			<Paper className='p-5'>
				<Row>
					<Col style={{ marginBottom: 16 }} sm={12}>
						<strong>
							<h3>Servicio comunal estudiantil</h3>
						</strong>
						<hr />
					</Col>
					<Col sm={4} className='mb-3'>
						<strong>{t('informationcarddetalle>areaProyecto', 'Área de Proyecto')}:</strong>
						<br />
						<span>{servicioData?.areaProyecto}</span>
					</Col>
					<Col sm={4} className='mb-3'>
						<strong>{t('informationcarddetalle>nombreProyecto', 'Nombre del Proyecto')}: </strong>
						<br />
						<span>{servicioData?.modalidadProyecto}</span>
					</Col>
					<Col sm={4} className='mb-3'>
						<strong>{t('informationcarddetalle>modalidad', 'Tipo de Proyecto')}:</strong>
						<br />
						<span>{servicioData?.modalidadProyecto}</span>
					</Col>
					<Col sm={4} className='mb-3'>
						<strong>{t('informationcarddetalle>fechaConclusion', 'Fecha de Conclusión')}:</strong>
						<br />
						<span>{servicioData?.fechaConclusionSCE}</span>
					</Col>
					<Col sm={4} className='mb-3'>
						<strong>
							{t('informationcarddetalle>organizaciónContraParte', 'Tipo de organización contraparte')}:
						</strong>
						<br />
						<span>{servicioData?.organizacionContraparte}</span>
					</Col>
					<Col sm={4} className='mb-3'>
						<strong>{t('informationcarddetalle>docenteAcompana', 'Acompañante de Proyecto')}:</strong>
						<br />
						<span>{servicioData?.docenteAcompanante}</span>
					</Col>
					<Col sm={4} className='mb-3'>
						<strong>{t('informationcarddetalle>institucion', 'Institución')}: </strong>
						<br />
						<span>{servicioData?.nombreInstitucion}</span>
					</Col>
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
					<Col sm={4} className='mb-3'>
						<strong>
							{/* TODO: i18 */}
							{/* {t(
										'informationcarddetalle>institucion',
										'Institución'
									)} */}
							Características:
						</strong>
						<br />
						<span>{servicioData?.caracteristicas}</span>
					</Col>
				</Row>
			</Paper>
		</div>
	)
}

export default ServicioComunalEstudiantil
