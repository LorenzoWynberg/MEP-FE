import React, { useState, useEffect, useMemo } from 'react'
import { connect, useSelector } from 'react-redux'
import { Colxx, Separator } from 'Components/common/CustomBootstrap'
import Breadcrumb from 'Containers/navs/Breadcrumb'
import { cleanIdentity } from '../../../../redux/identificacion/actions'
import swal from 'sweetalert'

import {
	cleanStudentsFilter,
	getStudentFilterExpediente,
	changeColumn,
	changeFilterOption,
	loadStudent
} from '../../../../redux/expedienteEstudiantil/actions'
import { Dropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap'
import BuscadorTable from 'Components/buscador-table'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import { IoEyeSharp } from 'react-icons/io5'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import BarLoader from 'Components/barLoader/barLoader.tsx'
import Typography from '@material-ui/core/Typography'
import { useTranslation } from 'react-i18next'

const Buscador = props => {
	const { t } = useTranslation()

	const { estudiantes, cleanIdentity, cleanStudentsFilter, buscador, changeColumn, changeFilterOption, loadStudent } =
		props
	const [dataestudiantes, setDataestudiantes] = useState([])
	const [loading, setLoading] = useState(false)

	const [filterIndex, setFilterIndex] = useState(0)
	const [pagination, setPagination] = useState({
		page: 1,
		selectedPageSize: 6,
		selectedColumn: '',
		searchValue: '',
		orderColumn: '',
		orientation: '',
		filterPor: 'nombre'
	})
	const [openModalExpediente, setOpenModalExpediente] = useState(false)
	const state = useSelector(store => {
		return {
			institution: store.authUser.currentInstitution
		}
	})
	useEffect(() => {
		cleanIdentity()
		setDataestudiantes(estudiantes)
	}, [cleanIdentity, estudiantes])

	useEffect(() => {
		return () => {
			cleanStudentsFilter()
		}
	}, [cleanStudentsFilter])

	const getDataFilter = async filterText => {
		let response = null
		setLoading(true)
		response = await props.getStudentFilterExpediente(filterText, 1, 100, state.institution?.id)
		setLoading(false)
		if (response.data.length === 0) {
			swal({
				icon: 'info',
				text: t(
					'estudiantes>expediente>msj_no_encontrado',
					'El estudiante no está matriculado en este centro educativo'
				),
				buttons: {
					ok: {
						text: t('general>aceptar', 'Aceptar'),
						value: true
					}
				}
			})
		}

		if (response.data.length === 1) {
			if (response.data[0].fallecido) {
				swal({
					icon: 'info',
					text: t(
						'estudiantes>expediente>msj_fallecido',
						'La persona estudiante que está consultando se encuentra registrada como FALLECIDA, por lo cual hay funcionalidades en el sistema que solamente son de consulta.'
					),
					buttons: {
						ok: {
							text: t('general>aceptar', 'Aceptar'),
							value: true
						}
					}
				})
			}
		}
	}

	const onSelectRow = async data => {
		await loadStudent(data)
		props.history.push('/director/expediente-estudiante/inicio')
		if (data.fallecido) {
			swal({
				icon: 'info',
				text: t(
					'estudiantes>expediente>msj_fallecido',
					'La persona estudiante que está consultando se encuentra registrada como FALLECIDA, por lo cual hay funcionalidades en el sistema que solamente son de consulta.'
				),
				buttons: {
					ok: {
						text: t('general>aceptar', 'Aceptar'),
						value: true
					}
				}
			})
		}
	}

	const columns = useMemo(() => {
		return [
			{
				Header: t('estudiantes>expediente>buscador>col_nom_ape', 'Nombre / Apellidos'),
				column: 'nombreEstudiante',
				accessor: 'nombreEstudiante',
				label: 'nombreEstudiante'
			},
			{
				Header: t('estudiantes>expediente>buscador>col_identificacion', 'Identificación'),
				column: 'identificacion',
				accessor: 'identificacion',
				label: 'identificacion'
			},
			{
				Header: t('estudiantes>expediente>buscador>col_ce', 'Centro educativo'),
				column: 'institucion',
				accessor: 'institucion',
				label: 'institucion'
			},
			{
				Header: t('estudiantes>expediente>buscador>col_tipo_ce', 'Tipo de centro educativo'),
				column: 'tipoInstitucion',
				accessor: 'tipoInstitucion',
				label: 'tipoInstitucion'
			},
			{
				Header: t('estudiantes>expediente>buscador>col_reg_circ', 'Regional / Circuito'),
				column: 'regional',
				accessor: 'regional',
				label: 'regional'
			},
			{
				Header: t('general>acciones', 'Acciones'),
				column: 'actions',
				accessor: 'actions',
				label: t('general>acciones', 'Acciones'),
				Cell: ({ _, row, data }) => {
					const fullRow = data[row.index]
					return (
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								alignContent: 'center'
							}}
						>
							<button
								style={{
									border: 'none',
									background: 'transparent',
									cursor: 'pointer',
									color: 'grey'
								}}
								onClick={() => onSelectRow(fullRow)}
							>
								<Tooltip title={t('estudiantes>expediente>buscador>col_acciones>ver', 'Ver')}>
									<IconButton>
										<IoEyeSharp style={{ fontSize: 30 }} />
									</IconButton>
								</Tooltip>
							</button>
						</div>
					)
				}
			}
		]
	}, [dataestudiantes, t])

	if (state.institution?.id == -1) {
		return (
			<>
				<Typography variant='h5' className='mb-3'>
					{t(
						'estudiantes>traslados>gestion_traslados>seleccionar',
						'Debe seleccionar un centro educativo en el buscador de centros educativos.'
					)}
				</Typography>
			</>
		)
	}

	return (
		<div>
			{loading && <BarLoader />}
			<div>
				<Colxx xxs='12'>
					<Breadcrumb
						heading={t('estudiantes>expediente>buscador>titulo', 'Buscador de expediente estudiantil')}
						match={props.match}
						hidePath
					/>
					<br />
					<Separator className='mb-4' />
				</Colxx>

				<div
					style={{
						display: 'flex',
						justifyContent: 'flex-end'
					}}
				/>

				<TableReactImplementation
					data={dataestudiantes}
					columns={columns}
					handleGetData={(searchValue, filterColumn, pageSize, page, column) => {
						getDataFilter(searchValue)
					}}
					pageSize={10}
					backendSearch
					mensajeSinRegistros={props.mensajeSinRegistros}
				/>
			</div>
		</div>
	)
}

const mapStateToProps = reducers => {
	return {
		...reducers.expedienteEstudiantil
	}
}

const mapActionsToProps = {
	getStudentFilterExpediente,
	cleanIdentity,
	cleanStudentsFilter,
	changeColumn,
	changeFilterOption,
	loadStudent
}

export default connect(mapStateToProps, mapActionsToProps)(Buscador)
