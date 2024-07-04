import React, { useEffect, useState } from 'react'
import LocationSelector from './LocationSelector.tsx'
import CoordinatesMap from './CoordinatesMap'

import { Row, Col } from 'reactstrap'

const initialLocationCoordinates = {
	latitude: '',
	longitude: ''
}

interface Location {
	latitude: string | number
	longitude: string | number
}

const LocationExact: React.FC = (props: any) => {
	const [search, setSearch] = useState(null)
	const [ubicacion, setUbicacion] = useState<Location>(null)
	const [location, setLocation] = useState<Location>(initialLocationCoordinates)

	const [overrideData, setOverrideData] = useState(true)

	const {
		field,
		register,
		setValue,
		watch,
		currentItem,
		errors,
		getValues,
		active,
		editable,
		dataForm,
		hide = false,
		control,
		isTemporal
	} = props

	useEffect(() => {
		return () => {
			setUbicacion(null)
			setSearch(null)
		}
	}, [])

	if (hide) {
		return <></>
	}
	const isEditTemporal = (): boolean => {
		const isEditField = editable && !props.readOnlyFields.includes(field.components.coordinates.options[1].id)
		const _isTemporal = field.config.temporal
		let isEdit = isEditField

		if (_isTemporal && isTemporal && isEditField) {
			isEdit = true
		}
		if (_isTemporal && !isTemporal && isEditField) {
			isEdit = false
		}
		return isEdit
	}

	return (
		<Row>
			<Col md={6}>
				<LocationSelector
					editable={isEditTemporal()}
					control={control}
					errors={errors}
					overrideData={overrideData}
					setOverrideData={setOverrideData}
					active={active}
					field={field.components.location}
					coordinates={field.components.coordinates}
					tooltips={field.config.tooltips}
					register={register}
					watch={watch}
					setValue={setValue}
					currentItem={currentItem}
					getValues={getValues}
					setSearch={setSearch}
					search={search}
					setUbicacion={setUbicacion}
					setLocation={setLocation}
					location={location}
					ubicacion={ubicacion}
					temporal={field.config.temporal}
					isTemporal={isTemporal}
					dataForm={dataForm}
					province={false}
					readOnlyFields={props.readOnlyFields}
				/>
			</Col>
			<Col md={6}>
				<CoordinatesMap
					register={register}
					editable={isEditTemporal()}
					active={active}
					setLocation={setLocation}
					location={location}
					field={field.components.coordinates}
					errors={errors}
					setValue={setValue}
					getValues={getValues}
					setSearch={setSearch}
					ubicacion={ubicacion}
					temporal={field.config.temporal}
					setUbicacion={setUbicacion}
					readOnlyFields={props.readOnlyFields}
				/>
			</Col>
		</Row>
	)
}

export default LocationExact
