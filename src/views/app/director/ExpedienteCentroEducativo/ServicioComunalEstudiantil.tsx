import React, { useState, useEffect } from 'react'
import axios from 'axios'
import HeaderTab from 'Components/Tab/LinkedHeader'
import ContentTab from 'Components/Tab/Content'
import Historico from './_partials/ServicioComunalEstudiantil/Historico'
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

	const optionsTab = [
		{ title: 'Historico', path: '/' },
		{ title: 'Mantenimiento', path: '/registro' }
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
