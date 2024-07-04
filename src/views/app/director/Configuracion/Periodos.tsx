import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import EditIcon from '@material-ui/icons/Edit'
import Tooltip from '@mui/material/Tooltip'
import { useSelector } from 'react-redux'
import { Card, CardBody, Button, InputGroupAddon } from 'reactstrap'

import { useActions } from 'Hooks/useActions'
import colors from 'Assets/js/colors'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import { getAllPeriodos, deletePeriodo, habilitaDeshabilitaPeriodo } from 'Redux/periodos/actions'
import PeriodForm from './_partials/Periodos/PeriodForm'
import { IPeriod } from 'Types/periodos'
import search from 'Utils/search'
import swal from 'sweetalert'
import DeleteIcon from '@material-ui/icons/Delete'
import BookAvailable from 'Assets/icons/bookAvailable'
import { IconButton } from '@mui/material'
import BookDisabled from 'Assets/icons/bookDisabled'
import useNotification from 'Hooks/useNotification'
interface IState {
	periodos: {
		periodosAll: Array<IPeriod>
	}
}

const Periodos = () => {
	const [selectedPeriod, setSelectedPeriod] = useState<IPeriod>(null)
	const [editable, setEditable] = useState(false)
	const [searchValue, setSearchValue] = useState('')
	const { periodosAll } = useSelector((state: IState) => state.periodos)
	const [items, setItems] = useState(periodosAll || [])
	const [snackbar, handleClick] = useNotification()
	const [snackbarContent, setSnackbarContent] = useState({
		msg: '',
		variant: ''
	})
	const data = useMemo(() => {
		return items
	}, [items])

	useEffect(() => {
		setItems(periodosAll || [])
	}, [periodosAll])

	const actions = useActions({
		getAllPeriodos,
		habilitaDeshabilitaPeriodo,
		deletePeriodo
	})

	useEffect(() => {
		actions.getAllPeriodos()
	}, [])
	const handleSnackbar = (msg, variant) => {
		setSnackbarContent({ msg, variant })
		handleClick()
	}
	const onHabilitarDeshabilitarClick = async periodoId => {
		const response = await actions.habilitaDeshabilitaPeriodo(periodoId)

		if (response.error) {
			handleSnackbar(`${response.error}`, 'error')
			return
		}
		actions.getAllPeriodos().then(_ => {
			handleSnackbar(`Período ${response.data.esActivo ? 'habilitado' : 'deshabilitado'} correctamente`, 'info')
		})
	}
	const columns = useMemo(() => {
		return [
			{
				label: 'Nombre',
				accessor: 'nombre',
				column: 'nombre',
				Header: 'Nombre'
			},
			{
				label: 'Cantidad de bloques',
				accessor: 'cantidadBloques',
				column: 'cantidadBloques',
				Header: 'Cantidad de bloques',
				Cell: ({ row }) => <>{row.original?.bloques?.length || 0}</>
			},
			{
				label: 'Activo',
				accessor: 'esActivo',
				column: 'esActivo',
				Header: 'Activo',
				Cell: ({ row }) => {
					return <span>{row.original.esActivo ? 'Activo' : 'Inactivo'}</span>
				}
			},
			{
				label: 'Acciones',
				accessor: 'actions',
				column: 'actions',
				Header: 'Acciones',
				Cell: ({ row }) => {
					return (
						<div className='d-flex justify-content-center align-items-center'>
							<Tooltip title={`${row.original.esActivo ? 'Deshabilitar' : 'Habilitar'}`}>
								<IconButton
									onClick={() => {
										onHabilitarDeshabilitarClick(row.original.id)
									}}
								>
									{row.original.esActivo ? (
										<BookAvailable
											style={{
												fontSize: 30,
												color: colors.darkGray,
												cursor: 'pointer'
											}}
										/>
									) : (
										<BookDisabled
											style={{
												fontSize: 30,
												color: colors.darkGray,
												cursor: 'pointer'
											}}
										/>
									)}
								</IconButton>
							</Tooltip>
							<Tooltip title='Editar'>
								<IconButton>
									<EditIcon
										style={{
											fontSize: 30,
											color: colors.darkGray,
											cursor: 'pointer'
										}}
										onClick={() => {
											setSelectedPeriod(row.original)
											setEditable(true)
										}}
									/>
								</IconButton>
							</Tooltip>
							<Tooltip title='Eliminar'>
								<IconButton>
									<DeleteIcon
										style={{
											fontSize: 30,
											color: colors.darkGray,
											cursor: 'pointer'
										}}
										onClick={() => {
											swal({
												title: 'Eliminar periodo',
												text: 'Esta seguro de querer eliminar el periodo?',
												icon: 'warning',
												className: 'text-alert-modal',
												buttons: {
													cancel: 'Cancelar',
													ok: {
														text: 'Eliminar',
														value: true,
														className: 'btn-alert-color'
													}
												}
											}).then(async res => {
												if (res) {
													const response = await actions.deletePeriodo(row.original.id)
													if (!response.error) {
														await actions.getAllPeriodos()
													} else {
														handleSnackbar(`${response.error}`, 'error')
													}
												}
											})
										}}
									/>
								</IconButton>
							</Tooltip>
						</div>
					)
				}
			}
		]
	}, [data])

	const onSearch = () => {
		searchValue ? setItems(search(searchValue).in(periodosAll, Object.keys(periodosAll[0]))) : setItems(periodosAll)
	}

	return (
		<Wrapper>
			{snackbar(snackbarContent.variant, snackbarContent.msg)}
			<Title>Periodos</Title>
			{!selectedPeriod && !editable ? (
				<>
					<div className='d-flex justify-content-between align-items-center'>
						<Search className={`search-sm--rounded`}>
							<input
								type='text'
								name='keyword'
								id='search'
								placeholder={'Usar aquí las palabras clave que desea buscar'}
								onInput={e => {}}
								onKeyDown={e => {
									if (e.key === 'Enter' || e.keyCode === 13) {
										onSearch()
									}
								}}
								onChange={e => setSearchValue(e.target.value)}
							/>

							<StyledInputGroupAddon style={{ zIndex: 2 }} addonType='append'>
								<Button
									color='primary'
									className='buscador-table-btn-search'
									onClick={() => onSearch()}
									id='buttonSearchTable'
								>
									Buscar
								</Button>
							</StyledInputGroupAddon>
						</Search>
						<Button
							color='primary'
							onClick={() => {
								setEditable(true)
							}}
						>
							Agregar
						</Button>
					</div>
					<Card className='my-5'>
						<CardBody>
							<div className='d-flex justify-content-between align-items-center'>
								<h6>Periodos</h6>
							</div>
							<div>
								<TableReactImplementation columns={columns} data={data} avoidSearch />
							</div>
						</CardBody>
					</Card>
				</>
			) : (
				<>
					<PeriodForm
						editable={editable}
						setEditable={setEditable}
						setSelectedPeriod={setSelectedPeriod}
						selectedPeriod={selectedPeriod}
					/>
				</>
			)}
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

const Search = styled.div`
	min-width: 50%;
`

const StyledInputGroupAddon = styled(InputGroupAddon)`
	top: 0;
	right: 0;
	position: absolute;
	height: 100%;
	display: flex;
	align-items: center;
`

export default Periodos
