import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import BackIcon from '@material-ui/icons/ArrowBackIos'
import HeaderTab from 'Components/Tab/Header'
import { Col } from 'reactstrap'
import StudentsSummary from './_partials/SubjectDetails/StudentsSummary'
import Asistencia from './_partials/SubjectDetails/Asistencia/Asistencia'
import Score from './_partials/SubjectDetails/Score/Index'
import StudentsConduct from './_partials/SubjectDetails/StudentsConduct'
import {
	getIncidenciasByAsignaturaGrupo,
	getIncidenciasByGroup,
	getTiposIncidencias,
	getAllStudentsByGroup,
	getBloquesByOffer,
	getStudentsByAsignaturaGrupoId
} from 'Redux/grupos/actions'
import { useActions } from 'Hooks/useActions'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { verificarAcceso } from 'Hoc/verificarAcceso'

const SubjectDetail = ({
	subject,
	setSubjectSelected,
	subjects,
	currentOffer,
	activeLvl,
	verificarAcceso
}) => {
	const { t } = useTranslation()
	const [activeTab, setActiveTab] = useState(0)

	const actions = useActions({
		getIncidenciasByGroup,
		getTiposIncidencias,
		getIncidenciasByAsignaturaGrupo,
		getAllStudentsByGroup,
		getBloquesByOffer,
		getStudentsByAsignaturaGrupoId
	})

	const {
		currentInstitution,
		GroupMembers,
		tiposIncidencia,
		groupIncidencias,
		membersBySubjectGroup,
		activeYears
	} = useSelector(state => ({ ...state.authUser, ...state.grupos }))
	useEffect(() => {
		const fetch = async () => {
			await actions.getBloquesByOffer(
				activeLvl.nivelModeloId,
				currentInstitution.id,
				activeYears ? activeYears[0].id : null
			)
			await actions.getIncidenciasByGroup(subject.sb_gruposId)
			await actions.getTiposIncidencias()
			await actions.getStudentsByAsignaturaGrupoId(subject?.id)
		}

		fetch()
	}, [subject])

	return (
		<Col>
			<Back style={{ cursor: 'pointer' }} onClick={() => setSubjectSelected(null)}>
				<BackIcon />
				<BackTitle>{t('edit_button>regresar', 'Regresar')}</BackTitle>
			</Back>
			<h2 className='my-4'>
				{t(
					'configuracion>mallas_curriculares>asignatura/figura_afin>asignatura/figura_afin',
					'Asignatura/figura afín'
				)}{' '}
				{'>'} {subject?.datosGrupo?.nombre}{' '}
				{subject?.datosMallaCurricularAsignaturaInstitucion?.nombreAsignatura}{' '}
			</h2>
			<HeaderTab
				options={[
					t(
						'estudiantes>traslados>gestion_traslados>solicitar_hacia_mi_centro>estudiantes',
						'Estudiantes'
					),
					verificarAcceso('gestiongruposasistencia', 'leer')
						? t('gestion_grupos>tab>asistencia', 'Asistencia')
						: null,
					verificarAcceso('gestiongruposcalificaciones', 'leer')
						? t('gestion_grupos>tab>calificaciones', 'Calificaciones')
						: null,
					verificarAcceso('gestiongruposconducta', 'leer')
						? t('gestion_grupos>tab>conducta', 'Conducta')
						: null
				]}
				activeTab={activeTab}
				setActiveTab={setActiveTab}
			/>
			{activeTab === 0 && (
				<StudentsSummary
					enrolledStudents={membersBySubjectGroup}
					subjects={subjects}
					subject={subject}
					currentOffer={currentOffer}
				/>
			)}
			{activeTab === 1 && (
				<Asistencia
					students={membersBySubjectGroup}
					subject={subject}
					currentOffer={currentOffer}
				/>
			)}
			{activeTab === 2 && <Score students={membersBySubjectGroup} subject={subject} />}
			{activeTab === 3 && (
				<StudentsConduct
					students={membersBySubjectGroup}
					tiposIncidencia={tiposIncidencia}
					groupIncidencias={groupIncidencias}
					activeLvl={activeLvl}
					currentInstitution={currentInstitution}
					director
					getIncidentsFunction={() => actions.getIncidenciasByGroup(subject.sb_gruposId)}
				/>
			)}
		</Col>
	)
}

const Back = styled.div`
	display: flex;
	align-items: center;
	cursor: pointer;
	padding: 0 5px;
	margin-bottom: 20px;
`

const BackTitle = styled.span`
	color: #000;
	font-size: 14px;
	font-size: 16px;
`

export default verificarAcceso(SubjectDetail)
