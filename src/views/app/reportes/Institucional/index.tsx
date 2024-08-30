import React from 'react'
import ReportCard from '../_partials/ReportCard'
import ReportCardContainer from '../_partials/ReportCardContainer'
import ReporteRegistroEstudiantes from './ReporteRegistroEstudiantes'
import ReporteResumenRegistroMatricula from './ReporteResumenRegistroMatricula'
import ReporteConducta from './ReporteConducta'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import GetHistoricoEstByInstitucionId from './GetHistoricoEstByInstitucionId'
import GetListaEstudSinReqSCEByInstitucionId from './GetListaEstudSinReqSCEByInstitucionId'

const ReporteInstitucional = props => {
  const { t } = useTranslation()

  const stateRedux = useSelector((store: any) => {
    return {
      institution: store.authUser.currentInstitution
    }
  })

  const reportes = props.props.tipo == 'sce' ? [

    {
      titulo: t('reportes>institucional>reporte_historicoSCE', 'Reporte Historico Servicio Comunitario'),
      descripcion: t('reportes>institucional>resumen_de_reporte_historicoSCE', 'Resumen de proyectos de Servicio Comunal Estudiantil en el centro educativo por año.'), id: 3
    },
    {
      titulo: t('reportes>institucional>reporte_historicoSCE', 'Reporte De Estudiantes Sin Requisito De SCE'),
      descripcion: t('reportes>institucional>resumen_de_reporte_historicoSCE', 'Listado de estudiantes del centro educativo, que tienen pendiente el cumplimiento del Servicio Comunal Estudiantil.'), id: 4
    },
  ] : [
    {
      titulo: t('reportes>institucional>reporte_registro_de_estudiantes', 'REPORTE REGISTRO DE ESTUDIANTES'),
      descripcion: t('reportes>institucional>registro_de_estudiantes', 'Registro de estudiantes'), id: 1
    },
    {
      titulo: t('reportes>institucional>reporte_resumen_de_registro_de_matricula', 'REPORTE Resumen de registro de matrícula'),
      descripcion: t('reportes>institucional>resumen_de_registro_de_matricula', 'Resumen de registro de matrícula'), id: 2
    },
  ]

  const [state, setState] = React.useState(0)
  const Cards = () => {
    return reportes?.map((reporte, index) => (
      <ReportCard
        onClick={() => setState(reporte.id)}
        titulo={reporte.titulo}
        descripcion={reporte.descripcion}
      />
    ))
  }

  if (stateRedux.institution?.id == -1) {
    return (
      <>
        <h3>
          {t("estudiantes>traslados>gestion_traslados>seleccionar", "Debe seleccionar un centro educativo en el buscador de centros educativos.")}
        </h3>
      </>
    )
  } else {
    return (
      <>
        {state == 0 && <ReportCardContainer>{Cards()}</ReportCardContainer>}
        {/* state == 1 && (
        <ReporteDocenteEstudianteAsignatura regresarEvent={() => setState(0)} />
      ) */}
        {/* state == 2 && (
        <ReporteListadoPersonasInstitucion regresarEvent={() => setState(0)} />
      ) */}
        {/* state == 3 && (
        <ReporteAsistenciaFecha regresarEvent={() => setState(0)} />
      ) */}
        {/* state == 4 && (
        <ReporteMatriculaActual regresarEvent={() => setState(0)} />
      ) */}
        {state == 1 && (
          <ReporteRegistroEstudiantes regresarEvent={() => setState(0)} />
        )}
        {state == 2 && (
          <ReporteResumenRegistroMatricula regresarEvent={() => setState(0)} />
        )}
        {state == 3 && (
          <GetHistoricoEstByInstitucionId regresarEvent={() => setState(0)} />
        )}
        {state == 4 && (
          <GetListaEstudSinReqSCEByInstitucionId regresarEvent={() => setState(0)} />
        )}
      </>
    )
  }
}

export default ReporteInstitucional
