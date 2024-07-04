import 'react-datepicker/dist/react-datepicker.css'
import Loader from 'Components/LoaderContainer'
import SimpleModal from 'Components/Modal/simple'

import { useActions } from 'Hooks/useActions'
import moment from 'moment'
import React, { useEffect } from 'react'

import { Controller, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import { Button, Col, Input, Row } from 'reactstrap'
import {
	actualizarTSE,
	cleanStudent,
	getIdentificacionPersona,
	identificacionTSE
} from 'Redux/identidad/actions'
import { getCatalogs } from 'Redux/selects/actions'
import styled from 'styled-components'
import { catalogsEnum } from 'Utils/catalogsEnum'
import { progressInCard } from 'Utils/progress'
import { getYearsOld } from 'Utils/years'
import ReactInputMask from 'react-input-mask'
import { useTranslation } from 'react-i18next'

interface IProps {
	disabled?: boolean
	showNotification: Function
	onPrev?: Function
	onNext?: Function
	matricula?: boolean
	data?: any
	isAplicar?: boolean
	idType: number
	cancelPreview?: any
	editResource?: any
	show?: any
}

type IState = {
	selects: any
	identidad: any
}

type FormValidations = {
	typeId?: boolean
	identification?: boolean
	nacionalidad?: boolean
	nombre?: boolean
	primerApellido?: boolean
	segundoApellido?: boolean
	conocidoComo?: boolean
	sexoId?: boolean
	generoId?: boolean
	fechaNacimiento?: boolean
	edad?: boolean
	button?: boolean
	tipoDimex?: boolean
	tipoYisro?: boolean
}

const parseDatosToSelectValue = (datos, selects) => {
	let _data = {}

	datos.forEach(item => {
		const typeCat = catalogsEnum.find(x => x.id === item.catalogoId)
		const selected = selects[typeCat.name].find(x => x.id === item.elementoId)
		let _obj = {}

		switch (typeCat.name) {
			case 'nationalities':
				_obj = {
					nationality: selected
				}
				break
			case 'genderTypes':
				_obj = {
					genero: selected
				}
				break
			case 'sexoTypes':
				_obj = {
					sexo: selected
				}
				break
			case 'tipoDimex':
				_obj = {
					tipoDimex: selected
				}
				break
			case 'tipoYisro':
				_obj = {
					tipoYisro: selected
				}
				break
			case 'idTypes':
				_obj = {
					type_identification: selected.nombre,
					tipoIdentificacionId: selected.id
				}
				break
		}
		_data = { ..._data, ..._obj }
	})
	return _data
}

const RegistroForm: React.FC<IProps> = props => {
	const { t } = useTranslation()
	const { matricula, showNotification, idType, onPrev, onNext, data, isAplicar } = props

	const [typeRequired, setTypeRequired] = React.useState<boolean>(true)
	const [existingId, setExistingId] = React.useState<boolean>(false)
	const [fallecido, setFallecido] = React.useState<boolean>(false)
	const [loading, setLoading] = React.useState<boolean>(false)
	const [selectNationalities, setSelectNationalities] = React.useState<any[]>([])

	const [modalAviso, setModalAviso] = React.useState<boolean>(false)
	const [modalAvisoMensaje, setModalAvisoMensaje] = React.useState('')
	const [disableFields, setDisableFields] = React.useState<boolean>(false)

	const CR: string = 'COSTARRICENSE'

	const actions = useActions({
		getIdentificacionPersona,
		identificacionTSE,
		cleanStudent,
		getCatalogs
	})

	const [validations, setValidation] = React.useState<FormValidations>({
		identification: false,
		nacionalidad: false,
		nombre: false,
		primerApellido: false,
		segundoApellido: false,
		conocidoComo: false,
		tipoDimex: false,
		tipoYisro: false,
		fechaNacimiento: false
	})

	const {
		register,
		formState: { errors },
		control,
		setValue,
		watch,
		clearErrors,
		handleSubmit
	} = useForm({
		mode: 'onChange'
	})
	const state = useSelector((store: IState) => {
		return {
			selects: store.selects,
			identidad: store.identidad,
			user: store.identidad.data
		}
	})
	React.useEffect(() => {
		const fetch = async () => {
			await actions.getCatalogs(40)
			await actions.getCatalogs(41)
		}
		fetch()

		register('type_identification')
		register('identificacion')
	}, [])

	React.useEffect(() => {
		if (data) {
			setValues(data)
		}
	}, [data])

	const setValidatiosToDefault = () => {
		const selectedIdType = state.selects.idTypes.find((x: any) => x.id === idType)
		const codigo = selectedIdType.codigo

		switch (codigo) {
			case '01': // Nacional
				const value = state.selects.nationalities.find((pais: any) => pais.nombre === CR)

				setValue('nationality', value)
				setValue('type_identification', selectedIdType?.nombre)
				setValidation({
					...validations,
					identification: false,
					nacionalidad: true,
					nombre: true,
					primerApellido: true,
					segundoApellido: true,
					conocidoComo: true,
					fechaNacimiento: true,
					button: true
				})
				break
			case '03': // Dimex
				const _values = state.selects.nationalities.filter(
					(pais: any) => pais.nombre !== CR
				)
				setSelectNationalities(_values)
				setValue('type_identification', selectedIdType.nombre)

				setValidation({
					...validations,
					identification: false,
					tipoDimex: false,
					nacionalidad: false,
					nombre: false,
					primerApellido: false,
					segundoApellido: false,
					conocidoComo: false,
					fechaNacimiento: false,
					button: false
				})
				break
			case '04': // YISRO
				setValue('type_identification', selectedIdType.nombre)
				setTypeRequired(false)
				setValidation({
					...validations,
					identification: true,
					tipoYisro: false,
					nacionalidad: false,
					nombre: false,
					primerApellido: false,
					segundoApellido: false,
					conocidoComo: false,
					fechaNacimiento: false,
					button: false
				})
				break
			case '05': // cedula de Generica
				setValue('type_identification', selectedIdType.nombre)
				setValidation({
					...validations,
					identification: false,
					tipoDimex: false,
					nacionalidad: false,
					nombre: false,
					primerApellido: false,
					segundoApellido: false,
					conocidoComo: false,
					fechaNacimiento: false,
					button: false
				})
				break
			default:
				setValue('type_identification', selectedIdType.nombre)
				setValidation({
					...validations,
					identification: false,
					tipoDimex: false,
					nacionalidad: false,
					nombre: false,
					primerApellido: false,
					segundoApellido: false,
					conocidoComo: false,
					fechaNacimiento: false,
					button: false
				})
		}
	}
	// watch typeId change
	React.useEffect(() => {
		if (idType) {
			!data && setValue('identificacion', '')
			!data && clearValues()
			clearErrors()

			setSelectNationalities(state.selects.nationalities)

			setValidatiosToDefault()
		}
	}, [idType])

	React.useEffect(() => {
		const currentSexo: any = watch('sexo')
		if (currentSexo) {
			const currentGender = state.selects.genderTypes.find(
				el => el.codigo === currentSexo.codigo
			)
			setValue('genero', currentGender)
		}
	}, [watch('sexo')])



	const fechaNacimientoForm = watch('fechaNacimiento')
	
	React.useEffect(() => {
		const birth = fechaNacimientoForm
		if (birth !== undefined && birth !== '') {
			const nacimiento = moment(birth).toDate()
			setValue('edad', getYearsOld(nacimiento))
		} else {
			setValue('edad', '')
		}
	}, [fechaNacimientoForm])

	React.useEffect(() => {
		const id: string = watch('identificacion')
		setExistingId(false)
		const Fetch = async () => {
			progressInCard(true)
			setLoading(true)
			await getIdentidad(id)
			setLoading(false)

			progressInCard(false)
		}
		clearErrors()

		setValidatiosToDefault()

		if (idType === 1 && id?.length !== 9) {
			clearValues()
			setDisableFields(false)
		}

		if (props.isAplicar) return
		if (id?.length > 4) {
			if (data) {
				if (id?.length === 9 && idType === 1) {
					data.identificacion !== id && Fetch()
				} else if (id?.length === 12 && idType === 3) {
					data.identificacion !== id && Fetch()
				}
			} else {
				if (id?.length === 9 && idType === 1) {
					Fetch()
				} else if (id?.length === 12 && idType === 3) {
					Fetch()
				}
			}
		}
	}, [watch('identificacion')])

	React.useEffect(() => {
		if (existingId) {
			showNotification('error', 'La persona ya se encuentra registrada')
		}
	}, [existingId])

	const getIdentidad = async (identification: string) => {
		const nationalValidation = identification?.length === 9 && idType === 1
		const dimexValidation = identification?.length === 12 && idType === 3

		if (dimexValidation || nationalValidation) {
			try {
				setDisableFields(false)
				setExistingId(false)
				setValue('fechaNacimiento', '')
				setValue('edad', '')

				const { data } = await actions.getIdentificacionPersona(identification)

				if (data === undefined || data === '') {
					// Aqui entra cuando no esta en DB Saber

					const res = await actions.identificacionTSE(identification)
					if (!res.error && res.data && idType === 1) {
						// Aqui entra si no esta en TSE
						if (res.data.error) {
							setModalAviso(true)
							setModalAvisoMensaje(res.data.mensaje)

							const selectedIdType2 = state.selects.idTypes.find(
								(x: any) => x.id === 1
							)

							if (res.data.mensaje.indexOf('con anotaciones') > -1) {
								setValue('type_identification', selectedIdType2?.nombre)

								const value = state.selects.nationalities.find(
									(pais: any) => pais?.nombre?.toLowerCase() === CR.toLowerCase()
								)
								setValue('nationality', value)

								setValidation({
									...validations,
									identification: false,
									nacionalidad: true,
									nombre: false,
									primerApellido: false,
									segundoApellido: false,
									conocidoComo: false,
									fechaNacimiento: false,
									button: true
								})
							} else {
								setValidation({
									...validations,
									identification: false,
									nacionalidad: true,
									nombre: true,
									primerApellido: true,
									segundoApellido: true,
									conocidoComo: true,
									fechaNacimiento: true,
									button: false
								})
							}
							return
						}
					}
					if (!res.error && !res.data?.esFallecido) {
						const fechaNacimiento = moment(res.data.fechaNacimiento).toDate()
						const age = getYearsOld(fechaNacimiento)
						if (res.data.fechaNacimiento !== '0001-01-01T00:00:00') {
							const fechaNacimientoFormatted = moment(
								new Date(res.data.fechaNacimiento)
							).format('YYYY-MM-DD')

							setValue('fechaNacimiento', fechaNacimientoFormatted)
							setValue('edad', age)
						}

						setFallecido(res.data.esFallecido)
						setValue('nombre', res.data.nombre)
						setValue('primerApellido', res.data.primerApellido)
						setValue('segundoApellido', res.data.segundoApellido)
						setValue('conocidoComo', res.data.conocidoComo)
						setValidation({
							...validations,
							conocidoComo: false,
							generoId: false,
							sexoId: false
						})
						if (idType === 1) {
							const value = state.selects.nationalities.find(
								(pais: any) => pais?.nombre?.toLowerCase() === CR.toLowerCase()
							)
							if (value) {
								setValue('nationality', value)
							}
						}
					}
				} else {
					setExistingId(true)
					setDisableFields(true)
					const fechaNacimiento = moment(data.fechaNacimiento).toDate()
					const age = getYearsOld(fechaNacimiento)

					const _datos: any = parseDatosToSelectValue(data.datos, state.selects)
					const fechaNacimientoFormatted = moment(new Date(data.fechaNacimiento)).format(
						'YYYY-MM-DD'
					)

					setValue('fechaNacimiento', fechaNacimientoFormatted)
					setValue('edad', age)
					setValue('nombre', data.nombre)
					setValue('primerApellido', data.primerApellido)
					setValue('segundoApellido', data.segundoApellido)
					setValue('conocidoComo', data.conocidoComo)
					setValue('sexo', _datos.sexo)
					setValue('genero', _datos.genero)
					setValue('nationality', _datos.nationality)
					setValue('tipoYisro', _datos.tipoYisro)
					setValue('tipoDimex', _datos.tipoDimex)
					setValidation({
						...validations,
						identification: false,
						nacionalidad: true,
						nombre: true,
						primerApellido: true,
						segundoApellido: true,
						conocidoComo: true,
						fechaNacimiento: true,
						button: true,
						tipoDimex: true,
						generoId: true,
						sexoId: true
					})
				}
			} catch (error) {
				console.error(error)
			}
		}
	}

	const toMayusculas = e => {
		e.target.value = e.target.value.toUpperCase()
		return e.target.value
	}

	const onSubmit = async values => {
		if (existingId || fallecido) {
			return
		}
		const data = {
			...values,
			tipoIdentificacionId: idType,
			nacionalidadId: values.nationality.id,
			sexoId: values.sexo.id,
			generoId: values.genero.id,
			fechaNacimiento: values.fechaNacimiento || watch('fechaNacimiento'),
			tipoYisroId: values?.tipoYisro?.id
		}
		await onNext(data)
	}

	const handleTSEUpdate = async () => {
		progressInCard(true)
		try {
			const res = await actualizarTSE(data.identificacion)

			if (!res.error) {
				const value = state.selects.nationalities.find(
					(pais: any) => pais.nombre.toLowerCase() === CR.toLowerCase()
				)
				setValue('nombre', res.data.nombre)
				setValue('primerApellido', res.data.primerApellido)
				setValue('segundoApellido', res.data.segundoApellido)
				setValue('conocidoComo', res.data.conocidoComo)
				const fechaNacimientoFormatted = moment(new Date(res.data.fechaNacimiento)).format(
					'YYYY-MM-DD'
				)
				setValue('fechaNacimiento', fechaNacimientoFormatted)
				setValue('edad', getYearsOld(new Date(res.data.fechaNacimiento)))
				setValue('nationality', value)
			} else {
				showNotification('error', 'Algo ha sucedido con la solicitud al TSE')
			}
		} catch (e) {
			showNotification('error', 'Algo ha sucedido con la solicitud al TSE')
		}
		progressInCard(false)
	}
	const clearValues = () => {
		setValue('nationality', '')
		setValue('nombre', '')
		setValue('primerApellido', '')
		setValue('segundoApellido', '')
		setValue('conocidoComo', '')
		setValue('sexo', '')
		setValue('fechaNacimiento', '')
		setValue('tipoDimex', '')
		setValue('genero', '')
		setValue('edad', '')
		setExistingId(false)
		setFallecido(false)
	}
	const setValues = data => {
		setValue('identificacion', data.identificacion)
		setValue('nationality', data.nationality)
		setValue('nombre', data.nombre)
		setValue('primerApellido', data.primerApellido)
		setValue('segundoApellido', data.segundoApellido)
		setValue('conocidoComo', data.conocidoComo)
		setValue('sexo', data.sexo)
		setValue('genero', data.genero)
		const fechaNacimientoFormatted = moment(new Date(data.fechaNacimiento)).format('YYYY-MM-DD')
		setValue('fechaNacimiento', fechaNacimientoFormatted)
		setValue('type_identification', data.type_identification)
		data.tipoIdentificacionId === 3 && setValue('tipoDimex', data.tipoDimex)
		data.tipoIdentificacionId === 4 && setValue('tipoYisro', data.tipoYisro)
		setValue('edad', data.edad)
		setExistingId(false)
		setFallecido(false)
	}
	console.table(errors)

	const maxAge = moment(new Date()).format('YYYY-MM-DD')
	function isValidDate(dateString) {
		// First check for the pattern
		if (!/^\d{4}\-\d{1,2}\-\d{1,2}$/.test(dateString)) {
			return false
		}

		// Parse the date parts to integers
		const parts = dateString.split('-')
		const day = parseInt(parts[2], 10)
		const month = parseInt(parts[1], 10)
		const year = parseInt(parts[0], 10)

		// Check the ranges of month and year
		const maxYear = new Date().getFullYear()
		if (year < 1922 || year > maxYear || month == 0 || month > 12) {
			return false
		}

		const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

		// Adjust for leap years
		if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
			monthLength[1] = 29
		}

		// Check the range of the day
		return day > 0 && day <= monthLength[month - 1]
	}

	// debugger
	return (
		<>
			<ContentRow className='p-3'>
				<Form>
					<Row>
						<Col md={(idType === 6508 || idType === 1 ) && isAplicar ? 8 : 12}>
							<FormGroup>
								<Label>
									{t(
										'estudiantes>registro_matricula>matricula_estudian>registrar_persona>tipo_id',
										'Tipo de identificación'
									)}
								</Label>
								<Input
									name='type_identification'
									value={watch('type_identification')}
									autoComplete='off'
									readOnly
								/>
							</FormGroup>
						</Col>
						{idType === 1 && isAplicar && (
							<Col md={4}>
								<CenterDiv>
									<Button color='primary' onClick={() => handleTSEUpdate()}>
										Actualizar TSE
									</Button>
								</CenterDiv>
							</Col>
						)}
						{idType === 3 && (
							<Col md={6}>
								<FormGroup>
									<Label>
										{t(
											'estudiantes>registro_matricula>matricula_estudian>registrar_persona>tipo_dimex',
											'Tipo de DIMEX'
										)}
									</Label>
									<Controller
										as={
											<Select
												className='react-select'
												classNamePrefix='react-select'
												placeholder=''
												options={state.selects.tipoDimex.sort((a, b) =>
													a.nombre.localeCompare(b.nombre)
												)}
												getOptionLabel={(option: any) => option.nombre}
												getOptionValue={(option: any) => option.id}
												isDisabled={validations.tipoDimex}
											/>
										}
										name='tipoDimex'
										control={control}
										rules={{ required: idType === 3 }}
									/>
									{errors?.tipoDimex && (
										<ErrorFeedback>
											{t(
												'estudiantes>registro_matricula>matricula_estudian>registrar_persona>campo_requerido',
												'Campo requerido'
											)}
										</ErrorFeedback>
									)}
								</FormGroup>
							</Col>
						)}
						{/* tipo yisro */}
						{idType === 4 && (
							<Col md={6}>
								<FormGroup>
									<Label>
										{t(
											'estudiantes>registro_matricula>matricula_estudian>registrar_persona>tipo_yisro',
											'Tipo de Yís Rö'
										)}
									</Label>
									<Controller
										as={
											<Select
												className='react-select'
												classNamePrefix='react-select'
												placeholder=''
												options={state.selects.tipoYisro.sort((a, b) =>
													a.nombre.localeCompare(b.nombre)
												)}
												getOptionLabel={(option: any) => option.nombre}
												getOptionValue={(option: any) => option.id}
												isDisabled={validations.tipoYisro}
											/>
										}
										name='tipoYisro'
										control={control}
										rules={{ required: idType === 4 }}
									/>
									{errors?.tipoYisro && (
										<ErrorFeedback>
											{t(
												'estudiantes>registro_matricula>matricula_estudian>registrar_persona>campo_requerido',
												'Campo requerido'
											)}
										</ErrorFeedback>
									)}
								</FormGroup>
							</Col>
						)}
						{idType != 4 && (
							<Col md={6}>
								<FormGroup>
									<Label>
										{t(
											'estudiantes>registro_matricula>matricula_estudian>registrar_persona>num_identificacion',
											'Número de identificación'
										)}{' '}
										{idType === 3 && 'de DIMEX'}
									</Label>

									<Controller
										maskChar={null}
										control={control}
										as={
											<ReactInputMask
												mask={
													idType === 1
														? '999999999' // 9
														: idType === 3
														? '999999999999' // 12
														: idType === 4
														? 'YR9999-99999'
														: '99999999999999999999'
												}
												className='form-control'
												type='text'
												readOnly={
													validations.identification || props.isAplicar
												}
												invalid={
													(existingId && matricula) ||
													errors?.identificacion
												}
											>
												{inputProps => <Input {...inputProps} />}
											</ReactInputMask>
										}
										name='identificacion'
										rules={{
											required: typeRequired,
											minLength: idType === 3 ? 12 : idType === 1 ? 9 : null
										}}
									/>
									{errors?.identification?.type === 'required' && (
										<ErrorFeedback>
											{t(
												'estudiantes>registro_matricula>matricula_estudian>registrar_persona>campo_requerido',
												'Campo requerido'
											)}
										</ErrorFeedback>
									)}
									{errors?.identification?.type === 'pattern' && (
										<ErrorFeedback>
											El campo no cumple con el patrón indicado
										</ErrorFeedback>
									)}

									{errors?.identificacion?.type === 'maxLength' && (
										<ErrorFeedback>
											Debe tener una longitud máxima de{' '}
											{idType === 3 ? 12 : idType === 1 && 9} caracteres
										</ErrorFeedback>
									)}
									{errors?.identificacion?.type === 'minLength' && (
										<ErrorFeedback>
											Debe tener una longitud mínima de{' '}
											{idType === 3 ? 12 : idType === 1 && 9} caracteres
										</ErrorFeedback>
									)}
									{existingId && (
										<ErrorFeedback>
											Esa identificacion se encuentra registrada
										</ErrorFeedback>
									)}
								</FormGroup>
							</Col>
						)}
						<Col md={idType === 3 ? 12 : 6}>
							<FormGroup>
								<Label>
									{t(
										'estudiantes>registro_matricula>matricula_estudian>registrar_persona>nacionalidad',
										'Nacionalidad'
									)}
								</Label>
								<Controller
									as={
										<Select
											className='react-select'
											classNamePrefix='react-select'
											placeholder=''
											options={selectNationalities.sort((a, b) =>
												a.nombre.localeCompare(b.nombre)
											)}
											getOptionLabel={(option: any) => option.nombre}
											getOptionValue={(option: any) => option.id}
											isDisabled={validations.nacionalidad}
										/>
									}
									value={watch('nationality')}
									name='nationality'
									control={control}
									rules={{ required: true }}
								/>
								{errors?.nationality && (
									<ErrorFeedback>
										{t(
											'estudiantes>registro_matricula>matricula_estudian>registrar_persona>campo_requerido',
											'Campo requerido'
										)}
									</ErrorFeedback>
								)}
							</FormGroup>
						</Col>
						<Col md={12}>
							<FormGroup>
								<Label>
									{t(
										'estudiantes>registro_matricula>matricula_estudian>registrar_persona>nombre',
										'Nombre'
									)}
								</Label>
								<Input
									name='nombre'
									autoComplete='off'
									onInput={toMayusculas}
									innerRef={register({
										required: true,
										maxLength: 50,
										validate: value => {
											const test = String(value).match(/[0-9]/g)
											if (test) {
												return t(
													'estudiantes>registro_matricula>matricula_estudian>registrar_persona>solo_texto',
													'Solo se permite texto'
												)
											}
										}
									})}
									style={{
										border: errors?.nombre ? '1px solid red' : null
									}}
									readOnly={validations.nombre}
								/>
								{errors?.nombre?.type === 'required' && (
									<ErrorFeedback>
										{t(
											'estudiantes>registro_matricula>matricula_estudian>registrar_persona>campo_requerido',
											'Campo requerido'
										)}
									</ErrorFeedback>
								)}
								{errors?.nombre?.type === 'validate' && (
									<ErrorFeedback>
										{t(
											'estudiantes>registro_matricula>matricula_estudian>registrar_persona>solo_texto',
											'Solo se permite texto'
										)}
									</ErrorFeedback>
								)}
								{errors?.nombre?.type === 'pattern' && (
									<ErrorFeedback>
										{t(
											'estudiantes>registro_matricula>matricula_estudian>registrar_persona>solo_mayus',
											'Solo se permiten mayúsculas'
										)}
									</ErrorFeedback>
								)}
								{errors?.nombre?.type === 'maxLength' && (
									<ErrorFeedback>
										Debe tener una longitud máxima de 50 caracteres
									</ErrorFeedback>
								)}
							</FormGroup>
						</Col>
						<Col md={6}>
							<FormGroup>
								<Label>
									{t(
										'estudiantes>registro_matricula>matricula_estudian>registrar_persona>primer_ap',
										'Primer apellido'
									)}
								</Label>
								<Input
									name='primerApellido'
									autoComplete='off'
									onInput={toMayusculas}
									style={{
										border: errors?.primerApellido ? '1px solid red' : null
									}}
									innerRef={register({
										required: true,
										maxLength: 30,
										validate: value => {
											const test = String(value).match(/[0-9]/g)
											if (test) {
												return t(
													'estudiantes>registro_matricula>matricula_estudian>registrar_persona>solo_texto',
													'Solo se permite texto'
												)
											}
										}
									})}
									readOnly={validations.primerApellido}
								/>

								{errors?.primerApellido?.type === 'required' && (
									<ErrorFeedback>
										{t(
											'estudiantes>registro_matricula>matricula_estudian>registrar_persona>campo_requerido',
											'Campo requerido'
										)}
									</ErrorFeedback>
								)}
								{errors?.primerApellido?.type === 'validate' && (
									<ErrorFeedback>
										{t(
											'estudiantes>registro_matricula>matricula_estudian>registrar_persona>solo_texto',
											'Solo se permite texto'
										)}
									</ErrorFeedback>
								)}
								{errors?.primerApellido?.type === 'pattern' && (
									<ErrorFeedback>
										{t(
											'estudiantes>registro_matricula>matricula_estudian>registrar_persona>solo_mayus',
											'Solo se permiten mayúsculas'
										)}
									</ErrorFeedback>
								)}

								{errors?.primerApellido?.type === 'maxLength' && (
									<ErrorFeedback>
										Debe tener una longitud máxima de 30 caracteres
									</ErrorFeedback>
								)}
							</FormGroup>
						</Col>
						<Col md={6}>
							<FormGroup>
								<Label>
									{t(
										'estudiantes>registro_matricula>matricula_estudian>registrar_persona>segundo_ap',
										'Segundo apellido'
									)}{' '}
								</Label>
								<Input
									name='segundoApellido'
									autoComplete='off'
									onInput={toMayusculas}
									style={{
										border: errors?.segundoApellido ? '1px solid red' : null
									}}
									innerRef={register({
										maxLength: 30,
										validate: value => {
											const test = String(value).match(/[0-9]/g)
											if (test) {
												return t(
													'estudiantes>registro_matricula>matricula_estudian>registrar_persona>solo_texto',
													'Solo se permite texto'
												)
											}
										}
									})}
									readOnly={validations.segundoApellido}
								/>
								{errors?.segundoApellido?.type === 'required' && (
									<ErrorFeedback>
										{t(
											'estudiantes>registro_matricula>matricula_estudian>registrar_persona>campo_requerido',
											'Campo requerido'
										)}
									</ErrorFeedback>
								)}
								{errors?.segundoApellido?.type === 'validate' && (
									<ErrorFeedback>
										{t(
											'estudiantes>registro_matricula>matricula_estudian>registrar_persona>solo_texto',
											'Solo se permite texto'
										)}
									</ErrorFeedback>
								)}
								{errors?.segundoApellido?.type === 'pattern' && (
									<ErrorFeedback>
										{t(
											'estudiantes>registro_matricula>matricula_estudian>registrar_persona>solo_mayus',
											'Solo se permiten mayúsculas'
										)}
									</ErrorFeedback>
								)}
								{errors?.segundoApellido?.type === 'maxLength' && (
									<ErrorFeedback>
										Debe tener una longitud máxima de 30 caracteres
									</ErrorFeedback>
								)}
							</FormGroup>
						</Col>
						<Col md={12}>
							<FormGroup>
								<Label>
									{t(
										'estudiantes>registro_matricula>matricula_estudian>registrar_persona>conocido_como',
										'Conocido como'
									)}
								</Label>
								<Input
									name='conocidoComo'
									onInput={toMayusculas}
									autoComplete='off'
									innerRef={register({
										maxLength: 150
									})}
									readOnly={validations.conocidoComo}
								/>
								{errors?.conocidoComo?.type === 'pattern' && (
									<ErrorFeedback>
										{t(
											'estudiantes>registro_matricula>matricula_estudian>registrar_persona>solo_mayus',
											'Solo se permiten mayúsculas'
										)}
									</ErrorFeedback>
								)}
								{errors?.conocidoComo?.type === 'maxLength' && (
									<ErrorFeedback>
										Debe tener una longitud máxima de 150 caracteres
									</ErrorFeedback>
								)}
							</FormGroup>
						</Col>

						<Col md={6}>
							<FormGroup>
								<Label>
									{t(
										'estudiantes>registro_matricula>matricula_estudian>registrar_persona>fecha_nacimiento',
										'Fecha de nacimiento'
									)}
								</Label>
								
								<Input
									name='fechaNacimiento'
									type='date'
									readOnly={validations.fechaNacimiento}
									innerRef={register({
										required: true
									})}
									value={fechaNacimientoForm}
									onChange={e => {
										if (isValidDate(e.target.value)) {
											setValue('fechaNacimiento', e.target.value)
										}
									}}
									max={maxAge}
									min='1922-01-01'
									invalid={errors?.fechaNacimiento}
									style={{
										border: errors?.fechaNacimiento ? '1px solid red' : null
									}}
									disabled={validations.fechaNacimiento}
								/>
								{errors?.fechaNacimiento && (
									<ErrorFeedback>
										{t(
											'estudiantes>registro_matricula>matricula_estudian>registrar_persona>campo_requerido',
											'Campo requerido'
										)}
									</ErrorFeedback>
								)}
							</FormGroup>
						</Col>
						<Col md={6}>
							<FormGroup>
								<Label>
									{t(
										'estudiantes>registro_matricula>matricula_estudian>registrar_persona>edad_cumplida',
										'Edad cumplida'
									)}
								</Label>
								<Input
									name='edad'
									autoComplete='off'
									innerRef={register({
										required: true
									})}
									readOnly
								/>
								{errors?.edad && (
									<ErrorFeedback>
										{t(
											'estudiantes>registro_matricula>matricula_estudian>registrar_persona>campo_requerido',
											'Campo requerido'
										)}
									</ErrorFeedback>
								)}
							</FormGroup>
						</Col>
						<Col md={6}>
							<FormGroup>
								<Label>
									{t(
										'estudiantes>registro_matricula>matricula_estudian>registrar_persona>sexo',
										'Sexo'
									)}
								</Label>
								<Controller
									as={
										<Select
											className='react-select'
											classNamePrefix='react-select'
											placeholder=''
											options={state.selects.sexoTypes}
											getOptionLabel={(option: any) => option.nombre}
											getOptionValue={(option: any) => option.id}
											isDisabled={validations.sexoId}
										/>
									}
									name='sexo'
									control={control}
									rules={{ required: true }}
								/>
								{errors?.sexo && (
									<ErrorFeedback>
										{t(
											'estudiantes>registro_matricula>matricula_estudian>registrar_persona>campo_requerido',
											'Campo requerido'
										)}
									</ErrorFeedback>
								)}
							</FormGroup>
						</Col>
						<Col md={6}>
							<FormGroup>
								<Label>
									{t(
										'estudiantes>registro_matricula>matricula_estudian>registrar_persona>identidad_genero',
										'Identidad de género'
									)}
								</Label>
								<Controller
									as={
										<Select
											className='react-select'
											classNamePrefix='react-select'
											placeholder=''
											options={state.selects.genderTypes}
											getOptionLabel={(option: any) => option.nombre}
											getOptionValue={(option: any) => option.id}
											isDisabled={validations.generoId}
										/>
									}
									name='genero'
									control={control}
									rules={{ required: true }}
								/>
								{errors?.genero && (
									<ErrorFeedback>
										{t(
											'estudiantes>registro_matricula>matricula_estudian>registrar_persona>campo_requerido',
											'Campo requerido'
										)}
									</ErrorFeedback>
								)}
							</FormGroup>
						</Col>
					</Row>
				</Form>

				<Actions className='mt-3' justify={onPrev ? 'space-between' : 'flex-end'}>
					{onPrev && (
						<Button color='primary' onClick={() => onPrev(onPrev && 'photo')}>
							Anterior
						</Button>
					)}
					<div style={{ marginRight: '7rem' }}>
						{props.show ? (
							<Button
								outline
								onClick={() => {
									props.cancelPreview()
								}}
							>
								{t('boton>general>cancelar', 'Cancelar')}
							</Button>
						) : (
							<div />
						)}
					</div>
					{onNext && (
						<Button
							color='primary'
							disabled={disableFields}
							onClick={handleSubmit(onSubmit)}
						>
							{t('general>siguiente', 'Siguiente')}
						</Button>
					)}
				</Actions>
				<ContainerLoading>{loading && <Loader />}</ContainerLoading>
			</ContentRow>

			{modalAviso && (
				<SimpleModal
					openDialog={modalAviso}
					onClose={() => {
						setModalAviso(false)
						setModalAvisoMensaje('')
					}}
					onConfirm={() => {
						setModalAviso(false)
						setModalAvisoMensaje('')
					}}
					title='Aviso importante'
					msg={modalAvisoMensaje}
					btnCancel={false}
				/>
			)}
		</>
	)
}

const ContentRow = styled(Row)`
	margin-top: 20px;
`
const ContainerLoading = styled.div`
	margin-top: 20px;
`
const CenterDiv = styled.div`
	display: flex;
	margin: 9px auto 0 auto;
	justify-content: center;
	align-items: center;
	height: calc(100% - 9px);
`

const Form = styled.form`
	margin-bottom: 20px;
`

const FormGroup = styled.div`
	margin-bottom: 10px;
	position: relative;
`

const Label = styled.label`
	color: #000;
	display: block;
`

const Actions = styled.div<{ justify: string }>`
	display: flex;
	justify-content: ${props => props.justify};
	align-items: center;
	margin: 0 auto;
	width: 100%;
`

const ErrorFeedback = styled.span`
	position: absolute;
	color: #bd0505;
	right: 0;
	font-weight: bold;
	font-size: 10px;
	bottom: -19px;
`
export default RegistroForm
