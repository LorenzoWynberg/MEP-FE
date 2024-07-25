import React, { useState, useEffect } from 'react'
import HeaderTab from 'Components/Tab/LinkedHeader'
import ContentTab from 'Components/Tab/Content'
import Historico from './_partials/ServicioComunalEstudiantil/Historico'
import Agregar from './_partials/ServicioComunalEstudiantil/Agregar'
import Editar from './_partials/ServicioComunalEstudiantil/Editar'
import { Helmet } from 'react-helmet'
import withRouter from 'react-router-dom/withRouter'
import Notification from '../../../../Hoc/Notificaction'
import { useTranslation } from 'react-i18next'
import { use } from 'i18next'

const ServicioComunalEstudiantil = props => {
	const { t } = useTranslation()
	const [activeTab, setActiveTab] = useState(0)
	const optionsTab = [
		{ title: 'Historico', path: '/' },
		{ title: 'Mantenimiento', path: '/registro' }
	]

	useEffect(() => {
		if (props.activeTab) {
			setActiveTab(props.activeTab)
		}
	}, [props.activeTab])

	return (
		<Notification>
			{showSnackbar => {
				return (
					<>
						<Helmet>
							<title>
								{/* TODO: Translate */}
								{/* {t('expediente_ce>informacion_general>titulo', 'Información general')} */}
								Historico SCE
							</title>
						</Helmet>
						<h4>
							{/* TODO: Translate */}
							{/* {t('expediente_ce>informacion_general>titulo', 'Información general')} */}
							Servicio comunal estudiantil
						</h4>
						<HeaderTab options={optionsTab} activeTab={activeTab} setActiveTab={setActiveTab} />
						<ContentTab activeTab={activeTab} numberId={activeTab}>
							{activeTab === 0 && <Historico {...props} />}
							{activeTab === 1 && props.match.params.id && <Editar {...props} />}
							{activeTab === 1 && !props.match.params.id && <Agregar {...props} />}
						</ContentTab>
					</>
				)
			}}
		</Notification>
	)
}

export default withRouter(ServicioComunalEstudiantil)
