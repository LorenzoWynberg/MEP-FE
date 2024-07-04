import React from 'react'
import ReportParameterCard from '../../_partials/ReportParameterCard'
const Parameters = ({ showReportEvent }) => {
  const selects = [
    {
      key: 'institucionId',
      label: 'Centro educativo',
      items: [
        { value: 'institucion1', label: 'institucion1' },
        { value: 'institucion1', label: 'institucion1' }
      ]
    }
  ]

  return (
    <div>
      <ReportParameterCard
        titulo='Listado de personas estudiantes por centro educativo, nivel y grupo'
        texto='Seleccione la dirección reginal y el circuito'
        selects={selects}
        onBtnGenerarEvent={(obj) => {
          if (showReportEvent) showReportEvent()
        }}
      />
    </div>
  )
}

export default Parameters
