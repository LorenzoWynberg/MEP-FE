import React from 'react'
import Parameters from './Parameters'
import Reporte from './Reporte'
import ReportBar from '../../_partials/ReportBar'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'

interface IReportData {
	caracteristicasTerreno: any[],
	afectacionesTerreno: any[]
}

const ReporteInformacionAccesoInstitucion = ({ regresarEvent }) => {
  const [state, setState] = React.useState(0)
  const printRef = React.useRef()
  const [reportData, setReportData] = React.useState<IReportData>({ caracteristicasTerreno: [], afectacionesTerreno: [] })
  const [reportParameters, setReportParameters] = React.useState<any>()

  const loadReportData = async (institucionId) => {
    try {
      const responseCaracteristicas = await axios.get<any[]>(
				`${envVariables.BACKEND_URL}/api/Areas/Reportes/ReportesGenerales/GetAllDatosRptTerrenoCentroEducativo/${institucionId}/0`
      )
      const responseAfectaciones = await axios.get<any[]>(
				`${envVariables.BACKEND_URL}/api/Areas/Reportes/ReportesGenerales/GetAllDatosRptTerrenoCentroEducativo/${institucionId}/1`
      )

      setReportData({
        caracteristicasTerreno: responseCaracteristicas.data,
        afectacionesTerreno: responseAfectaciones.data
      })
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
    console.log(parametros)
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

export default ReporteInformacionAccesoInstitucion
