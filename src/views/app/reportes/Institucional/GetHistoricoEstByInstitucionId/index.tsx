import React from 'react'
import Parameters from './Parameters'
import ReportBar from '../../_partials/ReportBar'
import { envVariables } from 'Constants/enviroment'
import axios from 'axios'
import Loader from 'Components/Loader'
import useFiltroReportes from '../../_partials/useFiltroReportes'
import { GenerateExcelObject, SendWorkbookToDownload } from 'Utils/excel'
import ReporteStyledTableAnno from '../../_partials/ReporteStyledTableAnno'

const GetHistoricoEstByInstitucionId = ({ regresarEvent }) => {
	const [state, setState] = React.useState(0)
	const printRef = React.useRef()
	const [reportData, setReportData] = React.useState<any>()
	const [reportParameters, setReportParameters] = React.useState<any>()
	const [loader, setLoader] = React.useState(true)
	const title = 'Reporte Historico de SCE por Institucion'

	const { institucionId } = useFiltroReportes()
	const loadReportData = async institucionId => {
		try {
			const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/ServicioComunal/Reportes/GetHistoricoEstByInstitucionId/${institucionId}`
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


  /*
  0
: 
"annoParticipacion"
1
: 
"nombreAreaProyecto"
2
: 
"descripcion"
3
: 
"nombreProyecto"
4
: 
"nombreModalidad"
5
: 
"caracteristicas"
6
: 
"nombreOrgContraparte"
7
: 
"cedulaCount"
8
: 
"dimexCount"
9
: 
"yisRoCount"
10
: 
"discapacidadCount"
11
: 
"hombreCount"
12
: 
"mujerCount"
13
: 
"indigenaCount"
14
: 
"refugiadoCount"
15
: 
"totalEstudiantes"
  */
  const columns = [
    {
      Header: 'Año',
      accessor: 'annoParticipacion',
      label: '',
      column: ''
    },
    {
      Header: 'Area de Proyecto',
      accessor: 'nombreAreaProyecto',
      label: '',
      column: ''
    },
    {
      Header: 'Descripción',
      accessor: 'descripcion',
      label: '',
      column: ''
    },
    {
      Header: 'Nombre del proyecto',
      accessor: 'nombreProyecto',
      label: '',
      column: ''
    },
    {
      Header: 'Modalidad',
      accessor: 'nombreModalidad',
      label: '',
      column: ''
    },
    {
      Header: 'Características',
      accessor: 'caracteristicas',
      label: '',
      column: ''
    },
    {
      Header: 'Organización Contraparte',
      accessor: 'nombreOrgContraparte',
      label: '',
      column: ''
    },
    {
      Header: 'Cantidad de cédulas',
      accessor: 'cedulaCount',
      label: '',
      column: ''
    },
    {
      Header: 'DIMEX',
      accessor: 'dimexCount',
      label: '',
      column: ''
    },
    {
      Header: 'Cantidad de YISRO',
      accessor: 'yisRoCount',
      label: '',
      column: ''
    },
    {
      Header: 'Discapacitados',
      accessor: 'discapacidadCount',
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
      Header: 'Indígenas',
      accessor: 'indigenaCount',
      label: '',
      column: ''
    },

    {
      Header: 'Cantidad de refugiados',
      accessor: 'refugiadoCount',
      label: '',
      column: ''
    },
    {
      Header: 'Total de estudiantes',
      accessor: 'totalEstudiantes',
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
      ) : <ReporteStyledTableAnno innerRef={printRef} data={reportData} columns={columns} title={title} />}

    </div>
  )
}

export default GetHistoricoEstByInstitucionId
