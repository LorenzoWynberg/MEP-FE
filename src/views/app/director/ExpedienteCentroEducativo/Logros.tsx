import axios from 'axios'
import React, { FC, useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import Loader from 'Components/Loader'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import ContentTab from 'Components/Tab/Content'
import HeaderTab from 'Components/Tab/LinkedHeader'
import { envVariables } from 'Constants/enviroment'
import Notification from '../../../../Hoc/Notificaction'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import useLoadLogrosColumns from 'hooks/logros/useLoadLogrosColumns'

interface LogrosProps {
	activeTab: number;
}

export interface RootState {
	authUser: {
		rolPermisos: {
			codigoSeccion: string;
			agregar: boolean;
		}[]
		selectedActiveYear: {
			esActivo: boolean;
		}
		currentInstitution: string;
	};
	selects: object;
}

const Logros: FC<LogrosProps> = ({ activeTab }) => {
	const [loading, setLoading] = useState(true)
	const [modalMode, setModalMode] = useState('add');
	const [initialData, setInitialData] = useState(null);
	const [openComputoModal, setOpenComputoModal] = useState(false);
	const [pagination, setPagination] = useState({
		page: 1,
		selectedPageSize: 10,
		selectedColumn: '',
		searchValue: '',
		orderColumn: '',
		orientation: '',
		// Required by type
		totalCount: 10,
	});
	const [filterText, setFilterText] = useState('')
	
	const { t } = useTranslation();
	
	const state = useSelector((state: RootState) => ({
		permisos: state.authUser.rolPermisos,
		selectedYear: state.authUser.selectedActiveYear,
		currentInstitution: state.authUser.currentInstitution,
		selects: state.selects,
	}));
	
	const permiso = state.permisos.find(
		permiso => permiso.codigoSeccion == 'equipoComputo'
	)
	const optionsTab = [
		{
			title: 'Logros',
			path: '/director/expediente-centro/logros-y-participaciones/historico/logros'
		},
		{
			title: 'Participaciones nivel 2',
			path: '/director/expediente-centro/logros-y-participaciones/historico/participaciones-nivel-2'
		},
		{
			title: 'Participaciones nivel 1',
			path: '/director/expediente-centro/logros-y-participaciones/historico/participaciones-nivel-1'
		},
		{
			title: 'Mantenimiento',
			path: '/director/expediente-centro/logros-y-participaciones/mantenimiento'
		}
	]

	useEffect(() => {
		const loadData = async () => {
			try {
				const response = await axios.get(
					`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/TipoCatalogo`
				)
				console.log('lore response catalogos', response)
			} catch (error) {
				console.error('Error loading catalogos:', error)
				setLoading(false)
			}
		}
		loadData()
		console.log('lore selects', state.selects)
		console.log('lore institucion', state.currentInstitution)
	}, [])

	if (loading) <Loader />


	// temporary definition so component stops screaming
	let data: [];
	const { columns } = useLoadLogrosColumns({
		setModalMode, // Callback para settear el modo ('add', 'edit', or 'view')
		setInitialData, // Callback para settear initial data
		setOpenComputoModal, // Callback para abrir modal
		permiso // Permisos del usuario
	})	
	
	return (
		<Notification>
			{showSnackbar => (
				<>
					<Helmet>
						<title>{t('logros>titulo', 'Logros y participaciones')}</title>
					</Helmet>
					<h4>{t('logros>titulo', 'Logros y participaciones')}</h4>
					<HeaderTab options={optionsTab} activeTab={activeTab} />
					<ContentTab activeTab={activeTab} numberId={activeTab}>
						<h1>{optionsTab[activeTab].title}</h1>
						{activeTab === 0 && <TableReactImplementation
							data={data}
							showAddButton={
								!!permiso &&
								!!permiso.agregar &&
								state.selectedYear.esActivo
							}
							onSubmitAddButton={() => {
								setModalMode('add') // Set mode to "add"
								setInitialData(null) // No initial data for adding
								setOpenComputoModal(true)
							}}
							handleGetData={async (searchValue, _, selectedPageSize, page, selectedColumn) => {
								setPagination({
									...pagination,
									page,
									selectedPageSize,
									selectedColumn,
									searchValue
								})
								setFilterText(searchValue ? searchValue : null)
							}}
							columns={columns}
							orderOptions={[]}
							paginationObject={pagination}
							pageSize={pagination.selectedPageSize}
						/>}
					</ContentTab>
				</>
			)}
		</Notification>
	)
}

export default Logros
