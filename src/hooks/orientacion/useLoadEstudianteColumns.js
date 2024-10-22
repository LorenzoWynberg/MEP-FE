import { useMemo } from 'react'
import colors from 'assets/js/colors'
import { useSelector } from 'react-redux'
import { Delete } from '@material-ui/icons'
import Tooltip from '@mui/material/Tooltip'
import { useTranslation } from 'react-i18next'

const useLoadEstudianteColumns = ({
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
					'expediente_ce>orientacion>columns>estudiante>identificacion',
					'Identificación'
				),
				column: 'fechaInsercion',
				accessor: 'fechaInsercion',
				label: ''
			},
			{
				Header: t(
					'expediente_ce>orientacion>columns>estudiante>nombre:',
					'Nombre completo'
				),
				column: 'sb_mecanismoDeteccionDesc',
				accessor: 'sb_mecanismoDeteccionDesc',
				label: ''
			},
			{
				Header: t(
					'expediente_ce>orientacion>columns>estudiante>nacionalidad',
					'Nacionalidad'
				),
				column: 'sb_componenteDesc',
				accessor: 'sb_componenteDesc',
				label: ''
			},
			{
				Header: t(
					'expediente_ce>orientacion>columns>estudiante>genero:',
					'Género'
				),
				column: 'genero',
				accessor: 'genero',
				label: ''
			},
			{
				Header: t(
					'expediente_ce>orientacion>columns>estudiante>fechaNacimiento',
					'Fecha de nacimiento'
				),
				column: 'fechaNacimiento',
				accessor: 'fechaNacimiento',
				label: ''
			},
			{
				Header: t('expediente_ce>orientacion>columns>estudiante>edad', 'Edad'),
				column: 'edad',
				accessor: 'edad',
				label: ''
			},
			{
				Header: t(
					'expediente_ce>orientacion>columns>estudiante>discapacidad',
					'Discapacidad'
				),
				column: 'discapacidad',
				accessor: 'discapacidad',
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
								title={t(
									'expediente_ce>orientacion>columns>acciones>eliminar',
									'Eliminar registro'
								)}
							>
								<Delete
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

export default useLoadEstudianteColumns
