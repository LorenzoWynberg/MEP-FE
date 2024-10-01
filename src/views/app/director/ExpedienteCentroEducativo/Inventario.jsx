import React from 'react'
import { useState } from 'react'
import { Helmet } from 'react-helmet'
import HeaderTab from 'Components/Tab/Header'
import { useTranslation } from 'react-i18next'
import ContentTab from 'Components/Tab/Content'
import Computo from './_partials/inventario/Computo'
import Notification from '../../../../Hoc/Notificaction'

const Inventario = props => {
	const { t } = useTranslation()
	const [activeTab, setActiveTab] = useState(0)
	const optionsTab = [t('inventario>computo>titulo', 'Cómputo')]
	return (
		<Notification>
			{showSnackbar => {
				return (
					<>
						<Helmet>
							<title>{t('inventario>titulo', 'Inventario')}</title>
						</Helmet>
						<h4>{t('inventario>titulo', 'Inventario')}</h4>
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
