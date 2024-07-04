import React, { useEffect, useMemo } from 'react'
import { TableReactImplementation } from 'Components/TableReactImplementation'

import { Col, Row } from 'reactstrap'
import { Colxx } from 'Components/common/CustomBootstrap'

import Tooltip from '@mui/material/Tooltip'
import VisibilityIcon from '@mui/icons-material/Visibility'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import InputWrapper from 'Components/wrappers/InputWrapper'
import TouchAppIcon from '@material-ui/icons/TouchApp'

import { useActions } from 'Hooks/useActions'
import { getAlertasPorEstudiante } from 'Redux/alertaTemprana/actionsAlerts'
import { useSelector } from 'react-redux'
import moment from 'moment'
import BackIcon from '@material-ui/icons/ArrowBackIos'
import styled from 'styled-components'
import colors from 'Assets/js/colors'
import { useTranslation } from 'react-i18next'
import { showProgress, hideProgress } from 'Utils/progress'

interface IProps {
	onSelected: Function
	student
	setCurrentAlert: (e) => void
}

const AlertaEstudiante: React.FC<IProps> = props => {
	const { t } = useTranslation()
	const { onSelected, student, setCurrentAlert } = props
	const { alertasPorEstudiante } = useSelector(state => state.alertaTemprana)

	const actions = useActions({
		getAlertasPorEstudiante
	})

	const fetch = async () => {
		showProgress()

		await actions.getAlertasPorEstudiante(student?.identidadEstudianteId, 15, 1)
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
			},
			{
				Header: t('buscador_ce>buscador>columna_acciones', 'Acciones'),
				accessor: 'actions',
				label: '',
				column: '',
				Cell: ({ row }) => {
					const fullRow = data[row.index]
					return (
						<>
							<button
								style={{
									border: 'none',
									background: 'transparent',
									cursor: 'pointer',
									color: 'grey'
								}}
								onClick={() => {
									setCurrentAlert(fullRow)
								}}
							>
								<Tooltip title={t('common>reactselect>seleccione', 'Seleccionar')}>
									<TouchAppIcon style={{ fontSize: 30 }} />
								</Tooltip>
							</button>
						</>
					)
				}
			}
		]
	}, [alertasPorEstudiante, t])

	const data = useMemo(() => alertasPorEstudiante, [alertasPorEstudiante, t])

	return (
		<Colxx className='mt-3 mb-5' sm='12'>
			<Back
				onClick={() => {
					onSelected(null)
				}}
			>
				<BackIcon />
				<BackTitle>{t('edit_button>regresar', 'Regresar')}</BackTitle>
			</Back>
			<Row className='mb-5'>
				<Col
					xs={12}
					md={{
						size: 6,
						orden: 5
					}}
				>
					<InputWrapper classNames=' backgroundCard backgroundCard-blue'>
						<Grid xs={12} container>
							<Grid xs={12} direction='row' className='mt-1' container>
								<Grid container direction='column' xs={12}>
									<Grid item xs>
										<Typography gutterBottom variant='subtitle1'>
											{t('alerta_temprana>estudiante_seleccionado', 'Estudiante seleccionado')}:
										</Typography>
										<Typography variant='body2'>
											{t(
												'buscador_ce>ver_centro>datos_director>identificacion',
												'Identificación'
											)}
											: {student?.identificacion}
										</Typography>
										<Typography variant='body2'>{student.modalidadNombre}</Typography>
										<Typography variant='body2'>
											{t(
												'estudiantes>traslados>gestion_traslados>solicitudes_traslado>columna_nombre',
												'Nombre Completo'
											)}
											: {student.nombreEstudiante}
										</Typography>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</InputWrapper>
				</Col>
			</Row>

			<TableReactImplementation
				columns={columns}
				data={data}
				
			/>
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

export default AlertaEstudiante
