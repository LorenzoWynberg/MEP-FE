import { useMemo } from 'react'
import colors from 'assets/js/colors'
import { useSelector } from 'react-redux'
import { Delete } from '@material-ui/icons'
import Tooltip from '@mui/material/Tooltip'
import { useTranslation } from 'react-i18next'
import { RemoveRedEyeRounded, Edit } from '@material-ui/icons'

const useLoadOrientacionColumns = ({
	setModalMode,
	setInitialData,
	setShowAgregarSesion,
	handleDelete,
	tienePermiso
}) => {
	const { t } = useTranslation()
	const state = useSelector(store => {
		return {
			selectedYear: store.authUser.selectedActiveYear
		}
	})

	const columns = useMemo(() => {
		return [
			{
				Header: t(
					'expediente_ce>orientacion>columns>fechaRegistro',
					'Fecha del registro'
				),
				column: 'fechaInsercion',
				accessor: 'fechaInsercion',
				label: ''
			},
			{
				Header: t(
					'expediente_ce>orientacion>columns>metodo',
					'Método de intervención'
				),
				column: 'sb_mecanismoDeteccionDesc',
				accessor: 'sb_mecanismoDeteccionDesc',
				label: ''
			},
			{
				Header: t('expediente_ce>orientacion>columns>componente', 'Componente'),
				column: 'sb_componenteDesc',
				accessor: 'sb_componenteDesc',
				label: ''
			},
			{
				Header: t(
					'expediente_ce>orientacion>columns>profesionalOrientacion',
					'Profesional en orientación'
				),
				column: 'insertadoPor',
				accessor: 'insertadoPor',
				label: ''
			},
			{
				Header: t('expediente_ce>orientacion>columns>acciones', 'Acciones'),
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
									onClick={() => {
										setModalMode('view') // Set mode to 'view'
										setInitialData(fullRow) // Set the row data for viewing
										setShowAgregarSesion(true) // Open the modal
									}}
									style={{
										fontSize: 25,
										color: colors.darkGray,
										cursor: 'pointer'
									}}
								/>
							</Tooltip>
						</div>
					)
				}
			}
		]
	}, [t, setModalMode, setInitialData, setShowAgregarSesion])

	return { columns }
} //

export default useLoadOrientacionColumns
