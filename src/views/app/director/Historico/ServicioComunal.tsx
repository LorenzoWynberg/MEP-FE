import React, { useEffect, useState, useMemo } from 'react'
import styled from 'styled-components'
import AppLayout from 'Layout/AppLayout'
import directorItems from 'Constants/directorMenu'
import { Row, Col, ModalBody, ModalHeader, Modal, Input as ReactstrapInput } from 'reactstrap'
import colors from '../../../../assets/js/colors'
import withRouter from 'react-router-dom/withRouter'
import Grid from '@material-ui/core/Grid'
import {
	crearServicioComunal,
	getTablaEstudiantesServicioComunalById
} from '../../../../redux/configuracion/actions'
import BuscadorServicioComunal from '../Buscadores/BuscadorServicioComunal'
import { Checkbox, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Chip, Button } from '@material-ui/core'
import StyledMultiSelect from '../../../../components/styles/StyledMultiSelect'
import { ObtenerInfoCatalogos } from '../../../../redux/formularioCentroResponse/actions'
import NavigationContainer from '../../../../components/NavigationContainer'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import { useTranslation } from 'react-i18next'
import Tooltip from '@mui/material/Tooltip'
import { IoEyeSharp } from 'react-icons/io5'
import BarLoader from 'Components/barLoader/barLoader'
import TableStudents from '../MatricularEstudiantes/registro/new/comunalTabla'
import SimpleModal from 'Components/Modal/simple'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useActions } from 'Hooks/useActions'
import { useSelector } from 'react-redux'

// const ModalRadio = (props) => {
// 	console.log('props', props)
// 	const [value, setValue] = React.useState(props.coleccion[0].id);
// 	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
// 		console.log('(event.target as HTMLInputElement).value', (event.target as HTMLInputElement).value)
// 		setValue((event.target as HTMLInputElement).value);
// 	  };

// 	return <SimpleModal title="Areas Proyecto" openDialog={props.value} onConfirm={() => { props.setValueParent(false) }} onClose={() => props.setValueParent(false)}>
// 		<FormControl>
// 			<FormLabel id="demo-radio-buttons-group-label">{props.title}</FormLabel>
// 			<RadioGroup
// 				aria-labelledby="demo-radio-buttons-group-label"
// 				name="radio-buttons-group"
// 				value={value}
// 				onChange={handleChange}
// 			>
// 			{props.coleccion.map(item => <Row><Col><FormControlLabel value={props.id} control={<Radio />} label={item.nombre} /></Col><Col>{item.descripcion}</Col></Row>)}
// 		</RadioGroup>
// 	</FormControl>
// 	</SimpleModal >
// }

