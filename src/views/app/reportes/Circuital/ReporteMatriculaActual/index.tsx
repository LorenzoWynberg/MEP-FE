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
  const [loader, setLoader] = React.useState(false)
  const loadReportData = async (institucionId) => {
    try {
      setLoader(true)
      const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/Areas/Reportes/ReportesGenerales/GetDatosRptMatriculaActual?institucionId=${institucionId}`
      )
      setReportData(response.data)
      setLoader(false)
    } catch (e) {
      console.log(e)
    }
  }

  const onShowReportEvent = (parametros) => {
    const { institucionId } = parametros
    if (!institucionId) return

    loadReportData(institucionId.value).then(() => {
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
      {state === 0 && <Parameters showReportEvent={onShowReportEvent} reportLoader={loader} />}
      {state === 1 && <Reporte innerRef={printRef} reportData={reportData} />}
    </div>
  )
}

export default ReporteMatriculaActual
