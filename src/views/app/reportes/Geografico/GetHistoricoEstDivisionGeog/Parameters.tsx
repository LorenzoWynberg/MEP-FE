import React from 'react'
import ReportParameterCard from '../../_partials/ReportParameterCard'
import useFiltroReportes from '../../_partials/useFiltroReportes' 
import { envVariables } from 'Constants/enviroment' 
import axios from 'axios'
const initialState = [
  {
    key: 'idProvincia',
    label: 'Provincia',
    items: []
  },
  {
    key: 'idCanton',
    label: 'Canton',
    items: []
  },
  {
    key: 'idDistrito',
    label: 'Distrito',
    items: []
  }
]
const Parameters = ({ showReportEvent }) => {
 
  const {
    setSelectInitialState,
    setSelectItems,
    selects
  } = useFiltroReportes()

  React.useEffect(() => {
 
    setSelectInitialState(initialState)
    const fetch = async () => {
      const provArr = await axios.get(`${envVariables.BACKEND_URL}/api/Provincia`)
      const mapeador = (item) => {
        return { value: item.id, label: item.nombre }
      }
      const onChange = (obj) => {
        const onChangeCanton = (obj) => {
          axios.get(`${envVariables.BACKEND_URL}/api/Distrito/GetByCanton/${obj.value}`).then((institucionArr) => {
            setSelectItems(2, institucionArr.data.map(mapeador), null)
          })
        }
        axios.get(`${envVariables.BACKEND_URL}/api/Canton/GetByProvince/${obj.value}`).then((circuitosArr) => {
          setSelectItems(1, circuitosArr.data.map(mapeador), onChangeCanton)
        })
      }
      setSelectItems(0, provArr.data.map(mapeador), onChange)
    }
    fetch()
  }, [])

  return (
    <div>
      <ReportParameterCard
        titulo='Reporte de aulas del centro educativo'
        texto='Seleccione la dirección regional y el circuito'
        selects={selects}
        onBtnGenerarEvent={(obj) => {
          if (showReportEvent) showReportEvent(obj)
        }}
      />
    </div>
  )
}

export default Parameters
