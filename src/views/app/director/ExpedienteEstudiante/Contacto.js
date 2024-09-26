import React, { useState, useEffect } from 'react'
import HeaderTab from 'Components/Tab/Header'
import ContentTab from 'Components/Tab/Content'
import InformacionContacto from './_partials/contacto/InformacionContacto'
import InformacionResidenciaSaber from './_partials/contacto/InformacionResidenciaSaber'
import HistoricoResidencia from './_partials/contacto/HistoricoResidencia.tsx'
import './style.scss'
import { withRouter } from 'react-router-dom'
import { useSelector } from 'react-redux'
import withAuthorization from '../../../../Hoc/withAuthorization'
import { useTranslation } from 'react-i18next'

const InformacionContactoAuth = withAuthorization({
	id: 2,
	Modulo: 'Expediente Estudiantil',
	Apartado: 'Informacion de Contacto',
	Seccion: 'Informacion de Contacto'
})(InformacionContacto)

const InformacionResidenciaTemporal = withAuthorization({
	id: 4,
	Modulo: 'Expediente Estudiantil',
	Apartado: 'Informacion de Contacto',
	Seccion: 'Informacion de Domicilio Temporal'
})(InformacionResidenciaSaber)

const InformacionResidenciaFija = withAuthorization({
	id: 3,
	Modulo: 'Expediente Estudiantil',
	Apartado: 'Informacion de Contacto',
	Seccion: 'Informacion de Residencia'
})(InformacionResidenciaSaber)

const HistoricoResidenciaAuth = withAuthorization({
	id: 102,
	Modulo: 'Expediente Estudiantil',
	Apartado: 'Informacion de Contacto',
	Seccion: 'Historico de residencias'
})(HistoricoResidencia)

const Expediente = () => {
	const [activeTab, setActiveTab] = useState(0)
	const [tempAddress, setTempAddress] = useState(false)
	const toggleAddress = () => {
		setTempAddress(!tempAddress)
	}
	const { t } = useTranslation()

	const optionsTab = [
		{ key: 'estudiantes>expediente>contacto>info_cont>titulo' },
		{ key: 'estudiantes>expediente>contacto>info_residencia>titulo' },
		{ key: 'estudiantes>expediente>contacto>info_residencia>dom_temp' },
		{ key: 'estudiantes>expediente>contacto>historico_residencia>titulo' }
	]

	const state = useSelector(store => {
		return {
			expedienteEstudiantil: store.expedienteEstudiantil,
			identification: store.identification
		}
	})

	useEffect(() => {
		const loadData = async () => {
			const item = state?.identification.data.direcciones.find(
				item => item.temporal === true
			)
			if (item?.temporal) {
				setTempAddress(true)
			}
		}

		if (
			state?.identification.data.direcciones &&
			state?.identification.data.direcciones.length > 0
		) {
			loadData()
		}
	}, [state?.identification.data])

	return (
		<>
			<h4>
				{t(
					'expediente_ce>informacion_general>informacion',
					'Información de contacto'
				)}
			</h4>
			<br />
			<HeaderTab
				options={optionsTab}
				activeTab={activeTab}
				setActiveTab={setActiveTab}
			/>
			<ContentTab activeTab={activeTab} numberId={activeTab}>
				{activeTab === 0 && <InformacionContactoAuth />}
				{activeTab === 1 && (
					<InformacionResidenciaFija
						tempAddress={tempAddress}
						toggleAddress={toggleAddress}
						identification={state.identification}
					/>
				)}
				{activeTab === 2 && (
					<InformacionResidenciaTemporal
						temporal
						identification={state.identification}
					/>
				)}
				{activeTab === 3 && (
					<HistoricoResidenciaAuth
						identidadId={state.identification?.data?.id}
					/>
				)}
			</ContentTab>
		</>
	)
}

export default withRouter(Expediente)
