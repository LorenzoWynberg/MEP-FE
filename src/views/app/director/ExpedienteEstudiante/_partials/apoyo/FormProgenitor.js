import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Form, Row, Col, FormGroup, Label, Input } from 'reactstrap'
import { envVariables } from 'Constants/enviroment'

// eslint-disable-next-line react/prop-types
function FormProgenitor({ cedula }) {
    const [progenitor, setProgenitor] = useState({})
    useEffect(() => {
        axios.get(`${envVariables.BACKEND_URL}/api/TSEIdentidad/GetOneByCedula/${cedula}`).then(r => {
            setProgenitor(r.data)
        }
        )
    }, [cedula]) 
    return progenitor && progenitor.fechaNacimiento && <Form>
        <Row>
            <Col sm="12" >
                <FormGroup>
                    <Label for="identificacion">
                        Cantón
                    </Label>
                    <Input type="text" name="identificacion" id="identificacion" value={progenitor.identificacion} disabled />
                </FormGroup>
            </Col>
            <Col sm="12" >
                <FormGroup>
                    <Label for="nombre">
                        Nombre
                    </Label>
                    <Input type="text" name="nombre" id="nombre" value={`${progenitor.nombre} ${progenitor.primerApellido} ${progenitor.segundoApellido}`} disabled />

                </FormGroup>
            </Col>
            <Col sm="12" >
                <FormGroup>
                    <Label for="conocidoComo">
                        Conocido como
                    </Label>
                    <Input type="text" name="conocidoComo" id="conocidoComo" value={`${progenitor.conocidoComo}`} disabled />

                </FormGroup>
            </Col>
            <Col sm="12" >
                <FormGroup>
                    <Label for="genero">
                        Género
                    </Label>
                    <Input type="text" name="genero" id="genero" value={progenitor.genero} disabled />
                </FormGroup>
            </Col>
            <Col sm="12" >
                <FormGroup>
                    <Label for="nacionalidad">
                        Nacionalidad
                    </Label>
                    <Input type="text" name="nacionalidad" id="nacionalidad" value={progenitor.nacionalidad} disabled />
                </FormGroup>
            </Col>
            <Col sm="12" >
                <FormGroup>
                    <Label for="fechaNacimiento">
                        Fecha de Nacimiento
                    </Label>
                    <Input type="text" name="fechaNacimiento" id="fechaNacimiento" value={progenitor.fechaNacimiento} disabled />
                </FormGroup>
            </Col>
            <Col sm="12" >
                <FormGroup>
                    <Label for="esFallecido">
                        ¿Es fallecido?
                    </Label>
                    <Input type="text" name="esFallecido" id="esFallecido" value={progenitor.esFallecido ? "Sí" : "No"} disabled />
                </FormGroup>
            </Col>
        </Row>
    </Form>

}

export default FormProgenitor