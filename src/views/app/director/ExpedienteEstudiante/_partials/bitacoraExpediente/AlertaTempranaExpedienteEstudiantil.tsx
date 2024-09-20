import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import Loader from 'Components/Loader'
import HistoricoAlertaDetail from './HistoricoAlertaDetail'
import { useTranslation } from 'react-i18next'

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
	const state = useSelector((store: IState) => {
		return {
			identification: store.identification
		}
	})

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
