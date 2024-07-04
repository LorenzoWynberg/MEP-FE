import React from 'react'
import Reporte from './Reporte'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import ReportBar from '../_partials/ReportBar'
import useFiltroReportes from '../_partials/useFiltroReportes'
import Loader from 'Components/Loader'
import { GenerateExcelObject, SendWorkbookToDownload } from 'utils/excel'
import { useSelector } from 'react-redux'
import { getYearsOld } from '../../../../utils/years'
import moment from 'moment'

const ReporteRegistroEstudiantes = ({ nivelOfertaId, dataNivel }) => {
	const [state, setState] = React.useState(0)
	const [reportData, setReportData] = React.useState<any>()
	const printRef = React.useRef()
	const [loader, setLoader] = React.useState(false)
	const { institucionId } = useFiltroReportes()

	const reduxState = useSelector<any, any>((store) => {
		return {
			currentInstituion: store.authUser.currentInstitution
		}
	})

	const mapper = (item) => {
		const shortDate = (date) =>
			moment(date, ['YYYYMMDD', 'DD/MM/YYYY', 'MM/DD/YYYY']).format(
				'DD/MM/YYYY'
			)

		let genero = JSON.parse(item.genero)
		return {
			...item,
			identificacion: item.identificacion,

			nombre: item.nombre,
			primerApellido: item.primerApellido,
			segundoApellido: item.segundoApellido,
			fechaNacimiento: shortDate(item.fechaNacimiento),
			edad: getYearsOld(item.fechaNacimiento),
			genero: Array.isArray(genero) ? genero[0].Nombre : '',
			condicionMatricula: item.estadoNombre,
			condicionFinal: item.condicionFinal ? item.condicionFinal : '-'
		}
	}

	const loadReportData = async () => {
		if (!institucionId) return
		try {
			setLoader(true)
			const response = await axios.get<any>(
				`${envVariables.BACKEND_URL}/api/Areas/Reportes/ReportesGenerales/GetEstudiantesCensoFinal?nivelOferta=${nivelOfertaId}&InstitucionId=${institucionId}`
			)
			setLoader(false)
			setReportData(response?.data.map(mapper))
			return response.data
		} catch (e) {
			setLoader(false)
		}
	}

	React.useEffect(() => {
		loadReportData().then(() => {
			setState(1)
		})
	}, [institucionId])

	const onExcelEvent = () => {
		let reportName = 'Censo Final - '
		
		reportName += reduxState.currentInstituion?.nombre
		const excelData = reportData.map((i, index) => {
			return {
				'Número de identificación': i.identificacion,
				Nombre: i.nombre,
				'Primer apellido': i.primerApellido,

				'Segundo apellido': i.segundoApellido,
				'Fecha de nacimiento': i.fechaNacimiento,
				Edad: i.edad,
				'Identidad de género': i.genero,
				'Condición matrícula': i.condicionMatricula,
				'Condición final': i.condicionFinal
			}
		})

		const workbook = GenerateExcelObject(excelData)
		SendWorkbookToDownload(workbook, `${reportName}.xlsx`)
	}
	return (
		<div>
			<ReportBar
				onExcelBtnEvent={onExcelEvent}
				imprimirRef={printRef}
				showBtn={state === 1}
			/>
			{/*state === 0 && <Parameters showReportEvent={onShowReportEvent} />*/}
			{state === 1 && !loader && (
				<Reporte
					innerRef={printRef}
					reportData={reportData}
					ofertaLabel={dataNivel}
				/>
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

export default ReporteRegistroEstudiantes
