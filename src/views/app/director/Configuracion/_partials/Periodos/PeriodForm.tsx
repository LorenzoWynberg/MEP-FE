import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Col, Form, Label, Input, ModalHeader, ModalBody, Modal, Card, CardBody, Button } from 'reactstrap'
import { useForm } from 'react-hook-form'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import Tooltip from '@mui/material/Tooltip'
import BackIcon from '@material-ui/icons/ArrowBackIos'

import { EditButton } from 'Components/EditButton'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import colors from 'Assets/js/colors'
import {
	savePeriodo,
	updatePeriodo,
	removeBlockFromPeriod,
	getAllPeriodos,
	getBlocksFromPeriod
} from 'Redux/periodos/actions'
import { useActions } from 'Hooks/useActions'
import { IPeriod, IBlock } from 'Types/periodos'
import swal from 'sweetalert'

import useNotification from 'Hooks/useNotification'
interface IProps {
	selectedPeriod: IPeriod
	setSelectedPeriod: (val: IPeriod) => void
	editable: boolean
	setEditable: (val: boolean) => void
}

const PeriodForm = ({ selectedPeriod, setSelectedPeriod, editable, setEditable }: IProps) => {
	const [selectedBlock, setSelectedBlock] = useState<IBlock>(null)
	const [blocks, setBlocks] = useState<Array<IBlock>>([])
	const [openBlockModal, setOpenBlockModal] = useState(false)
	const { handleSubmit, register, setValue } = useForm()
	const { handleSubmit: handleSubmitBlock, register: registerBlock, setValue: setBlockValue } = useForm()
	const [snackbar, handleClick] = useNotification()
	const [snackbarContent, setSnackbarContent] = useState({
		variant: '',
		msg: ''
	})

	const actions = useActions({
		savePeriodo,
		updatePeriodo,
		removeBlockFromPeriod,
		getAllPeriodos,
		getBlocksFromPeriod
	})

	useEffect(() => {
		if (selectedPeriod) {
			setValue('name', selectedPeriod.nombre)
		}
		setBlocks(selectedPeriod?.bloques || [])
	}, [selectedPeriod])

	useEffect(() => {
		if (selectedBlock) {
			setBlockValue('blockname', selectedBlock.nombre)
			setBlockValue('sort', Number(selectedBlock.ordenBloque))
			setBlockValue('porcentage', Number(selectedBlock.porcentaje))
		}
	}, [selectedBlock])

	const dataBlocks = useMemo(() => {
		return blocks.filter(el => el.estado) || []
	}, [blocks])

	const deleteBloque = async id => {
		let response = null
		response = await actions.removeBlockFromPeriod(id)
		actions.getAllPeriodos()

		if (response.error) {
			swal({
				title: 'Oops',
				text: `${response.message}`,
				icon: 'error',
				className: 'text-alert-modal',
				buttons: {
					ok: {
						text: '¡Entendido!',
						value: true,
						className: 'btn-alert-color'
					}
				}
			})
		} else {
			const _responseBlock = await actions.getBlocksFromPeriod(selectedPeriod.id)
			!_responseBlock.error && setBlocks(_responseBlock.data)

			swal({
				title: 'Correcto',
				text: 'Se ha eliminado el bloque correctamente.',
				icon: 'success',
				className: 'text-alert-modal',
				buttons: {
					ok: {
						text: '¡Entendido!',
						value: true,
						className: 'btn-alert-color'
					}
				}
			})
		}
	}
	const columnsBlocks = useMemo(() => {
		return [
			{
				label: 'Orden',
				accessor: 'ordenBloque',
				column: 'ordenBloque',
				Header: 'Orden'
			},
			{
				label: 'Nombre',
				accessor: 'nombre',
				column: 'nombre',
				Header: 'Nombre'
			},
			{
				label: 'Porcentaje',
				accessor: 'porcentaje',
				column: 'porcentaje',
				Header: 'Porcentaje',
				Cell: ({ row }) => `${row?.original?.porcentaje}%`
			},
			{
				label: 'Acciones',
				accessor: 'actions',
				column: 'actions',
				Header: 'Acciones',
				Cell: ({ row }) => {
					return (
						<div className='d-flex justify-content-center align-items-center'>
							<Tooltip title='Editar'>
								<EditIcon
									onClick={e => {
										setOpenBlockModal(true)
										setSelectedBlock(row.original)
									}}
									style={{
										fontSize: 30,
										color: colors.darkGray,
										cursor: 'pointer'
									}}
								/>
							</Tooltip>
							<Tooltip title='Eliminar'>
								<DeleteIcon
									onClick={e => {
										swal({
											title: 'Eliminar bloque',
											text: 'Esta seguro de querer eliminar el bloque?',
											icon: 'warning',
											className: 'text-alert-modal',
											buttons: {
												ok: {
													text: 'Eliminar',
													value: true,
													className: 'btn-alert-color'
												},
												cancel: 'Cancelar'
											}
										}).then(res => {
											if (res) {
												if (row.original.id) {
													deleteBloque(row.original.id)
												} else {
													const newBlocks = [...blocks]
													newBlocks.splice(row.index, 1)
													setBlocks(newBlocks)
												}
											}
										})
									}}
									style={{
										fontSize: 30,
										color: colors.darkGray,
										cursor: 'pointer'
									}}
								/>
							</Tooltip>
						</div>
					)
				}
			}
		]
	}, [dataBlocks])

	const validatePercentage = (array: Array<any>) => {
		const porcentage = array.filter(el => el.estado).reduce((acc, cur) => (acc += cur.porcentaje), 0)
		if (porcentage > 100) {
			setSnackbarContent({
				msg: 'Los bloques deben sumar el 100%',
				variant: 'error'
			})
			handleClick()
			return false
		}
		return true
	}

	const onSubmit = async data => {
		const isValid = validatePercentage(blocks)
		if (!isValid) {
			return
		}
		let res = null
		if (selectedPeriod) {
			res = await actions.updatePeriodo({
				...selectedPeriod,
				nombre: data.name,
				bloques: blocks
			})
		} else {
			res = await actions.savePeriodo({
				nombre: data.name,
				estado: true,
				bloques: blocks
			})
		}
		if (res.error) {
			setSnackbarContent({
				variant: 'error',
				msg: res.error
			})
			handleClick()
		} else {
			await actions.getAllPeriodos()
			setSnackbarContent({
				variant: 'success',
				msg: `Se ha ${selectedPeriod ? 'editado' : 'agregado'} correctamente`
			})
			setSelectedPeriod(null)
			setEditable(false)
			handleClick()
		}
	}

	const onSubmitBlock = data => {
		if (!data.porcentage || !data.blockname || !data.sort) {
			setSnackbarContent({
				msg: 'Los campos son requeridos',
				variant: 'error'
			})
			handleClick()
			return
		}
		if (selectedBlock) {
			const newBlocks = [...blocks]

			const index = blocks.findIndex(el => el?.id === selectedBlock?.id)
			if (index !== -1) {
				newBlocks[index] = {
					...selectedBlock,
					nombre: data.blockname,
					ordenBloque: Number(data.sort),
					porcentaje: Number(data.porcentage)
				}

				setBlocks(newBlocks)
			}
		} else {
			const newBlocks = [
				...blocks,
				{
					nombre: data.blockname,
					ordenBloque: Number(data.sort),
					porcentaje: Number(data.porcentage),
					estado: true
					// sBPeriodo_Id: 0,
				}
			]

			setBlocks(newBlocks)
		}
		setOpenBlockModal(false)
		setSelectedBlock(null)
	}
	return (
		<>
			{snackbar(snackbarContent.variant, snackbarContent.msg)}
			<Modal
				isOpen={openBlockModal}
				toggle={() => {
					setSelectedBlock(null)
					setOpenBlockModal(false)
				}}
			>
				<ModalHeader>{selectedBlock ? 'Editar bloque' : 'Añadir bloque'}</ModalHeader>
				<ModalBody>
					<Form onSubmit={handleSubmitBlock(onSubmitBlock)}>
						<div className='my-3'>
							<Label>Orden</Label>
							<Input
								type='number'
								name='sort'
								required
								innerRef={registerBlock({
									required: 'true'
								})}
							/>
						</div>
						<div className='my-3'>
							<Label>Nombre</Label>
							<Input
								type='text'
								name='blockname'
								required
								innerRef={registerBlock({
									required: 'true'
								})}
							/>
						</div>
						<div className='my-3'>
							<Label>Porcentaje</Label>
							<Input
								type='number'
								name='porcentage'
								required
								step='0.01'
								innerRef={registerBlock({
									required: 'true'
								})}
							/>
						</div>
						<div className='d-flex justify-content-center align-items-center my-3'>
							<Button
								color='default'
								onClick={() => {
									setOpenBlockModal(false)
									setSelectedBlock(null)
								}}
								className='mr-3'
							>
								Cancelar
							</Button>
							<Button color='primary' type='submit'>
								Guardar
							</Button>
						</div>
					</Form>
				</ModalBody>
			</Modal>
			<Col sm='12' md='6'>
				<Back
					onClick={() => {
						setSelectedPeriod(null)
						setEditable(false)
					}}
				>
					<BackIcon />
					<BackTitle>Regresar</BackTitle>
				</Back>
				<Card>
					<CardBody>
						<Form onSubmit={handleSubmit(onSubmit)}>
							<h6>{selectedPeriod ? 'Editar periodo' : 'Agregar periodo'}</h6>
							<div className=''>
								<Label>Nombre</Label>
								<Input
									type='text'
									name='name'
									required
									disabled={!editable}
									innerRef={register({
										required: true
									})}
								/>
							</div>
							<div className='my-3'>
								<div className='d-flex justify-content-between align-items-center'>
									<Label>Bloques</Label>
									<Button
										color='primary'
										onClick={() => {
											setOpenBlockModal(true)
										}}
									>
										Agregar
									</Button>
								</div>
								<TableReactImplementation columns={columnsBlocks} data={dataBlocks} avoidSearch />
							</div>
							<div className='d-flex justify-content-center align-items-center'>
								{!editable ? (
									<Button onClick={() => setEditable(true)} color='primary'>
										Editar
									</Button>
								) : (
									<div className='d-flex justify-content-center align-items-center'>
										<Button
											onClick={() => {
												setEditable(false)
												setBlocks(selectedPeriod?.bloques)
											}}
											className='mr-3'
											color='default'
										>
											Cancelar
										</Button>
										<Button type='submit' color='primary'>
											Guardar
										</Button>
									</div>
								)}
							</div>
						</Form>
					</CardBody>
				</Card>
			</Col>
		</>
	)
}

const Back = styled.div`
	display: flex;
	align-items: center;
	cursor: pointer;
	padding: 0 5px;
	margin-bottom: 20px;
`

const BackTitle = styled.span`
	color: #000;
	font-size: 14px;
	font-size: 16px;
`

export default PeriodForm
