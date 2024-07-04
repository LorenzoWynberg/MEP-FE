import React from 'react'
import ReportParameterCard from '../../_partials/ReportParameterCard'
import useFiltroReportes from '../../_partials/useFiltroReportes'

const initialState = [
  {
    key: 'regionId',
    label: 'Región',
    items: [],
    onChange: null
  },
  {
    key: 'circuitoId',
    label: 'Circuito',
    items: [],
    onChange: null
  }
]

const Parameters = ({ showReportEvent }) => {
  const {
    getRegionales,
    getCircuitosByRegionalId,
    setSelectInitialState,
    setSelectItems,
    selects
  } = useFiltroReportes()

  React.useEffect(() => {
    setSelectInitialState(initialState)
    const fetch = async () => {
      const regionArr = await getRegionales()

      const mapeador = (item) => {
        return { value: item.id, label: item.nombre }
      }
      const onChange = (obj) => {
        getCircuitosByRegionalId(obj.value).then((circuitosArr) => {
          setSelectItems(1, circuitosArr.map(mapeador), null)
        })
      }
      setSelectItems(0, regionArr.map(mapeador), onChange)
    }
    fetch()
  }, [])

  return (
    <ReportParameterCard
      titulo='Reporte de matrícula actual'
      texto='Seleccione la dirección regional y el circuito'
      selects={selects}
      onBtnGenerarEvent={(obj) => {
        if (showReportEvent) showReportEvent(obj)
      }}
    />
  )
}

export default Parameters
