import React, { useEffect, useState, useMemo, useRef } from 'react'
import { Col, Row } from 'reactstrap'
import { useActions } from 'Hooks/useActions'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { envVariables } from 'Constants/enviroment'
import { formatoOracion } from 'utils/utils'
import {
	filterInstitutionsPaginated,
	cleanInstitutions,
	GetServicioComunalByInstitucionId,
	getCertificadosByInstitucionFiltered
} from 'Redux/configuracion/actions'
import { Document } from '@react-pdf/renderer'
import withRouter from 'react-router-dom/withRouter'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import CancelIcon from '@mui/icons-material/RemoveCircle'
import Tooltip from '@mui/material/Tooltip'
import styles from './ServicioComunal.css'
import { handleChangeInstitution, updatePeriodosLectivos, desactivarServicioComunal } from 'Redux/auth/actions'
import BarLoader from 'Components/barLoader/barLoader'
import { useHistory } from 'react-router-dom'
import colors from 'assets/js/colors'
import { useTranslation } from 'react-i18next'
import { RemoveRedEyeRounded, Edit } from '@material-ui/icons'
import SimpleModal from 'Components/Modal/simple'
import ModalSCE from './_partials/ModalSCE'
import { Delete } from '@material-ui/icons'
import ReportHeader from 'Views/app/reportes/_partials/ReportHeader'
import axios from 'axios'
import { useReactToPrint } from 'react-to-print'

const Actas = props => {
	const [data, setData] = useState([])
	const [base64, setBase64] = useState('')
	const printRef = useRef()
	const [htmlToShow, setHtmlToShow] = useState('')
	const [certData, setCertData] = useState({})
	const [publicos, setPublicos] = useState(true)
	const [openDialog, setOpenDialog] = useState(false)
	const [institucionId, setInstitucionId] = useState(localStorage.getItem('idInstitucion'))
	const [codSaber, setCodSaber] = useState()
	const [dropdownToggle, setDropdownToggle] = useState(false)
	const [firstCalled, setFirstCalled] = useState(false)
	const [studentId, setStudentId] = useState()
	const [loading, setLoading] = useState(true)
	const [expediente, setExpediente] = useState(null)
	const { t } = useTranslation()
	const history = useHistory()
	const { hasAddAccess = true, hasEditAccess = true, hasDeleteAccess = true } = props

	const toggle = () => {
		setDropdownToggle(!dropdownToggle)
	}

	const reactToPrintContent = React.useCallback(() => {
		return printRef.current
	}, [printRef.current])
	const handlePrint = useReactToPrint({
		content: reactToPrintContent
	})
	const storeState = useSelector(store => {
		return {
			institution: store.authUser.currentInstitution,
			info_general: store.VistasUsuarios.info_general
		}
	})
	const { authUser } = useSelector(store => store.authUser)
	const { accessRole } = useSelector((state: any) => state?.authUser?.currentRoleOrganizacion)

	const idInstitucion = localStorage.getItem('idInstitucion')

	const selectedInstitution = localStorage.getItem('selectedInstitution')

	const state = useSelector((store: any) => {
		return {
			centros: store.configuracion.instituciones,
			totalCount: store.configuracion.instituciones.totalCount,
			selects: store.selects,
			accessRole: store.authUser.currentRoleOrganizacion.accessRole,
			permisos: store.authUser.rolPermisos
		}
	})

	const actions = useActions({
		filterInstitutionsPaginated,
		cleanInstitutions,
		GetServicioComunalByInstitucionId,
		handleChangeInstitution,
		updatePeriodosLectivos,
		desactivarServicioComunal,
		getCertificadosByInstitucionFiltered
	})

	useEffect(() => {
		axios
			.get(`${envVariables.BACKEND_URL}/api/ServicioComunal/Actas/GetActasByInstitucionId/${idInstitucion}`)
			.then(response => {
				setData(response.data)
			})
			.catch(error => {})
			.finally(() => setLoading(false))
	}, [])

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

	const [pagination, setPagination] = useState({
		page: 1,
		selectedPageSize: 6,
		selectedColumn: '',
		searchValue: '',
		orderColumn: '',
		orientation: ''
	})

	useEffect(() => {
		setFirstCalled(true)
		return () => {
			actions.cleanInstitutions()
		}
	}, [])

	const setInstitution = async id => {
		await actions.handleChangeInstitution(id)
		await actions.updatePeriodosLectivos(id)
	}

	if (!tienePermiso || tienePermiso?.leer == 0) {
		return <h4>{t('No tienes permisos para acceder a esta sección')}</h4>
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
					<h3 className='mt-2 mb-3'>
						{/* {t('expediente_ce>titulo', 'Expediente Centro Educativo')} */}
						Actas
					</h3>
				</Col>
				<Col xs={12}>
					<TableReactImplementation
						data={data}
						msjButton='Generar Acta'
						showAddButton={tienePermiso && tienePermiso?.agregar == 1}
						avoidSearch
						onSubmitAddButton={() => {
							setLoading(true)
							axios
								.get(
									`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/Institucion/GetById/${idInstitucion}`
								)
								.then(res => {
									const data = { institucionId, codSaber: res.data.codigo }

									axios
										.post(
											`${envVariables.BACKEND_URL}/api/ServicioComunal/Actas/GenerarNuevaActa/`,
											data
										)
										.then(r2 => {
											axios
												.get(
													`${envVariables.BACKEND_URL}/api/ServicioComunal/Actas/GetActasByInstitucionId/${idInstitucion}`
												)
												.then(response => {
													setData(response.data)
												})
												.catch(error => {
													console.log('error', error)
												})
												.finally(() => setLoading(false))
										})
								})
						}}
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

const Table = styled.table`
	border-collapse: collapse;
	width: 100%;
	thead {
		font-width: bold;
		text-align: center;
	}
	th {
		border: solid 1px;
		padding: 2px;
	}
	td {
		text-align: center;
		border: solid 1px;
		padding: 2px;
	}
`

const Card = styled.div`
	border-radius: 15px;
	min-width: 100%;
	min-height: 100%;
	border-color: gray;
	background: white;
	padding: 15px;
`
const Linea = styled.hr`
	width: 100%;
	background-color: black;
	height: 1px;
	border: none;
	margin: 0;
`
const Seccion = styled.section`
	text-align: center;
`
