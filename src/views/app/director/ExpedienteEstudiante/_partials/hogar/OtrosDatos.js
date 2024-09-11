import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { Button, CardTitle, Row, Card, CardBody, FormGroup, Label, Col, Form } from 'reactstrap'
import { envVariables } from 'Constants/enviroment'
import Select from 'react-select'
import AsyncSelect from 'react-select/async'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { updateInformacionOtrosEstudiante } from 'Redux/identificacion/actions'
import useNotification from 'Hooks/useNotification'
import { getCatalogs } from 'Redux/selects/actions'
import { catalogsEnumObj } from '../../../../../../utils/catalogsEnum'
import withAuthorization from '../../../../../../Hoc/withAuthorization'
import { useTranslation } from 'react-i18next'
import { AsyncPaginate } from 'react-select-async-paginate'
import axios from 'axios'
const OtrosDatos = props => {
	const { t } = useTranslation()

	const [editable, setEditable] = useState(false)
	const [hasCurrentCondicionL, setHasCurrentCondicionL] = useState(false)
	const [currentCondicionL, setCurrentCondicionL] = useState({ label: '', value: '' })
	const [currentOcupacion, setCurrentOcupacion] = useState(null)
	const [currentEscolaridad, setCurrentEscolaridad] = useState({ label: '', value: '' })
	const [snakbar, handleClick, handleClose] = useNotification()
	const [snackbarMsg, setSnackbarMsg] = useState('')
	const [snackbarVariant, setSnackbarVariant] = useState('success')

	useEffect(() => {
		if (!props.expediente.id) {
			props.history.push('/director/expediente-estudiante')
		}

		const fetchData = async () => {
			!props.condicionLaboral[0] && (await props.getCatalogs(catalogsEnumObj.CONDICIONLABORAL.id))

			!props.ocupaciones[0] && (await props.getCatalogs(catalogsEnumObj.OCUPACIONES.id, 1, 10))

			!props.escolaridades[0] && (await props.getCatalogs(catalogsEnumObj.ESCOLARIDADES.id))
		}

		fetchData()

		setHasCurrentCondicionL(props.expediente.trabaja)
	}, [])

	useEffect(() => {
		getAditionalItem('condicionL', 11, (actionCatalogo, result) => {
			const condTemp = props.condicionLaboral.find(x => x.id == result?.elementoId)
			handleInputChange(actionCatalogo, {
				label: condTemp?.nombre,
				value: condTemp?.id
			})
		})
	}, [props.condicionLaboral, editable])

	useEffect(() => {
		getAditionalItem('ocupacion', 12, (actionCatalogo, result) => {
			const condTemp = props.ocupaciones.find(x => x.id == result?.elementoId)
			handleInputChange(actionCatalogo, {
				label: condTemp?.nombre,
				value: condTemp?.id
			})
		})
	}, [props.ocupaciones, editable])

	useEffect(() => {
		getAditionalItem('escolaridad', 13, (actionCatalogo, result) => {
			const condTemp = props.escolaridades.find(x => x.id == result?.elementoId)
			handleInputChange(actionCatalogo, {
				label: condTemp?.nombre,
				value: condTemp?.id
			})
		})
	}, [props.escolaridades, editable])

	const getAditionalItem = (actionCatalogo, catalogoId, callback) => {
		if (!props.expediente.datos) {
			return -1
		}

		let tempAditional = props.expediente.datos.find(x => x.catalogoId == catalogoId)

		tempAditional = tempAditional || { label: '', value: '' }

		callback(actionCatalogo, tempAditional)
	}

	const handleInputChange = (action, data) => {
		switch (action) {
			case 'ocupacion': {
				setCurrentOcupacion(data)
				break
			}
			case 'escolaridad': {
				setCurrentEscolaridad(data)
				break
			}
			case 'hasCondicion': {
				setHasCurrentCondicionL(data)
				break
			}
			case 'condicionL': {
				setCurrentCondicionL(data)
				break
			}
		}
	}

	const sendData = async () => {
		const aditionalIds = []
		if (currentCondicionL.value) aditionalIds.push(currentCondicionL.value)
		if (currentEscolaridad.value) {
			aditionalIds.push(currentEscolaridad.value)
		}
		if (currentOcupacion.value) aditionalIds.push(currentOcupacion.value)

		const payload = {
			id: props.expediente.id,
			trabaja: currentCondicionL.label === 'Empleado',
			AdditionalIds: aditionalIds
		}

		const rest = await props.updateInformacionOtrosEstudiante(payload)
		if (rest.payload) {
			setSnackbarVariant('success')
			setSnackbarMsg(t('general>success_act', 'Se actualizo correctamente'))
			handleClick()
			setEditable(false)
		}

		if (rest.data && rest.data.error) {
			setSnackbarVariant('error')
			setSnackbarMsg(t('general>error_act', 'Ocurrio un error al actualizar'))
			handleClick()
		}
	}

	const loadOptions = async (searchQuery, loadedOptions, { page }) => {
		let response = {}
		if (searchQuery && searchQuery != '') {
			response = await axios.get(
				`${envVariables.BACKEND_URL}/api/Catalogo/GetAllbyTypeByText/${12}/${searchQuery}/${page}/${20}`
			)
		} else {
			response = await axios.get(`${envVariables.BACKEND_URL}/api/Catalogo/GetAllByType/${12}/${page}/${20}`)
		}

		let filteredOptions = {
			options:
				response.data.map(item => ({
					label: item.nombre,
					value: item.id
				})) || [],
			hasMore: searchQuery && searchQuery != '' ? false : response.data?.length >= 1,
			additional: {
				page: searchQuery && searchQuery != '' ? page : page + 1
			}
		}
		return filteredOptions
	}

	return (
		<Col sm='12' md='8' className='m-0 p-0'>
			{snakbar(snackbarVariant, snackbarMsg)}
			<Card>
				<CardBody>
					<CardTitle>
						{t('estudiantes>expediente>hogar>otros_datos>titulo', 'Otros datos del estudiante')}
					</CardTitle>
					<Form>
						<Row>
							<Col sm={{ size: 10, offset: 1 }}>
								<FormGroup>
									<Label>
										{t(
											'estudiantes>expediente>hogar>otros_datos>condicion_lab',
											'Condición Laboral'
										)}
									</Label>
									<Select
										components={{
											Input: CustomSelectInput
										}}
										className='react-select'
										classNamePrefix='react-select'
										name='condicionLaboral'
										id='condicionLaboral'
										value={currentCondicionL}
										isDisabled={!editable}
										onChange={data => {
											handleInputChange('condicionL', data)
										}}
										placeholder=''
										//TODO: Agregar N/A
										options={props.condicionLaboral.map(item => ({
											label: item.nombre,
											value: item.id
										}))}
									/>
								</FormGroup>
							</Col>
							<Col sm={{ size: 10, offset: 1 }}>
								<FormGroup>
									<Label>
										{t('estudiantes>expediente>hogar>otros_datos>ocupacion', 'Ocupación')}
									</Label>
									<AsyncPaginate
										components={{
											Input: CustomSelectInput
										}}
										key='async-ocupaciones'
										className='react-select'
										classNamePrefix='react-select'
										name='ocupacion'
										id='ocupacion'
										value={currentOcupacion}
										isDisabled={!editable}
										onChange={data => {
											handleInputChange('ocupacion', data)
										}}
										additional={{
											page: 1
										}}
										loadOptions={loadOptions}
										placeholder=''
										cacheUniqs={[currentOcupacion]}
									/>
								</FormGroup>
							</Col>
							<Col sm={{ size: 10, offset: 1 }}>
								<FormGroup>
									<Label>
										{t('estudiantes>expediente>hogar>otros_datos>escolaridad', 'Escolaridad')}
									</Label>
									<Select
										components={{
											Input: CustomSelectInput
										}}
										className='react-select'
										classNamePrefix='react-select'
										name='escolaridad'
										id='escolaridad'
										value={currentEscolaridad}
										isDisabled={!editable}
										onChange={data => {
											handleInputChange('escolaridad', data)
										}}
										placeholder=''
										options={props.escolaridades.map(item => ({
											label: item.nombre,
											value: item.id
										}))}
									/>
								</FormGroup>
							</Col>
						</Row>
					</Form>
				</CardBody>
			</Card>
			<div className='container-center mt-2'>
				{editable ? (
					<>
						<Button
							className='btn-shadow m-0'
							outline
							color='primary'
							type='button'
							onClick={() => {
								setEditable(false)
							}}
						>
							{t('general>cancelar', 'Cancelar')}
						</Button>
						<Button
							color='primary'
							className='btn-shadow m-0'
							type='button'
							onClick={() => {
								props.authHandler('modificar', sendData)
							}}
						>
							{t('general>guardar', 'Guardar')}
						</Button>
					</>
				) : (
					<Button
						color='primary'
						className='btn-shadow m-0'
						type='button'
						onClick={() => {
							props.authHandler('modificar', () => setEditable(true))
						}}
					>
						{t('general>editar', 'Editar')}
					</Button>
				)}
			</div>
		</Col>
	)
}

const mapStateToProps = state => {
	return {
		condicionLaboral: state.selects[catalogsEnumObj.CONDICIONLABORAL.name],
		ocupaciones: state.selects[catalogsEnumObj.OCUPACIONES.name],
		escolaridades: state.selects[catalogsEnumObj.ESCOLARIDADES.name],
		expediente: state.identification.data
	}
}

const mapDispatchToProps = {
	updateInformacionOtrosEstudiante,
	getCatalogs
}

export default withAuthorization({
	id: 5,
	Modulo: 'Expediente Estudiantil',
	Apartado: 'Informacion del Hogar',
	Seccion: 'Otros Datos del estudiante'
})(connect(mapStateToProps, mapDispatchToProps)(withRouter(OtrosDatos)))
