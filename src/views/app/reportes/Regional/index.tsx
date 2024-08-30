import React from 'react'
import ReportCard from '../_partials/ReportCard'
import ReportCardContainer from '../_partials/ReportCardContainer'
import ReporteMatriculaPorRegion from './ReporteMatriculaPorRegion'
import { useTranslation } from 'react-i18next'
import GetHistoricoEstDivisionAdminReg from './GetHistoricoEstDivisionAdminReg'
import ReporteUltimoNivelSinSCE from './ReporteUltimoNivelSinSCE/'

const ReporteRegional = props => {
  const { t } = useTranslation()

  const reportes = props.props.tipo == 'sce' ? [


    {
      titulo: t('reportes>circuital>reporte_de_sce_historico_division', 'Reporte de SCE Historico Division'),
      descripcion: t('reportes>circuital>resumen_de_sce_historico_division', 'Resumen de proyectos de Servicio Comunal Estudiantil según división administrativa MEP (DRE-circuitos)'), id: 2
    }
    ,
    {
      titulo: t('reportes>circuital>reporte_de_sce_historico_division', 'Reporte de Estudiantes Sin SCE'),
      descripcion: t('reportes>circuital>resumen_de_sce_historico_division', 'Resumen de cantidad de estudiantes de último nivel que no han concluido el Servicio Comunal Estudiantil'), id: 3
    }
  ] : [
    {
      titulo: t('reportes>regional>reporte_de_matricula_por_direccion_regional', 'Reporte de Matrícula por Dirección Regional'),
      descripcion: t('reportes>regional>resumen_de_estudiantes_matriculados_por_centro_educativo', 'Resumen de estudiantes matriculados por centro educativo'),
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
      {/* state == 1 && (
        <ReporteListadoPersonasInstitucion regresarEvent={() => setState(0)} />
      ) */}
      {/* state == 2 && (
        <ReporteMatriculaActual regresarEvent={() => setState(0)} />
      ) */}
      {state == 1 && (
        <ReporteMatriculaPorRegion regresarEvent={() => setState(0)} />
      )}

      {state == 2 && (
        <GetHistoricoEstDivisionAdminReg regresarEvent={() => setState(0)} />
      )}

      {state == 3 && (
        <ReporteUltimoNivelSinSCE regresarEvent={() => setState(0)} />
      )}
    </>
  )
}

export default ReporteRegional
