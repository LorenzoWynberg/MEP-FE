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
import { envVariables } from 'Constants/enviroment'

const ServicioComunalEstudiantil = props => {
	const { t } = useTranslation()
	const [aplicaSCE, setAplicaSCE] = useState(true)
	const [loading, setLoading] = useState(true)
	const idInstitucion = localStorage.getItem('idInstitucion')

	const state = useSelector((store: any) => {
		return {
			permisos: store.authUser.rolPermisos
		}
	})

	const tienePermiso = state.permisos.find(
		permiso => permiso.codigoSeccion == 'registrosSCE'
	)

	const validarInstitucionSCE = async () => {
		try {
			const response = await axios.post(
				`${envVariables.BACKEND_URL}/api/ServicioComunal/VerificarInstitucionAplicaSCE?idInstitucion=${idInstitucion}`
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
		? {
				title: 'Mantenimiento',
				path: '/director/expediente-centro/sce/registro'
		  }
		: {
				title: 'Mantenimiento',
				path: `/director/expediente-centro/sce/editar/${props.match.params.id}`
		  }

	const optionsTab = [
		{ title: 'Historico', path: '/director/expediente-centro/sce' },
		mantenimientoTab,
		{ title: 'Actas', path: '/director/expediente-centro/sce/actas' },
		{
			title: 'Certificados',
			path: '/director/expediente-centro/sce/certificados'
		}
	]

	if (!tienePermiso || tienePermiso?.leer == 0) {
		return <h4>{t('No tienes permisos para acceder a esta sección')}</h4>
	}

	if (!aplicaSCE) {
		return (
			<h4>
				{t('Esta institución no cuenta con servicio comunal estudiantil.')}
			</h4>
		)
	}

	return (
		<Notification>
			{showSnackbar => {
				return (
					<>
						<Helmet>
							<title>Historico SCE</title>
						</Helmet>
						<h4>Servicio comunal estudiantil</h4>
						<div>
							{loading ?? <Loader />}
							{!loading && aplicaSCE && (
								<>
									<HeaderTab options={optionsTab} activeTab={props.activeTab} />
									<ContentTab
										activeTab={props.activeTab}
										numberId={props.activeTab}
									>
										{props.activeTab === 0 && <Historico {...props} />}
										{props.activeTab === 1 && props.match.params.id && (
											<Editar {...props} />
										)}
										{props.activeTab === 1 && !props.match.params.id && (
											<Agregar {...props} />
										)}
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
