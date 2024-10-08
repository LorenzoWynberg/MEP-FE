import React from 'react'
import ReportCard from '../_partials/ReportCard'
import ReportCardContainer from '../_partials/ReportCardContainer'
import { useTranslation } from 'react-i18next'
import GetHistoricoEstDivisionGeog from './GetHistoricoEstDivisionGeog'

const ReporteGeografico = props => {
	const { t } = useTranslation()

	const reportes = [
		/* {
      titulo: 'LISTADO DE PERSONAS ESTUDIANTES POR INSTITUCIÓN, NIVEL Y GRUPO',
      descripcion:
        'Este reporte se utiliza para visualizar la lista de todas las personas estudiantes de la institución',
    },
    {
      titulo: 'REPORTE DE MATRÍCULA ACTUAL',
      descripcion:
        'Este reporte se utiliza para visualizar la matrícula por oferta, modalidad, nivel y especialidad',
    }, */
		{
			titulo: 'Histórico SCE por División Geográfica',
			descripcion:
				'Resumen de proyectos de Servicio Comunal Estudiantil según división geografica (Provincia, cantón, distrito)'
		}
	]
	const [state, setState] = React.useState(0)
	const Cards = () => {
		return reportes.map((reporte, index) => (
			<ReportCard onClick={() => setState(index + 1)} titulo={reporte.titulo} descripcion={reporte.descripcion} />
		))
	}

	return (
		<>
			{state == 0 && <ReportCardContainer>{Cards()}</ReportCardContainer>}

			{state == 1 && <GetHistoricoEstDivisionGeog regresarEvent={() => setState(0)} />}
		</>
	)
}

export default ReporteGeografico
