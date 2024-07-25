import React, { useEffect, useState, useMemo } from 'react'
import { Col, Row, Container } from 'reactstrap'
import AppLayout from 'Layout/AppLayout'
import directorItems from 'Constants/directorMenu'
import { useActions } from 'Hooks/useActions'
import { useSelector } from 'react-redux'
import {
	filterInstitutionsPaginated,
	cleanInstitutions,
	GetServicioComunalByInstitucionId
} from '../../../../redux/configuracion/actions'
import withRouter from 'react-router-dom/withRouter'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import { IoEyeSharp } from 'react-icons/io5'
import CancelIcon from '@mui/icons-material/RemoveCircle'
import Tooltip from '@mui/material/Tooltip'
import TouchAppIcon from '@material-ui/icons/TouchApp'
import BuildIcon from '@mui/icons-material/Build'
import styles from './ServicioComunal.css'
import {
	handleChangeInstitution,
	updatePeriodosLectivos,
	desactivarServicioComunal
} from '../../../../redux/auth/actions'
import BarLoader from 'Components/barLoader/barLoader'
import { useHistory } from 'react-router-dom'
import { CustomInput } from 'Components/CommonComponents'
import colors from 'assets/js/colors'
import { useTranslation } from 'react-i18next'
import { RemoveRedEyeRounded, Edit } from '@material-ui/icons'
import SimpleModal from 'Components/Modal/simple'
import ExpedienteEstudianteSEC from '../ExpedienteCentroEducativo/ModalSCE'

