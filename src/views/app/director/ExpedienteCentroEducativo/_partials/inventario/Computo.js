import axios from 'axios'
import Loader from 'Components/Loader'
import { useSelector } from 'react-redux'
import ComputoModal from './ComputoModal'
import { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { envVariables } from 'Constants/enviroment'
import useNotification from 'Hooks/useNotification'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import useLoadComputoColumns from 'Hooks/inventario/computo/useLoadComputoColumns'
import useLoadComputoSelects from 'Hooks/inventario/computo/useLoadComputoSelects'
import useLoadComputoHistorico from 'Hooks/inventario/computo/useLoadComputoHistorico'

const Computo = props => {
	const permisos = useSelector(store => store.authUser.rolPermisos)
	const selectedYear = useSelector(store => store.authUser.selectedActiveYear)
	const currentInstitution = useSelector(
		store => store.authUser.currentInstitution
	)

	const { selects, loading: selectsLoading } = useLoadComputoSelects()
	const [openComputoModal, setOpenComputoModal] = useState(false)
	const [nombreDirector, setNombreDirector] = useState('')
	const [initialData, setInitialData] = useState(null)
	const [modalMode, setModalMode] = useState('add')
	const [snackbar, handleClick] = useNotification()
	const { t } = useTranslation()

	const [pagination, setPagination] = useState({
		page: 1,
		pageSize: 4,
		searchValue: ''
	})

	const totalCount = 3

	const [snackbarContent, setSnackbarContent] = useState({
		msg: '',
		type: ''
	})

	const {
		data,
		loading: historicoLoading,
		refetch
	} = useLoadComputoHistorico(pagination)

	const tienePermiso = permisos.find(
		permiso => permiso.codigoSeccion === 'equipoComputo'
	)

	// Memoize handleDelete to maintain stable reference
	const handleDelete = useCallback(
		async id => {
			try {
				await axios.delete(`${envVariables.BACKEND_URL}/api/Inventario/${id}`)
				setSnackbarContent({
					msg: 'Se ha eliminado el registro',
					type: 'warning'
				})
				handleClick()
				refetch() // Refetch with current data
			} catch (error) {
				setSnackbarContent({
					msg: 'Error eliminando el registro',
					type: 'error'
				})
				handleClick()
			}
		},
		[refetch, handleClick]
	)

	const { columns } = useLoadComputoColumns({
		setModalMode, // Callback to set mode ('add', 'edit', or 'view')
		setInitialData, // Callback to set initial data
		setOpenComputoModal, // Callback to open modal
		handleDelete, // Callback to delete a record
		tienePermiso // User permissions
	})

	// Fetch director data
	useEffect(() => {
		const fetchDirectorDatos = async () => {
			if (currentInstitution?.id) {
				try {
					const response = await axios.get(
						`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/Institucion/GetDatosDirector/${currentInstitution.id}`
					)
					const director = response.data
					const nombre = `${director?.nombre} ${director?.primerApellido} ${director?.segundoApellido}`
					if (nombre) {
						setNombreDirector(nombre)
					}
				} catch (error) {
					console.error('Error fetching director datos:', error)
				}
			}
		}
		fetchDirectorDatos()
	}, [currentInstitution?.id])

	// Handle search data fetch
	const handleGetData = (searchValue, _, pageSize, page) => {
		console.log('Handling data fetch with:', { searchValue, pageSize, page })
		setPagination(prev => ({
			...prev,
			page,
			pageSize,
			searchValue
		}))
	}

	if (!tienePermiso || !tienePermiso.leer) {
		return <h1>No tiene acceso a este sitio</h1>
	}

	return (
		<div>
			{!selectsLoading && !historicoLoading ? (
				<>
					{snackbar(snackbarContent.type, snackbarContent.msg)}
					<ComputoModal
						setSnackbarContent={setSnackbarContent}
						handleClick={handleClick}
						nombreDirector={nombreDirector || ''}
						selects={selects}
						open={openComputoModal}
						initialData={initialData}
						idInstitucion={currentInstitution.id || ''}
						mode={modalMode}
						handleClose={() => {
							setOpenComputoModal(false)
						}}
						refetch={() => refetch()} // refetch uses current data
					/>
					<TableReactImplementation
						data={data}
						showAddButton={
							!!tienePermiso && !!tienePermiso.agregar && selectedYear.esActivo
						}
						onSubmitAddButton={() => {
							setModalMode('add')
							setInitialData(null)
							setOpenComputoModal(true)
						}}
						autoResetPage={false}
						handleGetData={handleGetData}
						backendPaginated={true}
						backendSearch={true}
						columns={columns}
						paginationObject={{
							page: pagination.page,
							totalCount: totalCount
						}}
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
