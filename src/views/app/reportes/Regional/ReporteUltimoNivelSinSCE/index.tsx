import React from 'react'
import Parameters from './Parameters'
// import Reporte from './Reporte'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import ReportBar from '../../_partials/ReportBar'
import { GenerateExcelObject, SendWorkbookToDownload } from 'utils/excel'
import { useSelector } from 'react-redux'
import ReporteStyledTableCircuitos from '../../_partials/ReporteStyledTableCircuitos'

const ReporteUltimoNivelSinSCE = ({ regresarEvent }) => {
  const [state, setState] = React.useState(0)
  const [idCircuitoSent, setIdCircuitoSent] = React.useState(0)
  const [idRegionSent, setIdRegionSent] = React.useState(0)
  const [reportData, setReportData] = React.useState<any>()
  const [reportParameters, setReportParameters] = React.useState<any>()
  const [loader, setLoader] = React.useState(false)
  const printRef = React.useRef()

  const columns = [
    {
      Header: 'Codigo Institucion',
      accessor: 'codigoInstitucion',
      label: '',
      column: ''
    },

    {
      Header: 'Hombres',
      accessor: 'hombreCount',
      label: '',
      column: ''
    },

    {
      Header: 'Mujeres',
      accessor: 'mujerCount',
      label: '',
      column: ''
    },

    {
      Header: 'Intitución',
      accessor: 'nombreInstitucion',
      label: '',
      column: ''
    },

    {
      Header: 'Total Estudiantes',
      accessor: 'totalEstudiantes',
      label: '',
      column: ''
    },

  ]

  const loadReportData = async ( regionId) => {
    try {
      setLoader(true)
      const response = await axios.get(
        `${envVariables.BACKEND_URL}/api/ServicioComunal/Reportes/GetEstudiantesSinReqSCEUltNivel/${regionId}/0`
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
    if (  !regionId) return

    loadReportData(  regionId.value).then(() => {
      setReportParameters(parametros)
      setState(1)
    })
  }
  const onExcelEvent = () => {
    const workbook = GenerateExcelObject(reportData)
    SendWorkbookToDownload(workbook, `ReporteUltimoNivelSinSCE.xlsx`)
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
        <ReporteStyledTableCircuitos innerRef={printRef} data={reportData} idCircuito={idCircuitoSent} idRegion={idRegionSent} columns={columns} title={'Resumen de cantidad de estudiantes de último nivel que no han concluido el Servicio Comunal Estudiantil'}
        />)}
    </div>
  )
}

export default ReporteUltimoNivelSinSCE