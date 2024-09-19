import React, { useEffect, useMemo, useState } from 'react'
import { Button, Col, FormGroup, Label, Row, Form } from 'reactstrap'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import { IoMdTrash } from 'react-icons/io'
import Tooltip from '@mui/material/Tooltip'
import { IconButton } from '@material-ui/core'
import swal from 'sweetalert'
import axios from 'axios'
import { envVariables } from '../../../../../../constants/enviroment'

function OtraCondicion(props) {
	const columns = useMemo(() => {
		return [
			{
				Header: 'Nombre',
				column: 'nombre',
				accessor: 'nombre',
				label: ''
			},
			{
				Header: 'Descripción',
				column: 'descripcion',
				accessor: 'descripcion',
				label: ''
			},
			{
				Header: 'Fecha',
				column: 'fechaRegistro',
				accessor: 'fechaRegistro',
				label: ''
			},
			{
				Header: 'Usuario',
				column: 'usuarioRegistro',
				accessor: 'usuarioRegistro',
				label: ''
			},
			{
				Header: 'Acciones',
				column: '',
				accessor: '',
				label: '',
				Cell: ({ _, row, data }) => {
					return (
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								alignContent: 'center'
							}}
						>
							<Button
								style={{
									border: 'none',
									background: 'transparent',
									cursor: 'pointer',
									color: 'grey'
								}}
								color="primary"
								onClick={() => {
									swal({
										title: 'Eliminar Condición',
										text: '¿Esta seguro de que desea eliminar la condición?',
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
									}).then(() => props.delete(row.original.id))
								}}
							>
								<Tooltip title="Eliminar">
									<IconButton>
										<IoMdTrash style={{ fontSize: 30 }} />
									</IconButton>
								</Tooltip>
							</Button>
						</div>
					)
				}
			}
		]
	}, [])
	return (
		<>
			<Row>
				<Col md="12">
					<TableReactImplementation
						data={props.condicionesHistorico || []}
						showAddButton
						placeholderText="Buscar por nombre"
						key={props.condicionesHistorico}
						// avoidSearch
						onSubmitAddButton={() => {
							props.handleOpenOptions(props.condiciones, 'condiciones')
						}}
						columns={columns}
						orderOptions={[]}
						pageSize={10}
					/>
				</Col>
			</Row>
		</>
	)
}

export default OtraCondicion
