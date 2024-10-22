import axios from 'axios'
import { useState } from 'react'
import { Helmet } from 'react-helmet'
import Loader from 'Components/Loader'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import ContentTab from 'Components/Tab/Content'
import HeaderTab from 'Components/Tab/LinkedHeader'
import { envVariables } from 'Constants/enviroment'
import Notification from '../../../../Hoc/Notificaction'

const Logros = props => {
	const { t } = useTranslation()
	const [loading, setLoading] = useState(true)
	const state = useSelector(store => ({
		selects: store.selects,
		currentInstitution: store.authUser.currentInstitution
	}))

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

	useEffect(() => {
		const loadData = async () => {
			try {
				const response = await axios.get(
					`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/TipoCatalogo`
				)
				console.log('lore response catalogos', response)
			} catch (error) {
				console.error('Error loading catalogos:', error)
				setLoading(false)
			}
		}
		loadData()
		console.log('lore selects', state.selects)
		console.log('lore institucion', state.currentInstitution)
	}, [])

	if (loading) <Loader />

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
