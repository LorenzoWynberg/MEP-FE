import React from 'react'
import Parameters from './Parameters'
import Reporte from './Reporte'
import { envVariables } from 'Constants/enviroment'
import axios from 'axios'
import ReportBar from '../../_partials/ReportBar'
import { GenerateExcelObject, SendWorkbookToDownload } from 'utils/excel'

const ReporteMatriculaActual = ({ regresarEvent }) => {
  const [state, setState] = React.useState(0)
  const [reportData, setReportData] = React.useState<any>()
  const [loader, setLoader] = React.useState(false)
  const printRef = React.useRef()

  const loadReportData = async (circuitoId, institucionId) => {
    try {
      setLoader(true)
      const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/Areas/Reportes/ReportesGenerales/GetDatosRptMatriculaActual??CircuitosId=${circuitoId}&institucionId=${institucionId}`
      )
      setLoader(false)
      setReportData(response.data)
    } catch (e) {
      console.log(e)
    }
  }
  const onShowReportEvent = (parametros) => {
    const { circuitoId, institucionId } = parametros
    if (!circuitoId || !institucionId) return

    loadReportData(circuitoId.value, institucionId.value).then(() => {
      setState(1)
    })
  }
  const onExcelEvent = () => {
    const workbook = GenerateExcelObject(reportData)
    SendWorkbookToDownload(workbook)
  }

  return (
    <div>
      <ReportBar
        regresarEvent={() => {
			  regresarEvent()
			  setState(0)
        }} onExcelBtnEvent={onExcelEvent} imprimirRef={printRef} showBtn={state === 1}
      />
      {state === 0 && <Parameters showReportEvent={onShowReportEvent} reportLoader={loader} />}
      {state === 1 && <Reporte innerRef={printRef} reportData={reportData} />}
    </div>
  )
}

export default ReporteMatriculaActual
