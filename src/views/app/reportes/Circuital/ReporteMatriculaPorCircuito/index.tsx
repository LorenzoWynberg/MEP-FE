import React from 'react'
import Parameters from './Parameters'
import Reporte from './Reporte'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import ReportBar from '../../_partials/ReportBar'
import { GenerateExcelObject, SendWorkbookToDownload } from 'utils/excel'
import { useSelector } from 'react-redux'

const ReporteMatriculaPorCircuito = ({ regresarEvent }) => {
  const [state, setState] = React.useState(0)
  const [reportData, setReportData] = React.useState<any>()
  const [reportParameters, setReportParameters] = React.useState<any>()
  const [loader, setLoader] = React.useState(false)
  const printRef = React.useRef()

  const statestore = useSelector<any, any>((store) => {
    return {
      annioeducativo: store.authUser.selectedActiveYear.id
    }
  })

  const loadReportData = async (circuitoId) => {
    try {
      setLoader(true)
      const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/Areas/Reportes/ReportesGenerales/GetInstitucionesbyCircuitoId/${circuitoId}/${statestore.annioeducativo}`
      )
      setLoader(false)
      setReportData(response.data)
    } catch (e) {
      console.log(e)
    }
  }
  
  const onShowReportEvent = (parametros) => {
    // setState(1)
    const { circuitoId, regionId } = parametros
    if (!circuitoId || !regionId) return

    loadReportData(circuitoId.value).then(() => {
      setReportParameters(parametros)
      setState(1)
    })
  }
  const onExcelEvent = () => {
    let reportName = 'Reporte de Matricula por Circuito - '
    const excelData = reportData.map((i, index) => {
      if (index == 0) { reportName += `${i.regionalNombre} ${i.circuitoNombre}` }

      return {
        Circuito: i.circuitoNombre,
        'Codigo Saber': i.institucionCodigo,
        'Nombre Centro Educativo': i.institucionNombre,
        Hombres: i.hombres,
        Mujeres: i.mujeres,
        Total: i.total
      }
    })

    const workbook = GenerateExcelObject(excelData)
    SendWorkbookToDownload(workbook, `${reportName}.xlsx`)
  }

  return (
    <div>
      <ReportBar
        regresarEvent={() => {
				  regresarEvent()
				  setState(0)
        }}
        onExcelBtnEvent={onExcelEvent}
        imprimirRef={printRef}
        showBtn={state === 1}
      />
      {state === 0 && (
        <Parameters
          showReportEvent={onShowReportEvent}
          reportLoader={loader}
        />
      )}
      {state === 1 && (
        <Reporte
          innerRef={printRef}
          reportParameters={reportParameters}
          reportData={reportData}
        />
      )}
    </div>
  )
}

export default ReporteMatriculaPorCircuito
