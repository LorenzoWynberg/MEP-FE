import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
	Form,
	Row,
	Col,
	FormGroup,
	Label,
	Input,
	Card,
	CardBody,
	CardTitle
} from 'reactstrap'
import moment from 'moment'
import BarLoader from 'Components/barLoader/barLoader'
import { envVariables } from 'Constants/enviroment'

// eslint-disable-next-line react/prop-types
function FormProgenitor({ cedula, nombre, title }) {
	const [progenitor, setProgenitor] = useState({})
	const [esFallecido, setEsFallecido] = useState('')
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchProgenitor = async () => {
			setLoading(true)
			try {
				const response = await axios.get(
					`${envVariables.BACKEND_URL}/api/TSEIdentidad/GetOneByCedula/${cedula}`
				)
				setProgenitor(response.data)
				setEsFallecido(response.data?.esFallecido ? 'Sí' : 'No')
			} catch (error) {
				console.error(error)
			} finally {
				setLoading(false)
			}
		}

		if (cedula) {
			fetchProgenitor()
		}
	}, [cedula])

	if (loading) return <BarLoader />

	return (
		<Card>
			<CardBody>
				<CardTitle>{title}</CardTitle>
				<Form>
					<Row>
						<Col sm="12">
							<FormGroup>
								<Label for="identificacion">Identificación</Label>
								<Input
									type="text"
									name="identificacion"
									id="identificacion"
									value={
										progenitor.identificacion
											? progenitor.identificacion
											: 'Cédula no encontrada'
									}
									disabled
								/>
							</FormGroup>
						</Col>
						<Col sm="12">
							<FormGroup>
								<Label for="nombre">Nombre</Label>
								<Input
									type="text"
									name="nombre"
									id="nombre"
									value={
										progenitor?.nombre
											? `${progenitor.nombre} ${progenitor.primerApellido} ${progenitor.segundoApellido}`
											: nombre
									}
									disabled
								/>
							</FormGroup>
						</Col>
						<Col sm="12">
							<FormGroup>
								<Label for="nacionalidad">Nacionalidad</Label>
								<Input
									type="text"
									name="nacionalidad"
									id="nacionalidad"
									value={progenitor?.nacionalidad ?? ''}
									disabled
								/>
							</FormGroup>
						</Col>
						<Col sm="12">
							<FormGroup>
								<Label for="fechaNacimiento">Fecha de Nacimiento</Label>
								<Input
									type="text"
									name="fechaNacimiento"
									id="fechaNacimiento"
									value={
										progenitor?.fechaNacimiento
											? moment(progenitor.fechaNacimiento).format('DD/MM/YYYY')
											: ''
									}
									disabled
								/>
							</FormGroup>
						</Col>
						<Col sm="12">
							<FormGroup>
								<Label for="esFallecido">¿Es fallecido?</Label>
								<Input
									type="text"
									name="esFallecido"
									id="esFallecido"
									value={esFallecido}
									disabled
								/>
							</FormGroup>
						</Col>
					</Row>
				</Form>
			</CardBody>
		</Card>
	)
}

export default FormProgenitor
