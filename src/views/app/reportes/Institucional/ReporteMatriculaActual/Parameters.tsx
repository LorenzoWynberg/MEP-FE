import React from 'react'
import ReportParameterCard from '../../_partials/ReportParameterCard'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import { useSelector } from 'react-redux'
const initialState = [
  {
    key: 'institucionId',
    label: 'Centro educativo',
    items: [],
    onChange: null
  }
]
const Parameters = ({ showReportEvent }) => {
  /**/
  const [selects, setSelects] = React.useState(initialState)
  const selectedYear = useSelector(store=>store.authUser.selectedActiveYear)
  React.useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get<any>(
          `${envVariables.BACKEND_URL}/api/Admin/Institucion`
        )
        const newState = [...selects]
        const select1 = {
          ...newState[0],
          items: response.data?.map((item) => {
            return { value: item.id, label: item.nombre }
          })
        }
        newState[0] = select1
        setSelects(newState)
      } catch (e) {
        console.log(e)
      }
    }
    fetch()
  }, [selectedYear])
  return (
    <div>
      <ReportParameterCard
        titulo='Reporte de matrícula actual'
        texto='Seleccione el circuito y el centro educativo'
        selects={selects}
        onBtnGenerarEvent={(obj) => {
          /* alert(JSON.stringify(obj))
					console.log(obj) */
          if (showReportEvent) showReportEvent(obj)
        }}
      />
    </div>
  )
}

export default Parameters
