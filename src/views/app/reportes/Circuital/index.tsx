import React from 'react'
import ReportCard from '../_partials/ReportCard'
import ReportCardContainer from '../_partials/ReportCardContainer'
import ReporteMatriculaPorCircuito from './ReporteMatriculaPorCircuito'
import { useTranslation } from 'react-i18next'

const ReporteCircuital = () => {
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
      titulo: t('reportes>circuital>reporte_de_matricula_por_circuito', 'Reporte de Matrícula por circuito'),
      descripcion: t('reportes>circuital>resumen_de_estudiantes_matriculados_por_centro_educativo', 'Resumen de estudiantes matriculados por centro educativo')
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
        <ReporteMatriculaPorCircuito regresarEvent={() => setState(0)} />
      )}
    </>
  )
}

export default ReporteCircuital
