import React from 'react'
import ReportCard from '../_partials/ReportCard'
import ReportCardContainer from '../_partials/ReportCardContainer'
import ReporteMatriculaPorRegion from './ReporteMatriculaPorRegion'
import { useTranslation } from 'react-i18next'
import GetHistoricoEstDivisionGeog from './GetHistoricoEstDivisionGeog'

const ReporteRegional = () => {
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
      titulo: t('reportes>regional>reporte_de_matricula_por_direccion_regional', 'Reporte de Matrícula por Dirección Regional'),
      descripcion: t('reportes>regional>resumen_de_estudiantes_matriculados_por_centro_educativo', 'Resumen de estudiantes matriculados por centro educativo')
    } 
  ]
  const [state, setState] = React.useState(0)
  const Cards = () => {
    return reportes.map((reporte, index) => (
      <ReportCard
        onClick={() => setState(index + 1)}
        titulo={reporte.titulo}
        descripcion={reporte.descripcion}
      />
    ))
  }

  return (
    <>
      {state == 0 && <ReportCardContainer>{Cards()}</ReportCardContainer>}
      {/* state == 1 && (
        <ReporteListadoPersonasInstitucion regresarEvent={() => setState(0)} />
      ) */}
      {/* state == 2 && (
        <ReporteMatriculaActual regresarEvent={() => setState(0)} />
      ) */}
      {state == 1 && (
        <ReporteMatriculaPorRegion regresarEvent={() => setState(0)} />
      )}
 
    </>
  )
}

export default ReporteRegional
