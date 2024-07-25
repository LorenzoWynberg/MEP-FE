import React from 'react'
import Parameters from './Parameters'
import Reporte from './Reporte'
import ReportBar from '../../_partials/ReportBar'
import { envVariables } from 'Constants/enviroment'
import axios from 'axios'

const GetHistoricoEstDivisionGeog = ({ regresarEvent }) => {
  const [state, setState] = React.useState(0)
  const printRef = React.useRef()
  const [reportData, setReportData] = React.useState<any>()
  const [reportParameters, setReportParameters] = React.useState<any>()

  const loadReportData = async (idProvincia, idCanton, idDistrito) => {
    try {
      const response = await axios.get(
        `${envVariables.BACKEND_URL}/api/ServicioComunal/Reportes/GetHistoricoEstDivisionGeog/${0}/${0}/${0}`
      )
      setReportData(response.data)
    } catch (e) {
      console.log(e)
    }
  }

  const onShowReportEvent = (parametros) => {
    const { idProvincia, idCanton, idDistrito } = parametros
    if (!idProvincia || !idCanton || !idDistrito) return

    loadReportData(idProvincia.value, idCanton.value, idDistrito.value).then(() => {
      setReportParameters(parametros)
      setState(1)
    }) 
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

export default GetHistoricoEstDivisionGeog
