import React from 'react'
import { Row, Container } from 'reactstrap'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import Loader from '../../../../../../components/Loader'
import HistoricoAlertaDetail from './HistoricoAlertaDetail'
import { getEstadosAlerta } from 'Redux/alertaTemprana/actionsAlerts'
import ContentTab from 'Components/Tab/Content'
import { useTranslation } from 'react-i18next'
import { useActions } from 'Hooks/useActions'

type AlertaProps = {
	verificarAcceso: any
}

type IState = {
	expedienteEstudiantil: any
	authUser: any
	identification: any
}

const AlertaTempranaExpedienteEstudiantil: React.FC<AlertaProps> = props => {
	const { t } = useTranslation()
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

	const handleCurrentAlert = (alert: any) => {
		setCurrentAlert(alert)
	}

	const subHeaders = {
		students: t(
			'alerta_temprana>mostrar_alerta_estudiante',
			'Muestra el detalle de las alertas de un estudiante. independientemente del centro educativo que las registrará'
		),
		main: t(
			'alerta_temprana>mostrar_alerta',
			'Muestra las alertas tempranas del centro educativo seleccionado'
		),
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
		<Wrapper>
			<Title>
				{t(
					'estudiantes>expediente>bitacora>alerta_temprana>sub_titulo',
					'Histórico de alertas tempranas'
				)}
			</Title>
			{state.identification.loading ? (
				<Loader />
			) : (
				<HistoricoAlertaDetail studentId={state.identification.data.id} />
			)}
		</Wrapper>
	)
}

const Wrapper = styled.div`
	margin-top: 20px;
`

const Title = styled.h4`
	color: #000;
`

export default AlertaTempranaExpedienteEstudiantil
