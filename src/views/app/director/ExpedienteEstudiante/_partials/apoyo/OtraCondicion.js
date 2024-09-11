import React, { useEffect, useState } from 'react'
import { Button, Col, FormGroup, Label, Row, Form } from 'reactstrap'
import { TableReactImplementation } from 'Components/TableReactImplementation'

function OtraCondicion(props) {
	const columns = [
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
		}
	]
	return (
		<>
			<Row>
				<Col md='12'>
					<TableReactImplementation
						data={props.condicionesHistorico || []}
						showAddButton
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
