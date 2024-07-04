import React from 'react'
import ReportParameterCard from '../../_partials/ReportParameterCard'
import useFiltroReportes from '../../_partials/useFiltroReportes'
const initialState = [
  {
    key: 'institucionId',
    label: 'Institucion',
    items: [],
    onChange: null
  }
]
const Parameters = ({ showReportEvent, reportLoader = false }) => {
  const [loader, setLoader] = React.useState(false)
  const { getInstitucionByCircuitoId, circuitoId, selects, setSelectInitialState, setSelectItems } = useFiltroReportes()
  React.useEffect(() => {
    setSelectInitialState(initialState)
    const fetch = async () => {
      setLoader(true)
      const institucionData = await getInstitucionByCircuitoId(circuitoId)
      const mapeador = (item) => {
        return { value: item.id, label: item.nombre }
      }
      setLoader(false)
      setSelectItems(0, institucionData?.map(mapeador), null)
    }
    fetch()
  }, [])
  return (
    <div>
      <ReportParameterCard
        titulo='Reporte de matrícula actual'
        texto='Seleccione el centro educativo'
        selects={selects}
        loader={(loader || reportLoader)}
        onBtnGenerarEvent={(obj) => {
				  if (showReportEvent) showReportEvent(obj)
        }}
      />
    </div>
  )
}

export default Parameters
