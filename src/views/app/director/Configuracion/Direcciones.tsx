import React, { useEffect, useMemo } from 'react'
import {
	Col,
	Row,
	Container,
	Button,
	CustomInput,
	ButtonDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem
} from 'reactstrap'

import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { Edit, Delete, Lock } from '@material-ui/icons'
import { Tooltip } from '@material-ui/core'
import { useActions } from 'Hooks/useActions'
import useNotification from 'Hooks/useNotification'
import colors from 'Assets/js/colors'
import swal from 'sweetalert'
import { useTranslation } from 'react-i18next'

import {
	getRegionalesPaginated,
	getRegionalesPaginatedByFilter,
	getRegionalDirector,
	setRegional,
	deleteRegional
} from 'Redux/configuracion/actions'

import { TableReactImplementation } from 'Components/TableReactImplementation'

import { Configuracion } from '../../../../types/configuracion'

const CrearDirecciones = React.lazy(() => import('./_partials/Direcciones/main'))

type Iprops = {
	match: string
	hasAddAccess: boolean
	hasEditAccess: boolean
	hasDeleteAccess: boolean
}

type IState = {
	configuracion: Configuracion
}

type SnackbarConfig = {
	variant: string
	msg: string
}

const Direcciones = (props: Iprops) => {
	const { t } = useTranslation()
	const [data, setData] = React.useState<any[]>([])
	const [createResource, setCreateResource] = React.useState<boolean>(false)
	const [loading, setLoading] = React.useState(false)
	const [dropdownSplitOpen, setDropdownSplitOpen] = React.useState(false)
	const [snackBarContent, setSnackbarContent] = React.useState<SnackbarConfig>({
		variant: '',
		msg: ''
	})
	const [selectedDR, setSelectedDR] = React.useState([])
	const [pagination, setPagination] = React.useState({
		page: 1,
		selectedPageSize: 6,
		selectedColumn: '',
		searchValue: '',
		orderColumn: '',
		orientation: ''
	})

	const [snackbar, handleClick] = useNotification()
	const actions = useActions({
		getRegionalesPaginated,
		getRegionalesPaginatedByFilter,
		setRegional,
		deleteRegional
	})
	const toggleSplit = () => {
		setDropdownSplitOpen(!dropdownSplitOpen)
	}

	const [editable, setEditable] = React.useState<boolean>(true)
	const { hasAddAccess = true, hasEditAccess = true, hasDeleteAccess = true } = props
	const state = useSelector((store: IState) => {
		return {
			currentInstitution: store.configuracion.currentInstitution,
			regionales: store.configuracion.regionales,
			currentRegional: store.configuracion.currentRegional
		}
	})

	React.useEffect(() => {
		fetch()
	}, [])

	const fetch = async () => {
		setLoading(true)
		await actions
			.getRegionalesPaginated({
				pagina: 1,
				cantidad: 30
			})
			.then(() => setLoading(false))
	}

	React.useEffect(() => {
		setLoading(true)
		setData(
			state.regionales.entityList.map(item => {
				return {
					...item,
					esActivo: item.esActivo ? 'Activo' : 'Inactivo'
				}
			}) || []
		)
		setLoading(false)
	}, [state.regionales])

	const showNotification = (variant: string, msg: string) => {
		setSnackbarContent({ variant, msg })
		handleClick()
	}

	const handleDelete = async ids => {
		swal({
			title: 'Eliminar',
			text: `Esta seguro de que desea eliminar ${ids.length === 1 ? 'el' : 'los'} registro${
				ids.length === 1 ? '' : 's'
			}`,
			className: 'text-alert-modal',
			icon: 'warning',
			buttons: {
				cancel: 'Cancelar',
				ok: {
					text: 'Eliminar',
					value: true
				}
			}
		}).then(async result => {
			if (result) {
				ids.forEach(async regional => {
					const error = await actions.deleteRegional(regional)
					if (error.error) {
						for (const fieldName in error.errors) {
							if (error.errors.hasOwnProperty(fieldName)) {
								showNotification('error', error.errors[fieldName])
							}
						}
					} else {
						showNotification('success', 'Direccion(es) eliminadas correctamente')
					}
				})
				selectedDR.splice(0, selectedDR.length)
				setSelectedDR([...selectedDR])
			}
		})
	}

	const handleEdit = async (item: any, alterEdit: boolean = true) => {
		await actions.setRegional(item)
		setCreateResource(!createResource)
		if (alterEdit) {
			setEditable(false)
		} else {
			setEditable(true)
		}
	}

	const handleBack = async () => {
		fetch()
		await actions.setRegional({})
		setCreateResource(!createResource)
	}

	const handleUpdate = () => {
		setCreateResource(!createResource)
		fetch()
	}
	const addRegional = async () => {
		handleEdit({}, false)
		setCreateResource(!createResource)
	}

	const DEFAULT_COLUMNS = useMemo(() => {
		return [
			{
				label: '',
				column: 'id',
				accessor: 'id',
				Header: '',
				Cell: ({ row }) => {
					return (
						<div
							style={{
								textAlign: 'center',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center'
							}}
						>
							<input
								className='custom-checkbox mb-0 d-inline-block'
								type='checkbox'
								id='checki'
								style={{
									width: '1rem',
									height: '1rem',
									marginRight: '1rem'
								}}
								onClick={e => {
									e.stopPropagation()
									if (selectedDR.includes(row.original.id)) {
										const i = selectedDR.indexOf(row.original.id)
										selectedDR.splice(i, 1)

										setSelectedDR([...selectedDR])
									} else {
										selectedDR.push(row.original.id)
										setSelectedDR([...selectedDR])
									}
								}}
								checked={
									(selectedDR?.length === row?.length && row?.length > 0) ||
									selectedDR?.includes(row.original.id)
								}
							/>
						</div>
					)
				}
			},
			{
				label: 'Código',
				column: 'codigo',
				accessor: 'codigo',
				Header: t('configuración>direcciones_regionales>columna_codigo', 'Código')
			},
			{
				label: 'Dirección regional de educación',
				column: 'nombre',
				accessor: 'nombre',
				Header: t(
					'configuración>direcciones_regionales>columna_direccion_regional_educacion',
					'Dirección regional de educación'
				)
			},
			{
				label: 'Director',
				column: 'nombreDirector',
				accessor: 'nombreDirector',
				Header: t('configuración>direcciones_regionales>columna_director', 'Director')
			},
			{
				label: 'Estado',
				column: 'esActivo',
				accessor: 'esActivo',
				Header: t('configuración>direcciones_regionales>columna_estado', 'Estado')
			},

			{
				Header: t('configuración>direcciones_regionales>columna_acciones', 'Acciones'),
				column: '',
				accessor: '',
				label: '',
				Cell: ({ row }) => {
					return (
						<div className='d-flex justify-content-center align-items-center'>
							{hasEditAccess && (
								<>
									<Tooltip title='Editar'>
										<Edit
											className='mr-2'
											style={{
												cursor: 'pointer',
												color: colors.darkGray
											}}
											onClick={() => {
												{
													handleEdit(row.original, false)
												}
											}}
										/>
									</Tooltip>
								</>
							)}
							{hasDeleteAccess && (
								<Tooltip title='Eliminar'>
									<Delete
										style={{
											cursor: 'pointer',
											color: colors.darkGray
										}}
										onClick={() => {
											swal({
												title: t(
													'configuración>direcciones_regionales>eliminar>titulo',
													'Eliminar Dirección Regional'
												),
												text: t(
													'configuración>direcciones_regionales>eliminar>mensaje',
													'¿Estás seguro de que deseas eliminar la Dirección Regional?'
												),
												icon: 'warning',
												className: 'text-alert-modal',
												buttons: {
													cancel: t('boton>general>cancelar', 'Cancelar'),
													ok: {
														text: t(
															'boton>general>si_seguro',
															'Sí, seguro'
														),
														value: true,
														className: 'btn-alert-color'
													}
												}
											}).then(async res => {
												if (res) {
													const response = {
														error: false
													}
													const res = await actions.deleteRegional(
														row.original.id
													)
													if (!res.error) {
														setSnackbarContent({
															variant: 'success',
															msg: 'Se ha eliminado exitosamente la dirección regional'
														})
														handleClick()
														actions.getRegionalesPaginated({
															pagina: 1,
															cantidad: 30
														})
													} else if (res.message) {
														setSnackbarContent({
															variant: 'error',
															msg: res.message
														})
														handleClick()
													} else {
														for (const fieldName in res.errors) {
															if (
																res.errors.hasOwnProperty(fieldName)
															) {
																showNotification(
																	'error',
																	res.errors[fieldName]
																)
															}
														}
													}
												}
											})
										}}
									/>
								</Tooltip>
							)}
						</div>
					)
				}
			}
		]
	}, [selectedDR])

	return (
		<Wrapper>
			{snackbar(snackBarContent.variant, snackBarContent.msg)}
			<Container>
				<Row>
					<Col xs={12}>
						<Title>
							{t(
								'configuración>direcciones_regionales>direcciones_regional_educacion',
								'Direcciones regional de educación'
							)}
						</Title>
						<div>
							{createResource && (
								<Title>
									{state.currentRegional.nombre &&
										state.currentRegional.nombre.toUpperCase()}
								</Title>
							)}
						</div>
					</Col>
					<Col xs={12}>
						<div
							style={{
								display: 'flex',
								justifyContent: 'flex-end'
							}}
						>
							{!createResource && (
								<Button color='primary' onClick={addRegional}>
									{t('boton>general>agregrar', 'Agregar')}
								</Button>
							)}
							{!createResource && (
								<StyledButtonDropdown
									isOpen={dropdownSplitOpen}
									toggle={toggleSplit}
									disabled={!editable}
								>
									<div className='btn btn-primary btn-lg pl-4 pr-0 check-button check-all'>
										<CustomInput
											className='custom-checkbox mb-0 d-inline-block'
											type='checkbox'
											id='checkAll'
											onClick={e => {
												e.stopPropagation()

												if (selectedDR?.length === data?.length) {
													selectedDR.splice(0, selectedDR.length)
													setSelectedDR([...selectedDR])
												} else {
													data.forEach(function (row, index) {
														if (!selectedDR.includes(row.id)) {
															selectedDR.push(row.id)
															setSelectedDR([...selectedDR])
														}
													})
												}
											}}
											checked={
												selectedDR?.length === data?.length &&
												data?.length > 0
											}
										/>
									</div>
									<DropdownToggle
										caret
										color='primary'
										className='dropdown-toggle-split btn-lg'
									/>
									<DropdownMenu right>
										<DropdownItem
											onClick={() => {
												if (selectedDR?.length > 0) {
													handleDelete(selectedDR)
												}
											}}
										>
											Eliminar
										</DropdownItem>
									</DropdownMenu>
								</StyledButtonDropdown>
							)}
						</div>
					</Col>
					<Col xs={12}>
						{createResource ? (
							<CrearDirecciones
								handleBack={handleBack}
								handleUpdate={handleUpdate}
								editable={editable}
								hasEditAccess={hasEditAccess}
								setEditable={setEditable}
							/>
						) : (
							<TableReactImplementation
								data={data}
								handleGetData={async (searchValue, _, pageSize, page, column) => {
									setPagination({
										...pagination,
										page,
										pageSize,
										column,
										searchValue
									})

									if (searchValue === '' || searchValue === undefined) {
										setLoading(true)
										actions.getRegionalesPaginated({
											pagina: 1,
											cantidad: 30
										})
										setLoading(false)
									} else {
										setLoading(true)
										actions.getRegionalesPaginatedByFilter({
											pagina: 1,
											cantidad: 30,
											type: 'Nombre',
											search: searchValue
										})
										setLoading(false)
									}
								}}
								columns={DEFAULT_COLUMNS}
								orderOptions={[]}
								pageSize={10}
								backendSearch
							/>
						)}
					</Col>
				</Row>
			</Container>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	background: transparent;
	padding-top: 20px;
`

const Title = styled.h4`
	color: #000;
	margin-bottom: 30px;
`
const StyledButtonDropdown = styled(ButtonDropdown)`
	margin-left: 10px;
	margin-right: 10px;
`
export default Direcciones
