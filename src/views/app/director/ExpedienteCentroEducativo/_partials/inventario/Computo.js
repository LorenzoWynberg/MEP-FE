import axios from 'axios'
import Loader from 'Components/Loader'
import { useSelector } from 'react-redux'
import ComputoModal from './ComputoModal'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { envVariables } from 'Constants/enviroment'
import useNotification from 'Hooks/useNotification'
import useLoadComputoColumns from 'Hooks/inventario/computo/useLoadComputoColumns'
import useLoadComputoSelects from 'Hooks/inventario/computo/useLoadComputoSelects'
import useLoadComputoHistorico from 'Hooks/inventario/computo/useLoadComputoHistorico'
import { TableReactImplementation } from 'Components/TableReactImplementation'

const Computo = props => {
	const { selects, loading: selectsLoading } = useLoadComputoSelects()
	const [openComputoModal, setOpenComputoModal] = useState(false)
	const [nombreDirector, setNombreDirector] = useState('')
	const [initialData, setInitialData] = useState(null)
	const [modalMode, setModalMode] = useState('add')
	const [snackbar, handleClick] = useNotification()
	const [filterText, setFilterText] = useState('')
	const [loading, setLoading] = useState(true)
	const { t } = useTranslation()

	const [snackbarContent, setSnackbarContent] = useState({
		msg: '',
		type: ''
	})

	const {
		data,
		loading: historicoLoading,
		refetch
	} = useLoadComputoHistorico(filterText)

	const state = useSelector(store => {
		return {
			permisos: store.authUser.rolPermisos,
			selectedYear: store.authUser.selectedActiveYear,
			currentInstitution: store.authUser.currentInstitution
		}
	})

	const tienePermiso = state.permisos.find(
		permiso => permiso.codigoSeccion == 'equipoComputo'
	)

	const handleDelete = async id => {
		setLoading(true)
		try {
			await axios.delete(`${envVariables.BACKEND_URL}/api/Inventario/${id}`)
			setSnackbarContent({
				msg: 'Se ha eliminado el registro',
				type: 'warning'
			})
			handleClick()
			refetch() // Refetch despues de borrar
		} catch (error) {
			setSnackbarContent({
				msg: 'Error eliminando el registro',
				type: 'error'
			})
			handleClick()
		} finally {
			setLoading(false)
		}
	}

	const { columns } = useLoadComputoColumns({
		setModalMode, // Callback para settear el modo ('add', 'edit', or 'view')
		setInitialData, // Callback para settear initial data
		setOpenComputoModal, // Callback para abrir modal
		handleDelete, // Callback para borrar un registro
		tienePermiso // Permisos del usuario
	})

	useEffect(() => {
		setLoading(true)
		const fetchDirectorDatos = async () => {
			if (state.currentInstitution?.id) {
				try {
					const response = await axios.get(
						`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/Institucion/GetDatosDirector/${state.currentInstitution.id}`
					)
					const director = response.data
					const nombre = `${director?.nombre} ${director?.primerApellido} ${director?.segundoApellido}`
					if (nombre) {
						setNombreDirector(nombre)
					}
					setLoading(false)
				} catch (error) {
					console.error('Error fetching director datos:', error)
					setLoading(false)
				}
			}
		}
		fetchDirectorDatos()
	}, [state.currentInstitution?.id])

	const [pagination, setPagination] = useState({
		page: 1,
		selectedPageSize: 10,
		selectedColumn: '',
		searchValue: '',
		orderColumn: '',
		orientation: ''
	})

	if (!tienePermiso || !tienePermiso.leer) {
		return <h1>No tiene acceso a este sitio</h1>
	}

	return (
		<div>
			{!loading && !selectsLoading && !historicoLoading ? (
				<>
					{snackbar(snackbarContent.type, snackbarContent.msg)}
					<ComputoModal
						setSnackbarContent={setSnackbarContent}
						handleClick={handleClick}
						nombreDirector={nombreDirector || ''}
						selects={selects}
						open={openComputoModal}
						initialData={initialData}
						idInstitucion={state.currentInstitution.id || ''}
						mode={modalMode}
						handleClose={() => {
							setOpenComputoModal(false)
						}}
						refetch={refetch}
					/>
					<TableReactImplementation
						data={data}
						showAddButton={
							!!tienePermiso &&
							!!tienePermiso.agregar &&
							state.selectedYear.esActivo
						}
						onSubmitAddButton={() => {
							setModalMode('add') // Set mode to "add"
							setInitialData(null) // No initial data for adding
							setOpenComputoModal(true)
						}}
						handleGetData={async (searchValue, _, pageSize, page, column) => {
							setPagination({
								...pagination,
								page,
								pageSize,
								column,
								searchValue
							})
							setFilterText(searchValue ? searchValue : null)
						}}
						columns={columns}
						orderOptions={[]}
						paginationObject={pagination}
						pageSize={pagination.pageSize}
					/>
				</>
			) : (
				<Loader />
			)}
		</div>
	)
}

export default Computo
