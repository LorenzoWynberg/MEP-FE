import React from 'react'
import Parameters from './Parameters'
import Reporte from './Reporte'
import ReportBar from '../../_partials/ReportBar'
import { envVariables } from 'Constants/enviroment'
import axios from 'axios'
import ReporteStyledTableGeo from '../../_partials/ReporteStyledTableGeo'
import { GenerateExcelObject, SendWorkbookToDownload } from 'Utils/excel'

const GetHistoricoEstDivisionGeog = ({ regresarEvent }) => {
	const [state, setState] = React.useState(0)
	const [values, setValues] = React.useState(0)
	const printRef = React.useRef()
	const [reportData, setReportData] = React.useState<any>()
	const [reportParameters, setReportParameters] = React.useState<any>()
	const title = 'Historico SCE Estudiantes Geografico'
	const loadReportData = async (idProvincia, idCanton, idDistrito) => {
		try {
			const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/ServicioComunal/Reportes/GetHistoricoEstDivisionGeog/${idProvincia}/${idCanton}/${idDistrito}`
			)
			setReportData(response.data)
		} catch (e) {
			console.log(e)
		}
	}
	const columns = [
		{
			Header: 'Provincia',
			accessor: 'idProvincia',
			label: '',
			column: ''
		},
		{
			Header: 'Cantón',
			accessor: 'idCanton',
			label: '',
			column: ''
		},
		{
			Header: 'Distrito',
			accessor: 'idDistrito',
			label: '',
			column: ''
		},
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
			Header: 'Organización contraparte',
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
	const onShowReportEvent = p => {
		let objBase = { label: '', value: 0 }
		const idProvincia = p.idProvincia || objBase
		const idCanton = p.idCanton || objBase
		const idDistrito = p.idDistrito || objBase
		setValues({ idProvincia, idCanton, idDistrito })
		loadReportData(idProvincia.value, idCanton.value, idDistrito.value).then(() => {
			setReportParameters(p)
			setState(1)
		})
	}
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
			{state === 0 && <Parameters showReportEvent={onShowReportEvent} />}
			{state === 1 && (
				<ReporteStyledTableGeo
					innerRef={printRef}
					data={reportData}
					columns={columns}
					title={
						'Resumen de proyectos de Servicio Comunal Estudiantil según división geografica (Provincia, cantón, distrito)'
					}
					headerValues={values}
				/>
			)}
		</div>
	)
}

export default GetHistoricoEstDivisionGeog
