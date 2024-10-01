import React from 'react'
import axios from 'axios'
import { isEmpty } from 'lodash'
import colors from 'assets/js/colors'
import Loader from 'Components/Loader'
import { useSelector } from 'react-redux'
import { Delete } from '@material-ui/icons'
import Tooltip from '@mui/material/Tooltip'
import { useActions } from 'Hooks/useActions'
import { useTranslation } from 'react-i18next'
import { envVariables } from 'Constants/enviroment'
import { useEffect, useState, useMemo } from 'react'
import { RemoveRedEyeRounded, Edit } from '@material-ui/icons'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import { getDatosDirector, clearDatosDirector } from 'Redux/institucion/actions'

const Computo = props => {
	const actions = useActions({ clearDatosDirector, getDatosDirector })
	const [data, setData] = useState([])
	const [loading, setLoading] = useState(true)
	const { t } = useTranslation()

	const state = useSelector(store => {
		return {
			selectedYear: store.authUser.selectedActiveYear,
			currentInstitution: store.authUser.currentInstitution
		}
	})

	useEffect(() => {
		console.log('LORE', state.selectedYear)
		const loadData = async () => {
			const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/Inventario/ListarInventarioByInstitucionId/${state.currentInstitution.id}`
			)
			if (!isEmpty(response.data)) {
				setData(response.data)
			}
			setLoading(false)
		}
		loadData()
	}, [state.currentInstitution.id])

	const [pagination, setPagination] = useState({
		page: 1,
		selectedPageSize: 10,
		selectedColumn: '',
		searchValue: '',
		orderColumn: '',
		orientation: ''
	})

	const columns = useMemo(() => {
		return [
			{
				Header: t('inventario>computo>tipo_activo', 'Tipo de activo'),
				column: 'sb_tipoActivo',
				accessor: 'sb_tipoActivo',
				label: ''
			},
			{
				Header: t('inventario>computo>serie', 'Serie'),
				column: 'serie',
				accessor: 'serie',
				label: ''
			},
			{
				Header: t('inventario>computo>placa', 'Placa'),
				column: 'placa',
				accessor: 'placa',
				label: ''
			},
			{
				Header: t('inventario>computo>fuente', 'Fuente'),
				column: 'sb_fuente',
				accessor: 'sb_fuente',
				label: ''
			},
			{
				Header: t('inventario>computo>condicion', 'Condición'),
				column: 'sb_condicion',
				accessor: 'sb_condicion',
				label: ''
			},
			{
				Header: t('inventario>computo>ubicacion', 'Ubicación'),
				column: 'sb_ubicacion',
				accessor: 'sb_ubicacion',
				label: ''
			},
			{
				Header: t('inventario>computo>utilizada', 'Utilizada'),
				column: 'utilizada',
				accessor: 'utilizada',
				label: '',
				Cell: ({ _, row, data }) => {
					const fullRow = data[row.index]
					const val = fullRow.utilizada ? 'Si' : 'No'
					return val
				}
			},
			{
				Header: t(
					'inventario>computo>para_donar',
					'¿Puede ser donada a otro centro educativo?'
				),
				column: 'paraDonar',
				accessor: 'paraDonar',
				label: '',
				Cell: ({ _, row, data }) => {
					const fullRow = data[row.index]
					const val = fullRow.utilizada ? 'Si' : 'No'
					return val
				}
			},
			{
				Header: t('buscador_ce>buscador>columna_acciones', 'Acciones'),
				column: '',
				accessor: '',
				label: '',
				Cell: ({ _, row, data }) => {
					const fullRow = data[row.index]
					return (
						<div
							style={{
								display: 'flex',
								placeContent: 'center',
								alignItems: 'center'
							}}
						>
							<Tooltip
								title={t('inventario>columna_acciones>ver', 'Ver registro')}
							>
								<RemoveRedEyeRounded
									onClick={() => {}}
									style={{
										fontSize: 25,
										color: colors.darkGray,
										cursor: 'pointer'
									}}
								/>
							</Tooltip>
							{fullRow.id && state.selectedYear.esActivo && (
								<Tooltip
									title={t(
										'inventario>columna_acciones>editar',
										'Editar Registro'
									)}
								>
									<Edit
										onClick={() => {}}
										style={{
											fontSize: 25,
											color: colors.darkGray,
											cursor: 'pointer'
										}}
									/>
								</Tooltip>
							)}
							{fullRow.id && (
								<Tooltip
									title={t(
										'inventario>columna_acciones>eliminar',
										'Eliminar Registro'
									)}
								>
									<Delete
										onClick={() => {}}
										style={{
											fontSize: 25,
											color: colors.darkGray,
											cursor: 'pointer'
										}}
									/>
								</Tooltip>
							)}
						</div>
					)
				}
			}
		]
	}, [t])

	return (
		<div>
			{!loading ? (
				<TableReactImplementation
					data={data}
					showAddButton={state.selectedYear.esActivo}
					onSubmitAddButton={() => {}}
					handleGetData={async (searchValue, _, pageSize, page, column) => {
						setPagination({
							...pagination,
							page,
							pageSize,
							column,
							searchValue
						})
					}}
					columns={columns}
					orderOptions={[]}
					pageSize={pagination.pageSize}
					backendSearch
				/>
			) : (
				<Loader />
			)}
		</div>
	)
}

export default Computo
