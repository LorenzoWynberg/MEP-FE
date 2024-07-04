import React from 'react'
import Parameters from './Parameters'
import Reporte from './Reporte'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import ReportBar from '../../_partials/ReportBar'

const ReporteMatriculaActual = ({ regresarEvent }) => {
  const [state, setState] = React.useState(0)
  const [reportData, setReportData] = React.useState<any>()
  const [reportParameters, setReportParameters] = React.useState<any>()
  const printRef = React.useRef()

  const loadReportData = async (regionId, circuitoId) => {
    try {
      const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/Areas/Reportes/ReportesGenerales/GetDatosRptMatriculaActual?RegionalId=${regionId}&CircuitosId=${circuitoId}`
      )
      setReportData(response.data)
    } catch (e) {
      console.log(e)
    }
  }

  const onShowReportEvent = (parametros) => {
    const { circuitoId, regionId } = parametros
    if (!circuitoId || !regionId) return

    loadReportData(regionId.value, circuitoId.value).then(() => {
      setReportParameters(parametros)
      setState(1)
    })
  }
  return (
    <>
      <ReportBar
        regresarEvent={() => {
			  regresarEvent()
			  setState(0)
        }} imprimirRef={printRef} showBtn={state === 1}
      />
      {state === 0 && <Parameters showReportEvent={onShowReportEvent} />}
      {state === 1 && <Reporte innerRef={printRef} reportData={reportData} parameters={reportParameters} />}
    </>
  )
}

export default ReporteMatriculaActual
