import React, { useState, useEffect } from 'react'
import 'react-tagsinput/react-tagsinput.css'
import HeaderTab from 'Components/Tab/LinkedHeader'
import ContentTab from 'Components/Tab/Content'
import { envVariables } from '../../../../../../constants/enviroment'
import { Row, Col, CustomInput } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import Loader from 'Components/LoaderContainer'
import CondicionDiscapacidad from './CondicionDiscapacidad'
import OtraCondicion from './OtraCondicion'
import axios from 'axios'
import AltoPotencial from './AltoPotencial'
import FormModal from '../../../../../../components/Modal/FormModal'
import {
	getCondiciones,
	getDiscapacidades
} from '../../../../../../redux/apoyos/actions'
import ApoyosEstudiante from './ApoyosEstudiante'

const ApoyoEducativo = props => {
	const { t } = useTranslation()
	const [discapacidadesHistorico, setDiscapacidadesHistorico] = useState()
	const [condicionesHistorico, setCondicionesHistorico] = useState()
	const [loading, setLoading] = useState(true)
	const [discapacidades, setDiscapacidades] = useState([])
	const [condiciones, setCondiciones] = useState([])
	const [openOptions, setOpenOptions] = useState({ open: false, type: null })
	const [modalOptions, setModalOptions] = useState([])
	const [catalogos, setCatalogos] = useState([])

	useEffect(() => {
		setLoading(true)
		const _discapacidades = []
		const _discapacidadesIdentidad = props.discapacidadesIdentidad.map(
			discapacidad => discapacidad.elementosCatalogosId
		)
		props.discapacidades.forEach(discapacidad => {
			if (_discapacidadesIdentidad.includes(discapacidad.id)) {
				_discapacidades.push(discapacidad)
			}
		})
		setDiscapacidades(_discapacidades)
		setLoading(false)
	}, [props.discapacidadesIdentidad])
	useEffect(() => {
		getHistoricos()
	}, [])
	const getHistoricos = () => {
		getHistoricosDiscapacidades()
		getHistoricosCondiciones()
	}
	const getHistoricosDiscapacidades = () => {
		setLoading(true)
		axios
			.get(
				`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/DiscapacidadesPorUsuario/GetByIdentityIdHist/${props.identidadId}`
			)
			.then(r => {
				setDiscapacidadesHistorico(r.data)
				setLoading(false)
			}, [])
	}

	const getHistoricosCondiciones = () => {
		axios
			.get(
				`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/CondicionesPorUsuario/GetByIdentidadHist/${props.identidadId}`
			)
			.then(r => {
				setCondicionesHistorico(r.data)
				setLoading(false)
			}, [])
	}

	useEffect(() => {
		setLoading(true)
		const loadCatalogos = async () => {
			axios
				.get(
					`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/TipoCatalogo`
				)
				.then(r => {
					setCatalogos(r.data)
					setLoading(false)
				})
				.catch(e => {
					console.log(e)
					setLoading(false)
				})
		}
		loadCatalogos()
	}, [])

	useEffect(() => {
		setLoading(true)
		const _condiciones = []
		const _condicionesIdentidad = props.condicionesIdentidad.map(
			condicion => condicion.elementosCatalogosId
		)
		props.condiciones.forEach(condicion => {
			if (_condicionesIdentidad.includes(condicion.id)) {
				_condiciones.push(condicion)
			}
		})
		setCondiciones(_condiciones)
		setLoading(false)
	}, [props.condicionesIdentidad])

	const handleOpenOptions = (options, name) => {
		setLoading(true)
		let _options = []
		const map =
			(name === 'discapacidades' &&
				discapacidadesHistorico.map(item => item.elementosCatalogosId)) ||
			condicionesHistorico.map(item => item.elementosCatalogosId)
		_options = options.map(elem => {
			if (map.includes(elem.id)) {
				return { ...elem, checked: true }
			} else {
				return { ...elem, checked: false }
			}
		})
		setModalOptions(_options)
		setOpenOptions({ open: true, type: name })
		setLoading(false)
	}

	const toggleModal = async (saveData = false) => {
		setLoading(true)
		let options = []
		if (saveData) {
			options = []
			modalOptions.forEach(el => {
				if (el.newChecked) options.push(el)
			})
			const url = `${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/${
				openOptions.type === 'discapacidades'
					? 'DiscapacidadesPorUsuario'
					: 'CondicionesPorUsuario'
			}/AddMultiple/${props.identidadId}`
			const optionsMap = options.map(d => {
				return {
					id: 0,
					elementosCatalogoId: d.id,
					identidadesId: props.identidadId,
					estado: true
				}
			})

			axios.post(url, optionsMap).then(r => {
				if (r.data) {
					getHistoricos()
					props.setConditionsHaveChanged(true)
					props.showsnackBar('success', 'Contenido enviado con éxito')
				}
				r.error && props.showsnackBar('error', 'Error agregando condición')
				setLoading(false)
			})
		} else {
			setLoading(false)
		}
		setOpenOptions({ open: false, type: null })
	}

	const handleChangeItem = item => {
		const newItems = modalOptions.map(element => {
			if (element.id === item.id) {
				return { ...element, newChecked: !element.newChecked }
			}
			return element
		})
		console.log('newItems', newItems)
		setModalOptions(newItems)
	}

	const optionsTab = [
		{
			title: 'Apoyos curriculares',
			path: '/director/expediente-estudiante/apoyos-educativos/curriculares'
		},
		{
			title: 'Apoyos personales',
			path: '/director/expediente-estudiante/apoyos-educativos/personales'
		},
		{
			title: 'Apoyos organizativos',
			path: '/director/expediente-estudiante/apoyos-educativos/organizativos'
		},
		{
			title: 'Alto potencial',
			path: '/director/expediente-estudiante/apoyos-educativos/alto-potencial'
		},
		{
			title: 'Condición de discapacidad',
			path: '/director/expediente-estudiante/apoyos-educativos/condicion-discapacidad'
		},
		{
			title: 'Otras condiciones',
			path: '/director/expediente-estudiante/apoyos-educativos/otras-condiciones'
		}
	]

	const deleteCondicion = id => {
		axios
			.delete(
				`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/CondicionesPorUsuario/${id}`
			)
			.then(() => {
				getHistoricosCondiciones()
				getCondiciones(id)
				props.setConditionsHaveChanged(true)
			})
	}
	const deleteDiscapacidad = id => {
		axios
			.delete(
				`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/DiscapacidadesPorUsuario/${id}`
			)
			.then(() => {
				getDiscapacidades(id)
				getHistoricosDiscapacidades()
				props.setConditionsHaveChanged(true)
			})
	}

	if (loading || catalogos.length === 0) {
		return <Loader />
	}

	return (
		<>
			<HeaderTab options={optionsTab} activeTab={props.activeTab} />
			<ContentTab activeTab={props.activeTab} numberId={props.activeTab}>
				{props.activeTab === 0 && (
					<ApoyosEstudiante
						catalogos={catalogos}
						apoyos={props.apoyos}
						categoria={{
							id: 4,
							nombre: 'Apoyos curriculares',
							addDispatchName: 'apoyoscurriculares4',
							tituloModal: 'Registro de apoyo curricular'
						}}
					/>
				)}
				{props.activeTab === 1 && (
					<ApoyosEstudiante
						catalogos={catalogos}
						apoyos={props.apoyos}
						categoria={{
							id: 1,
							nombre: 'Apoyos personales',
							addDispatchName: 'apoyospersonales1',
							tituloModal: 'Registro de apoyo personal'
						}}
					/>
				)}
				{props.activeTab === 2 && (
					<ApoyosEstudiante
						catalogos={catalogos}
						apoyos={props.apoyos}
						categoria={{
							id: 2,
							nombre: 'Apoyos organizativos',
							addDispatchName: 'apoyosorganizativos2',
							tituloModal: 'Registro de apoyos organizativos'
						}}
					/>
				)}
				{props.activeTab === 3 && (
					<AltoPotencial catalogos={catalogos} apoyos={props.apoyos} />
				)}
				{props.activeTab === 4 && (
					<CondicionDiscapacidad
						discapacidadesHistorico={discapacidadesHistorico}
						delete={deleteDiscapacidad}
						handleOpenOptions={handleOpenOptions}
						discapacidades={props.discapacidades}
					/>
				)}
				{props.activeTab === 5 && (
					<OtraCondicion
						condicionesHistorico={condicionesHistorico}
						handleOpenOptions={handleOpenOptions}
						delete={deleteCondicion}
						condiciones={props.condiciones}
					/>
				)}
			</ContentTab>

			<FormModal
				isOpen={openOptions.open}
				titleHeader={
					openOptions.type === 'discapacidades'
						? t(
								'estudiantes>expediente>apoyos_edu>modal>tipos',
								'Tipos de discapacidades'
						  )
						: t(
								'estudiantes>expediente>apoyos_edu>modal>otro',
								'Otros tipos de condiciones'
						  )
				}
				onConfirm={() => toggleModal(true)}
				onCancel={() => toggleModal(false)}
				textConfirm="Guardar"
			>
				{modalOptions
					.filter(d =>
						openOptions.type === 'discapacidades'
							? !discapacidadesHistorico?.some(di => di.id == d.id)
							: !condicionesHistorico?.some(di => di.id == d.id)
					)
					.filter(d => !d.checked)
					.map((item, i) => {
						return (
							<Row key={i}>
								<Col xs={3} className="modal-detalle-subsidio-col">
									<div>
										<CustomInput
											type="checkbox"
											label={item.nombre}
											inline
											onClick={() => handleChangeItem(item)}
											checked={item.newChecked}
										/>
									</div>
								</Col>
								<Col xs={9} className="modal-detalle-subsidio-col">
									<div>
										<p>
											{item.descripcion
												? item.descripcion
												: item.detalle
												? item.detalle
												: 'Elemento sin detalle actualmente'}
										</p>
									</div>
								</Col>
							</Row>
						)
					})}
			</FormModal>
		</>
	)
}
export default ApoyoEducativo
