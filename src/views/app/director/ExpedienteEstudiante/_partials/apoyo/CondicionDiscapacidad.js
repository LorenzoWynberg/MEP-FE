import React, { useEffect, useState } from 'react'
import { Button, Col, FormGroup, Label, Row, Form } from 'reactstrap';
import { TableReactImplementation } from 'Components/TableReactImplementation'

function CondicionDiscapacidad(props) {
    const columns = [
        {
            Header: 'Nombre',
            column: 'nombre',
            accessor: 'nombre',
            label: ''
        }, {
            Header: 'Descripcion',
            column: 'descripcion',
            accessor: 'descripcion',
            label: ''
        }, {
            Header: 'Fecha',
            column: 'fechaRegistro',
            accessor: 'fechaRegistro',
            label: ''
        }, {
            Header: 'Usuario',
            column: 'usuarioRegistro',
            accessor: 'usuarioRegistro',
            label: ''
        }]
    return <>
        <Row>
            <Col md='12'>
                <TableReactImplementation
                    data={props.discapacidadesHistorico || []}
                    showAddButton
                    // avoidSearch
                    key={props.discapacidadesHistorico}
                    onSubmitAddButton={() => {
                        props.handleOpenOptions(props.discapacidades, 'discapacidades')
                    }}

                    columns={columns}
                    orderOptions={[]}
                    pageSize={10} 
                />
            </Col>
        </Row>
    </>;
}

export default CondicionDiscapacidad;
