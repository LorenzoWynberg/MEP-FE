import React from 'react'
import ReportCard from '../_partials/ReportCard'
import ReportCardContainer from '../_partials/ReportCardContainer'
import ReporteMatriculaPorCircuito from './ReporteMatriculaPorCircuito'
import GetHistoricoEstDivisionAdmin from './GetHistoricoEstDivisionAdmin'
import { useTranslation } from 'react-i18next'
import ReporteUltimoNivelSinSCE from './ReporteUltimoNivelSinSCE'

const ReporteCircuital = props => {
	const { t } = useTranslation()
	const reportes =
		props.props.tipo == 'sce'
			? [
					{
						titulo: t(
							'reportes>circuital>reporte_de_sce_historico_division',
							'Reporte de SCE histórico división'
						),
						descripcion: t(
							'reportes>circuital>resumen_de_sce_historico_division',
							'Resumen de proyectos de Servicio Comunal Estudiantil según división administrativa MEP (DRE-circuitos)'
						),
						id: 2
					},

					{
						titulo: t(
							'reportes>circuital>reporte_de_sce_historico_divisionnoSCE',
							'Reporte de estudiantes sin SCE'
						),
						descripcion: t(
							'reportes>circuital>resumen_de_sce_historico_divisionnoSCE',
							'Resumen de cantidad de estudiantes de último nivel que no han concluido el Servicio Comunal Estudiantil'
						),
						id: 3
					}
			  ]
			: [
					{
						titulo: t(
							'reportes>circuital>reporte_de_matricula_por_circuito',
							'Reporte de matrícula por circuito'
						),
						descripcion: t(
							'reportes>circuital>resumen_de_estudiantes_matriculados_por_centro_educativo',
							'Resumen de estudiantes matriculados por centro educativo'
						),
						id: 1
					}
			  ]
	const [state, setState] = React.useState(0)
	const Cards = () => {
		return reportes.map((reporte, index) => (
			<ReportCard
				onClick={() => setState(reporte.id)}
				titulo={reporte.titulo}
				descripcion={reporte.descripcion}
			/>
		))
	}

	return (
		<>
			{state == 0 && <ReportCardContainer>{Cards()}</ReportCardContainer>}
			{state == 1 && <ReporteMatriculaPorCircuito regresarEvent={() => setState(0)} />}

			{state == 2 && <GetHistoricoEstDivisionAdmin regresarEvent={() => setState(0)} />}

			{state == 3 && <ReporteUltimoNivelSinSCE regresarEvent={() => setState(0)} />}
		</>
	)
}

export default ReporteCircuital
