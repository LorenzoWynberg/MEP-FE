import axios from 'axios'
import Loader from 'Components/Loader'
import { useSelector } from 'react-redux'
import ComputoModal from './ComputoModal'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { envVariables } from 'Constants/enviroment'
import useLoadComputoColumns from 'Hooks/inventario/computo/useLoadComputoColumns'
import useLoadComputoSelects from 'Hooks/inventario/computo/useLoadComputoSelects'
import useLoadComputoHistorico from 'Hooks/inventario/computo/useLoadComputoHistorico'
import { TableReactImplementation } from 'Components/TableReactImplementation'

const Computo = props => {
	const { data, loading: historicoLoading, refetch } = useLoadComputoHistorico()
	const [openComputoModal, setOpenComputoModal] = useState(false)
	const { selects, loading: selectsLoading } = useLoadComputoSelects()
	const [nombreDirector, setNombreDirector] = useState('')
	const [initialData, setInitialData] = useState(null)
	const [modalMode, setModalMode] = useState('add')
	const [loading, setLoading] = useState(true)
	const { t } = useTranslation()

	const { columns } = useLoadComputoColumns({
		setModalMode, // Callback para settear el modo ('add', 'edit', or 'view')
		setInitialData, // Callback para settear initial data
		setOpenComputoModal // Callback para abrir modal
	})

	const state = useSelector(store => {
		return {
			selectedYear: store.authUser.selectedActiveYear,
			currentInstitution: store.authUser.currentInstitution
		}
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

	// console.log('LORE', data)

	return (
		<div>
			{!loading && !selectsLoading && !historicoLoading ? (
				<>
					<ComputoModal
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
						showAddButton={state.selectedYear.esActivo}
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
						}}
						// paginationObject={pagination}
						columns={columns}
						orderOptions={[]}
						paginationObject={pagination}
						pageSize={pagination.pageSize}
						backendSearch
					/>
				</>
			) : (
				<Loader />
			)}
		</div>
	)
}

export default Computo
