import React from 'react'
import Reporte from './Reporte'
import { useEffect } from 'react'
import { GenerateExcelObject, SendWorkbookToDownload } from 'utils/excel'
import Loader from 'Components/Loader'
import { envVariables } from 'Constants/enviroment'
import axios from 'axios'
import ReportBar from '../_partials/ReportBar'
import Parameters from './Parameters'

interface IProps {
	regresarEvent: Function
	type: string
}
const ReportesUsuarios: React.FC<IProps> = (props) => {
	const { regresarEvent, type } = props
	const [reportData, setReportData] = React.useState<any>()
	const printRef = React.useRef()
	const [loader, setLoader] = React.useState(false)
	const [state, setState] = React.useState(0)
	const [reportParameters, setReportParameters] = React.useState<any>()

	const mapper = (item) => {
		return {
			...item,
			identificacion: item.identificacion,
			nombre: item.nombreCompleto,
			roles: '',
			estado: item.estadoNombre
		}
	}

	const loadReportData = async () => {
		try {
			setLoader(true)
			const response = await axios.get<any>(
				`${envVariables.BACKEND_URL}/api/Areas/Reportes/ReportesGenerales/GetUsuarios?identificacion=${id}&type=${type}`
			)
			setLoader(false)
			setReportData(response?.data.map(mapper))
			return response.data
		} catch (e) {
			setLoader(false)
		}
	}
	const onExcelEvent = () => {
		let reportName = `Reporte de usuarios por ${type} - `
		const excelData = reportData.map((i, index) => {
			if (index == 0)
				reportName += `${i.regionalNombre} ${i.circuitoNombre}`

			return {
				identificacion: i.identificacion,
				'Nombre completo': i.nombre,
				'Nombre Centro Educativo': i.institucionNombre,
				roles: i.roles,
				estado: i.estado
			}
		})

		const workbook = GenerateExcelObject(excelData)
		SendWorkbookToDownload(workbook, `${reportName}.xlsx`)
	}
	const onShowReportEvent = (data) => {
		const { id } = data
		if (!id) return

		loadReportData().then(() => {
			setReportParameters(data)
			setState(1)
		})
	}

	return (
		<div>
			<ReportBar
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
			{state === 1 && !loader && (
				<Reporte innerRef={printRef} reportData={reportData} />
			)}
			{loader && (
				<div
					style={{
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
			)}
		</div>
	)
}

export default ReportesUsuarios
