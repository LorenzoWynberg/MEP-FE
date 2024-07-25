import React from 'react'
import ReportParameterCard from '../../_partials/ReportParameterCard'
import useFiltroReportes from '../../_partials/useFiltroReportes'
const initialState = [
  {
    key: 'idRegion',
    label: 'Region',
    items: []
  },
  {
    key: 'idCircuito',
    label: 'Circuito',
    items: []
  }
]
const Parameters = ({ showReportEvent }) => {
  const {
    getInstitucionByCircuitoId,
    getRegionales,
    getCircuitosByRegionalId,
    setSelectInitialState,
    setSelectItems,
    selects
  } = useFiltroReportes()
console.log('Parameters',selects)
  React.useEffect(() => {
    setSelectInitialState(initialState)
    const fetch = async () => {
      const regionArr = await getRegionales()

      const mapeador = (item) => {
        return { value: item.id, label: item.nombre }
      }
      const onChange = (obj) => {
        const onChangeCircuito = (obj) => {
          getInstitucionByCircuitoId(obj.value).then((institucionArr) => {
            // setSelectItems(2, institucionArr.map(mapeador), null)
            // alert()
          })
        }
        getCircuitosByRegionalId(obj.value).then((circuitosArr) => {
          setSelectItems(1, circuitosArr.map(mapeador), onChangeCircuito)
        })
      }
      setSelectItems(0, regionArr.map(mapeador), onChange)
    }
    fetch()
  }, [])

  return (
    <div>
      <ReportParameterCard
        titulo='Reporte Historico de SCE por Division Administrativa'
        texto='Reporte Historico de SCE por Division Administrativa'
        selects={selects}
        onBtnGenerarEvent={(obj) => {
          if (showReportEvent) showReportEvent(obj)
        }}
      />
    </div>
  )
}

export default Parameters
