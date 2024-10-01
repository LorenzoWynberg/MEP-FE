import Loader from 'Components/Loader'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useActions } from 'Hooks/useActions'
import { useTranslation } from 'react-i18next'
import useLoadColumns from 'Hooks/inventario/useLoadColumns'
import useLoadSelects from 'Hooks/inventario/useLoadSelects'
import useLoadHistorico from 'Hooks/inventario/useLoadHistorico'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import { getDatosDirector, clearDatosDirector } from 'Redux/institucion/actions'

const Modal = props => {
	return <div>Modal</div>
}

const Computo = props => {
	const { data, loading: historicoLoading } = useLoadHistorico()
	const { selects, loading: selectsLoading } = useLoadSelects()
	const [showModal, setShowModal] = useState(false)
	const [loading, setLoading] = useState(true)
	const { columns } = useLoadColumns()
	const { t } = useTranslation()

	const actions = useActions({
		clearDatosDirector,
		getDatosDirector
	})

	const loadDatosDirector = async () => {
		return await actions.getDatosDirector(store.authUser.currentInstitution)
	}

	const state = useSelector(store => {
		return {
			selectedYear: store.authUser.selectedActiveYear,
			currentInstitution: store.authUser.currentInstitution
		}
	})

	useEffect(() => {}, [])

	useEffect(() => {
		console.log('LOREDIRECTOR', loadDatosDirector())
	}, [state.currentInstitution?.id])

	useEffect(() => {
		console.log('LOREPROPS', props)
		console.log('LORESELECTS', selects)
		setLoading(false)
	}, [selects])

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
			{!loading ?? !selectsLoading ?? !historicoLoading ? (
				<>
					{showModal && <Modal />}
					<TableReactImplementation
						data={data}
						showAddButton={state.selectedYear.esActivo}
						onSubmitAddButton={() => {
							setShowModal(true)
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
						columns={columns}
						orderOptions={[]}
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
