import React from 'react'
import ReportParameterCard from '../_partials/ReportParameterCard'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import { uniqWith } from 'lodash'
import useFiltroReportes from '../_partials/useFiltroReportes'

const initialState = [
	{
		key: 'regionId',
		label: 'Regional',
		items: [],
		onChange: null
	},
	{
		key: 'circuitoId',
		label: 'Circuito',
		items: [],
		onChange: null
	}
]

const Parameters = ({ showReportEvent, reportLoader = false }) => {
	//const [selects, setSelects] = React.useState(intialState)
	const [loader, setLoader] = React.useState(false)
	const { setSelectInitialState, setSelectItems, selects } =
		useFiltroReportes()
	const fetch = async () => {
		try {
			setLoader(true)
			const response = await axios.get<any>(
				`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/GetAccesibilidadByUsuarioLogeadoId/2`
			)
			setLoader(false)
			const mapeador = (item) => ({ label: item.nombre, value: item.id })
			const allData = response.data
			const regionales = uniqWith(allData, function (a: any, b: any) {
				return a.idRegiondelCircuito == b.idRegiondelCircuito
			})
			const onChangeRegion = (obj) => {
				const filtrado = allData
					.filter((item) => item.idRegiondelCircuito == obj.value)
					.map(mapeador)
				setSelectItems(1, filtrado, null)
			}
			setSelectItems(
				0,
				regionales.map((item) => ({
					value: item.idRegiondelCircuito,
					label: item.nombreRegiondelCircuito
				})),
				onChangeRegion
			)
			return response.data
		} catch (e) {
			console.log(e)
		}
	}
	React.useMemo(() => {
		setSelectInitialState(initialState)
		fetch()
	}, [])

	return (
		<div>
			<ReportParameterCard
				titulo="Resumen de estudiantes matriculados por centro educativo"
				texto="Seleccione el circuito"
				selects={selects}
				loader={loader || reportLoader}
				onBtnGenerarEvent={(obj) => {
					if (showReportEvent) showReportEvent(obj)
				}}
			/>
		</div>
	)
}

export default Parameters
