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
	const title = 'Reporte Historico de SCE por Institución'

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
			Header: 'Año',
			accessor: 'annoParticipacion',
			label: '',
			column: ''
		},
		{
			Header: 'Área de Proyecto',
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
			Header: 'Personas con discapacidad',
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
			Header: 'Refugiados',
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
		const dataToPrint = []
		reportData.forEach(d => {
			d.datos.forEach(d2 => {
				dataToPrint.push(d2)
			})
		})
		const workbook = GenerateExcelObject(dataToPrint)
		SendWorkbookToDownload(workbook, `${title}.xlsx`)
	}
	return (
		<div>
			{!loader && (
				<ReportBar
					onExcelBtnEvent={onExcelEvent}
					regresarEvent={() => {
						regresarEvent()
						setState(0)
					}}
					imprimirRef={printRef}
					showBtn={state === 0}
				/>
			)}
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
				<ReporteStyledTableAnno
					innerRef={printRef}
					data={reportData}
					columns={columns}
					title={'Resumen de proyectos de Servicio Comunal Estudiantil en el centro educativo por año.'}
				/>
			)}
		</div>
	)
}

export default GetHistoricoEstByInstitucionId
