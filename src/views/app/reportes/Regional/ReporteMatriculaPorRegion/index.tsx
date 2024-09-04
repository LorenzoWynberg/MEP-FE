import React from 'react'
import Parameters from './Parameters'
import Reporte from './Reporte'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import ReportBar from '../../_partials/ReportBar'
import { GenerateExcelObject, SendWorkbookToDownload } from 'utils/excel'
const ReporteMatriculaPorCircuito = ({ regresarEvent }) => {
	const [state, setState] = React.useState(0)
	const [reportData, setReportData] = React.useState<any>()
	const [reportParameters, setReportParameters] = React.useState<any>()
	const printRef = React.useRef()
	const [loader, setLoader] = React.useState(false)
	const loadReportData = async (regionId) => {
		try {
			setLoader(true)
			const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/Areas/Reportes/ReportesGenerales/GetInstitucionesbyRegionalId/${regionId}`
			)
			setLoader(false)
			setReportData(response.data)
		} catch (e) {
			console.log(e)
		}
	}

	const onShowReportEvent = (parametros) => {
		// setState(1)
		const { regionId } = parametros
		if (!regionId) return

		loadReportData(regionId.value).then(() => {
			setReportParameters(parametros)
			setState(1)
		})
	}

	const onExcelEvent = () => {
		let reportName =
			'Resumen de estudiantes matriculados por centro educativo - '
		const excelData = reportData.flatMap((circuitoData, index) => {
			if (index == 0) {
				reportName += circuitoData.matriculas[0].regionalNombre
			}
			return circuitoData.matriculas.map((i) => {
				return {
					Circuito: i.circuitoNombre,
					Codigo: i.institucionCodigo,
					'Nombre Centro Educativo': i.institucionNombre,
					Hombres: i.hombres,
					Mujeres: i.mujeres,
					Total: i.total
				}
			})
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
