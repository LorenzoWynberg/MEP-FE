import React, { useState, useEffect } from 'react'
import axios from 'axios'
import HeaderTab from 'Components/Tab/LinkedHeader'
import ContentTab from 'Components/Tab/Content'
import Historico from './_partials/ServicioComunalEstudiantil/Historico'
import Certificados from './_partials/ServicioComunalEstudiantil/Certificados'
import Actas from './_partials/ServicioComunalEstudiantil/Actas'
import Agregar from './_partials/ServicioComunalEstudiantil/Agregar'
import Editar from './_partials/ServicioComunalEstudiantil/Editar'
import { Helmet } from 'react-helmet'
import Loader from 'Components/Loader'
import { useSelector } from 'react-redux'
import withRouter from 'react-router-dom/withRouter'
import Notification from '../../../../Hoc/Notificaction'
import { useTranslation } from 'react-i18next'

const ServicioComunalEstudiantil = props => {
	const { t } = useTranslation()
	const [aplicaSCE, setAplicaSCE] = useState(true)
	const [loading, setLoading] = useState(true)
	const [activeTab, setActiveTab] = useState(0)
	const idInstitucion = localStorage.getItem('idInstitucion')

	const validarInstitucionSCE = async () => {
		try {
			const response = await axios.post(
				`https://mep-saber.azurewebsites.net/api/ServicioComunal/VerificarInstitucionAplicaSCE?idInstitucion=${idInstitucion}`
			)
			setAplicaSCE(response.data)
		} catch (error) {
			console.error('API error:', error)
		}
	}

	const validarAcceso = async () => {
		await Promise.all([validarInstitucionSCE()])
		setLoading(false)
	}

	useEffect(() => {
		setLoading(true)
		validarAcceso()
	}, [])

	const mantenimientoTab = !props.match.params.id
		? { title: 'Mantenimiento', path: '/registro' }
		: { title: 'Mantenimiento', path: `/editar/${props.match.params.id}` }

	const optionsTab = [
		{ title: 'Historico', path: '/' },
		mantenimientoTab,
		{ title: 'Actas', path: '/actas' },
		{ title: 'Certificados', path: '/certificados' }
	]

	return (
		<Notification>
			{showSnackbar => {
				return (
					<>
						<Helmet>
							<title>Historico SCE</title>
						</Helmet>
						{aplicaSCE ? (
							<h4>Servicio comunal estudiantil</h4>
						) : (
							<h4>Esta institución no cuenta con servicio comunal estudiantil.</h4>
						)}
						<div>
							{loading ?? <Loader />}
							{!loading && aplicaSCE && (
								<>
									<HeaderTab options={optionsTab} activeTab={props.activeTab} />
									<ContentTab activeTab={props.activeTab} numberId={props.activeTab}>
										{props.activeTab === 0 && <Historico {...props} />}
										{props.activeTab === 1 && props.match.params.id && <Editar {...props} />}
										{props.activeTab === 1 && !props.match.params.id && <Agregar {...props} />}
										{props.activeTab === 2 && <Actas {...props} />}
										{props.activeTab === 3 && <Certificados {...props} />}
									</ContentTab>
								</>
							)}
						</div>
					</>
				)
			}}
		</Notification>
	)
}

export default withRouter(ServicioComunalEstudiantil)
