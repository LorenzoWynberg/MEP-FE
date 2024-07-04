import React from 'react'
import ReportParameterCard from '../../_partials/ReportParameterCard'
import useFiltroReportes from '../../_partials/useFiltroReportes'

const initialState = [
  {
    key: 'circuitoId',
    label: 'Circuito',
    items: [],
    onChange: null
  },
  {
    key: 'institucionId',
    label: 'Centro educativo',
    items: []
  }
]

const Parameters = ({ showReportEvent, reportLoader = false }) => {
  const {
    getCurrentRegion,
    getCircuitosByRegionalId,
    getInstitucionByCircuitoId,
    setSelectInitialState,
    setSelectItems,
    selects
  } = useFiltroReportes()
  const [loader, setLoader] = React.useState(false)
  React.useEffect(() => {
    setSelectInitialState(initialState)
    const fetch = async () => {
      setLoader(true)
      const region = await getCurrentRegion()

      const circuitosArr = await getCircuitosByRegionalId(region?.id)
      setLoader(false)
      const mapeador = (item) => {
        return { value: item.id, label: item.nombre }
      }
      const onChange = (obj) => {
        getInstitucionByCircuitoId(obj.value).then((institucionArr) => {
          setSelectItems(1, institucionArr?.map(mapeador), null)
        })
      }
      setSelectItems(0, circuitosArr?.map(mapeador), onChange)
    }
    fetch()
  }, [])
  return (
    <div>
      <ReportParameterCard
        titulo='Reporte de matrícula actual'
        texto='Seleccione el circuito y el centro educativo'
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
