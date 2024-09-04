import React, { useEffect, useState, useMemo, useRef } from 'react'
import { Col, Row } from 'reactstrap'
import { useSelector } from 'react-redux'
import { Button } from 'Components/CommonComponents'
import { envVariables } from 'Constants/enviroment'
import withRouter from 'react-router-dom/withRouter'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import Tooltip from '@mui/material/Tooltip'
import styles from './ServicioComunal.css'
import BarLoader from 'Components/barLoader/barLoader'
import colors from 'assets/js/colors'
import { useTranslation } from 'react-i18next'
import { RemoveRedEyeRounded } from '@material-ui/icons'
import SimpleModal from 'Components/Modal/simple'
import axios from 'axios'
import { useReactToPrint } from 'react-to-print'
import { isEmpty } from 'lodash'

const Actas = props => {
	const [data, setData] = useState([])
	const printRef = useRef()
	const [htmlToShow, setHtmlToShow] = useState('')
	const [openDialog, setOpenDialog] = useState(false)
	const [loading, setLoading] = useState(true)
	const [registrosSinActa, setRegistrosSinActa] = useState(true)
	const { t } = useTranslation()
	const institucionId = localStorage.getItem('idInstitucion')

	const reactToPrintContent = React.useCallback(() => {
		return printRef.current
	}, [printRef.current])
	const handlePrint = useReactToPrint({
		content: reactToPrintContent
	})

	const state = useSelector((store: any) => {
		return {
			centros: store.configuracion.instituciones,
			totalCount: store.configuracion.instituciones.totalCount,
			selects: store.selects,
			accessRole: store.authUser.currentRoleOrganizacion.accessRole,
			permisos: store.authUser.rolPermisos
		}
	})

	useEffect(() => {
		axios
			.get(`${envVariables.BACKEND_URL}/api/ServicioComunal/Actas/GetActasByInstitucionId/${institucionId}`)
			.then(response => {
				setData(response.data)
			})
			.catch(error => {})

		axios
			.get(`${envVariables.BACKEND_URL}/api/ServicioComunal/GetServiciosComunalByFilter/${institucionId}`)
			.then(response => {
				setRegistrosSinActa(!isEmpty(response.data.filter(item => !item.actaId)))
			})
			.catch(error => {})
			.finally(() => {
				setLoading(false)
			})
	}, [])

	const generarActa = () => {
		setLoading(true)
		axios
			.get(`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/Institucion/GetById/${institucionId}`)
			.then(res => {
				const data = { institucionId, codSaber: res.data.codigo }
				axios.post(`${envVariables.BACKEND_URL}/api/ServicioComunal/Actas/GenerarNuevaActa/`, data).then(r2 => {
					axios
						.get(
							`${envVariables.BACKEND_URL}/api/ServicioComunal/Actas/GetActasByInstitucionId/${institucionId}`
						)
						.then(response => {
							setData(response.data)
							axios
								.get(
									`${envVariables.BACKEND_URL}/api/ServicioComunal/GetServiciosComunalByFilter/${institucionId}`
								)
								.then(r3 => {
									setRegistrosSinActa(!isEmpty(r3.data.filter(item => !item.actaId)))
								})
								.catch(error => {
									console.log('error', error)
								})
								.finally(() => {
									setLoading(false)
								})
						})
						.catch(error => {
							console.log('error', error)
						})
				})
			})
	}

	const tienePermiso = state.permisos.find(permiso => permiso.codigoSeccion == 'actasSCE')

	const columns = useMemo(() => {
		return [
			{
				Header: 'Codigo',
				column: 'codigo',
				accessor: 'codigo',
				label: ''
			},
			{
				Header: 'Fecha',
				column: 'fechaInsercion',
				accessor: 'fechaInsercion',
				label: ''
			},
			{
				Header: t('buscador_ce>buscador>columna_acciones', 'Acciones'),
				column: '',
				accessor: '',
				label: '',
				Cell: ({ _, row, data }) => {
					const fullRow = data[row.index]
					return (
						<div
							style={{
								display: 'flex',
								placeContent: 'center',
								alignItems: 'center'
							}}
						>
							<Tooltip title={t('buscador_ce>buscador>columna_acciones>ver', 'Ver')}>
								<RemoveRedEyeRounded
									onClick={() => {
										axios
											.get(
												`${envVariables.BACKEND_URL}/api/ServicioComunal/Actas/ObtenerDocumentoActaById/${fullRow.id}`
											)
											.then(response => {
												setHtmlToShow(response.data)
												setOpenDialog(true)
											})
									}}
									style={{
										fontSize: 25,
										color: colors.darkGray,
										cursor: 'pointer'
									}}
								/>
							</Tooltip>
						</div>
					)
				}
			}
		]
	}, [t])

	if (!tienePermiso || tienePermiso?.leer == 0) {
		return <h4 className='mt-2'>{t('No tienes permisos para acceder a esta sección')}</h4>
	}

	return (
		<div className={styles}>
			{loading && <BarLoader />}

			{htmlToShow && openDialog && (
				<SimpleModal
					addMarginTitle
					txtBtnCancel='Cerrar'
					txtBtn='Imprimir'
					onConfirm={handlePrint}
					title='Acta'
					onClose={() => setOpenDialog(false)}
					stylesContent={{}}
					openDialog={openDialog}
				>
					{/* <object style={{ width: '50vw', height: '90vh' }} data={`data:application/pdf;base64,${base64}`} /> */}
					<div ref={printRef} className='content' dangerouslySetInnerHTML={{ __html: htmlToShow }}></div>
				</SimpleModal>
			)}

			<Row>
				<Col xs={12}>
					<h3
						className='mt-2 mb-3'
						style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
					>
						{/* {t('expediente_ce>titulo', 'Expediente Centro Educativo')} */}
						Actas
						{tienePermiso && tienePermiso?.agregar == 1 && registrosSinActa && (
							<span>
								<Button
									style={{ cursor: 'pointer' }}
									color='primary'
									onClick={() => {
										generarActa()
									}}
								>
									Generar Acta
								</Button>
							</span>
						)}
					</h3>
				</Col>
				<Col xs={12}>
					<TableReactImplementation
						data={data}
						showAddButton={false}
						avoidSearch
						columns={columns}
						orderOptions={[]}
						pageSize={10}
						backendSearch
					/>
				</Col>
			</Row>
		</div>
	)
}

export default withRouter(Actas)
