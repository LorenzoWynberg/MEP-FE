import React, { useEffect, useState, useMemo } from 'react'
import { Col, Row } from 'reactstrap'
import { useActions } from 'Hooks/useActions'
import { useSelector } from 'react-redux'
import { formatoOracion } from 'utils/utils'
import {
	filterInstitutionsPaginated,
	cleanInstitutions,
	GetServicioComunalByInstitucionId
} from 'Redux/configuracion/actions'
import withRouter from 'react-router-dom/withRouter'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import CancelIcon from '@mui/icons-material/RemoveCircle'
import Tooltip from '@mui/material/Tooltip'
import styles from './ServicioComunal.css'
import { handleChangeInstitution, updatePeriodosLectivos, desactivarServicioComunal } from 'Redux/auth/actions'
import BarLoader from 'Components/barLoader/barLoader'
import { useHistory } from 'react-router-dom'
import colors from 'assets/js/colors'
import { useTranslation } from 'react-i18next'
import { RemoveRedEyeRounded, Edit } from '@material-ui/icons'
import SimpleModal from 'Components/Modal/simple'
import ModalSCE from './_partials/ModalSCE'
import { Delete } from '@material-ui/icons'

const Historico = props => {
	const [data, setData] = useState([])
	const [publicos, setPublicos] = useState(true)
	const [dropdownToggle, setDropdownToggle] = useState(false)
	const [firstCalled, setFirstCalled] = useState(false)
	const [servicioComunalId, setServicioComunalId] = useState()
	const [loading, setLoading] = useState(true)
	const [expediente, setExpediente] = useState(null)
	const { t } = useTranslation()
	const history = useHistory()
	const { hasAddAccess = true, hasEditAccess = true, hasDeleteAccess = true } = props

	const toggle = () => {
		setDropdownToggle(!dropdownToggle)
	}
	const { authUser } = useSelector(store => store.authUser)
	const { accessRole } = useSelector((state: any) => state?.authUser?.currentRoleOrganizacion)
	const idInstitucion = localStorage.getItem('idInstitucion')

	// TODO: mappear los strings
	// const mapper = el => {
	// 	console.log('el', el)
	// 	return {
	// 		...el,
	// 		organizacionContraparte: formatoOracion(el.organizacionContraparte)
	// 	}
	// }

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
		actions
			.GetServicioComunalByInstitucionId(idInstitucion)
			.then(data => {
				// const _data = mapper(data.options)
				// console.log('data', _data)
				setData(data.options)
				setLoading(false)
			})
			.catch(error => {
				console.log('error', error)
				setLoading(false)
			})
	}, [])

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
				Header: t('expediente_estudiantil>modalidad', 'Tipo de proyecto'),
				column: 'modalidadProyecto',
				accessor: 'modalidadProyecto',
				label: ''
			},
			{
				Header: t('expediente_estudiantil>cantidadEstudiantes', 'Cantidad estudiantes'),
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
									<Delete
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
		<div className={styles}>
			{loading && <BarLoader />}
			{expediente && tienePermiso && tienePermiso.leer == 1 && (
				<SimpleModal
					title='Eliminar Registro'
					onClose={() => setExpediente(null)}
					onConfirm={() => {
						setLoading(true)
						actions.desactivarServicioComunal(expediente.id, history)
						setExpediente(null)
						actions
							.GetServicioComunalByInstitucionId(idInstitucion)
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
					{/* TODO: i18n */}
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
					<ModalSCE servicioComunalId={servicioComunalId} />
				</SimpleModal>
			)}

			{!tienePermiso || tienePermiso.leer == 0 ? (
				<Row>
					<Col xs={12}>
						{/* TODO: i18n */}
						<h5>No tiene permiso para visualizar esta pagina</h5>
					</Col>
				</Row>
			) : (
				<Row>
					<Col xs={12}>
						<h3 className='mt-2 mb-3'>
							{/* {t('expediente_ce>titulo', 'Expediente Centro Educativo')} */}
							Histórico de servicio comunal estudiantil
						</h3>
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
										state.accessRole.nivelAccesoId == 3 ? state.accessRole.organizacionId : null,
										state.accessRole.nivelAccesoId == 2 ? state.accessRole.organizacionId : null,
										state.accessRole.nivelAccesoId == 1 ? state.accessRole.organizacionId : null
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
		</div>
	)
}

export default withRouter(Historico)
