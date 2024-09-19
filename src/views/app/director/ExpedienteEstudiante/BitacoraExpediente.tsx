import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { getIdentification } from '../../../../redux/identificacion/actions'
import { useActions } from '../../../../hooks/useActions'
import HeaderTab from 'Components/Tab/Header'
import ContentTab from 'Components/Tab/Content'
import AlertaTempranaExpedienteEstudiantil from './_partials/bitacoraExpediente/AlertaTempranaExpedienteEstudiantil'
import HistoricoCambiosIdentidadEstudiante from './_partials/bitacoraExpediente/HistoricoCambiosIdentidadEstudiante'

const BitacoraExpediente = props => {
	const [activeTab, setActiveTab] = useState(0)
	const { t } = useTranslation()

	const optionsTab = [
		{ key: 'estudiantes>expediente>bitacora>alerta_temprana>titulo' },
		{ key: 'estudiantes>expediente>bitacora>cambios_identidad>titulo' }
	]

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
			<h4>
				{t('estudiantes>expediente>bitacora>titulo', 'Bitácora de expediente')}
			</h4>
			<br />
			<HeaderTab
				options={optionsTab}
				activeTab={activeTab}
				setActiveTab={setActiveTab}
			/>
			<ContentTab activeTab={activeTab} numberId={activeTab}>
				{activeTab === 0 && <AlertaTempranaExpedienteEstudiantil />}
				{activeTab === 1 && <HistoricoCambiosIdentidadEstudiante />}
			</ContentTab>
		</>
	)
}

export default BitacoraExpediente