const HistoricoExpediente = props => {
	const [data, setData] = useState([])
	const [publicos, setPublicos] = useState(true)
	const [dropdownToggle, setDropdownToggle] = useState(false)
	const [firstCalled, setFirstCalled] = useState(false)
	const [servicioComunalId, setServicioComunalId] = useState()
	const [loading, setLoading] = useState(false)
	const [expediente, setExpediente] = useState(null)
	const { t } = useTranslation()
	const history = useHistory()

	const { hasAddAccess = true, hasEditAccess = true, hasDeleteAccess = true } = props

	const toggle = () => {
		setDropdownToggle(!dropdownToggle)
	}
	const { authUser } = useSelector(store => store.authUser)
	const { accessRole } = useSelector((state: any) => state?.authUser?.currentRoleOrganizacion)
	const { currentInstitution } = useSelector((store: any) => {
		const currentInstitution = store.authUser.currentInstitution
		return currentInstitution
	})

	const state = useSelector((store: any) => {
		return {
			centros: store.configuracion.instituciones,
			totalCount: store.configuracion.instituciones.totalCount,
			selects: store.selects,
			accessRole: store.authUser.currentRoleOrganizacion.accessRole,
			permisos: store.authUser.rolPermisos
		}
	})

	useEffect(() => {
		setLoading(true)
		const selectedInstitution = JSON.parse(localStorage.getItem('selectedInstitution'))
		actions
			.GetServicioComunalByInstitucionId(selectedInstitution.institucionId)
			.then(data => {
				setData(data.options)
				setLoading(false)
			})
			.catch(error => {
				console.log('error', error)
				setLoading(false)
			})
	}, [accessRole, currentInstitution])
	// TODO: Poner permiso correcto
	const tienePermiso = state.permisos.find(permiso => permiso.codigoSeccion == 'configurarinstituciones')
	const columns = useMemo(() => {
		return [
			{
				Header: t('expediente_estudiantil>area_proyecto', 'Area de Proyecto'),
				column: 'areaProyecto',
				accessor: 'areaProyecto',
				label: ''
			},
			{
				Header: t('expediente_estudiantil>nombre', 'Nombre'),
				column: 'nombreProyecto',
				accessor: 'nombreProyecto',
				label: ''
			},
			{
				Header: t('expediente_estudiantil>modalidad', 'Modalidad'),
				column: 'modalidadProyecto',
				accessor: 'modalidadProyecto',
				label: ''
			},
			{
				Header: t('expediente_estudiantil>cantidadEstudiantes', 'Cantidad Estudiantes'),
				column: 'cantidadEstudiantes',
				accessor: 'cantidadEstudiantes',
				label: ''
			},
			{
				Header: t('expediente_estudiantil>fecha_conclusion', 'Fecha de Conclusion'),
				column: 'fechaConclusionSCE',
				accessor: 'fechaConclusionSCE',
				label: ''
			},
			{
				Header: t('expediente_estudiantil>organizacion', 'Organizacion Contraparte'),
				column: 'organizacionContraparte',
				accessor: 'organizacionContraparte',
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
						<div
							style={{
								display: 'flex',
								placeContent: 'center',
								alignItems: 'center'
							}}
						>
							<Tooltip title={t('buscador_ce>buscador>columna_acciones>ficha', 'Ver ficha del SCE')}>
								<RemoveRedEyeRounded
									onClick={() => {
										setServicioComunalId(fullRow.id)
									}}
									style={{
										fontSize: 25,
										color: colors.darkGray,
										cursor: 'pointer'
									}}
								/>
							</Tooltip>
							{fullRow.actaId || !tienePermiso || tienePermiso?.editar == 0 ? (
								<></>
							) : (
								<Tooltip
									title={
										'Editar'
										// TODO: i18
										// t('buscador_ce>buscador>columna_acciones>ficha', 'Ver ficha del SCE')
									}
								>
									<Edit
										onClick={() => {
											props.history.push(
												`/director/expediente-centro/servicio-comunal/editar/${fullRow.id}`
											)
										}}
										style={{
											fontSize: 25,
											color: colors.darkGray,
											cursor: 'pointer'
										}}
									/>
								</Tooltip>
							)}
							{fullRow.actaId || !tienePermiso || tienePermiso?.eliminar == 0 ? (
								<></>
							) : (
								<Tooltip title={t('expediente_estudiantil>eliminar', 'Eliminar Expediente')}>
									<CancelIcon
										onClick={() => {
											setExpediente(fullRow)
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
	}, [t])

	const [pagination, setPagination] = useState({
		page: 1,
		selectedPageSize: 6,
		selectedColumn: '',
		searchValue: '',
		orderColumn: '',
		orientation: ''
	})

	const actions = useActions({
		filterInstitutionsPaginated,
		cleanInstitutions,
		GetServicioComunalByInstitucionId,
		handleChangeInstitution,
		updatePeriodosLectivos,
		desactivarServicioComunal
	})

	useEffect(() => {
		setFirstCalled(true)
		return () => {
			actions.cleanInstitutions()
		}
	}, [])

	const setInstitution = async id => {
		await actions.handleChangeInstitution(id)
		await actions.updatePeriodosLectivos(id)
	}

	return (
		<AppLayout className={styles} items={directorItems}>
			<div className='dashboard-wrapper'>
				{loading && <BarLoader />}
				{expediente && tienePermiso && tienePermiso.leer == 1 && (
					<SimpleModal
						title='Eliminar Registro'
						onClose={() => setExpediente(null)}
						onConfirm={() => {
							setLoading(true)
							actions.desactivarServicioComunal(expediente.id, history)
							setExpediente(null)
							const selectedInstitution = JSON.parse(localStorage.getItem('selectedInstitution'))
							actions
								.GetServicioComunalByInstitucionId(selectedInstitution.institucionId)
								.then(data => {
									setData(data.options)
									setLoading(false)
								})
								.catch(error => {
									console.log('error', error)
									setLoading(false)
								})
						}}
						openDialog={expediente}
					>
						Está seguro que desea eliminar este registro de Servicio Comunal Estudiantil?
					</SimpleModal>
				)}
				{servicioComunalId && tienePermiso && tienePermiso.leer == 1 && (
					<SimpleModal
						btnCancel={false}
						addMarginTitle
						title='Detalle del Servicio Comunal'
						onClose={() => setServicioComunalId(null)}
						stylesContent={{}}
						onConfirm={() => {
							setServicioComunalId(null)
						}}
						openDialog={servicioComunalId}
					>
						<ExpedienteEstudianteSEC servicioComunalId={servicioComunalId} />
					</SimpleModal>
				)}

				<Container>
					{!tienePermiso || tienePermiso.leer == 0 ? (
						<Row>
							<Col xs={12}>
								<h5>No tiene permiso para visualizar esta pagina</h5>
							</Col>
						</Row>
					) : (
						<Row>
							<Col xs={12}>
								<h3>{t('expediente_ce>titulo', 'Expediente Centro Educativo')}</h3>
							</Col>
							<Col xs={12}>
								<TableReactImplementation
									data={data}
									showAddButton
									// avoidSearch
									onSubmitAddButton={() => {
										props.history.push('/director/expediente-centro/servicio-comunal/registro')
									}}
									handleGetData={async (searchValue, _, pageSize, page, column) => {
										setPagination({
											...pagination,
											page,
											pageSize,
											column,
											searchValue
										})

										if (firstCalled) {
											setLoading(true)
											await actions.getInstitucionesFinder(
												publicos,
												searchValue,
												1,
												250,
												state.accessRole.nivelAccesoId == 3
													? state.accessRole.organizacionId
													: null,
												state.accessRole.nivelAccesoId == 2
													? state.accessRole.organizacionId
													: null,
												state.accessRole.nivelAccesoId == 1
													? state.accessRole.organizacionId
													: null
											)
											setLoading(false)
										}
									}}
									columns={columns}
									orderOptions={[]}
									pageSize={10}
									backendSearch
								/>
							</Col>
						</Row>
					)}
				</Container>
			</div>
		</AppLayout>
	)
}

export default withRouter(HistoricoExpediente)
