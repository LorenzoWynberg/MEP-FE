import React, { useEffect } from 'react'
import { useState } from 'react'
import { Helmet } from 'react-helmet'
import HeaderTab from 'Components/Tab/Header'
import { useTranslation } from 'react-i18next'
import ContentTab from 'Components/Tab/Content'
import OrientacionTab from './_partials/orientacion/OrientacionTab'
import Notification from '../../../../Hoc/Notificaction'
import { useSelector } from 'react-redux'
import Loader from 'Components/Loader'
import useLoadOrientacionSelects from 'Hooks/orientacion/useLoadOrientacionSelects'
import { isEmpty } from 'lodash'

const Orientacion = props => {
	const { selects, loading: selectsLoading } = useLoadOrientacionSelects()
	const [loading, setLoading] = useState(true)
	const [mediosIntervencion, setMediosIntervencion] = useState({})

	const { t } = useTranslation()
	const [activeTab, setActiveTab] = useState(0)
	const optionsTab = [
		t('expediente_ce>orientacion>tabs>grupal', 'Grupal'),
		t('expediente_ce>orientacion>tabs>individual', 'Individual (Consulta)'),
		t(
			'expediente_ce>orientacion>tabs>individualIntervencion',
			'Individual (Plan de intervención)'
		),
		t('expediente_ce>orientacion>tabs>asesoria', 'Asesoría'),
		t('expediente_ce>orientacion>tabs>mantenimiento', 'Mantenimiento')
	]

	const state = useSelector(store => {
		return {
			permisos: store.authUser.rolPermisos,
			selectedYear: store.authUser.selectedActiveYear,
			currentInstitution: store.authUser.currentInstitution
		}
	})

	useEffect(() => {
		if (selects.length !== 0) {
			let dictionary = new Object()
			selects.mediosIntervencion.forEach(m => {
				dictionary[m.nombre] = {
					id: m.id,
					nombre: m.nombre
				}
			})

			setMediosIntervencion(dictionary)

			setLoading(false)
		}
	}, [selects])

	return (
		<div>
			{!selectsLoading && !loading && !isEmpty(mediosIntervencion) ? (
				<Notification>
					{showSnackbar => {
						return (
							<>
								<Helmet>
									<title>
										{t('expediente_ce>orientacion>titulo', 'Orientación')}
									</title>
								</Helmet>
								<h4>{t('expediente_ce>orientacion>titulo', 'Orientación')}</h4>
								<br />
								<HeaderTab
									options={optionsTab}
									activeTab={activeTab}
									setActiveTab={setActiveTab}
								/>
								<ContentTab activeTab={activeTab} numberId={activeTab}>
									{activeTab === 0 && (
										<OrientacionTab
											{...props}
											title="Orientación grupal"
											tipoIntervencion={
												mediosIntervencion['Orientación grupal']
											}
										/>
									)}
									{activeTab === 1 && (
										<OrientacionTab
											{...props}
											title="Orientación individual - Consulta"
											tipoIntervencion={
												mediosIntervencion['Orientación individual - Consulta']
											}
										/>
									)}
									{activeTab === 2 && (
										<OrientacionTab
											{...props}
											title="Orientación individual - Plan de Intervención"
											tipoIntervencion={
												mediosIntervencion[
													'Orientación individual - Plan de Intervención'
												]
											}
										/>
									)}
									{activeTab === 3 && (
										<OrientacionTab
											{...props}
											title="Asesoria"
											tipoIntervencion={mediosIntervencion['Asesoria']}
										/>
									)}
									{activeTab === 4 && (
										<OrientacionTab
											{...props}
											title="Mantenimiento"
											tipoIntervencion={mediosIntervencion}
										/>
									)}
								</ContentTab>
							</>
						)
					}}
				</Notification>
			) : (
				<Loader />
			)}
		</div>
	)
}

export default Orientacion
