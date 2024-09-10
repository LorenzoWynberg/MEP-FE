import React, { FunctionComponent, useState, useEffect } from 'react'
import { Row, Col } from 'reactstrap'
import { Field } from '../../Interfaces'
import TextInput from '../TextInput'
import MapInput from '../MapInput'
type Props = {
	showLocation: boolean
	useModal: boolean
	defaultHidden: boolean
	options: Field
	register: any
}
const CoordinatesMap: FunctionComponent<Props> = props => {
	const [mapOpen, setMapOpen] = useState(props.useModal && !props.defaultHidden)
	const [search, setSearch] = useState(null)
	const { location, setLocation } = props
	const toggleModal = () => {
		setMapOpen(!mapOpen)
	}

	useEffect(() => {
		const latitudeId = props.field.options.find(item => item.label == 'Latitud')
		const longitudeId = props.field.options.find(
			item => item.label == 'Longitud'
		)
		if (longitudeId && latitudeId) {
			props.setValue(`${latitudeId.id}`, location.latitude)
			props.setValue(`${longitudeId.id}`, location.longitude)
		}
	}, [location])
	const map = props.field.options.find(field => field.type === 'map')
	const texts = props.field.options.filter(field => field.type === 'text')
	const setLocationIfEditable = value => {
		if (props.editable) {
			setLocation(value)
		}
	}
	return (
		<div>
			{/* Componente mapa */}
			<span style={{ color: 'grey' }}>
				*Marcar en el mapa la ubicación aproximada del terreno
			</span>
			<MapInput
				field={props.field}
				mapOpen={mapOpen}
				toggleModal={toggleModal}
				setSearch={props.setSearch || setSearch}
				setLocation={setLocationIfEditable}
				editable={props.editable}
				setUbicacion={props.setUbicacion}
			/>
			<Row>
				{texts.map(option => {
					return (
						<Col xs={6}>
							<TextInput
								field={{ ...option, config: { required: !props.temporal } }}
								register={props.register}
								errors={props.errors}
								editable={props.editable}
							/>
						</Col>
					)
				})}
			</Row>
		</div>
	)
}
export default CoordinatesMap