export const ServicioComunal: React.FC<IProps> = props => {
	const { t } = useTranslation()
	const [catalogos, setCatalogos] = React.useState([])
	const [areaProyecto, setAreaProyecto] = React.useState()
	const [showAreaProyecto, setShowAreaProyecto] = React.useState(false)
	const [showNombre, setShowNombre] = React.useState(false)
	const [objetivoNombre, setObjetivoNombre] = React.useState([])
	const [busqueda, setBusqueda] = React.useState()
	const [estudiantes, setEstudiantes] = React.useState([])
	const [nombresSeleccionados, setNombresSeleccionados] = React.useState([])
	const [nombresIdSeleccionados, setNombresIdSeleccionados] = React.useState([])
	const [showBuscador, setShowBuscador] = React.useState(false)
	const [showTipoOrganizacion, setShowTipoOrganizacion] = React.useState(false)
	const [organizacionId, setOrganizacionId] = React.useState()
	const [organizacion, setOrganizacion] = React.useState()

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
		console.log('(event.target as HTMLInputElement).value', (event.target as HTMLInputElement).value)
		setValue((event.target as HTMLInputElement).value)
	}
	const [Cdate, setDate] = useState(new Date().toLocaleDateString('fr-FR'))
	const [valueModalidad, setValueModalidad] = React.useState('')
	const [valueCaracteristicas, setValueCaracteristicas] = React.useState('')
	const [valueOrg, setValueOrg] = React.useState('')
	const [acompanante, setValueAcompanante] = React.useState('')
	const [descripcion, setValueDescripcion] = React.useState('')
	const [studentsSeleccionados, setStudentsSeleccionados] = React.useState([])

	const [students, setStudents] = useState([])

	const mapper = el => {
		return {
			...el,
			id: el.matriculaId,
			image: el.img,
			edad: getYearsOld(el.fechaNacimiento),
			fechaNacimientoP: format(parseISO(el.fechaNacimiento), 'dd/MM/yyyy'),
			nacionalidad: Array.isArray(el.nacionalidades) ? el.nacionalidades[0].nacionalidad : '',
			genero: Array.isArray(el.genero) ? el.genero[0].nombre : '',
			cuentaCorreoOffice: el.cuentaCorreoOffice ? 'Sí' : 'No'
		}
	}
	useEffect(() => {
		const _data = studentsSeleccionados.map(mapper)
		setStudents(_data)
	}, [studentsSeleccionados])

	useEffect(() => {
		console.log('isssssasdasd', estudiantes)
	}, [estudiantes])

	const actions = useActions({
		crearServicioComunal,
		getTablaEstudiantesServicioComunalById
	})

	useEffect(() => {
		ObtenerInfoCatalogos().then(respone => {
			setCatalogos(respone)
		})
	}, [])
	return (
		<AppLayout items={directorItems}>
			{console.log('catalogos.areasProyecto', catalogos.areasProyecto)}
			{loading && <BarLoader />}
			{catalogos && console.log('catalogos', catalogos)}
			{/* {showAreaProyecto && catalogos.areasProyecto &&
					<ModalRadio title="Area Proyecto" setValue={setShowAreaProyecto} value={showAreaProyecto} coleccion={catalogos.areasProyecto} />} */}
			{showAreaProyecto && catalogos.areasProyecto &&
				<SimpleModal title="Areas Proyecto" openDialog={showAreaProyecto} onConfirm={() => { setShowAreaProyecto(false) }} onClose={() => setShowAreaProyecto(false)}>
					<FormControl>
						<FormLabel id='demo-radio-buttons-group-label'>Area Proyecto</FormLabel>
						<RadioGroup
							aria-labelledby='demo-radio-buttons-group-label'
							name='radio-buttons-group'
							value={value}
						>
							{catalogos.areasProyecto.map(item => <FormControlLabel value={item.id} onClick={(e, v) => { e.persist(); console.log('item.nombre', item.nombre); setValue(e.target.value); setAreaProyecto(item.nombre) }} checked={value == item.id} control={<Radio />} label={item.nombre} />)}
						</RadioGroup>
					</FormControl>
				</SimpleModal >}
			{showCaracteristicas &&
				<SimpleModal title="Areas Proyecto" openDialog={showCaracteristicas} onConfirm={() => { setShowCaracteristicas(false) }} onClose={() => setShowCaracteristicas(false)}>
					<FormControl>
						<FormLabel id='demo-radio-buttons-group-label'>Caracteristica</FormLabel>
						<RadioGroup
							aria-labelledby='demo-radio-buttons-group-label'
							name='radio-buttons-group'
							value={value}
						>
							{catalogos.caracteristicas.map(item => <FormControlLabel value={item.id} onClick={(e, v) => { e.persist(); setCaracteristicaId(e.target.value); setCaracteristica(item.nombre); }} checked={caracteristicaId == item.id} control={<Radio />} label={item.nombre} />)}
						</RadioGroup>
					</FormControl>
				</SimpleModal >} }
			{showModalidades &&
				<SimpleModal title="Areas Proyecto" openDialog={showModalidades} onConfirm={() => { setShowModalidades(false) }} onClose={() => setShowModalidades(false)}>
					<FormControl>
						<FormLabel id='demo-radio-buttons-group-label'>Modalidad</FormLabel>
						<RadioGroup
							aria-labelledby='demo-radio-buttons-group-label'
							name='radio-buttons-group'
							value={value}
						>
							{catalogos.modalidades.map(item => <FormControlLabel value={item.id} onClick={(e, v) => { e.persist(); setModalidadId(e.target.value); setModalidad(item.nombre); }} checked={modalidadId == item.id} control={<Radio />} label={item.nombre} />)}
						</RadioGroup>
					</FormControl>
				</SimpleModal >}
			{showTipoOrganizacion &&
				<SimpleModal title="Areas Proyecto" openDialog={showTipoOrganizacion} onConfirm={() => { setShowTipoOrganizacion(false) }} onClose={() => setShowTipoOrganizacion(false)}>
					<FormControl>
						<FormLabel id='demo-radio-buttons-group-label'>Tipo Organizacion</FormLabel>
						<RadioGroup
							aria-labelledby='demo-radio-buttons-group-label'
							name='radio-buttons-group'
							value={value}
						>
							{catalogos.tipoOrganizacion.map(item => <FormControlLabel value={item.id} onClick={(e, v) => { e.persist(); setOrganizacionId(e.target.value); setOrganizacion(item.nombre); }} checked={organizacionId == item.id} control={<Radio />} label={item.nombre} />)}
						</RadioGroup>
					</FormControl>
				</SimpleModal >}
			{showBuscador && <SimpleModal title="Estudiantes" openDialog={showBuscador} onConfirm={() => { setShowBuscador(false) }} onClose={() => setShowBuscador(false)}>
				<BuscadorServicioComunal busqueda={busqueda} setEstudiantes={setEstudiantes} estudiantes={estudiantes} />
			</SimpleModal >
			}
			{nombresSeleccionados && value && showNombre && catalogos.nombresProyecto &&
				<SimpleModal title="Nmobre Proyecto" openDialog={showNombre} onConfirm={() => { setShowNombre(false) }} onClose={() => setShowNombre(false)}>
					<FormControl>
						<FormLabel id="demo-radio-buttons-group-label">Nombre Proyecto</FormLabel>
						{catalogos.nombresProyecto.filter(item => parseInt(item.codigo) == parseInt(value)).map((item, index) =>
							<FormControlLabel
								control={
									<Checkbox
										checked={nombresSeleccionados.map(v => v.id).includes(item.id)}
										value={item.id}
									/>
								}
								label={item.nombre}
								onClick={async () => {
									let nombres = [...nombresSeleccionados];
									let nombresId = [...nombresIdSeleccionados];
									console.log('nombres', nombres)
									if (!nombresId.includes(item.id)) {
										nombres.push(item)
										nombresId.push(item.id)
									} else {
										nombres = nombres.filter(n => n.id != item.id)
										nombresId = nombresId.filter(n => n != item.id)
									}
									setNombresSeleccionados(nombres);
									setNombresIdSeleccionados(nombresId);
								}}
							/>
						)}
					</FormControl>
				</SimpleModal>}
			<NavigationContainer
				goBack={() => {
					props.history.push('/director/buscador/centro')
				}}
			/>
			<Wrapper>
				<Title>{t('servicio_comunal_title', 'Servicio Comunal')}</Title>
				<Row>
					<Col sm={12}>
						<Card className='bg-white__radius'>
							<CardTitle>{t('registro_servicio_comunal', 'Registro Servicio Comunal')}</CardTitle>
							{nombresSeleccionados && console.log('nombresSeleccionados', nombresSeleccionados)}
							<Form>
								<Row>
									<Col md={3}>
										<FormGroup>
											<Label>
												{t('registro_servicio_comunal>area_proyecto', 'Area de proyecto')}
											</Label>
											<Input key={areaProyecto} name='i' value={areaProyecto ? areaProyecto : ''} readOnly onClick={() => !showAreaProyecto && setShowAreaProyecto(true)} />
										</FormGroup>
									</Col>
									<Col md={6}>
										{nombresSeleccionados.length == 0 && <FormGroup>
											<Label>{t('registro_servicio_comunal>objetivonombre', 'objetivo')}</Label>
											<Input name='codigo' value={objetivoNombre ? '' : objetivoNombre} readOnly onClick={() => !showNombre && setShowNombre(true)} />
										</FormGroup>}
										{nombresSeleccionados.length > 0 &&
											<div onClick={() => !showNombre && setShowNombre(true)} style={{ padding: 8, background: '#e9ecef' }} >
												{nombresSeleccionados.map(n => <Chip label={n.nombre} />)}
											</div>
										}
									</Col>
									<Col sm={3}>
										<FormGroup>
											<Label>{t('registro_servicio_comunal>modalidad', 'Modalidad')}</Label>
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
								<Row>
									<Col sm={3}>
										<FormGroup>
											<Label>
												{t('registro_servicio_comunal>caracteristicas', 'Caracteristicas')}
											</Label>
											<Input
												name='modalidad'
												type='text'
												value={caracteristica}
												readOnly
												onClick={() => !showCaracteristicas && setShowCaracteristicas(true)}
												autoFocus={true}
											/>
										</FormGroup>
									</Col>
									<Col sm={3}>
										{' '}
										<FormGroup>
											<Label>
												{t(
													'registro_servicio_comunal>fecha_conclusion',
													'Fecha de conclusión SCE'
												)}
											</Label>
											<DatePicker
												dateFormat="dd/MM/yyyy"
												value={Cdate}
												onChange={(date) => {
													const d = new Date(date).toLocaleDateString('fr-FR');
													console.log(d);
													setDate(d);
												}}
											/>
										</FormGroup>
									</Col>
									<Col sm={3}>
										<FormGroup>
											<Label>
												{t(
													'registro_servicio_comunal>organizacion_contraparte',
													'Tipo de organización contraparte'
												)}
											</Label>
											<Input
												name='tipo_centro'
												type='text'
												value={organizacion ? organizacion : ''} readOnly onClick={() => !showTipoOrganizacion && setShowTipoOrganizacion(true)}

												autoFocus={true}
											/>
										</FormGroup>
										{valueOrg}
									</Col>
									<Col sm={3}>
										<FormGroup>
											<Label>
												{t(
													'registro_servicio_comunal>docente_acompaña',
													'Acompañante de proyecto'
												)}
											</Label>
											<Input
												name='tipo_centro'
												type='text'
												value={acompanante}
												onChange={e => setValueAcompanante(e.target.acompanante)}
												autoFocus={true}
											/>
										</FormGroup>
										{acompanante}
									</Col>
								</Row>

								<FormGroup>
									<Label>{t('registro_servicio_comunal>descripcion', 'Descripción')}</Label>

									<Input
										style={{}}
										name='tipo_centro'
										type='text'
										value={descripcion}
										onChange={e => setValueDescripcion(e.target.descripcion)}
										autoFocus={true}
									/>

									{descripcion}
								</FormGroup>
							</Form>
						</Card>
					</Col>
				</Row>

				<Row>
					<Col sm={12}>
						<TableStudents
							onlyViewModule={true}
							data={estudiantes}
							// data={[
							// 	{
							// 		"idEstudiante": 1495875,
							// 		"nombreEstudiante": "CASTILLO  NAVARRO AARON",
							// 		"identificacion": "113420854",
							// 		"fotografiaUrl": "",
							// 		"conocidoComo": "",
							// 		"nacionalidad": null,
							// 		"idInstitucion": null,
							// 		"idMatricula": null,
							// 		"institucion": "",
							// 		"codigoinstitucion": "",
							// 		"modalidad": null,
							// 		"grupo": "",
							// 		"fallecido": false,
							// 		"tipoInstitucion": null,
							// 		"regional": "/",
							// 		"fechaNacimiento": "1988-02-05T00:00:00",
							// 		"nivel": null,
							// 		"tipoIdentificacion": "CÉDULA"
							// 	}
							// ]}
							hasEditAccess={true}
							handleGetData={() => { showBuscador ? setShowBuscador(false) : setShowBuscador(true) }}

							closeContextualMenu={false}
						></TableStudents>
					</Col>
				</Row>

				<Row>
					<Col sm={12}><Button primary onClick={() => actions.crearServicioComunal({
						"sb_InstitucionesId": 0,
						"sb_areaProyectoId": value,
						"sb_nombreProyectoId": nombresSeleccionados[0].id,
						"sb_modalidadId": modalidadId,
						"sb_tipoOrganizacionContraparteId": organizacionId,
						"docenteAcompanante": acompanante,
						"descripcion": descripcion,
						"fechaConclusionSCE": Cdate,
						"insertadoPor": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
						"caracteristicas": [
							caracteristicaId
						],
						"estudiantes":
							estudiantes.map(e => e.idEstudiante)

					})}>Guardar</Button></Col>
				</Row>
			</Wrapper>
		</AppLayout>
	)
}

const Wrapper = styled.div``

const Title = styled.h3`
	color: #000;
	margin: 5px 3px 25px;
`

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
	color: #000;
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
	background-color: #e9ecef;
	outline: 0;
	&:focus {
		background: #fff;
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

export default withRouter(ServicioComunal)
