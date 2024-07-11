import React, { useEffect, useState, useMemo } from 'react'
import styled from 'styled-components'
import AppLayout from 'Layout/AppLayout'
import directorItems from 'Constants/directorMenu'
import { Row, Col, ModalBody, ModalHeader, Modal, Input as ReactstrapInput } from 'reactstrap'
import colors from '../../../../assets/js/colors'
import withRouter from 'react-router-dom/withRouter'
import Grid from '@material-ui/core/Grid'
import { Checkbox, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@material-ui/core'
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
	const [areaProyecto, setData] = React.useState([])
	const [showAreaProyecto, setShowAreaProyecto] = React.useState(false)
	const [showNombre, setShowNombre] = React.useState(false)
	const [objetivoNombre, setObjetivoNombre] = React.useState([])
	const [areasProyectoId, setAreasProyectoId] = React.useState()
	const [currentExtentions, setCurrentExtentions] = React.useState()
	const [nombresSeleccionados, setNombresSeleccionados] = React.useState([])
	const [showMap, setShowMap] = React.useState(false)
	const [institutionImage, setInstitutionImage] = React.useState(null)
	const [loading, setLoading] = React.useState<boolean>(false)
	const [value, setValue] = React.useState(catalogos.areasProyecto && catalogos.areasProyecto[0].id);
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		console.log('(event.target as HTMLInputElement).value', (event.target as HTMLInputElement).value)
		setValue((event.target as HTMLInputElement).value);
	};


	useEffect(() => {
		ObtenerInfoCatalogos().then((respone) => {
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
						<FormLabel id="demo-radio-buttons-group-label">Area Proyecto</FormLabel>
						<RadioGroup
							aria-labelledby="demo-radio-buttons-group-label"
							name="radio-buttons-group"
							value={value}
						>
							{catalogos.areasProyecto.map(item => <FormControlLabel value={item.id} onClick={(e, v) => { e.persist(); setValue(e.target.value) }} checked={value == item.id} control={<Radio />} label={item.nombre} />)}
						</RadioGroup>
					</FormControl>
				</SimpleModal >}
			{value}
			{showNombre && catalogos.nombresProyecto &&
				<SimpleModal title="Areas Proyecto" openDialog={showNombre} onConfirm={() => { setShowNombre(false) }} onClose={() => setShowNombre(false)}>
					<FormControl>
						<FormLabel id="demo-radio-buttons-group-label">Nombre Proyecto</FormLabel>
						{console.log('nombresSeleccionados', nombresSeleccionados)}
						{catalogos.nombresProyecto.filter(item => parseInt(item.codigo) == parseInt(value)).map(item =>
							<FormControlLabel control={<Checkbox


								checked={nombresSeleccionados.includes(item.id)}
								onChange={(e, v) => {
									console.log('ev,[e,v]', [e, v])
									let nombres = nombresSeleccionados; if (nombres.includes(item.id)) { nombres = nombres.filter(x => x != item.id) } else { nombres.push(item.id) } setNombresSeleccionados(nombres);
								}}
							/>}

								label={item.nombre} />
						)}


					</FormControl>
				</SimpleModal >}
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
							``
							<Form>
								<Row>
									<Col md={3}>
										<FormGroup>
											<Label>
												{t('registro_servicio_comunal>area_proyecto', 'Area de proyecto')}
											</Label>
											<Input name='i' value={areaProyecto ? '' : areaProyecto} readOnly onClick={() => !showAreaProyecto && setShowAreaProyecto(true)} />
										</FormGroup>
									</Col>
									<Col md={6}>
										<FormGroup>
											<Label>{t('registro_servicio_comunal>objetivonombre', 'objetivo')}</Label>
											<Input name='codigo' value={objetivoNombre ? '' : objetivoNombre} readOnly onClick={() => !showNombre && setShowNombre(true)} />
										</FormGroup>
									</Col>
									<Col sm={3}>
										<FormGroup>
											<Label>{t('registro_servicio_comunal>modalidad', 'Modalidad')}</Label>
											<Input name='tipo_centro' value={''} readOnly />
										</FormGroup>
									</Col>
								</Row>
								<Row>
									<Col sm={3}>
										<FormGroup>
											<Label>
												{t('registro_servicio_comunal>caracteristicas', 'Caracteristicas')}
											</Label>
											<Input name='estado_centro' value={''} readOnly />
										</FormGroup>
									</Col>
									<Col sm={3}>
										{' '}
										<FormGroup>
											<Label>
												{t('registro_servicio_comunal>fecha_conclusion', 'Fecha de conclusión SCE')}
											</Label>
											<Input
												name='fundacion'
												autoComplete='off'
												value={''}
												readOnly

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
											<Input name='fundacion' autoComplete='off' value={''} readOnly />
										</FormGroup>
									</Col>
									<Col sm={3}>
										<FormGroup>
											<Label>
												{t(
													'registro_servicio_comunal>docente_acompaña',
													'Acompañante de proyecto'
												)}
											</Label>
											<Input name='fundacion' autoComplete='off' value={''} readOnly />
										</FormGroup>
									</Col>
								</Row>
								<Row></Row>


								<FormGroup>
									<Label>{t('registro_servicio_comunal>descripcion', 'Descripción')}</Label>
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
							onSelectedStudent={() => { }}
							closeContextualMenu={false} ></TableStudents>

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
