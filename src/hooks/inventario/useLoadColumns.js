import { useMemo } from 'react'
import colors from 'assets/js/colors'
import { useSelector } from 'react-redux'
import { Delete } from '@material-ui/icons'
import Tooltip from '@mui/material/Tooltip'
import { useTranslation } from 'react-i18next'
import { RemoveRedEyeRounded, Edit } from '@material-ui/icons'

const useLoadColumns = () => {
	const { t } = useTranslation()
	const state = useSelector(store => {
		return {
			selectedYear: store.authUser.selectedActiveYear
		}
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

	return { columns }
}

export default useLoadColumns
