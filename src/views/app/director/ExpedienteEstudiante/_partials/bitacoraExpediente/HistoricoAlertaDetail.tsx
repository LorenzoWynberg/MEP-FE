import React, { useEffect, useMemo } from 'react'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import { Col, Row } from 'reactstrap'
import { Colxx } from 'Components/common/CustomBootstrap'
import { useActions } from 'Hooks/useActions'
import { getAlertasPorEstudiante } from 'Redux/alertaTemprana/actionsAlerts'
import { useSelector } from 'react-redux'
import moment from 'moment'
import styled from 'styled-components'
import colors from 'Assets/js/colors'
import { useTranslation } from 'react-i18next'
import { showProgress, hideProgress } from 'Utils/progress'

interface IProps {
	studentId
}

const HistoricoAlertaDetail: React.FC<IProps> = props => {
	const { t } = useTranslation()
	const { studentId } = props
	const { alertasPorEstudiante } = useSelector(state => state.alertaTemprana)

	const actions = useActions({
		getAlertasPorEstudiante
	})

	const fetch = async () => {
		showProgress()
		debugger
		await actions.getAlertasPorEstudiante(studentId, 15, 1)
		hideProgress()
	}
	useEffect(() => {
		fetch()
	}, [])

	const columns = useMemo(() => {
		return [
			{
				Header: t('alerta_temprana>tabla>columna>codigo', 'Código saber'),
				accessor: 'codigosaber',
				label: '',
				column: ''
			},
			{
				Header: t('alerta_temprana>tabla>columna>centro_educativo', 'Centro educativo'),
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
				Cell: ({ row }) => <div>{moment(row.original.fecharegistrada).format('DD/MM/YYYY')}</div>
			},

			{
				Header: t('configuracion>ofertas_educativas>niveles>agregar>nivel', 'Nivel'),
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

					if (row?.original?.estadoalerta === 'Eliminada' || row?.original?.estadoalerta === 'Cerrada') {
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

	console.log('JP DATA: ', data)

	return (
		<Colxx className='mt-3 mb-5' sm='12'>
			<TableReactImplementation columns={columns} data={data} avoidSearch={true} />
		</Colxx>
	)
}

const Back = styled.div`
	display: flex;
	align-items: center;
	cursor: pointer;
	padding: 0 5px;
	margin-bottom: 20px;
`

const BackTitle = styled.span`
	color: #000;
	font-size: 14px;
	font-size: 16px;
`

export default HistoricoAlertaDetail
