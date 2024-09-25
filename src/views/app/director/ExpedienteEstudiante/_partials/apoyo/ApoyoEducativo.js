import React, { useState, useEffect } from 'react'
import 'react-tagsinput/react-tagsinput.css'
import HeaderTab from 'Components/Tab/Header'
import ContentTab from 'Components/Tab/Content'
import { envVariables } from '../../../../../../constants/enviroment'
import { Row, Col, CustomInput } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import Loader from 'Components/LoaderContainer'
import CondicionDiscapacidad from './CondicionDiscapacidad'
import OtraCondicion from './OtraCondicion'
import axios from 'axios'
import { ApoyosCurriculares } from './ApoyosCurriculares'
import { ApoyosPersonales } from './ApoyosPersonales'
import { AltoPotencial } from './AltoPotencial'
import { ApoyosOrganizativos } from './ApoyosOrganizativos'
import OptionModal from '../../../../../../components/Modal/OptionModal'
import RequiredSpan from '../../../../../../components/Form/RequiredSpan'
import {
	getCondiciones,
	getDiscapacidades
} from '../../../../../../redux/apoyos/actions'

const ApoyoEducativo = props => {
	const { t } = useTranslation()
	const [discapacidadesHistorico, setDiscapacidadesHistorico] = useState()
	const [condicionesHistorico, setCondicionesHistorico] = useState()
	const [loading, setLoading] = useState(true)
	const [discapacidades, setDiscapacidades] = useState([])
	const [condiciones, setCondiciones] = useState([])
	const [openOptions, setOpenOptions] = useState({ open: false, type: null })
	const [modalOptions, setModalOptions] = useState([])
	const [activeTab, setActiveTab] = useState(0)

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
		{ title: 'Apoyos curriculares' },
		{ title: 'Apoyos personales' },
		{ title: 'Apoyos organizativos' },
		{ title: 'Alto Potencial' },
		{ title: 'Condición de discapacidad' },
		{ title: 'Otras condiciones' }
	]
	const deleteCondicion = id => {
		axios
			.delete(
				`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/CondicionesPorUsuario/${id}`
			)
			.then(() => {
				getHistoricosCondiciones()
				getCondiciones(id)
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
			})
	}
	return (
		<>
			{loading && <Loader />}
			<Row>
				<HeaderTab
					options={optionsTab}
					activeTab={activeTab}
					setActiveTab={setActiveTab}
				/>
				<ContentTab activeTab={activeTab} numberId={activeTab}>
					{activeTab === 0 && (
						<ApoyosCurriculares validations={props.validations} />
					)}
					{activeTab === 1 && (
						<ApoyosPersonales validations={props.validations} />
					)}
					{activeTab === 2 && (
						<ApoyosOrganizativos validations={props.validations} />
					)}
					{activeTab === 3 && <AltoPotencial validations={props.validations} />}
					{activeTab === 4 && (
						<CondicionDiscapacidad
							validations={props.validations}
							discapacidadesHistorico={discapacidadesHistorico}
							delete={deleteDiscapacidad}
							handleOpenOptions={handleOpenOptions}
							discapacidades={props.discapacidades}
						/>
					)}
					{activeTab === 5 && (
						<OtraCondicion
							validations={props.validations}
							condicionesHistorico={condicionesHistorico}
							handleOpenOptions={handleOpenOptions}
							delete={deleteCondicion}
							condiciones={props.condiciones}
						/>
					)}
				</ContentTab>
			</Row>
			<OptionModal
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
			</OptionModal>
		</>
	)
}
export default ApoyoEducativo
