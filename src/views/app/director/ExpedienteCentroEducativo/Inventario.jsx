import React, { useState } from 'react'
import HeaderTab from 'Components/Tab/Header'
import ContentTab from 'Components/Tab/Content'
import Computo from './_partials/inventario/Computo'
import { Helmet } from 'react-helmet'
import Notification from '../../../../Hoc/Notificaction'
import { useTranslation } from 'react-i18next'

const Inventario = props => {
	const { t } = useTranslation()
	const [activeTab, setActiveTab] = useState(0)
	const optionsTab = [
		t('expediente_ce>informacion_general>nav>perfilaa', 'Cómputo')
	]
	return (
		<Notification>
			{showSnackbar => {
				return (
					<>
						<Helmet>
							<title>
								{t(
									'expediente_ce>informacion_general>titulo',
									'Información general'
								)}
							</title>
						</Helmet>
						<h4>
							{t(
								'expediente_ce>informacion_general>titulo',
								'Información general'
							)}
						</h4>
						<br />
						<HeaderTab
							options={optionsTab}
							activeTab={activeTab}
							setActiveTab={setActiveTab}
						/>
						<ContentTab activeTab={activeTab} numberId={activeTab}>
							{activeTab === 0 && <Computo {...props} />}
						</ContentTab>
					</>
				)
			}}
		</Notification>
	)
}

export default Inventario
