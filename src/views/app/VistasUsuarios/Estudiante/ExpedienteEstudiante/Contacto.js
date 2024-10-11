import React, { useState } from 'react'
import HeaderTab from 'Components/Tab/Header'
import ContentTab from 'Components/Tab/Content'

import InformacionContacto from './_partials/contacto/InformacionContacto'
import InformacionResidenciaSaber from './_partials/contacto/InformacionResidenciaSaber'

import './style.scss'
import { withRouter } from 'react-router-dom'
import { getIdentification } from '../../../../../redux/identificacion/actions'
import { useActions } from '../../../../../hooks/useActions'
import { useSelector } from 'react-redux'
import withAuthorization from '../../../../../Hoc/withAuthorization'

const InformacionResidenciaTemporal = withAuthorization({
	id: 1,
	Modulo: 'Expediente Estudiantil',
	Apartado: 'Informacion de Contacto',
	Seccion: 'Informacion de Domicilio Temporal'
})(InformacionResidenciaSaber)

const InformacionResidenciaFija = withAuthorization({
	id: 1,
	Modulo: 'Expediente Estudiantil',
	Apartado: 'Informacion de Contacto',
	Seccion: 'Informacion de Residencia'
})(InformacionResidenciaSaber)

const Expediente = props => {
	const [activeTab, setActiveTab] = useState(0)

	const optionsTab = ['Información de contacto', 'Información de residencia', 'Información de domicilio temporal']

	const state = useSelector(store => {
		return {
			expedienteEstudiantil: store.expedienteEstudiantil,
			identification: store.identification
		}
	})

	const actions = useActions({
		getIdentification
	})

	return (
		<>
			<h4>Información de contacto</h4>
			<br />
			<HeaderTab options={optionsTab} activeTab={activeTab} setActiveTab={setActiveTab} />
			<ContentTab activeTab={activeTab} numberId={activeTab}>
				{activeTab === 0 && <InformacionContacto />}
				{activeTab === 1 && <InformacionResidenciaFija identification={state.identification} />}
				{activeTab === 2 && <InformacionResidenciaTemporal temporal identification={state.identification} />}
			</ContentTab>
		</>
	)
}

export default withRouter(Expediente)
