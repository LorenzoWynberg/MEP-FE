import React from 'react'
import Parameters from './Parameters'
import Reporte from './Reporte'
import ReportBar from '../../_partials/ReportBar'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
const ReporteListadoPersonasInstitucion = ({ regresarEvent }) => {
  const [state, setState] = React.useState(0)
  const [reportData, setReportData] = React.useState([])
  const [reportParameters, setReportParameters] = React.useState()
  const [loader, setLoader] = React.useState(false)
  const printRef = React.useRef()
  const loadReportData = async (grupoId, estudianteId) => {
    try {
      const response = await axios.get<any>(
				`${envVariables.BACKEND_URL}/api/Areas/Reportes/ReportesGenerales/GetDatosRptDocentesPorEstudianteAsignatura?GrupoId=${grupoId}&EstudianteId=${estudianteId}`
      )
      setReportData(response.data)
    } catch (e) {
      console.log(e)
    }
  }

  const onShowReportEvent = (parametros) => {
    const { grupoId, personaId } = parametros
    if (!grupoId || !personaId) return

    loadReportData(grupoId.value, personaId.value).then(() => {
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
      {state === 1 && <Reporte innerRef={printRef} reportData={reportData} reportParameters={reportParameters} />}
    </div>
  )
}

export default ReporteListadoPersonasInstitucion
