import React, { useState } from 'react'
import HeaderTab from 'Components/Tab/Header'
import ContentTab from 'Components/Tab/Content'
import './style.scss'
import { useTranslation } from 'react-i18next'
import HistoricoMatricula from './_partials/oferta/HistoricoMatricula'
import withAuthorization from '../../../../Hoc/withAuthorization'

const HistoricoMatriculaAuth = withAuthorization({
	id: 12,
	Modulo: 'Expediente Estudiantil',
	Apartado: 'Oferta Educativa',
	Seccion: 'Historial de centros Educativos'
})(HistoricoMatricula)

const Oferta = () => {
	const { t } = useTranslation()

	const [activeTab, setActiveTab] = useState(0)

	const optionsTab = [
		t('estudiantes>expediente>oferta_edu>nav>historial_ce', 'Historial de centros educativos'),
		t('estudiantes>expediente>oferta_edu>nav>info_acad', 'Información académica')
	]

	return (
		<>
			<h2>{t('estudiantes>expediente>oferta_edu>titulo', 'Oferta educativa')}</h2>
			<HeaderTab options={optionsTab} activeTab={activeTab} setActiveTab={setActiveTab} />
			<ContentTab activeTab={activeTab} numberId={activeTab}>
				{
					{
						0: <HistoricoMatriculaAuth />,
						1: <h2>{t('estudiantes>expediente>oferta_edu>info_acad>titulo', 'Información académica')}</h2>
					}[activeTab]
				}
			</ContentTab>
		</>
	)
}

// {open && <CentroEducativo open={open} centro={centro} toggleModal={toggleModal} />}

export default Oferta
