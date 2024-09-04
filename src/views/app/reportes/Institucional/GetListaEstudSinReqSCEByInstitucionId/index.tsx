import React from 'react'
import Parameters from './Parameters'
import ReportBar from '../../_partials/ReportBar'
import { envVariables } from 'Constants/enviroment'
import axios from 'axios'
import Loader from 'Components/Loader'
import useFiltroReportes from '../../_partials/useFiltroReportes'
import { GenerateExcelObject, SendWorkbookToDownload } from 'Utils/excel'
import ReporteStyledTable from '../../_partials/ReporteStyledTable'

const GetListaEstudSinReqSCEByInstitucionId = ({ regresarEvent }) => {
  const [state, setState] = React.useState(0)
  const printRef = React.useRef()
  const [reportData, setReportData] = React.useState<any>()
  const [loader, setLoader] = React.useState(true)
  const title = 'Reporte De Estudiantes Sin Requisito De SCE'

  const { institucionId } = useFiltroReportes()
  const loadReportData = async institucionId => {
    try {
      const response = await axios.get(
        `${envVariables.BACKEND_URL}/api/ServicioComunal/Reportes/GetListaEstudSinReqSCEByInstitucionId/${institucionId}`
      )
      setReportData(response.data)
    } catch (e) {
      console.log(e)
    }
  }
  const onShowReportEvent = () => {
    loadReportData(institucionId).then(() => {
      setLoader(false)
    })
  }

  React.useEffect(() => {
    onShowReportEvent()
  }, [institucionId])

  const columns = [
		{
			Header: 'Direccion Regional',
			accessor: 'direccionRegional',
			label: '',
			column: ''
		},
		{
			Header: 'Circuito',
			accessor: 'circuito',
			label: '',
			column: ''
		},
    {
      Header: 'ID',
      accessor: 'identificacion',
      label: '',
      column: ''
    },
    {
      Header: 'Tipo ID',
      accessor: 'tipoIdentificacion',
      label: '',
      column: ''
    },
    {
      Header: 'Nombre',
      accessor: 'nombreEstudiante',
      label: '',
      column: ''
    },
    {
      Header: 'Nivel',
      accessor: 'nombreNivel',
      label: '',
      column: ''
    },
    {
      Header: 'Género',
      accessor: 'genero',
      label: '',
      column: ''
    },
  ]

  const onExcelEvent = () => {
    const workbook = GenerateExcelObject(reportData)
    SendWorkbookToDownload(workbook, `${title}.xlsx`)
  }
  return (
    <div>
      {!loader && <ReportBar onExcelBtnEvent={onExcelEvent}
        regresarEvent={() => {
          regresarEvent()
          setState(0)
        }} imprimirRef={printRef} showBtn={state === 0}
      />}
      {loader ? (
        <div style={{
          height: '100%',
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 20
        }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <Loader />
          </div>
        </div>
      ) : <ReporteStyledTable innerRef={printRef} data={reportData} columns={columns} title={'Listado de estudiantes del centro educativo, que tienen pendiente el cumplimiento del Servicio Comunal Estudiantil.'} />}

    </div>
  )
}

export default GetListaEstudSinReqSCEByInstitucionId
