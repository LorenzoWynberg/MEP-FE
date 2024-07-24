import React from 'react'
import Parameters from './Parameters'
import Reporte from './Reporte'
import ReportBar from '../../_partials/ReportBar'
import { envVariables } from 'Constants/enviroment'
import axios from 'axios'

const GetHistoricoEstDivisionAdmin = ({ regresarEvent }) => {
  const [state, setState] = React.useState(0)
  const printRef = React.useRef()
  const [reportData, setReportData] = React.useState<any>()
  const [reportParameters, setReportParameters] = React.useState<any>()

  const loadReportData = async (idRegion, idCircuito) => {
    try {
      const response = await axios.get(
        `${envVariables.BACKEND_URL}/api/ServicioComunal/Reportes/GetHistoricoEstDivisionAdmin/${idRegion}/${idCircuito}`
      )
      setReportData(response.data)
    } catch (e) {
      console.log(e)
    }
  }

  const onShowReportEvent = (parametros) => {
    const { idRegion, idCircuito } = parametros
    if (!idCircuito || !idRegion) return

    loadReportData(idRegion.value, idCircuito.value).then(() => {
      setReportParameters(parametros)
      setState(1)
    })
    console.log(parametros)
  }

  return (
    <div>
      <ReportBar
        regresarEvent={() => {
          regresarEvent()
          setState(0)
        }} imprimirRef={printRef} showBtn={state === 1}
      />
      {state === 0 && <Parameters showReportEvent={onShowReportEvent} />}
      {state === 1 && <Reporte innerRef={printRef} reportData={reportData} reportParameters={reportParameters} />}
    </div>
  )
}

export default GetHistoricoEstDivisionAdmin
