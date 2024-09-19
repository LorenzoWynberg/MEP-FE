import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { HiPencil } from 'react-icons/hi'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import { IoEyeSharp } from 'react-icons/io5'
import { IoMdTrash } from 'react-icons/io'
import { Button } from 'reactstrap'
import moment from 'moment'
import swal from 'sweetalert'
import BookDisabled from 'Assets/icons/bookDisabled'
import BookAvailable from 'Assets/icons/bookAvailable'
import colors from 'Assets/js/colors'
import BarLoader from 'Components/barLoader/barLoader.tsx'
const TablaMep = props => {
	const {
		data,
		loading,
		handlePagination,
		handleSearch,
		totalRegistros,
		setVisualizing
	} = props

	const actions = [
		{
			actionName: 'button.remove',
			actionFunction: ids => {
				props.authHandler(
					'eliminar',
					props.handleDeleteSubsidio(ids),
					props.toggleSnackbar
				)
			}
		}
	]
	const actionRow = [
		{
			actionName: 'Editar',
			actionFunction: item => {
				props.authHandler(
					'modificar',
					props.handleViewSubsidio(item),
					props.toggleSnackbar
				)
			},
			actionDisplay: () => true
		},
		{
			actionName: 'Eliminar',
			actionFunction: item => {
				props.authHandler(
					'eliminar',
					props.handleDeleteSubsidio([item.id]),
					props.toggleSnackbar
				)
			},
			actionDisplay: () => true
		}
	]

	const columns = useMemo(() => {
		return [
			{
				Header: 'Dependencia',
				column: 'nombreDependecia',
				accessor: 'nombreDependecia',
				label: ''
			},
			{
				Header: 'Tipo de subsidio',
				column: 'nombreTipoSubsidio',
				accessor: 'nombreTipoSubsidio',
				label: ''
			},
			{
				Header: 'Detalle del subsidio',
				column: 'detalle',
				accessor: 'detalle',
				label: '',
				Cell: ({ _, row, data }) => {
					const fullRow = data[row.index]
					return (
						<div>
							{
								props.beneficios.typesSubsidios.find(
									item => item.id === fullRow.tipoSubsidioId
								).detalle
							}
						</div>
					)
				}
			},
			{
				Header: 'Verificación de recepción del apoyo',
				column: 'recepcionVerificada',
				accessor: 'recepcionVerificada',
				label: ''
			},
			{
				Header: 'Periodo activo (Inicio - Fin)',
				column: 'periodo',
				accessor: 'periodo',
				label: '',
				Cell: ({ _, row, data }) => {
					const fullRow = data[row.index]
					return (
						<div>
							{`${moment(fullRow.fechaInicio).format('DD/MM/YYYY')} - ` +
								(fullRow.fechaFinal
									? moment(fullRow.fechaFinal).format('DD/MM/YYYY')
									: 'Fecha no registrada')}
						</div>
					)
				}
			},
			{
				Header: 'Acciones',
				column: '',
				accessor: '',
				label: '',
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
							<Tooltip title="Ver">
								<IconButton
									onClick={() => {
										props.handleViewSubsidio(fullRow, false)
										props.setEditable(false)
										props.setVisualizing(true)
									}}
								>
									<IoEyeSharp
										style={{ fontSize: 25, color: colors.darkGray }}
									/>
								</IconButton>
							</Tooltip>
							<Tooltip title="Editar">
								<IconButton
									onClick={() => {
										props.authHandler(
											'modificar',
											() => {
												props.handleViewSubsidio(fullRow, true)
											},
											props.toggleSnackbar,
											props.setEditable(true),
											props.setVisualizing(false)
											// handlePagination
										)
									}}
								>
									<HiPencil style={{ fontSize: 25, color: colors.darkGray }} />
								</IconButton>
							</Tooltip>
							<Tooltip title="Eliminar">
								<IconButton
									onClick={() => {
										swal({
											title: ' ¿Está seguro que desea eliminar este beneficio?',
											text: 'Este cambio no puede ser revertido',
											icon: 'warning',
											className: 'text-alert-modal',
											buttons: {
												cancel: 'Cancelar',
												ok: {
													text: 'Aceptar',
													value: true,
													className: 'btn-alert-color'
												}
											}
										}).then(result => {
											if (result) {
												props.handleDeleteSubsidio([fullRow.id])
											}
										})
									}}
								>
									<IoMdTrash style={{ fontSize: 25, color: colors.darkGray }} />
								</IconButton>
							</Tooltip>
						</div>
					)
				}
			}
		]
	}, [data])

	return (
		<div>
			{(loading || props.loading) && <BarLoader />}
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<div />
				<div>
					<Button
						color="primary"
						onClick={() => {
							props.handleCreateToggle()
						}}
					>
						Agregar
					</Button>
				</div>
			</div>
			<div>
				<TableReactImplementation
					placeholderText={props.placeholderText}
					data={data}
					handleGetData={() => {}}
					columns={columns}
					orderOptions={[]}
				/>
			</div>
		</div>
	)
}
TablaMep.prototype = {
	placeholderText: PropTypes.string,
	data: PropTypes.array,
	loading: PropTypes.bool,
	handlePagination: PropTypes.func,
	handleSearch: PropTypes.func,
	totalRegistros: PropTypes.number
}
TablaMep.defaultProps = {
	data: [],
	loading: false,
	handlePagination: () => {},
	handleSearch: () => {},
	totalRegistros: 0,
	placeholderText: ''
}

export default TablaMep
