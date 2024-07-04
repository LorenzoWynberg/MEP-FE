import React, { useState } from 'react'
import { Row, Container, Col } from 'reactstrap'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import Loader from '../../../../components/Loader'
import AppLayout from '../../../../layout/AppLayout'
import BuscarEstudiante from './AlertaPorEstudiante/BuscarEstudiante'
import AlertasEstudiante from './AlertaPorEstudiante/BuscarEstudiante/AlertaEstudiante'
import AlertaDetail from './AlertaPorEstudiante/AlertaDetail'
import { getEstadosAlerta } from 'Redux/alertaTemprana/actionsAlerts'

import HeaderPage from 'Components/common/Header'
import ContentTab from 'Components/Tab/Content'

import directorItems from '../../../../constants/directorMenu'
import { useTranslation } from 'react-i18next'
import { useActions } from 'Hooks/useActions'

import { verificarAcceso } from '../../../../Hoc/verificarAcceso';

type AlertaProps = {
	active: number,
	verificarAcceso:any
}

type IState = {
	expedienteEstudiantil: any
	authUser: any
	identification: any
}

const AlertaTemprana: React.FC<AlertaProps> = props => {
	const { t } = useTranslation()
	const [activeTab, setActiveTab] = React.useState<number>(0)
	const [currentAlert, setCurrentAlert] = React.useState<any>(null)
	const [currentStudent, setCurrentStudent] = React.useState<any>(null)

	const actions = useActions({
		getEstadosAlerta
	})

	const state = useSelector((store: IState) => {
		return {
			expedienteEstudiantil: store.expedienteEstudiantil,
			identification: store.identification,
			currentInstitucion: store.authUser.currentInstitution
		}
	})
	const fetch = async () => {
		await actions.getEstadosAlerta()
	}
	React.useEffect(() => {
		setActiveTab(props.active)
		fetch()
	}, [props.active])

	if (state.currentInstitucion?.id == -1) {
		return (
			<AppLayout items={directorItems}>
				<div className='dashboard-wrapper'>
					<section>
						<Container>
							<Row>
								<Col xs={12}>
									<h3>
										{t(
											'estudiantes>traslados>gestion_traslados>seleccionar',
											'Debe seleccionar un centro educativo en el buscador de centros educativos.'
										)}
									</h3>
								</Col>
							</Row>
						</Container>
					</section>
				</div>
			</AppLayout>
		)
	}

	const handleCurrentAlert = (alert: any) => {
		setCurrentAlert(alert)
	}

	const subHeaders = {
		students: t(
			'alerta_temprana>mostrar_alerta_estudiante',
			'Muestra el detalle de las alertas de un estudiante. independientemente del centro educativo que las registrará'
		),
		main: t('alerta_temprana>mostrar_alerta', 'Muestra las alertas tempranas del centro educativo seleccionado'),
		detail: t(
			'alerta_temprana>mostrar_alerta_detalle',
			'Muestra el estado y las acciones de seguimiento de la alerta temprana seleccionada'
		)
	}

	const getSubHeaderTexto = (): string => {
		if (currentAlert) return subHeaders.detail
		if (currentStudent) return subHeaders.students
		return subHeaders.main
	}

	return (
		<AppLayout items={directorItems}>
			<Container>
				<Row>
					<Col xs={12}>
						<HeaderPage
							title={t(
								'estudiantes>registro_matricula>matricula_estudian>estudian_matriculados>acciones>riesgo>colum_alerta',
								'Alerta temprana'
							)}
							subHeader={getSubHeaderTexto()}
							className={{ separator: 'mb-2' }}
						/>
					</Col>
					{state.identification.loading ? (
						<Loader />
					) : (
						<ContentTab activeTab={activeTab} numberId={activeTab}>
							{!currentStudent  && (
								props.verificarAcceso('estudiantesConAlertas', 'leer')?<BuscarEstudiante
									onSelectedStudent={student => {
										setCurrentStudent(student)
									}}
								/>:<p>No tiene permisos para acceder a esta vista.</p>
							)}
							{currentStudent && (
								<>
									{!currentAlert  && (
										props.verificarAcceso('alertasDelEstudiante', 'leer')?<AlertasEstudiante
											onSelected={student => {
												setCurrentStudent(student)
											}}
											student={currentStudent}
											setCurrentAlert={e => {
												handleCurrentAlert(e)
											}}
										/>:<p>No tiene permisos para acceder a esta vista.</p>
									)}
									{currentAlert && (
										props.verificarAcceso('accionesAlertaTemprana', 'leer')?<AlertaDetail
											currentAlert={currentAlert}
											student={currentStudent}
											permisoAgregar = {props.verificarAcceso('accionesAlertaTemprana', 'agregar')}
											setCurrentAlert={setCurrentAlert}
										/>:<p>No tiene permisos para acceder a esta vista.</p>
									)}
								</>
							)}
						</ContentTab>
					)}
				</Row>
			</Container>
		</AppLayout>
	)
}

const TitleBread = styled.h2`
	color: #000;
	margin-bottom: 15px;
`

export default verificarAcceso(AlertaTemprana)
