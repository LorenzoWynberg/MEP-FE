import React, { useEffect, useState, useMemo } from 'react'
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
// import { Page, Text, View, Document, StyleSheet, BlobProvider, PDFDownloadLink } from '@react-pdf/renderer';
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

const Actas = props => {
	const [data, setData] = useState([])
	const [certData, setCertData] = useState({})
	const [publicos, setPublicos] = useState(true)
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
	const { authUser } = useSelector(store => store.authUser)
	const { accessRole } = useSelector((state: any) => state?.authUser?.currentRoleOrganizacion)
	const idInstitucion = localStorage.getItem('idInstitucion')

	// TODO: mappear los strings
	// const mapper = el => {
	// 	console.log('el', el)
	// 	return {
	// 		...el,
	// 		organizacionContraparte: formatoOracion(el.organizacionContraparte)
	// 	}
	// }

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
		axios.get(`${envVariables.BACKEND_URL}/api/ServicioComunal/Actas/GetActasByInstitucionId/${idInstitucion}`)
			.then(response => {
				// const _data = mapper(data.options)
				console.log('data', response)
				setData(response.data)
				setLoading(false)
			})
			.catch(error => {
				console.log('error', error)
				setLoading(false)
			})
	}, [])

	const tienePermiso = state.permisos.find(permiso => permiso.codigoSeccion == 'configurarinstituciones')

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
										console.log('fullRow', fullRow)
										axios.get(`${envVariables.BACKEND_URL}/api/ServicioComunal/Actas/ObtenerDocumentoActaById/${fullRow.id}`).then(response => {
											console.log('response', response)
											setCertData(response.data)
											setStudentId(fullRow.idEstudiante)
										});
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

	return (
		<div className={styles}>
			{loading && <BarLoader />}

			{studentId && (
				<SimpleModal
					btnCancel={false}
					addMarginTitle
					title='Certificado'
					onClose={() => setStudentId(null)}
					stylesContent={{}}
					onConfirm={() => {
						setStudentId(null)
					}}
					openDialog={studentId && true}
				>
					{/* <PDFDownloadLink document={<Document>
					<Page size="A4" style={stylesSheet.page}>
						<View> */}
					<ReportHeader />
					<Table>
						<tr>
							{typeof certData !== "object" && certData.map((v => <td>{v}</td>))}
						</tr>

					</Table>
					{/* </View>
					</Page>
				</Document>} fileName='pdf.pdf'>
						{({ blob, url, loading, error }) =>
							loading ? 'Loading document...' : 'Download now!'
						}
					</PDFDownloadLink > */}
				</SimpleModal>
			)
			}

			{
				!tienePermiso || tienePermiso.leer == 0 ? (
					<Row>
						<Col xs={12}>
							{/* TODO: i18n */}
							<h5>No tiene permiso para visualizar esta pagina</h5>
						</Col>
					</Row>
				) : (
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
								textButton="Generar Acta"
								showAddButton
								avoidSearch
								onSubmitAddButton={() => {
									alert()
								}}
								handleGetData={async (searchValue, _, pageSize, page, column) => {
									setPagination({
										...pagination,
										page,
										pageSize,
										column,
										searchValue
									})

									if (firstCalled) {
										setLoading(true)
										await actions.getCertificadosByInstitucionFiltered(

											idInstitucion, searchValue,
											1,
											250
										).then(data => console.log('dataiss', data))
										setLoading(false)
									}
								}}
								columns={columns}
								orderOptions={[]}
								pageSize={10}
								backendSearch
							/>
						</Col>
					</Row>
				)
			}
		</div >
	)
}

export default withRouter(Actas)


const stylesSheet = StyleSheet.create({
	page: {
		flexDirection: 'row',
		backgroundColor: '#E4E4E4'
	},
	section: {
		margin: 10,
		padding: 10,
		flexGrow: 1
	}
});
const Table = styled.table`
  border-collapse: collapse;
  width:100%;
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