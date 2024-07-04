import Tooltip from '@mui/material/Tooltip'
import colors from 'Assets/js/colors'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import { format, parseISO } from 'date-fns'
import { useActions } from 'Hooks/useActions'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AiFillEye, AiOutlineUsergroupAdd } from 'react-icons/ai'
import { RiFileInfoLine } from 'react-icons/ri'
import { useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Select from 'react-select'
import {
	Badge,
	Button,
	ButtonDropdown,
	CustomInput,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	Input,
	InputGroupAddon,
	Label,
	Modal,
	ModalBody,
	ModalHeader
} from 'reactstrap'
import styled from 'styled-components'
import search from 'Utils/search'

import { assignGroup, getAllStudentsWithoutGroup } from '../../../../redux/grupos/actions'

const EstudiantesSinGrupos = props => {
	const { t } = useTranslation()
	const [itemsIds, setItemsIds] = useState<number[]>([])
	const [data, setData] = useState<any[]>([])
	const [modalOpen, setModalOpen] = useState<boolean>(false)
	const [destinationGroup, setDestinationGroup] = useState<object>({})
	const [openDropdown, setOpenDropdown] = useState(false)
	const [searchValue, setSearchValue] = useState('')

	const state = useSelector((store: any) => {
		return {
			membersWithoutGroup: store.grupos.membersWithoutGroup,
			grupos: store.grupos.groups
		}
	})

	const actions = useActions({
		getAllStudentsWithoutGroup,
		assignGroup
	})

	useEffect(() => {
		const fetch = async () => {
			await actions.getAllStudentsWithoutGroup(
				props.activeLvl.nivelId,
				props.currentInstitution.id
			)
		}
		fetch()
	}, [])

	useEffect(() => {
		setData(
			state.membersWithoutGroup.map(el => {
				return {
					...el,
					id: el.matriculaId,
					image: el.img,
					fechaNacimientoP: format(parseISO(el.fechaNacimiento), 'dd/MM/yyyy'),
					nacionalidad: el.nacionalidades ? el.nacionalidades[0].nacionalidad : ''
				}
			})
		)
	}, [state.membersWithoutGroup])

	const handleModal = () => {
		setModalOpen(!modalOpen)
	}
	const columns = useMemo(() => {
		return [
			{
				Header: '#',
				accessor: 'id',
				label: '',
				column: '',
				Cell: ({ cell, row, data }) => {
					const _row = data[row.index]
					return (
						<div className='d-flex justify-content-center align-items-center'>
							<Tooltip title='Seleccionar'>
								<CustomInput
									type='checkbox'
									inline
									style={{
										cursor: 'pointer'
									}}
									checked={itemsIds.includes(row.original.id)}
									onClick={e => {
										if (itemsIds.includes(row.original.id)) {
											setItemsIds(
												itemsIds.filter(el => el !== row.original.id)
											)
										} else {
											setItemsIds([...itemsIds, row.original.id])
										}
									}}
								/>
							</Tooltip>
						</div>
					)
				}
			},
			{
				Header: t('buscador_ce>ver_centro>datos_director>identificacion', 'Identificación'),
				accessor: 'identificacion',
				label: '',
				column: ''
			},
			{
				Header: t('buscador_ce>ver_centro>datos_director>nombre', 'Nombre completo'),
				accessor: 'nombreCompleto',
				label: '',
				column: ''
			},
			{
				Header: t('estudiantes>buscador_per>col_fecha_naci', 'Fecha de nacimiento'),
				accessor: 'fechaNacimientoP',
				label: '',
				column: ''
			},
			{
				Header: t('estudiantes>buscador_per>info_gen>nacionalidad', 'Nacionalidad'),
				accessor: 'nacionalidad',
				label: '',
				column: ''
			},
			{
				Header: t(
					'estudiantes>matricula_estudiantil>matricular_estudiante>datos_educativos>condicion',
					'Condición'
				),
				accessor: 'condicion',
				label: '',
				column: '',
				Cell: ({ cell, row, data }) => {
					const _row = data[row.index]
					const color = { 1: 'success', 3: 'warning', 2: 'danger' }
					return (
						<Badge
							color={`${color[_row.condicionId] || 'success'}`}
							pill
							style={{ color: 'white !important' }}
						>
							{row.original.condicion}
						</Badge>
					)
				}
			},

			{
				Header: '',
				accessor: 'acciones',
				label: '',
				column: '',
				Cell: ({ cell, row, data }) => {
					const _row = data[row.index]

					return (
						<div className='d-flex justify-content-center align-items-center'>
							<Tooltip title='Asignar a grupo'>
								<div
									onClick={() => {
										setItemsIds([_row.id])
										handleModal()
									}}
								>
									<AiOutlineUsergroupAdd
										style={{
											fontSize: 30,
											color: colors.darkGray,
											cursor: 'pointer'
										}}
										className='mr-2'
									/>
								</div>
							</Tooltip>

							<Tooltip title='Ver Expediente'>
								<div
									style={{
										color: colors?.darkGray,
										cursor: 'pointer'
									}}
									onClick={() => {
										props.history.push(
											`/director/expediente-estudiante/inicio/${_row.identificacion}`
										)
									}}
								>
									<AiFillEye
										style={{
											fontSize: 30,
											color: colors.darkGray,
											cursor: 'pointer'
										}}
										className='mr-2'
									/>
								</div>
							</Tooltip>

							<Tooltip title='Ficha informativa'>
								<div
									style={{
										color: colors?.darkGray,
										cursor: 'pointer'
									}}
									onClick={() => {
										props.history.push(
											`/director/ficha-estudiante/${_row.identidadId}`
										)
									}}
								>
									<RiFileInfoLine
										style={{
											fontSize: 30,
											color: colors.darkGray,
											cursor: 'pointer'
										}}
									/>
								</div>
							</Tooltip>
						</div>
					)
				}
			}
		]
	}, [data, itemsIds, t])

	const onSearch = () => {
		searchValue
			? setData(search(searchValue).in(data, Object.keys(data[0])))
			: setData(
					state.membersWithoutGroup.map(el => {
						return {
							...el,
							id: el.matriculaId,
							image: el.img,
							fechaNacimientoP: format(parseISO(el.fechaNacimiento), 'dd/MM/yyyy'),
							nacionalidad: el.nacionalidades[0].nacionalidad
						}
					})
			  )
	}

	return (
		<>
			{/* <h3>Estudiantes sin grupo asignado</h3> */}
			<div className='d-flex justify-content-between align-items-center'>
				<div
					className='search-sm--rounded'
					style={{
						width: '50em'
					}}
				>
					<Input
						type='text'
						name='keyword'
						id='search'
						onInput={e => onSearch()}
						onKeyPress={e => {
							if (e.key === 'Enter' || e.keyCode === 13) {
								onSearch()
							}
						}}
						value={searchValue}
						onChange={e => setSearchValue(e.target.value)}
						placeholder={t('general>buscar', 'Buscar')}
					/>

					<StyledInputGroupAddon style={{ zIndex: 2 }} addonType='append'>
						<Button
							color='primary'
							className='buscador-table-btn-search'
							onClick={onSearch}
							id='buttonSearchTable'
						>
							{t('general>buscar', 'Buscar')}
						</Button>
					</StyledInputGroupAddon>
				</div>
				<ButtonDropdown
					isOpen={openDropdown}
					toggle={() => {
						setOpenDropdown(!openDropdown)
					}}
				>
					<div className='btn btn-primary btn-lg pl-4 pr-0 check-button check-all'>
						<CustomInput
							className='custom-checkbox mb-0 d-inline-block'
							type='checkbox'
							id='checkAll'
							onClick={() => {
								if (itemsIds.length < data.length) {
									setItemsIds(data.map(el => el?.id))
								} else if (itemsIds.length === data.length) {
									setItemsIds([])
								}
							}}
							checked={itemsIds.length === data.length}
						/>
					</div>
					<DropdownToggle
						caret
						color='primary'
						className='dropdown-toggle-split btn-lg'
					/>
					<DropdownMenu right>
						<DropdownItem
							onClick={async () => {
								handleModal()
							}}
						>
							<div>Agregar a un grupo</div>
						</DropdownItem>
					</DropdownMenu>
				</ButtonDropdown>
			</div>
			<TableReactImplementation columns={columns} data={data} avoidSearch />
			<Modal isOpen={modalOpen} size={itemsIds.length > 0 ? 'lg' : 'sm'}>
				<ModalHeader toggle={handleModal}>
					{itemsIds.length > 0 ? 'Asignar estudiantes a grupo' : 'Atención'}
				</ModalHeader>
				<ModalBody>
					<Label>Seleccione el grupo</Label>
					<Select
						options={state.grupos.map(el => ({
							...el,
							value: el.grupoId,
							label: el.grupo
						}))}
						value={destinationGroup}
						onChange={data => {
							setDestinationGroup(data)
						}}
						components={{ Input: CustomSelectInput }}
						className='react-select'
						classNamePrefix='react-select'
						placeholder=''
						style={{ width: '50%' }}
					/>
					<br />
					<h3>Estudiantes seleccionados</h3>
					<TableReactImplementation
						orderOptions={[]}
						avoidSearch
						columns={columns.filter(
							x => x.accessor !== 'acciones' && x.accessor !== 'id'
						)}
						data={state.membersWithoutGroup
							.map(el => {
								return {
									...el,
									id: el.matriculaId,
									image: el.img,
									fechaNacimientoP: format(
										parseISO(el.fechaNacimiento),
										'dd/MM/yyyy'
									),
									nacionalidad: el.nacionalidades
										? el.nacionalidades[0].nacionalidad
										: ''
								}
							})
							.filter(el => itemsIds.includes(el.id))}
					/>

					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							width: '100%'
						}}
					>
						<Button
							color='primary'
							style={{ marginRight: '10px' }}
							outline
							onClick={() => {
								handleModal()
							}}
						>
							{itemsIds.length > 0 ? 'Cancelar' : 'Regresar'}
						</Button>
						{itemsIds.length > 0 && (
							<Button
								color='primary'
								onClick={async () => {
									const response = await actions.assignGroup(
										itemsIds,
										destinationGroup.value
									)
									if (!response.error) {
										await actions.getAllStudentsWithoutGroup(
											props.activeLvl.nivelId,
											props.currentInstitution.id
										)
										handleModal()
										setItemsIds([])
									}
								}}
							>
								Aplicar
							</Button>
						)}
					</div>
				</ModalBody>
			</Modal>
		</>
	)
}
const StyledInputGroupAddon = styled(InputGroupAddon)`
	top: 0;
	right: 0;
	position: absolute;
	height: 100%;
	display: flex;
	align-items: center;
`
export default withRouter(EstudiantesSinGrupos)
