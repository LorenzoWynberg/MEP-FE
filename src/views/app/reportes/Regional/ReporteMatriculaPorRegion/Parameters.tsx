import React from 'react'
import ReportParameterCard from '../../_partials/ReportParameterCard'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

const Parameters = ({ showReportEvent, reportLoader }) => {
	const { t } = useTranslation()
	const intialState = [
		{
			key: 'regionId',
			label: t('gestion_usuario>usuarios>regional', 'Regional'),
			items: [],
			onChange: null
		}
	]
	const [selects, setSelects] = React.useState(intialState)
	const [loader, setLoader] = React.useState(false)
	const selectedYear = useSelector(store=>store.authUser.selectedActiveYear)
	const fetch = async () => {
		try {
			setLoader(true)
			const response = await axios.get<any>(
				`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/GetAccesibilidadByUsuarioLogeadoId/1`
			)
			const mapeador = (item) => ({ label: item.nombre, value: item.id })
			setSelects([
				{
					...selects[0],
					items: response.data.map(mapeador)
				}
			])
			setLoader(false)
			return response.data
		} catch (e) {
			console.log(e)
		}
	}
	React.useMemo(() => {
		fetch()
	}, [selectedYear])

	return (
		<div>
			<ReportParameterCard
				titulo={t(
					'reportes>regional>resumen_estudiante',
					'Resumen de estudiantes matriculados por centro educativo'
				)}
				texto={t(
					'reportes>regional>seleccione_region',
					'Seleccione la región'
				)}
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
