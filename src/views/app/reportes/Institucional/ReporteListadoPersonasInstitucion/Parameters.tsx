import React from 'react'
import ReportParameterCard from '../../_partials/ReportParameterCard'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
const initialState = [
  {
    key: 'institucionId',
    label: 'Centro educativo',
    items: []
  }
]
const Parameters = ({ showReportEvent }) => {
  /**/
  const [selects, setSelects] = React.useState(initialState)

  React.useEffect(() => {
    const fetch = async () => {
      const institucionResponse = await axios.get<any>(
        `${envVariables.BACKEND_URL}/api/Admin/Institucion`
      )
      const mapeador = (item) => {
        return { value: item.id, label: item.nombre }
      }
      const newState = [...selects]
      newState[0] = {
        ...newState[0],
        items: institucionResponse.data?.map(mapeador)
      }
      setSelects(newState)
    }
    fetch()
  }, [])
  return (
    <div>
      <ReportParameterCard
        titulo='Listado de personas estudiantes por centro educativo, nivel y grupo'
        texto='Seleccione el centro educativo'
        selects={selects}
        onBtnGenerarEvent={(obj) => {
          if (showReportEvent) showReportEvent(obj)
        }}
      />
    </div>
  )
}

export default Parameters
