import React from 'react'
import Parameters from './Parameters'
import ReportBar from '../../_partials/ReportBar'
import { envVariables } from 'Constants/enviroment'
import axios from 'axios'
import Loader from 'Components/Loader'
import useFiltroReportes from '../../_partials/useFiltroReportes'
import ReporteStyledTable from '../../_partials/ReporteStyledTable'
import { GenerateExcelObject, SendWorkbookToDownload } from 'Utils/excel'

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

	const columns = [
		{
			Header: 'Año de participación',
			accessor: 'annoParticipacion',
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
		const workbook = GenerateExcelObject(reportData)
		SendWorkbookToDownload(workbook, `${title}.xlsx`)
	}
	return (
		<div>
			<ReportBar
				onExcelBtnEvent={onExcelEvent}
				regresarEvent={() => {
					regresarEvent()
					setState(0)
				}}
				imprimirRef={printRef}
				showBtn={state === 1}
			/>
			{loader ? (
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
			) : (
				<ReporteStyledTable innerRef={printRef} data={reportData} columns={columns} title={title} />
			)}
		</div>
	)
}

export default GetHistoricoEstByInstitucionId
