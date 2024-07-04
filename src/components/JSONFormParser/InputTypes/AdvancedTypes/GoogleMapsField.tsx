import React from 'react'
import GoogleMapsLocation from 'Components/GoogleMapsLocation'

interface IProps {
	register: any
	editable: any
	active: any
	setValue: any
	field: any
	errors: any
	getValues: any
	readOnlyFields: any
}
const GoogleMapsField: React.FC<IProps> = (props) => {
  console.log(props, 'Google maps props')
  return <GoogleMapsLocation />
}

export default GoogleMapsField
