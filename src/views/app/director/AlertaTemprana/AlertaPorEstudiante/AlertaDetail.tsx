import React, { useEffect, useMemo, useState } from 'react'
import { TableReactImplementation } from 'Components/TableReactImplementation'

import { Col, Row } from 'reactstrap'
import { Colxx } from 'Components/common/CustomBootstrap'

import Tooltip from '@mui/material/Tooltip'
import VisibilityIcon from '@mui/icons-material/Visibility'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import InputWrapper from 'Components/wrappers/InputWrapper'

import { useActions } from 'Hooks/useActions'
import { getObservacionesAlertas, getAccionAlerta, getAlertaEstudiante } from 'Redux/alertaTemprana/actionsAlerts'
import { useSelector } from 'react-redux'
import moment from 'moment'
import BackIcon from '@material-ui/icons/ArrowBackIos'
import styled from 'styled-components'
import colors from 'Assets/js/colors'
import { useTranslation } from 'react-i18next'
import AgregarAccion from '../modals/AgregarAccion'
import VerAccion from '../modals/VerAccion'

interface IProps {
	student: any
	currentAlert: any
	setCurrentAlert: Function,
	permisoAgregar:any
}

const HistorialAlerta: React.FC<IProps> = props => {
	const { t } = useTranslation()
	const { student, currentAlert, setCurrentAlert } = props
	const { observacionesAlerta } = useSelector(state => state.alertaTemprana)
	const [viewAcciones, setViewAcciones] = useState(false)
	const [viewAccion, setViewAccion] = useState(false)
	const [accionSelected, setAccionSelected] = useState(null)

	const actions = useActions({
		getObservacionesAlertas,
		getAlertaEstudiante,
		getAccionAlerta
	})

	const fetch = async () => {
		await actions.getObservacionesAlertas(currentAlert.alertasPorEstudianteid)
	}

	const fetchAccion = async id => {
		try {
			const response = await actions.getAccionAlerta(id)
			if (!response.error) {
				setAccionSelected(response.data)
				setViewAccion(true)
			}
		} catch (e) {
			console.log('Error')
		}
	}

	useEffect(() => {
		fetch()
	}, [currentAlert])

	const columns = useMemo(() => {
		return [
			{
				Header: t('alerta_temprana>estado', 'Estado de la alerta'),
				accessor: 'estadoAlerta',
				label: '',
				column: '',
				Cell: ({ cell, row, data }) => {
					const isLast = row.index === data.length - 1
					let color = colors.opaqueGray
					let colorTxt = '#000'

					if (isLast) {
						color = colors.primary
						colorTxt = '#fff'
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
								{row?.original?.estadoAlerta}
							</div>
						</div>
					)
				}
			},

			{
				Header: t('alerta_temprana>descripcion', 'Descripción'),
				accessor: 'descripcion',
				label: '',
				column: ''
			},
			{
				Header: t('alerta_temprana>observacion', 'Observación'),
				accessor: 'observacion',
				label: '',
				column: ''
			},
			{
				Header: t('alerta_temprana>registrada', 'Registrada'),
				accessor: 'registrada',
				label: '',
				column: '',
				Cell: ({ row }) => <div>{moment(row.original.registrada).format('DD/MM/YYYY')}</div>
			},
			{
				Header: t('alerta_temprana>institucion', 'Institución'),
				accessor: 'institucion',
				label: '',
				column: ''
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
								onClick={() => fetchAccion(row.original.id)}
							>
								<Tooltip title={t('common>reactselect>seleccione', 'Seleccionar')}>
									<VisibilityIcon style={{ fontSize: 20 }} />
								</Tooltip>
							</button>
						</>
					)
				}
			}
		]
	}, [observacionesAlerta, t])

	const data = useMemo(() => observacionesAlerta, [observacionesAlerta, t])

	return (
		<Colxx className='mt-3 mb-5' sm='12'>
			<Back
				onClick={() => {
					setCurrentAlert(null)
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
			<Row>
				<Col xs={12} md={6}>
					<InputWrapper classNames=' backgroundCard backgroundCard-gray'>
						<Grid xs={12} container>
							<Grid xs={12} direction='row' className='mt-1' container>
								<Grid container direction='column' xs={12}>
									<Grid item xs>
										<div style={{ fontSize: '14px' }}>
											<b>Tipo Alerta: </b>
											{currentAlert.tipoalerta}
										</div>
										<StadoAlerta>
											Esta alerta se encuentra:{' '}
											<div
												style={{
													padding: '0.2em 2em',
													backgroundColor: colors.primary,
													color: '#fff',
													textAlign: 'center',
													borderRadius: '8px',
													marginLeft: '10px'
												}}
											>
												{currentAlert.estadoalerta}
											</div>
										</StadoAlerta>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</InputWrapper>
				</Col>
				<Col sm={12} className='mt-3'>
					<Typography gutterBottom variant='h6'>
						Historia de la alerta
					</Typography>
				</Col>
			</Row>

			<TableReactImplementation
				showAddButton={props.permisoAgregar}
				columns={columns}
				data={data}
				onSubmitAddButton={() => setViewAcciones(true)}
				msjButton={'Agregar acción'}
			/>

			{viewAcciones && (
				<AgregarAccion
					open={viewAcciones}
					onClose={async () => {
						const dataAlerta = await actions.getAlertaEstudiante(currentAlert.alertasPorEstudianteid)
						setCurrentAlert(dataAlerta.data)
						await actions.getObservacionesAlertas(currentAlert.alertasPorEstudianteid)
						setViewAcciones(false)
					}}
					student={student}
					idAlerta={currentAlert.alertasPorEstudianteid}
				/>
			)}
			{accionSelected && (
				<VerAccion
					open={viewAccion}
					onClose={async () => {
						await actions.getObservacionesAlertas(currentAlert.alertasPorEstudianteid)
						setAccionSelected(null)
						setViewAccion(false)
					}}
					data={accionSelected}
				/>
			)}
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
const StadoAlerta = styled.div`
	display: flex;
	align-items: center;
	padding: 0 5px;
	margin-top: 20px;
	font-size: 14px;
`

const BackTitle = styled.span`
	color: #000;
	font-size: 14px;
	font-size: 16px;
`

export default HistorialAlerta
