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
import { ApoyosOrganizativos } from './ApoyosOrganizativos'
import OptionModal from '../../../../../../components/Modal/OptionModal'

const ApoyoEducativo = props => {
	const { t } = useTranslation()

	const [discapacidadesHistorico, setDiscapacidadesHistorico] = useState()
	const [condicionesHistorico, setCondicionesHistorico] = useState()
	const [loading, setLoading] = useState()

	const [discapacidades, setDiscapacidades] = useState([])
	const [condiciones, setCondiciones] = useState([])
	const [openOptions, setOpenOptions] = useState({ open: false, type: null })
	const [modalOptions, setModalOptions] = useState([])
	const [activeTab, setActiveTab] = useState(0)

	useEffect(() => {
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
	}, [props.discapacidadesIdentidad])
	useEffect(() => {
		getHistoricos()
	}, [])

	const getHistoricos = () => {
		setLoading(true)
		axios
			.get(
				`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/DiscapacidadesPorUsuario/GetByIdentityIdHist/${props.identidadId}`
			)
			.then(r => {
				setDiscapacidadesHistorico(r.data)
				setLoading(false)
			}, [])
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
	}, [props.condicionesIdentidad])

	const handleOpenOptions = (options, name) => {
		let _options = []

		const map =
			(name === 'discapacidades' && discapacidades.map(item => item.id)) ||
			condiciones.map(item => item.id)
		_options = options.map(elem => {
			if (map.includes(elem.id)) {
				return { ...elem, checked: true }
			} else {
				return { ...elem, checked: false }
			}
		})
		setModalOptions(_options)
		setOpenOptions({ open: true, type: name })
	}

	const toggleModal = async (saveData = false) => {
		setLoading(true)
		let options = []
		if (saveData) {
			options = []
			modalOptions.forEach(el => {
				if (el.checked) options.push(el)
			})
			const url = `${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/${
				openOptions.type === 'discapacidades'
					? 'DiscapacidadesPorUsuario'
					: 'CondicionesPorUsuario'
			}/CreateMultiple/${props.identidadId}`
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
			})
		} else {
			setLoading(false)
		}
		setOpenOptions({ open: false, type: null })
	}

	const handleChangeItem = item => {
		const newItems = modalOptions.map(element => {
			if (element.id === item.id) {
				return { ...element, checked: !element.checked }
			}
			return element
		})
		setModalOptions(newItems)
	}

	const optionsTab = [
		{ title: 'Condición de discapacidad' },
		{ title: 'Otras condiciones' },
		{ title: 'Apoyos curriculares' },
		{ title: 'Apoyos personales' },
		{ title: 'Apoyos organizativos' }
	]
	return (
		<>
			{loading && <Loader />}

			<HeaderTab
				options={optionsTab}
				activeTab={activeTab}
				setActiveTab={setActiveTab}
			/>
			<ContentTab activeTab={activeTab} numberId={activeTab}>
				{activeTab === 0 && (
					<CondicionDiscapacidad
						discapacidadesHistorico={discapacidadesHistorico}
						handleOpenOptions={handleOpenOptions}
						discapacidades={props.discapacidades}
					/>
				)}
				{activeTab === 1 && (
					<OtraCondicion
						condicionesHistorico={condicionesHistorico}
						handleOpenOptions={handleOpenOptions}
						condiciones={props.condiciones}
					/>
				)}
				{activeTab === 2 && <ApoyosCurriculares />}
				{activeTab === 3 && <ApoyosPersonales />}
				{activeTab === 4 && <ApoyosOrganizativos />}
			</ContentTab>

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
											checked={item.checked}
										/>
									</div>
								</Col>
								<Col xs={9} className="modal-detalle-subsidio-col">
									<div>
										{item.descripcion ||
											item.detalle ||
											'Elemento sin detalle actualmente'}
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
