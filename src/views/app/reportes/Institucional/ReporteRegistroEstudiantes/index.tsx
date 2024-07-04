import React from 'react'
import Parameters from './Parameters'
import Reporte from './Reporte'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import ReportBar from '../../_partials/ReportBar'
import useFiltroReportes from '../../_partials/useFiltroReportes'
import { GenerateExcelObject, SendWorkbookToDownload } from 'utils/excel'
import { getYearsOld } from 'utils/years'
import moment from 'moment'
import { useSelector } from 'react-redux'
const ReporteRegistroEstudiantes = ({ regresarEvent }) => {
  const [state, setState] = React.useState(0)
  const [reportData, setReportData] = React.useState<any>()
  const [parameters, setParameters] = React.useState<any>()
  const { institucionId } = useFiltroReportes()
  const printRef = React.useRef()
  const [loader, setLoader] = React.useState(false)
  const reduxState = useSelector<any, any>((store) => {
    return {
		  currentInstituion: store.authUser.currentInstitution
    }
	  })
  const loadReportData = async (nivelOfertaId, institucionId) => {
    try {
      setLoader(true)
      const response = await axios.get<any>(
				`${envVariables.BACKEND_URL}/api/Areas/Reportes/ReportesGenerales/GetRegistroEstudiatesByNivelOferta?nivelOferta=${nivelOfertaId}&institucionId=${institucionId}`
      )
      // const uniqueData = _.uniq(response.data)
      setLoader(false)
      setReportData(response.data)
      return response.data
    } catch (e) {
      console.log(e)
    }
  }

  const onShowReportEvent = (parameters) => {
    const { nivelOfertaId } = parameters

    if (!nivelOfertaId) return
    setParameters(parameters)
    loadReportData(nivelOfertaId.value, institucionId).then(() => {
      setState(1)
    })
  }
  const onExcelEvent = () => {
    const shortDate = (date) =>
      moment(date, ['YYYYMMDD', 'DD/MM/YYYY', 'MM/DD/YYYY']).format(
        'DD/MM/YYYY'
      )
    let reportName = 'Reporte de Registro de Estudiantes - '
    reportName += reduxState.currentInstituion?.nombre
    const excelData = reportData.map((i, index) => {
      return {
        '#': index + 1,
        'Número de Identificación': i.identificacion,
        'Tipo de Identificación': i.tipoIdentificacion,
        Nombre: i.nombre,
        'Primer Apellido': i.primerApellido,
        'Segundo Apellido': i.segundoApellido,
        'Fecha de Nacimiento': shortDate(i.fechaNacimiento),
        Edad: getYearsOld(i.fechaNacimiento),
        'Identidad de género': i.sexo,
        Nacionalidad: i.nacionalidad || '',
        Repitente: i.esRepitente ? 'SI' : 'NO',
        Refugiado: i.esRefugiado ? 'SI' : 'NO',
        Discapacidad: !i.discapacidad
          ? 'SIN DISCAPACIDAD'
          : i.discapacidad,
        Especialidad: !i.especialidad
          ? 'SIN ESPECIALIDAD'
          : i.especialidad

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
        }} onExcelBtnEvent={onExcelEvent} imprimirRef={printRef} showBtn={state === 1}
      />
      {state === 0 && <Parameters showReportEvent={onShowReportEvent} reportLoader={loader} />}
      {state === 1 && <Reporte innerRef={printRef} reportData={reportData} parameters={parameters} />}
    </div>
  )
}

export default ReporteRegistroEstudiantes
