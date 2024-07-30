import React, { useCallback, useMemo } from 'react'
import Parameters from './Parameters'
import Reporte from './Reporte'
import ReportBar from '../../_partials/ReportBar'
import { envVariables } from 'Constants/enviroment'
import axios from 'axios'
import ReporteStyledTableCircuitos from '../../_partials/ReporteStyledTableCircuitos'
import { GenerateExcelObject, SendWorkbookToDownload } from 'Utils/excel'

const GetHistoricoEstDivisionAdmin = ({ regresarEvent }) => {
  const [state, setState] = React.useState(0)
  const [idCircuitoSent, setIdCircuitoSent] = React.useState()
  const [idRegionSent, setIdRegionSent] = React.useState()

  const printRef = React.useRef()
  const [reportData, setReportData] = React.useState<any>()
  const [reportParameters, setReportParameters] = React.useState<any>()

  const loadReportData = async (idRegion, idCircuito) => {
    try {

      setIdCircuitoSent(idCircuito)
      setIdRegionSent(idRegion)
      const response = await axios.get(
        `${envVariables.BACKEND_URL}/api/ServicioComunal/Reportes/GetHistoricoEstDivisionAdmin/${idRegion}/${idCircuito}`
      )
      setReportData(response.data)
    } catch (e) {
      console.log(e)
    }
  }

  const onShowReportEvent = parametros => {
    const { idRegion, idCircuito } = parametros
    if (!idCircuito || !idRegion) return
    loadReportData(idRegion.value, idCircuito.value).then(() => {
      setReportParameters(parametros)
      setState(1)
    })
  }
  const columns = [
    {
      Header: 'Oferta',
      accessor: 'nombreOferta',
      label: '',
      column: ''
    },
    {
      Header: 'Área del proyecto',
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
      Header: 'Tipo de proyecto',
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
      Header: 'Nombre de la organización contraparte',
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
      Header: 'Cantidad de DIMEX',
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
      Header: 'Cantidad de discapacitados',
      accessor: 'discapacidadCount',
      label: '',
      column: ''
    },
    {
      Header: 'Cantidad de hombres',
      accessor: 'hombreCount',
      label: '',
      column: ''
    },
    {
      Header: 'Cantidad de mujeres',
      accessor: 'mujerCount',
      label: '',
      column: ''
    },
    {
      Header: 'Cantidad de indígenas',
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
    }
  ]
  const onExcelEvent = () => {
    const dataToPrint = [];
    reportData.forEach(d => { d.datos.forEach(d2 => { dataToPrint.push(d2) }) });
    console.log('dataToPrint', dataToPrint)
    const workbook = GenerateExcelObject(dataToPrint)
    SendWorkbookToDownload(workbook, `Historico SCE Estudiantes Por Institucion.xlsx`)
  }

  return (
    <div>
      {console.log('idCircuitoSent', idCircuitoSent)}
      {console.log('idCircuitoSent idRegionSent', idRegionSent)}
      <ReportBar onExcelBtnEvent={onExcelEvent}
        regresarEvent={() => {
          regresarEvent()
          setState(0)
        }} imprimirRef={printRef} showBtn={state === 1}
      />
      {state === 0 && <Parameters showReportEvent={onShowReportEvent} />}
      {state === 1 && <ReporteStyledTableCircuitos innerRef={printRef} data={reportData} idCircuito={idCircuitoSent} idRegion={idRegionSent} columns={columns} title={'Historico SCE Estudiantes Por Institucion'} />}
    </div>

  )
}

export default GetHistoricoEstDivisionAdmin
