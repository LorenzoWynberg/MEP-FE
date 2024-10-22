import React from 'react'
import { useState } from 'react'
import { Helmet } from 'react-helmet'
import HeaderTab from 'Components/Tab/LinkedHeader'
import { useTranslation } from 'react-i18next'
import ContentTab from 'Components/Tab/Content'
import Notification from '../../../../Hoc/Notificaction'

const Logros = props => {
	const { t } = useTranslation()
	const optionsTab = [
		{
			title: 'Logros',
			path: '/director/expediente-centro/logros-y-participaciones/historico/logros'
		},
		{
			title: 'Participaciones nivel 2',
			path: '/director/expediente-centro/logros-y-participaciones/historico/participaciones-nivel-2'
		},
		{
			title: 'Participaciones nivel 1',
			path: '/director/expediente-centro/logros-y-participaciones/historico/participaciones-nivel-1'
		},
		{
			title: 'Mantenimiento',
			path: '/director/expediente-centro/logros-y-participaciones/mantenimiento'
		}
	]
	return (
		<Notification>
			{showSnackbar => {
				return (
					<>
						<Helmet>
							<title>{t('logros>titulo', 'Logros y participaciones')}</title>
						</Helmet>
						<h4>{t('logros>titulo', 'Logros y participaciones')}</h4>
						<br />
						<HeaderTab options={optionsTab} activeTab={props.activeTab} />
						<ContentTab activeTab={props.activeTab} numberId={props.activeTab}>
							{/* {props.activeTab === 0 && <Computo {...props} />} */}
							{props.activeTab === 0 && <h1>Logros</h1>}
							{props.activeTab === 1 && <h1>Participaciones Nivel 2</h1>}
							{props.activeTab === 2 && <h1>Participaciones Nivel 1</h1>}
							{props.activeTab === 3 && <h1>Mantenimiento</h1>}
						</ContentTab>
					</>
				)
			}}
		</Notification>
	)
}

export default Logros
