import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Row, Col, Input as ReactstrapInput } from 'reactstrap'
import withRouter from 'react-router-dom/withRouter'
import {
	actualizarServicioComunal,
	getTablaEstudiantesServicioComunalById,
	GetServicioComunalInfoById
} from 'Redux/configuracion/actions'
import styles from './ServicioComunal.css'
import BuscadorServicioComunal from '../../../Buscadores/BuscadorServicioComunal'
import {
	Checkbox,
	FormControl,
	FormControlLabel,
	FormLabel,
	Radio,
	RadioGroup,
	Chip,
	Typography
} from '@material-ui/core'
import { Button } from 'Components/CommonComponents'

import { ObtenerInfoCatalogos } from 'Redux/formularioCentroResponse/actions'
import { useTranslation } from 'react-i18next'
import BarLoader from 'Components/barLoader/barLoader'
import TableStudents from './_partials/comunalTabla'
import SimpleModal from 'Components/Modal/simple'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useActions } from 'Hooks/useActions'
import { useSelector } from 'react-redux'
import { Search } from 'Components/TableReactImplementationServicio/Header'
import { isEmpty } from 'lodash'
import { useHistory } from 'react-router'

export const Editar: React.FC<IProps> = props => {
	const { t } = useTranslation()
	const [catalogos, setCatalogos] = React.useState([])
	const [areaProyecto, setAreaProyecto] = React.useState()
	const [showAreaProyecto, setShowAreaProyecto] = React.useState(false)
	const [showNombre, setShowNombre] = React.useState(false)
	const [objetivoNombre, setObjetivoNombre] = React.useState([])
	const [busqueda, setBusqueda] = React.useState()
	const [estudiantes, setEstudiantes] = React.useState([])
	const [checkedValid, setCheckedValid] = React.useState(false)
	const [nombresSeleccionados, setNombresSeleccionados] = React.useState([])
	const [nombreSend, setNombreSend] = React.useState([])
	const [nombreId, setNombreId] = React.useState()
	const [showBuscador, setShowBuscador] = React.useState(false)
	const [showTipoOrganizacion, setShowTipoOrganizacion] = React.useState(false)
	const [organizacionId, setOrganizacionId] = React.useState()
	const [organizacion, setOrganizacion] = React.useState()
	const [showModalidades, setShowModalidades] = React.useState(false)
	const [modalidadId, setModalidadId] = React.useState()
	const [modalidad, setModalidad] = React.useState()
	const idInstitucion = localStorage.getItem('idInstitucion')
	const [institutionImage, setInstitutionImage] = React.useState(null)
	const [loading, setLoading] = React.useState<boolean>(true)
	const [value, setValue] = React.useState(catalogos.areasProyecto && catalogos.areasProyecto[0].id)
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setValue((event.target as HTMLInputElement).value)
	}
	const [Cdate, setCDate] = useState(new Date().toLocaleDateString('fr-FR'))
	const [date, setDate] = useState(new Date())
	const [valueModalidad, setValueModalidad] = React.useState('')
	const [valueOrg, setValueOrg] = React.useState('')
	const [acompanante, setValueAcompanante] = React.useState('')
	const [descripcion, setValueDescripcion] = React.useState('')
	const [studentsSeleccionados, setStudentsSeleccionados] = React.useState([])
	const [students, setStudents] = useState([])
	const today = new Date()
	const history = useHistory()

	const mapper = el => {
		return {
			...el,
			id: el.matriculaId,
			image: el.img,
			edad: el.edad,
			fechaNacimiento: el.fechaNacimiento,
			nacionalidad: el.nacionalidad ? el.nacionalidad : '',
			genero: el.genero ? el.genero : '',
			cuentaCorreoOffice: el.cuentaCorreoOffice ? 'Sí' : 'No'
		}
	}
	useEffect(() => {
		const _data = studentsSeleccionados.map(mapper)
		setStudents(_data)
	}, [studentsSeleccionados])

	const actions = useActions({
		actualizarServicioComunal,
		GetServicioComunalInfoById,
		getTablaEstudiantesServicioComunalById
	})

	const state = useSelector((store: any) => {
		return {
			selectedYear: store.authUser.selectedActiveYear,
			permisos: store.authUser.rolPermisos
		}
	})

	const tienePermiso = state.permisos.find(permiso => permiso.codigoSeccion == 'registrosSCE')

	const isValid = () => {
		if (
			!idInstitucion ||
			!value ||
			!nombreId ||
			!modalidadId ||
			!organizacionId ||
			!acompanante ||
			!date ||
			!localStorage.getItem('loggedUser') ||
			// isEmpty(caracteristicasSeleccionados) ||
			isEmpty(estudiantes)
		) {
			return false
		} else {
			return true
		}
	}

	useEffect(() => {
		ObtenerInfoCatalogos().then(respone => {
			setCatalogos(respone)
		})
	}, [])

	useEffect(() => {
		actions
			.GetServicioComunalInfoById(props.match.params.id, idInstitucion)
			.then(res => {
				let data = res.options[0]
				setEstudiantes(data.listaEstudiantes.map(e => ({ ...e, idEstudiante: e.id })))
				setAreaProyecto(data.nombreAreaProyecto)
				setValue(data.areaProyectoId)
				setOrganizacion(data.nombreOrganizacionContraparte)
				setOrganizacionId(data.organizacionId)
				setValueAcompanante(data.nombreDocente)
				setModalidad(data.nombreModalidad)
				setModalidadId(data.modalidadId)
				setNombreSend(data.nombreProyecto)
				setNombreId(data.nombreProyectoId)
				setValueDescripcion(data.descripcion)
			})
			.finally(() => {
				setLoading(false)
			})
	}, [props.match?.params?.id])

	if (!tienePermiso || tienePermiso?.modificar == 0) {
		return <h4>{t('No tienes permisos para acceder a esta sección')}</h4>
	}

	if (!state.selectedYear.esActivo) {
		return <h4>{t('No se puede editar registros en un año lectivo no activo')}</h4>
	}

	if (loading) {
		return <BarLoader />
	}

	return (
		<div className={styles}>
			{showAreaProyecto && catalogos.areasProyecto && (
				<SimpleModal
					title='Área de proyecto'
					openDialog={showAreaProyecto}
					onConfirm={() => {
						setShowAreaProyecto(false)
					}}
					onClose={() => setShowAreaProyecto(false)}
				>
					<FormControl>
						<RadioGroup
							aria-labelledby='demo-radio-buttons-group-label'
							name='radio-buttons-group'
							value={value}
						>
							{catalogos?.areasProyecto &&
								catalogos.areasProyecto.map(item => (
									<Row
										className='py-2'
										style={{
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											borderBottom: '1px solid #d7d7d7'
										}}
									>
										<Col sm={3}>
											<FormControlLabel
												value={item.id}
												onClick={(e, v) => {
													e.persist()
													setValue(e.target.value)
													setAreaProyecto(item.nombre)
													setNombreSend(null)
													setNombreId(null)
												}}
												checked={value == item.id}
												control={<Radio />}
												label={item.nombre}
											/>
										</Col>
										<Col sm={9}>{item.descripcion}</Col>
									</Row>
								))}
						</RadioGroup>
						{checkedValid && !value && <span style={{ color: 'red' }}>Campo requerido</span>}
					</FormControl>
				</SimpleModal>
			)}

			{showModalidades && (
				<SimpleModal
					title='Tipo de proyecto'
					value={value}
					openDialog={showModalidades}
					onConfirm={() => {
						setShowModalidades(false)
					}}
					onClose={() => setShowModalidades(false)}
				>
					<FormControl>
						<RadioGroup aria-labelledby='demo-radio-buttons-group-label' name='radio-buttons-group'>
							{catalogos.modalidades &&
								catalogos.modalidades.map(item => (
									<Row
										className='py-2'
										style={{
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											borderBottom: '1px solid #d7d7d7'
										}}
									>
										<Col sm={3}>
											<FormControlLabel
												value={item.id}
												onClick={(e, v) => {
													e.persist()
													setModalidadId(e.target.value)
													setModalidad(item.nombre)
												}}
												checked={modalidadId == item.id}
												control={<Radio />}
												label={item.nombre}
											/>
										</Col>
										<Col sm={9}>{item.descripcion}</Col>
									</Row>
								))}
						</RadioGroup>
					</FormControl>
				</SimpleModal>
			)}
			{showTipoOrganizacion && (
				<SimpleModal
					title='Organizacion'
					openDialog={showTipoOrganizacion}
					onConfirm={() => {
						setShowTipoOrganizacion(false)
					}}
					onClose={() => setShowTipoOrganizacion(false)}
				>
					<FormControl>
						<RadioGroup
							aria-labelledby='demo-radio-buttons-group-label'
							name='radio-buttons-group'
							value={value}
						>
							{catalogos.tipoOrganizacion.map(item => (
								<Row
									className='py-2'
									style={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										borderBottom: '1px solid #d7d7d7'
									}}
								>
									<Col sm={12}>
										<FormControlLabel
											value={item.id}
											onClick={(e, v) => {
												e.persist()
												setOrganizacionId(e.target.value)
												setOrganizacion(item.nombre)
											}}
											checked={organizacionId == item.id}
											control={<Radio />}
											label={item.nombre}
										/>
									</Col>
								</Row>
							))}
						</RadioGroup>
					</FormControl>
				</SimpleModal>
			)}
			{showBuscador && (
				<SimpleModal
					title='Estudiantes'
					openDialog={showBuscador}
					onConfirm={() => {
						setShowBuscador(false)
					}}
					onClose={() => setShowBuscador(false)}
				>
					<BuscadorServicioComunal
						busqueda={busqueda}
						setEstudiantes={setEstudiantes}
						estudiantes={estudiantes}
					/>
				</SimpleModal>
			)}
			{nombresSeleccionados && value && !showBuscador && showNombre && catalogos.nombresProyecto && (
				<SimpleModal
					title='Nombre de proyecto'
					openDialog={showNombre}
					onConfirm={() => {
						setShowNombre(false)
					}}
					onClose={() => setShowNombre(false)}
				>
					<FormControl>
						<RadioGroup
							aria-labelledby='demo-radio-buttons-group-label'
							name='radio-buttons-group'
							value={value}
						>
							{catalogos.nombresProyecto
								.filter(item => parseInt(item.codigo) == parseInt(value))
								.map(item => (
									<Row
										className='py-2'
										style={{
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											borderBottom: '1px solid #d7d7d7'
										}}
									>
										<Col sm={3}>
											<FormControlLabel
												value={item.id}
												onClick={(e, v) => {
													e.persist()
													setNombreId(e.target.value)
													setNombreSend(item.nombre)
												}}
												checked={nombreId == item.id}
												control={<Radio />}
												label={item.nombre}
											/>
										</Col>
										<Col sm={9}>{item.descripcion}</Col>
									</Row>
								))}
						</RadioGroup>
					</FormControl>
				</SimpleModal>
			)}
			<h3 className='mt-2 mb-3'>
				{/* TODO: Translate */}
				{/* {t('servicio_comunal_title', 'Editar Servicio Comunal')} */}
				Editar servicio comunal estudiantil
			</h3>
			<Row>
				<Col sm={12}>
					<Card className='bg-white__radius mb-3'>
						<CardTitle>Editar Servicio Comunal</CardTitle>
						<Form>
							<Row className='mb-2'>
								<Col md={4}>
									<FormGroup>
										<Label>
											{t('registro_servicio_comunal>area_proyecto', 'Área de proyecto')}
										</Label>
										<Input
											key={areaProyecto}
											name='areaProyecto'
											value={areaProyecto ? areaProyecto : ''}
											readOnly
											onClick={() => !showAreaProyecto && setShowAreaProyecto(true)}
										/>
									</FormGroup>
								</Col>
								<Col md={4}>
									<FormGroup>
										<Label>{t('registro_servicio_comunal>objetivo', 'Nombre de proyecto')}</Label>
										<Input
											key={nombreSend}
											name='objetivo'
											value={nombreSend ? nombreSend : ''}
											readOnly
											onClick={() => areaProyecto && !showNombre && setShowNombre(true)}
										/>
									</FormGroup>
								</Col>
								<Col sm={4}>
									<FormGroup>
										<Label>{t('registro_servicio_comunal>modalidad', 'Tipo de proyecto')}</Label>
										<Input
											name='modalidad'
											type='text'
											value={modalidad}
											readOnly
											onClick={() => !showModalidades && setShowModalidades(true)}
											autoFocus={true}
										/>
									</FormGroup>
								</Col>
							</Row>
							<Row className='mb-2'>
								<Col sm={4}>
									<FormGroup>
										<Label>
											{t('registro_servicio_comunal>fecha_conclusion', 'Fecha de conclusión SCE')}
										</Label>
										<DatePicker
											dateFormat='dd/MM/yyyy'
											style={{
												zIndex: 99999
											}}
											popperPlacement={'right'}
											value={Cdate}
											onChange={date => {
												const d = new Date(date)
												setDate(d)
												setCDate(d.toLocaleDateString('fr-FR'))
											}}
											minDate={new Date(new Date().getFullYear(), 0, 1)}
											maxDate={today}
										/>
									</FormGroup>
								</Col>
								<Col sm={4}>
									<FormGroup>
										<Label>
											{t(
												'registro_servicio_comunal>organizacion_contraparte',
												'Tipo de organización contraparte'
											)}
										</Label>
										<Input
											name='organizacionContraparte'
											type='text'
											value={organizacion ? organizacion : ''}
											readOnly
											onClick={() => !showTipoOrganizacion && setShowTipoOrganizacion(true)}
											autoFocus={true}
										/>
									</FormGroup>
									{valueOrg}
								</Col>
								<Col sm={4}>
									<FormGroup>
										<Label>
											{t('registro_servicio_comunal>docente_acompaña', 'Persona tutor/a')}
										</Label>
										<Input
											style={{ border: checkedValid && !acompanante ? '1px solid red' : '' }}
											name='acompanante'
											type='text'
											value={acompanante}
											onChange={e => {
												setValueAcompanante(e.target.value)
											}}
											autoFocus={true}
										/>
										{checkedValid && !acompanante && (
											<span style={{ color: 'red' }}>Campo requerido</span>
										)}
									</FormGroup>
								</Col>
							</Row>
						</Form>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col sm={12}>
					{checkedValid && isEmpty(estudiantes) && (
						<span style={{ color: 'red' }}>Debe agregar estudiantes</span>
					)}
					<TableStudents
						button={
							<Button
								onClick={() => {
									showBuscador ? setShowBuscador(false) : setShowBuscador(true)
								}}
								color='primary'
								style={{ cursor: 'pointer' }}
							>
								Agregar
							</Button>
						}
						onlyViewModule={true}
						data={estudiantes}
						avoidSearch={true}
						hasEditAccess={true}
						setEstudiantes={setEstudiantes}
						estudiantes={estudiantes}
						closeContextualMenu={false}
					></TableStudents>
				</Col>
			</Row>

			<Row>
				<Col sm={12}>
					<p style={{ textAlign: 'center' }}>
						<Button
							outline={true}
							color='secondary'
							style={{ cursor: 'pointer', marginRight: '5px' }}
							onClick={() => {
								history.push('/director/expediente-centro/servicio-comunal')
							}}
						>
							Cancelar
						</Button>
						<Button
							color='primary'
							onClick={() => {
								setLoading(true)
								if (idInstitucion) {
									if (!isValid()) {
										setCheckedValid(true)
										setLoading(false)
									} else {
										actions
											.actualizarServicioComunal({
												id: parseInt(props.match.params.id),
												sb_InstitucionesId: idInstitucion,
												sb_areaProyectoId: value,
												sb_nombreProyectoId: nombreId,
												sb_modalidadId: modalidadId,
												sb_tipoOrganizacionContraparteId: organizacionId,
												docenteAcompanante: acompanante,
												descripcion,
												fechaConclusionSCE: date.toISOString(),
												insertadoPor: localStorage.getItem('loggedUser'),
												caracteristicas: [],
												estudiantes: estudiantes.map(e => e.idEstudiante)
											})
											.then(r => {
												r.response == false
													? alert('Error al editar')
													: props.history.push('/director/expediente-centro/servicio-comunal')
											})
									}
								} else {
									setLoading(false)
									alert('Seleccione una institución')
								}
							}}
						>
							{/* TODO: i18n */}
							Guardar
						</Button>
					</p>
				</Col>
			</Row>
		</div>
	)
}

const Card = styled.div`
	background: #fff;
	position: relative;
`

const CardTitle = styled.h5`
	color: #000;
	margin-bottom: 10px;
`

const Form = styled.form`
	margin-bottom: 20px;
`

const FormGroup = styled.div`
	margin-bottom: 10px;
`

const Label = styled.label`
	color: #000;
	display: block;
`

const Input = styled(ReactstrapInput)`
	padding: 10px;
	width: 100%;
	border: 1px solid #d7d7d7;
	background-color: #fff !important;
	outline: 0;
	&:focus {
		background: #fff !important;
	}
`

export default withRouter(Editar)
