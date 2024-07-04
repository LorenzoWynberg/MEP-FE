import React from 'react'
import ReportParameterCard from '../../_partials/ReportParameterCard'
import useFiltroReportes from '../../_partials/useFiltroReportes'

const initialState = [
  {
    key: 'circuitoId',
    label: 'Circuito',
    items: []
  },
  {
    key: 'institucionId',
    label: 'Centro educativo',
    items: []
  }
]

const Parameters = ({ showReportEvent, reportLoader = false }) => {
  /**/
  // const [selects, setSelects] = React.useState(initialState)
  const [loader, setLoader] = React.useState(false)
  const {
    getCurrentRegion,
    getCircuitosByRegionalId,
    getInstitucionByCircuitoId,
    setSelectInitialState,
    setSelectItems,
    selects
  } = useFiltroReportes()

  React.useEffect(() => {
    setSelectInitialState(initialState)

    const fetch = async () => {
      setLoader(true)
      const region = await getCurrentRegion()
      const circuitosData = await getCircuitosByRegionalId(region?.id)
      setLoader(false)
      const mapeador = (item) => {
        return { value: item.id, label: item.nombre }
      }

      const onChange = (obj) => {
        getInstitucionByCircuitoId(obj.value).then((institucionArr) => {
          setSelectItems(1, institucionArr.map(mapeador), null)
        })
      }

      setSelectItems(0, circuitosData?.map(mapeador), onChange)
      /* const newState = [...selects]
			newState[0] = {...newState[0],items: circuitosResponse.data?.map(mapeador)}
			newState[1] = {...newState[1],items: institucionResponse.data?.map(mapeador)}
			setSelects(newState) */
    }
    fetch()
  }, [])
  return (
    <div>
      <ReportParameterCard
        titulo='Listado de personas estudiantes por centro educativo, nivel y grupo'
        texto='Seleccione el circuito y el centro educativo'
        selects={selects}
        loader={loader || reportLoader}
        onBtnGenerarEvent={(obj) => {
          if (showReportEvent) showReportEvent(obj)
        }}
      />
    </div>
  )
}

export default Parameters
