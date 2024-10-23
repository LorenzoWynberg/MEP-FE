import React, { useMemo } from 'react';
import colors from 'assets/js/colors';
import { useSelector } from 'react-redux';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';
import { RemoveRedEyeRounded, Edit } from '@material-ui/icons';
import { RootState } from 'Views/app/director/ExpedienteCentroEducativo/Logros';

const useLoadLogrosColumns = ({
	setModalMode,
	setInitialData,
	setOpenComputoModal,
	permiso
}) => {
	const { t } = useTranslation();

	const state = useSelector((store: RootState) => {
		return {
			selectedYear: store.authUser.selectedActiveYear
		}
	})

	const columns = useMemo(() => {
		return [
			{
				Header: t('', ''),
				column: 'grupo',
				accessor: 'grupo',
				label: ''
			},
			{
				Header: t('', ''),
				column: 'descripcion',
				accessor: 'descripcion',
				label: ''
			},
			{
				Header: t('', ''),
				column: 'publico',
				accessor: 'publico',
				label: ''
			},
			{
				Header: t('', ''),
				column: 'fechaLogro',
				accessor: 'fechaLogro',
				label: ''
			},
			{
				Header: t('', ''),
				column: 'sb_categoriaDesc',
				accessor: 'sb_categoriaDesc',
				label: ''
			},
			{
				Header: t('', ''),
				column: 'sb_disciplinaDesc',
				accessor: 'sb_disciplinaDesc',
				label: ''
			},
			{
				Header: t('', ''),
				column: 'sb_tipoReconocimientoDesc',
				accessor: 'sb_tipoReconocimientoDesc',
				label: ''
			},
			{
				Header: t('', ''),
				column: 'sb_etapa',
				accessor: 'sb_etapa',
				label: ''
			},
			{
				Header: t('', ''),
				column: 'insertadoPor',
				accessor: 'insertadoPor',
				label: ''
			},
			{
				Header: t('', ''),
				column: 'fechaInsercion',
				accessor: 'fechaInsercion',
				label: ''
			},
			{
				Header: t('buscador_ce>buscador>columna_acciones', 'Acciones'),
				column: '',
				accessor: '',
				label: '',
				Cell: ({ _, row, data }) => {
					const fullRow = data[row.index]
					return (
						// @TODO: this should be a component of its own
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
									onClick={() => {
										setModalMode('view') // Set mode to 'view'
										setInitialData(fullRow) // Set the row data for viewing
										setOpenComputoModal(true) // Open the modal
									}}
									style={{
										fontSize: 25,
										color: colors.darkGray,
										cursor: 'pointer'
									}}
								/>
							</Tooltip>
							{!!fullRow.id &&
								!!permiso &&
								!!permiso.modificar &&
								state.selectedYear.esActivo && (
									<Tooltip
										title={t(
											'inventario>columna_acciones>editar',
											'Editar Registro'
										)}
									>
										<Edit
											onClick={() => {
												setModalMode('edit') // Set mode to 'edit'
												setInitialData(fullRow) // Set the row data for editing
												setOpenComputoModal(true) // Open the modal
											}}
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
	}, [t, setModalMode, setInitialData, setOpenComputoModal])

	return { columns }
}

export default useLoadLogrosColumns
