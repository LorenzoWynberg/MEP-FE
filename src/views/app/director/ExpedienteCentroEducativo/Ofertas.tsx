import React, { useState, useEffect } from 'react'
import HeaderTab from 'Components/Tab/Header'
import ContentTab from 'Components/Tab/Content'
import OfertasTable from './_partials/ofertas/Ofertas.tsx'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import CursoLectivo from './_partials/ofertas/Cursolectivo'
import { getEducationalYears } from '../../../../redux/anioEducativo/actions'
import { Helmet } from 'react-helmet'
import MallasCurriculares from './_partials/ofertas/MallasCurriculares'
import { useTranslation } from 'react-i18next'

const Ofertas = (props) => {
	const { t } = useTranslation()
	const [activeTab, setActiveTab] = useState(0)
	const optionsTab = [
		t('buscador_ce>ver_centro>ofertas educativas', 'Ofertas educativas'),
		// "Mallas curriculares",
		t('estudiantes>matricula_estudiantil>curso_lectivo', 'Curso lectivo'),
		t('expediente-ce>malla_curricular', 'Malla curricular')
	]
	const state = useSelector((store) => {
		return {
			ofertas: store.institucion.ofertas,
			currentInstitution: store.authUser.currentInstitution
		}
	})

	const actions = useActions({ getEducationalYears })

	useEffect(() => {
		actions.getEducationalYears()
	}, [])

	const columns = [
		{
			label: t(
				'expediente_ce>ofertas_educativas>detalle_ofertas>columna>cod_pre',
				'Código Presupuestario'
			),
			column: 'codigoPresupuestario'
		},
		{
			label: t(
				'expediente_ce>ofertas_educativas>detalle_ofertas>columna>oferta',
				'Oferta educativa'
			),
			column: 'oferta'
		},
		{
			label: t(
				'expediente_ce>ofertas_educativas>detalle_ofertas>columna>modalidad',
				'Modalidad'
			),
			column: 'modalidad'
		},
		{
			label: t(
				'expediente_ce>ofertas_educativas>detalle_ofertas>columna>servicio',
				'Servicio'
			),
			column: 'servicio'
		},
		{
			label: t(
				'expediente_ce>ofertas_educativas>detalle_ofertas>columna>matricula',
				'Matrícula'
			),
			column: 'total'
		}
	]

	return (
		<>
			<Helmet>
				<title>
					{t(
						'buscador_ce>ver_centro>ofertas educativas',
						'Ofertas educativas'
					)}
				</title>
			</Helmet>
			<br />
			<HeaderTab
				options={optionsTab}
				activeTab={activeTab}
				setActiveTab={setActiveTab}
			/>
			<ContentTab activeTab={activeTab} numberId={activeTab}>
				{activeTab === 0 && (
					<OfertasTable
						data={state.ofertas.filter((oferta) => oferta.estado)}
						columns={columns}
						{...props}
					/>
				)}
				{activeTab === 1 && <CursoLectivo />}
				{activeTab === 2 && <MallasCurriculares /* readOnly */ />}
			</ContentTab>
		</>
	)
}

export default Ofertas
