import React from 'react'
import ReportCard from '../_partials/ReportCard'
import ReportCardContainer from '../_partials/ReportCardContainer'
import GetHistoricoEstDivisionGeog from '../Regional/GetHistoricoEstDivisionGeog'
import GetHistoricoEstByInstitucionId from '../Institucional/GetHistoricoEstByInstitucionId'
const ReportesNacional = () => {
  const reportes = [
    {
      titulo: 'REPORTES DE MATRÍCULA ACTUAL',
      descripcion:
        'Este reporte se utiliza para visualizar la matrícula por oferta, modalidad, nivel y especialidad'
    },
    {
      titulo: 'Reporte de aulas del centro educativo',
      descripcion:
        'Este reporte se utiliza para verificar la cantidad de aulas de un centro educativo.'
    },
    {
      titulo: 'Reporte de información de acceso al centro educativo',
      descripcion:
        'Este reporte se utiliza para visualizar la matrícula por oferta, modalidad nivel y especialidad'
    },
    {
      titulo: 'Reporte de servicios públicos del centro educativo',
      descripcion:
        'Este reporte se utiliza para visualizar la matrícula por oferta, modalidad, nivel y especialidad'
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
      {state == 1 && (
        <GetHistoricoEstDivisionGeog regresarEvent={() => setState(0)} />
      )}
      {state == 2 && (
        <GetHistoricoEstByInstitucionId regresarEvent={() => setState(0)} />
      )}
      {state == 3 && (
        <ReporteInformacionAccesoInstitucion
          regresarEvent={() => setState(0)}
        />
      )}
      {/* {state == 4 && (
        <ReporteServiciosPublicosInstitucion
          regresarEvent={() => setState(0)}
        />
      )} */}
    </>
  )
}

export default ReportesNacional
