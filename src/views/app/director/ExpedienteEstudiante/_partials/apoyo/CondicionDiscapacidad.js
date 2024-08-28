import React, { useEffect, useState } from 'react'
import { Button, Col, FormGroup, Label, Row, Form } from 'reactstrap';
import IntlMessages from '../../../../../../helpers/IntlMessages';
import { EditButton } from '../../../../../../components/EditButton'
import colors from '../../../../../../assets/js/colors'
import { TableReactImplementation } from 'Components/TableReactImplementation'

import styled from 'styled-components'
import { useTranslation } from 'react-i18next';
import SelectItem from './SelectItem';
function CondicionDiscapacidad(props) {  
    const columns = [
        {
            Header: 'Id',
            column: 'id',
            accessor: 'id',
            label: ''
        }, {
            Header: 'Nombre',
            column: 'nombre',
            accessor: 'nombre',
            label: ''
        }]
    return <>
        <Row>
            <Col md='12'> 
                <TableReactImplementation
                    data={props.discapacidadesIdentidad}
                    showAddButton
                    // avoidSearch
                    onSubmitAddButton={() => { 
                        props.handleOpenOptions(props.discapacidades, 'discapacidades')
                    }}

                    columns={columns}
                    orderOptions={[]}
                    pageSize={10}
                    backendSearch
                />
            </Col>
            {/* <Col xs={12}>
                <Form onSubmit={props.handleSubmit(props.sentData)}>
                    <EditButton
                        editable={props.editable}
                        setEditable={(value) => props.authHandler('modificar', () => props.setEditable(value), props.showsnackBar)}
                        loading={props.loading}
                    />
                </Form>
            </Col> */}

        </Row>
    </>;
}

export default CondicionDiscapacidad;
 