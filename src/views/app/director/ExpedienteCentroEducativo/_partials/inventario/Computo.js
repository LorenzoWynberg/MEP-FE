import axios from 'axios'
import Loader from 'Components/Loader'
import { useSelector } from 'react-redux'
import ComputoModal from './ComputoModal'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { envVariables } from 'Constants/enviroment'
import useLoadColumns from 'Hooks/inventario/computo/useLoadComputoColumns'
import useLoadSelects from 'Hooks/inventario/computo/useLoadComputoSelects'
import useLoadHistorico from 'Hooks/inventario/computo/useLoadComputoHistorico'
import { TableReactImplementation } from 'Components/TableReactImplementation'

const Computo = props => {
	const [openComputoModal, setOpenComputoModal] = useState(false)
	const { data, loading: historicoLoading, refetch } = useLoadHistorico()
	const { selects, loading: selectsLoading } = useLoadSelects()
	const [nombreDirector, setNombreDirector] = useState('')
	const [loading, setLoading] = useState(true)
	const { columns } = useLoadColumns()
	const { t } = useTranslation()

	const save = async () => {
		setOpenComputoModal(false)
	}

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

	return (
		<div>
			{!loading && !selectsLoading && !historicoLoading ? (
				<>
					<ComputoModal
						nombreDirector={nombreDirector || ''}
						selects={selects}
						open={openComputoModal}
						idInstitucion={state.currentInstitution.id || ''}
						mode="add"
						handleClose={() => {
							setOpenComputoModal(false)
						}}
						refetch={refetch}
					/>
					<TableReactImplementation
						data={data}
						showAddButton={state.selectedYear.esActivo}
						onSubmitAddButton={() => {
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
