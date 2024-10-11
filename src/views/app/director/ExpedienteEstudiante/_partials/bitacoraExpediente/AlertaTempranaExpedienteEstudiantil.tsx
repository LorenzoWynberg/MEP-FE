import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import { useActions } from 'Hooks/useActions'
import withAuthorization from '../../../../../../Hoc/withAuthorization'
import { getAlertasPorEstudiante } from 'Redux/alertaTemprana/actionsAlerts'
import { useSelector } from 'react-redux'
import moment from 'moment'
import colors from 'Assets/js/colors'
import { useTranslation } from 'react-i18next'
import { showProgress, hideProgress } from 'Utils/progress'
import BarLoader from 'Components/barLoader/barLoader'

type AlertaProps = {
	identificacion: any
}

const AlertaTempranaExpedienteEstudiantil: React.FC<AlertaProps> = props => {
	const { t } = useTranslation()
	const { alertasPorEstudiante } = useSelector(state => state.alertaTemprana)
	const [loading, setLoading] = useState(true)

	const actions = useActions({
		getAlertasPorEstudiante
	})

	const fetch = async () => {
		showProgress()
		await actions.getAlertasPorEstudiante(props.identificacion, 15, 1)
		hideProgress()
		setLoading(false)
	}

	useEffect(() => {
		fetch()
	}, [props.identificacion])

	const columns = useMemo(() => {
		return [
			{
				Header: t('alerta_temprana>tabla>columna>codigo', 'Código saber'),
				accessor: 'codigosaber',
				label: '',
				column: ''
			},
			{
				Header: t(
					'alerta_temprana>tabla>columna>centro_educativo',
					'Centro educativo'
				),
				accessor: 'centroeducativo',
				label: '',
				column: ''
			},
			{
				Header: t('alerta_temprana>tipo_alerta', 'Tipo alerta'),
				accessor: 'tipoalerta',
				label: '',
				column: ''
			},
			{
				Header: t('alerta_temprana>registrada', 'Registrada'),
				accessor: 'fecharegistrada',
				label: '',
				column: '',
				Cell: ({ row }) => (
					<div>{moment(row.original.fecharegistrada).format('DD/MM/YYYY')}</div>
				)
			},

			{
				Header: t(
					'configuracion>ofertas_educativas>niveles>agregar>nivel',
					'Nivel'
				),
				accessor: 'nivel',
				label: '',
				column: ''
			},
			{
				Header: t('alerta_temprana>estado', 'Estado'),
				accessor: 'estadoalerta',
				label: '',
				column: '',
				Cell: ({ row }) => {
					let color = colors.primary
					let colorTxt = '#fff'

					if (
						row?.original?.estadoalerta === 'Eliminada' ||
						row?.original?.estadoalerta === 'Cerrada'
					) {
						color = colors.opaqueGray
						colorTxt = '#000'
					}
					return (
						<div>
							<div
								style={{
									padding: '0.2em 2em',
									backgroundColor: color,
									color: colorTxt,
									textAlign: 'center',
									borderRadius: '8px'
								}}
							>
								{row?.original?.estadoalerta}
							</div>
						</div>
					)
				}
			}
		]
	}, [alertasPorEstudiante, t])

	const data = useMemo(() => alertasPorEstudiante, [alertasPorEstudiante, t])

	if (loading) return <BarLoader />

	return (
		<Wrapper>
			<Title>
				{t(
					'estudiantes>expediente>bitacora>alerta_temprana>sub_titulo',
					'Histórico de alertas tempranas'
				)}
			</Title>
			<div className="mb-5">
				<TableReactImplementation
					columns={columns}
					data={data}
					avoidSearch={true}
				/>
			</div>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	margin-top: 20px;
`

const Title = styled.h4`
	color: #000;
`

export default withAuthorization({
	id: 99,
	Modulo: 'Expediente Estudiantil',
	Apartado: 'Bitácora expediente',
	Seccion: 'Alerta temprana'
})(AlertaTempranaExpedienteEstudiantil)
