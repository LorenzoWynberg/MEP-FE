import React, { useEffect, useState, useMemo } from 'react'
import styled from 'styled-components'
import AppLayout from 'Layout/AppLayout'
import directorItems from 'Constants/directorMenu'
import { Row, Col, ModalBody, ModalHeader, Modal, Input as ReactstrapInput } from 'reactstrap'
import colors from '../../../../assets/js/colors'
import withRouter from 'react-router-dom/withRouter'
import Grid from '@material-ui/core/Grid'
import { Checkbox, Chip, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@material-ui/core'
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
import ModalRadio from './ModalRadio'
import SimpleModal from 'Components/Modal/simple'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

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
	const [areasProyectoId, setAreasProyectoId] = React.useState()
	const [currentExtentions, setCurrentExtentions] = React.useState()
	const [nombresSeleccionados, setNombresSeleccionados] = React.useState([])
	const [nombresIdSeleccionados, setNombresIdSeleccionados] = React.useState([])
	const [showMap, setShowMap] = React.useState(false)
	const [institutionImage, setInstitutionImage] = React.useState(null)
	const [loading, setLoading] = React.useState<boolean>(false)
	const [value, setValue] = React.useState(catalogos.areasProyecto && catalogos.areasProyecto[0].id)
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		console.log('(event.target as HTMLInputElement).value', (event.target as HTMLInputElement).value)
		setValue((event.target as HTMLInputElement).value)
	}
	const [Cdate, setDate] = useState(new Date().toLocaleDateString('fr-FR'));
	const [value1, setValue1] = React.useState('')
	const [value2, setValue3] = React.useState('')
	const [valueModalidad, setValueModalidad] = React.useState('')
	const [valueCaracteristicas, setValueCaracteristicas] = React.useState('')
	const [valueOrg, setValueOrg] = React.useState('')
	const [acompañante, setValueAcompañante] = React.useState('')
	const [descripcion, setValueDescripcion] = React.useState('')

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
z					<FormControl>
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
			{console.log('nombresSeleccionados', nombresSeleccionados)}
			{nombresSeleccionados && value && showNombre && catalogos.nombresProyecto &&
				<SimpleModal title="Nmobre Proyecto" openDialog={showNombre} onConfirm={() => { setShowNombre(false) }} onClose={() => setShowNombre(false)}>
					<FormControl>
						<FormLabel id="demo-radio-buttons-group-label">Nombre Proyecto</FormLabel>
						{catalogos.nombresProyecto.filter(item => parseInt(item.codigo) == parseInt(value)).map((item, index) =>
							<FormControlLabel
								control={
									<Checkbox
										checked={nombresSeleccionados.includes(item.id)}
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
										nombres = nombres.filter(n => n != item.id)
										nombresId = nombresId.filter(n => n.id != item.id)
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
											<div onClick={() => !showNombre && setShowNombre(true)}  style={{ padding: 8, background: '#e9ecef' }} > 
												{nombresSeleccionados.map(n => <Chip label={n.nombre} />)}
											</div>
										}
									</Col>
									<Col sm={3}>
										<FormGroup>
											<Label>{t('registro_servicio_comunal>modalidad', 'Modalidad')}</Label>
											<Input
												name='tipo_centro'
												type='text'
												value={valueModalidad}  
												onChange={e => setValueModalidad(e.target.valueModalidad)}
												autoFocus={true}
											/>
										</FormGroup>
										{valueModalidad}
									</Col>
								</Row>
								<Row>
									<Col sm={3}>
										<FormGroup>
											<Label>
												{t('registro_servicio_comunal>caracteristicas', 'Caracteristicas')}
											</Label>
											<Input
												name='tipo_centro'
												type='text'
												value={valueCaracteristicas} 
												onChange={e => setValueCaracteristicas(e.target.valueCaracteristicas)}
												autoFocus={true}
											/>
										</FormGroup>
										{valueCaracteristicas}
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
												value={valueOrg}
												onChange={e => setValueOrg(e.target.valueOrg)}
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
												value={acompañante}
												onChange={e => setValueAcompañante(e.target.acompañante)}
												autoFocus={true}
											/>
										</FormGroup>
										{acompañante}
									</Col>
								</Row>
								<Row></Row>

								<FormGroup>
									<Label>{t('registro_servicio_comunal>descripcion', 'Descripción')}</Label>
									<Input
												name='tipo_centro'
												type='text'
												value={descripcion}  
												onChange={e => setValueDescripcion(e.target.descripcion)}
												autoFocus={true}
											/>
									
										{descripcion}
									<StyledMultiSelect options={[]} selectedOptions={[]} editable={false} />
								</FormGroup>
							</Form>
						</Card>
					</Col>
				</Row>

				<Row>
					<Col sm={12}>
						<TableStudents
							onlyViewModule={false}
							data={[]}
							hasEditAccess={true}
							onSelectedStudent={() => {}}
							closeContextualMenu={false}
						></TableStudents>
					</Col>
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
