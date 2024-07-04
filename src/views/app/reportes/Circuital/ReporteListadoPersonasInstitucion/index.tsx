import React from 'react'
import Parameters from './Parameters'
import Reporte from './Reporte'
import ReportBar from '../../_partials/ReportBar'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
const ReporteListadoPersonasInstitucion = ({ regresarEvent }) => {
  const [state, setState] = React.useState(0)
  const [reportData, setReportData] = React.useState<any>()
  const printRef = React.useRef()
  const [loader, setLoader] = React.useState(false)
  const loadReportData = async (institucionId) => {
    try {
      setLoader(true)
      const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/Areas/Reportes/ReportesGenerales/GetDatosRptListadoEstudiantes?institucionId=${institucionId}`
      )
      setLoader(false)
      setReportData(response.data)
    } catch (e) {
      console.log(e)
    }
  }
  const onShowReportEvent = (parametros) => {
    const { institucionId } = parametros
    if (!institucionId) return

    loadReportData(institucionId.value).then(() => {
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
      {state === 0 && <Parameters showReportEvent={onShowReportEvent} reportLoader={loader} />}
      {state === 1 && <Reporte innerRef={printRef} reportData={reportData} />}
    </div>
  )
}

export default ReporteListadoPersonasInstitucion
