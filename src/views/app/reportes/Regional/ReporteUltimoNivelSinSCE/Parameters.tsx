import React from 'react'
import ReportParameterCard from '../../_partials/ReportParameterCard'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import { uniqWith } from 'lodash'
import useFiltroReportes from '../../_partials/useFiltroReportes'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

const Parameters = ({ showReportEvent, reportLoader = false }) => {
	// const [selects, setSelects] = React.useState(intialState)
	const { t } = useTranslation()
	const initialState = [
		{
			key: 'regionId',
			label: t('gestion_usuario>usuarios>regional', 'Regional'),
			items: [],
			onChange: null
		}
	]
	const [loader, setLoader] = React.useState(false)
	const { setSelectInitialState, setSelectItems, selects } = useFiltroReportes()
	const selectedYear = useSelector(store => store.authUser.selectedActiveYear)
	const fetch = async () => {
		try {
			setLoader(true)
			const response = await axios.get<any>(
				`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/GetAccesibilidadByUsuarioLogeadoId/2`
			)
			setLoader(false)
			const mapeador = item => ({ label: item.nombre, value: item.id })
			const allData = response.data
			const regionales = uniqWith(allData, function (a: any, b: any) {
				return a.idRegiondelCircuito == b.idRegiondelCircuito
			})

			setSelectItems(
				0,
				regionales.map(item => ({
					value: item.idRegiondelCircuito,
					label: item.nombreRegiondelCircuito
				})),
				null
			)
			return response.data
		} catch (e) {
			console.log(e)
		}
	}
	React.useMemo(() => {
		setSelectInitialState(initialState)
		fetch()
	}, [selectedYear])

	return (
		<div>
			<ReportParameterCard
				titulo={t(
					'reportes>circuital>resumen_de_estudiantes_matriculados_por_sin_sce',
					'Resumen de cantidad de estudiantes de último nivel que no han concluido el Servicio Comunal Estudiantil'
				)}
				texto={t('reportes>seleccionar_region', 'Seleccione la Región')}
				selects={selects}
				loader={loader || reportLoader}
				onBtnGenerarEvent={obj => {
					if (showReportEvent) showReportEvent(obj)
				}}
			/>
		</div>
	)
}

export default Parameters
