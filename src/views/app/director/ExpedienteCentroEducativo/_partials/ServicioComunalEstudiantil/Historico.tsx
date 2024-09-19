import React, { useEffect, useState, useMemo } from 'react'
import { Col, Row } from 'reactstrap'
import { useActions } from 'Hooks/useActions'
import { useSelector } from 'react-redux'
import { ObtenerInfoCatalogos } from 'Redux/formularioCentroResponse/actions'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core'
import { GetServicioComunalByInstitucionId } from 'Redux/configuracion/actions'
import withRouter from 'react-router-dom/withRouter'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import Tooltip from '@mui/material/Tooltip'
import styles from './ServicioComunal.css'
import { desactivarServicioComunal } from 'Redux/auth/actions'
import BarLoader from 'Components/barLoader/barLoader'
import { useHistory } from 'react-router-dom'
import colors from 'assets/js/colors'
import { useTranslation } from 'react-i18next'
import { RemoveRedEyeRounded, Edit } from '@material-ui/icons'
import SimpleModal from 'Components/Modal/simple'
import ModalSCE from './_partials/ModalSCE'
import { Delete } from '@material-ui/icons'
import { filter, get } from 'lodash'

const Historico = props => {
	const [data, setData] = useState([])
	const [filterText, setFilterText] = useState(null)
	const [catalogos, setCatalogos] = React.useState([])
	const [value, setValue] = React.useState(
		catalogos.areasProyecto && catalogos.areasProyecto[0].id
	)
	const [servicioComunalId, setServicioComunalId] = useState()
	const [loading, setLoading] = useState(true)
	const [expediente, setExpediente] = useState(null)
	const { t } = useTranslation()
	const history = useHistory()
	const idInstitucion = localStorage.getItem('idInstitucion')

	const state = useSelector((store: any) => {
		return {
			permisos: store.authUser.rolPermisos,
			selectedYear: store.authUser.selectedActiveYear
		}
	})

	const [pagination, setPagination] = useState({
		page: 1,
		selectedPageSize: 6,
		selectedColumn: '',
		searchValue: '',
		orderColumn: '',
		orientation: ''
	})

	const actions = useActions({
		GetServicioComunalByInstitucionId,
		desactivarServicioComunal
	})
	const fetch = async (idInstitucion, idAreaProyecto = null) => {
		try {
			setLoading(true)
			let url = ''
			if (idAreaProyecto) {
				url = `${idInstitucion}/${state.selectedYear.id}/${filterText}/${idAreaProyecto}`
			} else {
				url = `${idInstitucion}/${state.selectedYear.id}/` + filterText + `/0`
			}
			if (!url) {
				url = `${idInstitucion}/${state.selectedYear.id}/null/0`
			}
			const response: any = await axios.get(
				`${envVariables.BACKEND_URL}/api/ServicioComunal/GetServiciosComunalByFilter/${url}`
			)
			const dataSet = response.data.map(d => {
				return {
					...d,
					descripcion: d.descripcion ? d.descripcion : 'No existe descripción'
				}
			})
			setData(dataSet)
			setLoading(false)
		} catch (e) {
			return { error: e.message, options: [] }
		}
	}

	useEffect(() => {
		fetch(idInstitucion, value)
	}, [idInstitucion, value, filterText, state.selectedYear])

	useEffect(() => {
		ObtenerInfoCatalogos().then(response => {
			setCatalogos(response)
		})
	}, [])

	const tienePermiso = state.permisos.find(
		permiso => permiso.codigoSeccion == 'registrosSCE'
	)

	const columns = useMemo(() => {
		return [
			{
				Header: t('expediente_estudiantil>area_proyecto', 'Area de proyecto'),
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
				Header: t(
					'expediente_estudiantil>cantidadEstudiantes',
					'Cantidad estudiantes'
				),
				column: 'cantidadEstudiantes',
				accessor: 'cantidadEstudiantes',
				label: ''
			},
			{
				Header: t(
					'expediente_estudiantil>fecha_conclusion',
					'Fecha de conclusion'
				),
				column: 'fechaConclusionSCE',
				accessor: 'fechaConclusionSCE',
				label: ''
			},
			{
				Header: t('expediente_estudiantil>fecha_regsitro', 'Fecha de registro'),
				column: 'fechaRegistro',
				accessor: 'fechaRegistro',
				label: ''
			},
			{
				Header: t(
					'expediente_estudiantil>organizacion',
					'Organizacion contraparte'
				),
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
							<Tooltip
								title={t(
									'buscador_ce>buscador>columna_acciones>ficha',
									'Ver ficha del SCE'
								)}
							>
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
							{!fullRow.actaId &&
								tienePermiso &&
								tienePermiso?.modificar == 1 &&
								state.selectedYear.esActivo && (
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
													`/director/expediente-centro/sce/editar/${fullRow.id}`
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
							{fullRow.actaId ||
							!tienePermiso ||
							tienePermiso?.eliminar == 0 ? (
								<></>
							) : (
								<Tooltip
									title={t(
										'expediente_estudiantil>eliminar',
										'Eliminar Expediente'
									)}
								>
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

	return (
		<div className={styles}>
			{loading && <BarLoader />}
			{expediente && (
				<SimpleModal
					title="Eliminar Registro"
					onClose={() => setExpediente(null)}
					onConfirm={() => {
						setLoading(true)
						actions
							.desactivarServicioComunal(expediente.id, history)
							.then(() => {
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
							})
						setExpediente(null)
					}}
					openDialog={expediente}
				>
					{/* TODO: i18n */}
					Está seguro que desea eliminar este registro de Servicio Comunal
					Estudiantil?
				</SimpleModal>
			)}
			{servicioComunalId && tienePermiso && tienePermiso.leer == 1 && (
				<SimpleModal
					btnCancel={false}
					addMarginTitle
					title="Detalle del Servicio comunal estudiantil"
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

			<Row>
				<Col xs={12}>
					<h3 className="mt-2 mb-3">
						{/* {t('expediente_ce>titulo', 'Expediente Centro Educativo')} */}
						Histórico de Servicio comunal estudiantil
					</h3>
				</Col>
				<Col xs={12}>
					<FormControl fullWidth>
						{' '}
						<InputLabel
							style={{ marginLeft: 16 }}
							id="demo-simple-select-label"
						>
							Área de Proyecto
						</InputLabel>
						<Select
							placeholder="Área de Proyecto"
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={value}
							variant="outlined"
							style={{ marginBottom: 16 }}
							label="Área De Proyecto"
							onChange={(e, v) => {
								e.persist()
								setValue(e.target.value)
							}}
						>
							<MenuItem key={0} value={0}>
								{'Todas las áreas'}
							</MenuItem>
							{catalogos?.areasProyecto &&
								catalogos.areasProyecto.map((item, i) => (
									<MenuItem key={i} value={item.id}>
										{item.nombre}
									</MenuItem>
								))}
						</Select>
					</FormControl>
					<TableReactImplementation
						data={data}
						showAddButton={
							tienePermiso &&
							tienePermiso?.agregar == 1 &&
							state.selectedYear.esActivo
						}
						onSubmitAddButton={() => {
							props.history.push('/director/expediente-centro/sce/registro')
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
						pageSize={10}
						backendSearch
					/>
				</Col>
			</Row>
		</div>
	)
}

export default withRouter(Historico)
