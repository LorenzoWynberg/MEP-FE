import React from 'react'
import ReportCard from '../_partials/ReportCard'
import ReportCardContainer from '../_partials/ReportCardContainer'
import ReporteRegistroEstudiantes from './ReporteRegistroEstudiantes'
import ReporteResumenRegistroMatricula from './ReporteResumenRegistroMatricula'
import ReporteConducta from './ReporteConducta'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

const ReporteInstitucional = () => {
  const { t } = useTranslation()

  const stateRedux = useSelector((store: any) => {
    return {
      institution: store.authUser.currentInstitution
    }
  })

  const reportes = [
    /* {
      titulo: 'Docentes por persona estudiante por asignatura',
      descripcion:
        'Este reporte se utliza para visualizar los docentes que imparten asignaturas por persona estudiante.',
    },
    {
      titulo: 'LISTADO DE PERSONAS ESTUDIANTES POR INSTITUCIÓN, NIVEL Y GRUPO',
      descripcion:
        'Este reporte se utiliza para visualizar la lista de todas las personas estudiantes de la institución',
    },
    {
      titulo: 'Asistencia por fecha',
      descripcion:
        'Este reporte se utiliza para visualizar la asistencia de las personas estudiantes en la institución',
    },
    {
      titulo: 'REPORTE DE MATRÍCULA ACTUAL',
      descripcion:
        'Este reporte se utiliza para visualizar la matrícula por oferta, modalidad, nivel y especialidad',
    }, */
    {
      titulo: t('reportes>institucional>reporte_registro_de_estudiantes', 'REPORTE REGISTRO DE ESTUDIANTES'),
      descripcion: t('reportes>institucional>registro_de_estudiantes', 'Registro de estudiantes')
    },
    {
      titulo: t('reportes>institucional>reporte_resumen_de_registro_de_matricula', 'REPORTE Resumen de registro de matrícula'),
      descripcion: t('reportes>institucional>resumen_de_registro_de_matricula', 'Resumen de registro de matrícula')
    },
    // {
    //   titulo: t('reportes>institucional>reporte_conducta', 'REPORTE de conducta'),
    //   descripcion: t('reportes>institucional>resumen_de_conducta', 'Resumen de conducta')
    // },
    // {
    //   titulo: t('reportes>institucional>reporte_asistencia', 'REPORTE de calificaciones'),
    //   descripcion: t('reportes>institucional>resumen_de_asistencia', 'Resumen de calificaciones')
    // }
  ]

  const [state, setState] = React.useState(0)
  const Cards = () => {
    return reportes?.map((reporte, index) => (
      <ReportCard
        onClick={() => setState(index + 1)}
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
        {/* {state == 3 && (
          <ReporteConducta regresarEvent={() => setState(0)} type="conducta"/>
        )}
        {state == 4 && (
          <ReporteConducta regresarEvent={() => setState(0)} type="asistencia"/>
        )} */}
      </>
    )
  }
}

export default ReporteInstitucional
