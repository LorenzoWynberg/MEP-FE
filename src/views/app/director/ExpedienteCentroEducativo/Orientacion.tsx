import React from 'react'
import { useState } from 'react'
import { Helmet } from 'react-helmet'
import HeaderTab from 'Components/Tab/Header'
import { useTranslation } from 'react-i18next'
import ContentTab from 'Components/Tab/Content'
import OrientacionTab from './_partials/orientacion/OrientacionTab'
import Notification from '../../../../Hoc/Notificaction'

const Orientacion = props => {
	const { t } = useTranslation()
	const [activeTab, setActiveTab] = useState(0)
	const optionsTab = [
		t('expediente_ce>orientacion>tabs>grupal', 'Grupal'),
		t('expediente_ce>orientacion>tabs>individual', 'Individual {Consulta}'),
		t(
			'expediente_ce>orientacion>tabs>individualIntervencion',
			'Individual {Plan de intervención}'
		),
		t('expediente_ce>orientacion>tabs>asesoria', 'Asesoría'),
		t('expediente_ce>orientacion>tabs>mantenimiento', 'Mantenimiento')
	]

	return (
		<Notification>
			{showSnackbar => {
				return (
					<>
						<Helmet>
							<title>
								{t('expediente_ce>orientacion>titulo', 'Orientación')}
							</title>
						</Helmet>
						<h4>{t('inventario>titulo', 'Orientación h4')}</h4>
						<br />
						<HeaderTab
							options={optionsTab}
							activeTab={activeTab}
							setActiveTab={setActiveTab}
						/>
						<ContentTab activeTab={activeTab} numberId={activeTab}>
							{activeTab === 0 && <OrientacionTab {...props} title="Grupal" />}
							{activeTab === 1 && (
								<OrientacionTab {...props} title="individual consulta" />
							)}
							{activeTab === 2 && (
								<OrientacionTab {...props} title="individual intervencion" />
							)}
							{activeTab === 3 && (
								<OrientacionTab {...props} title="asesoria" />
							)}
							{activeTab === 4 && (
								<OrientacionTab {...props} title="Mantenimiento" />
							)}
						</ContentTab>
					</>
				)
			}}
		</Notification>
	)
}

export default Orientacion
