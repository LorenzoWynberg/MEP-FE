import React, { useState } from 'react'
import useNotification from 'Hooks/useNotification'
import HeaderTab from 'Components/Tab/Header'
import ContentTab from 'Components/Tab/Content'
import { withRouter } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import InfoGeneral from './_partials/general/InfoGeneral'
import DatosRegistrales from './_partials/general/DatosRegistrales'

const optionsTab = [
	{ title: 'Información personal' },
	{ title: 'Datos registrales' }
]

const General = () => {
	const { t } = useTranslation()
	const [activeTab, setActiveTab] = useState(0)
	const [snackBar, handleClick] = useNotification()

	const [snackbarContent, setSnackbarContent] = useState({
		msg: 'welcome',
		variant: 'info'
	})

	const toggleSnackbar = (variant, msg) => {
		setSnackbarContent({
			variant,
			msg
		})
		handleClick()
	}

	return (
		<div>
			<br />
			<h4>
				{t(
					'estudiantes>expediente>info_gen>info_gen>titulo',
					'Información general'
				)}
			</h4>
			<br />
			{snackBar(snackbarContent.variant, snackbarContent.msg)}
			<HeaderTab
				options={optionsTab}
				activeTab={activeTab}
				setActiveTab={setActiveTab}
				marginTop="3"
			/>
			<ContentTab activeTab={activeTab} numberId={activeTab}>
				{activeTab === 0 && (
					<InfoGeneral
						toggleSnackbar={toggleSnackbar}
						handleClick={handleClick}
					/>
				)}
				{activeTab === 1 && <DatosRegistrales />}
			</ContentTab>
		</div>
	)
}
export default withRouter(General)
