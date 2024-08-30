import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Row, Col, Input as ReactstrapInput } from 'reactstrap'
import colors from 'Assets/js/colors'
import withRouter from 'react-router-dom/withRouter'
import Grid from '@material-ui/core/Grid'
import { crearServicioComunal, getTablaEstudiantesServicioComunalById } from 'Redux/configuracion/actions'
import styles from './ServicioComunal.css'
import BuscadorServicioComunal from '../../../Buscadores/BuscadorServicioComunal'
import { Button } from 'Components/CommonComponents'
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
import zIndex from '@material-ui/core/styles/zIndex'
import { isEmpty } from 'lodash'

export const Agregar: React.FC<IProps> = props => {
	const { t } = useTranslation()
	const [catalogos, setCatalogos] = React.useState([])
	const [areaProyecto, setAreaProyecto] = React.useState()
	const [showAreaProyecto, setShowAreaProyecto] = React.useState(false)
	const [showNombre, setShowNombre] = React.useState(false)
	const [objetivoNombre, setObjetivoNombre] = React.useState([])
	const [busqueda, setBusqueda] = React.useState()
	const [estudiantes, setEstudiantes] = React.useState([])
	const [caracteristicas, setCaracteristicas] = React.useState()
	const [caracteristicasIdSeleccionados, setCaracteristicasIdSeleccionados] = React.useState([])
	const [caracteristicasSeleccionados, setCaracteristicasSeleccionados] = React.useState([])
	const [nombresSeleccionados, setNombresSeleccionados] = React.useState([])
	const [nombreSend, setNombreSend] = React.useState()
	const [nombreId, setNombreId] = React.useState()
	const [showBuscador, setShowBuscador] = React.useState(false)
	const [showTipoOrganizacion, setShowTipoOrganizacion] = React.useState(false)
	const [organizacionId, setOrganizacionId] = React.useState()
	const [organizacion, setOrganizacion] = React.useState()
	const [checkedValid, setCheckedValid] = React.useState(false)
	const [showModalidades, setShowModalidades] = React.useState(false)
	const [modalidadId, setModalidadId] = React.useState()
	const [modalidad, setModalidad] = React.useState()
	const [showCaracteristicas, setShowCaracteristicas] = React.useState(false)
	const [caracteristicaId, setCaracteristicaId] = React.useState()
	const [caracteristica, setCaracteristica] = React.useState()
	const [institutionImage, setInstitutionImage] = React.useState(null)
	const [loading, setLoading] = React.useState<boolean>(false)
	const [value, setValue] = React.useState(catalogos.areasProyecto && catalogos.areasProyecto[0].id)
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setValue((event.target as HTMLInputElement).value)
	}
	const [Cdate, setCDate] = useState(new Date().toLocaleDateString('fr-FR'))
	const [date, setDate] = useState(new Date())
	const [valueModalidad, setValueModalidad] = React.useState('')
	const [valueCaracteristicas, setValueCaracteristicas] = React.useState('')
	const [valueOrg, setValueOrg] = React.useState('')
	const [acompanante, setValueAcompanante] = React.useState('')
	const [descripcion, setValueDescripcion] = React.useState('')
	const [studentsSeleccionados, setStudentsSeleccionados] = React.useState([])
	const idInstitucion = localStorage.getItem('idInstitucion')
	const [students, setStudents] = useState([])
	const [selectedDate, setSelectedDate] = useState(null)
	const [formattedDate, setFormattedDate] = useState('')
	const today = new Date()

	const state = useSelector((store: any) => {
		return {
			accessRole: store.authUser.currentRoleOrganizacion.accessRole,
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
			!formattedDate ||
			!descripcion ||
			!localStorage.getItem('loggedUser') ||
			isEmpty(caracteristicasSeleccionados) ||
			isEmpty(estudiantes)
		) {
			return false
		} else {
			return true
		}
	}

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
		crearServicioComunal,
		getTablaEstudiantesServicioComunalById
	})

	useEffect(() => {
		ObtenerInfoCatalogos().then(response => {
			setCatalogos(response)
		})
	}, [])

	if (!tienePermiso || tienePermiso?.agregar == 0) {
		return <h4>{t('No tienes permisos para acceder a esta sección')}</h4>
	}

	return (
		<div className={styles}>
			{loading && <BarLoader />}
			{showAreaProyecto && catalogos.areasProyecto && (
				<SimpleModal
					title='Selección de áreas de proyecto'
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
									<Row>
										<Col
											style={{
												display: 'flex',
												textAlign: 'left',
												justifyContent: 'left',
												alignItems: 'left'
											}}
											sm={3}
										>
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
			{showCaracteristicas && (
				<SimpleModal
					title='Selección de caracteristicas'
					openDialog={showCaracteristicas}
					onConfirm={() => {
						setShowCaracteristicas(false)
					}}
					onClose={() => setShowCaracteristicas(false)}
				>
					<FormControl>
						{catalogos.caracteristicas.map((item, index) => (
							<Row>
								<Col
									style={{
										display: 'flex',
										textAlign: 'left',
										justifyContent: 'left',
										alignItems: 'left'
									}}
									sm={3}
								>
									<FormControlLabel
										control={
											<Checkbox
												checked={caracteristicasSeleccionados.map(v => v.id).includes(item.id)}
												value={item.id}
											/>
										}
										label={
											<div
												onClick={async () => {
													let caracteristicas = [...caracteristicasSeleccionados]
													let caracteristicasId = [...caracteristicasIdSeleccionados]
													if (!caracteristicasId.includes(item.id)) {
														caracteristicas.push(item)
														caracteristicasId.push(item.id)
													} else {
														caracteristicas = caracteristicas.filter(n => n.id != item.id)
														caracteristicasId = caracteristicasId.filter(n => n != item.id)
													}
													setCaracteristicasSeleccionados(caracteristicas)
													setCaracteristicasIdSeleccionados(caracteristicasId)
												}}
											>
												{item.nombre}
											</div>
										}
										onClick={async () => {
											let caracteristicas = [...caracteristicasSeleccionados]
											let caracteristicasId = [...caracteristicasIdSeleccionados]
											if (!caracteristicasId.includes(item.id)) {
												caracteristicas.push(item)
												caracteristicasId.push(item.id)
											} else {
												caracteristicas = caracteristicas.filter(n => n.id != item.id)
												caracteristicasId = caracteristicasId.filter(n => n != item.id)
											}
											setCaracteristicasSeleccionados(caracteristicas)
											setCaracteristicasIdSeleccionados(caracteristicasId)
										}}
									/>
								</Col>
								<Col sm={9}>{item.descripcion}</Col>
							</Row>
						))}
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
					<Row>
						<FormControl>
							<RadioGroup aria-labelledby='demo-radio-buttons-group-label' name='radio-buttons-group'>
								{catalogos.modalidades &&
									catalogos.modalidades.map(item => (
										<Row>
											<Col
												style={{
													display: 'flex',
													justifyContent: 'left',
													alignItems: 'left'
												}}
												sm={3}
											>
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
					</Row>
				</SimpleModal>
			)}
			{showTipoOrganizacion && (
				<SimpleModal
					title='Organización'
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
								<Row>
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
					title='Nombre Proyecto'
					openDialog={showNombre}
					onConfirm={() => {
						setShowNombre(false)
					}}
					onClose={() => setShowNombre(false)}
				>
					<FormControl>
						<FormLabel id='demo-radio-buttons-group-label'>Tipo Organizacion</FormLabel>
						<RadioGroup
							aria-labelledby='demo-radio-buttons-group-label'
							name='radio-buttons-group'
							value={value}
						>
							{catalogos.nombresProyecto
								.filter(item => parseInt(item.codigo) == parseInt(value))
								.map(item => (
									<Row>
										<Col sm={12}>
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
									</Row>
								))}
						</RadioGroup>
					</FormControl>
				</SimpleModal>
			)}
			<h3 className='mt-2 mb-3'>
				{/* TODO: i18n */}
				{/* {t('servicio_comunal_title', 'Servicio Comunal')} */}
				Agregar servicio comunal estudiantil
			</h3>
			<Row>
				<Col sm={12}>
					<Card className='bg-white__radius mb-3'>
						<CardTitle>{t('registro_servicio_comunal', 'Registro Servicio Comunal')}</CardTitle>
						<Form>
							<Row className='mb-2'>
								<Col md={3}>
									<FormGroup>
										<Label>
											{t('registro_servicio_comunal>area_proyecto', 'Area de proyecto')}
										</Label>
										<Input
											style={{ border: checkedValid && !areaProyecto ? '1px solid red' : '' }}
											key={areaProyecto}
											name='areaProyecto'
											value={areaProyecto ? areaProyecto : ''}
											readOnly
											onClick={() => !showAreaProyecto && setShowAreaProyecto(true)}
										/>
										{checkedValid && !areaProyecto && (
											<span style={{ color: 'red' }}>Campo requerido</span>
										)}
									</FormGroup>
								</Col>
								<Col md={6}>
									<FormGroup>
										<Label>{t('registro_servicio_comunal>objetivonombre', 'objetivo')}</Label>
										<Input
											style={{ border: checkedValid && !nombreSend ? '1px solid red' : '' }}
											key={nombreSend}
											name='objetivo'
											value={nombreSend ? nombreSend : ''}
											readOnly
											onClick={() => !showNombre && setShowNombre(true)}
										/>{' '}
										{checkedValid && !nombreSend && (
											<span style={{ color: 'red' }}>Campo requerido</span>
										)}
									</FormGroup>
								</Col>
								<Col sm={3}>
									<FormGroup>
										<Label>{t('registro_servicio_comunal>modalidad', 'Modalidad')}</Label>
										<Input
											style={{ border: checkedValid && !modalidad ? '1px solid red' : '' }}
											name='modalidad'
											type='text'
											value={modalidad}
											readOnly
											onClick={() => !showModalidades && setShowModalidades(true)}
											autoFocus={true}
										/>
										{checkedValid && !modalidad && (
											<span style={{ color: 'red' }}>Campo requerido</span>
										)}
									</FormGroup>
								</Col>
							</Row>
							<Row className='mb-2'>
								<Col sm={3}>
									<Label>{t('registro_servicio_comunal>caracteristicas', 'Caracteristicas')}</Label>

									{caracteristicasSeleccionados.length == 0 && (
										<FormGroup>
											<Input
												style={{
													border:
														checkedValid && isEmpty(caracteristicasSeleccionados)
															? '1px solid red'
															: ''
												}}
												name='caracteristicas'
												value={''}
												readOnly
												onClick={() => !showCaracteristicas && setShowCaracteristicas(true)}
											/>
											{checkedValid && isEmpty(caracteristicasSeleccionados) && (
												<span style={{ color: 'red' }}>Campo requerido</span>
											)}
										</FormGroup>
									)}
									{caracteristicasSeleccionados.length > 0 && (
										<div
											className='caracteristicas'
											onClick={() => !showCaracteristicas && setShowCaracteristicas(true)}
										>
											{caracteristicasSeleccionados.map(n => (
												<Chip label={n.nombre} />
											))}
										</div>
									)}
								</Col>
								<Col sm={3}>
									<FormGroup>
										<Label>
											{t('registro_servicio_comunal>fecha_conclusion', 'Fecha de conclusión SCE')}
										</Label>
										<DatePicker
											style={{
												zIndex: 99999
											}}
											popperPlacement={'right'}
											dateFormat='dd/MM/yyyy'
											customInput={
												<input className={checkedValid && !formattedDate ? 'invalid' : ''} />
											}
											selected={selectedDate}
											onChange={date => {
												const d = new Date(date)
												setSelectedDate(d)
												setFormattedDate(d.toLocaleDateString('fr-FR'))
											}}
											maxDate={today} // Set the maximum selectable date to today
										/>
									</FormGroup>
									{checkedValid && !formattedDate && (
										<span style={{ color: 'red' }}>Campo requerido</span>
									)}
								</Col>
								<Col sm={3}>
									<FormGroup>
										<Label>
											{t(
												'registro_servicio_comunal>organizacion_contraparte',
												'Organización contraparte'
											)}
										</Label>
										<Input
											style={{ border: checkedValid && !organizacion ? '1px solid red' : '' }}
											name='organizacionContraparte'
											type='text'
											value={organizacion ? organizacion : ''}
											readOnly
											onClick={() => !showTipoOrganizacion && setShowTipoOrganizacion(true)}
											autoFocus={true}
										/>
										{checkedValid && !organizacion && (
											<span style={{ color: 'red' }}>Campo requerido</span>
										)}
									</FormGroup>
									{valueOrg}
								</Col>
								<Col sm={3}>
									<FormGroup>
										<Label>
											{t('registro_servicio_comunal>docente_acompaña', 'Acompañante de proyecto')}
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

							<FormGroup>
								<Label>{t('registro_servicio_comunal>descripcion', 'Descripción')}</Label>

								<Input
									style={{ border: checkedValid && !descripcion ? '1px solid red' : '' }}
									name='descripcion'
									type='text'
									value={descripcion}
									onChange={e => {
										setValueDescripcion(e.target.value)
									}}
									autoFocus={true}
								/>
								{checkedValid && !descripcion && <span style={{ color: 'red' }}>Campo requerido</span>}
							</FormGroup>
						</Form>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col sm={12}>
					<div>
						
					<Button
                       	onClick={() => {
							showBuscador ? setShowBuscador(false) : setShowBuscador(true)
						}}
                        color='primary'

						style={{ cursor: 'pointer' }}
                      >
						Agregar
                      </Button>
						 
					</div>
					{checkedValid && isEmpty(estudiantes) && (
						<span style={{ color: 'red' }}>Debe agregar estudiantes</span>
					)}
					<TableStudents
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
							
							color='primary'

							style={{ cursor: 'pointer' }}
							disabled={!isValid()}
							onClick={() => {
								setLoading(true)
								if (idInstitucion) {
									if (!isValid()) {
										setCheckedValid(true)
										setLoading(false)
									} else {
										actions
											.crearServicioComunal({
												sb_InstitucionesId: idInstitucion,
												sb_areaProyectoId: value,
												sb_nombreProyectoId: nombreId,
												sb_modalidadId: modalidadId,
												sb_tipoOrganizacionContraparteId: organizacionId,
												docenteAcompanante: acompanante,
												descripcion,
												fechaConclusionSCE: date.toISOString(),
												insertadoPor: localStorage.getItem('loggedUser'),
												caracteristicas: caracteristicasSeleccionados.map(e => e.id),
												estudiantes: estudiantes.map(e => e.idEstudiante)
											})
											.then(() => {
												props.history.push('/director/expediente-centro/servicio-comunal')
											})
									}
								} else {
									setLoading(false)
									alert('Seleccione una institución')
								}
							}}
						>
							Guardar
						</Button>
					</p>
				</Col>
			</Row>
		</div>
	)
}

const StyledTable = styled.table`
	border-spacing: 1.8rem;
	width: 100%;
`

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
	color: rgba(0, 0, 0, 0.87);
	display: block;
`

const MapContainer = styled(Grid)`
	@media (max-width: 870px) {
		height: 29rem;
	}
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

const Avatar = styled.img`
	width: 120px;
	height: 120px;
	border-radius: 50%;
`

const CardLink = styled.a`
	color: ${colors.primary};
`

const SectionTable = styled.div`
	margin-top: 20px;
`

export default withRouter(Agregar)
