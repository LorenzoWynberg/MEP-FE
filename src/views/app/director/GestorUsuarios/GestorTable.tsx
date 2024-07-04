import React, { useState, useEffect } from 'react'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import { Col, InputGroupAddon, Card, CardBody, Input, Modal, ModalFooter } from 'reactstrap'
import { Button } from 'Components/CommonComponents'
import styled from 'styled-components'
import AddIcon from '@material-ui/icons/Add'
import colors from 'Assets/js/colors'
import swal from 'sweetalert'
import { useSelector } from 'react-redux'
import { getFuncionariosByTipoIdAndId } from 'Redux/RecursosHumanos/actions'
import ReactInputMask from 'react-input-mask'
import { useActions } from 'Hooks/useActions'
import {
	getCircuitosPaginated,
	getCircuitosbyRegional,
	getRegionalesPaginated,
	getInstitutionsPaginatedWithFilter,
	getAllRegionales,
	getAllCircuitos
} from 'Redux/configuracion/actions'
import ReactSelect from 'react-select'
import {
	createUsuario,
	editUser,
	resetPassword,
	removeUser,
	getAllUsuarioCatalogosByRolId
} from 'Redux/UsuarioCatalogos/actions'
import { AsyncPaginate, wrapMenuList } from 'react-select-async-paginate'
import useNotification from 'Hooks/useNotification'
import WizardRegisterIdentityModal from 'Views/app/configuracion/Identidad/_partials/wizardRegisterIdentityModal'
import SimpleModal from 'Components/Modal/simple'
import { useTranslation } from 'react-i18next'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import { FaUserLock, FaUserCheck } from 'react-icons/fa'

interface IProps {
	data: Array<any>
	columns: Array<any>
	openModal: '' | 'add-user' | 'add-user-form' | 'edit-user-form' | 'register-person'
	setOpenModal: React.Dispatch<
		React.SetStateAction<
			'' | 'add-user' | 'add-user-form' | 'edit-user-form' | 'register-person'
		>
	>
	rol: { id: number; nombre: string; nivelAccessoId: number }
	inputValues: {
		numeroDeIdentificacion: any
		usuarioEncontrado: any
		nombreDeUsuario: any
		email: any
		password: any
		passwordConfirm: any
		instituciones: Array<any>
		circuitos: Array<any>
		regionales: Array<any>
		userId: string
	}
	setInputValues: React.Dispatch<
		React.SetStateAction<{
			numeroDeIdentificacion: any
			usuarioEncontrado: any
			nombreDeUsuario: any
			email: any
			password: any
			passwordConfirm: any
			instituciones: Array<any>
			circuitos: Array<any>
			regionales: Array<any>
			userId: string
		}>
	>
	handleSearch: () => void
	searchValue: string
	setSearchValue: React.Dispatch<React.SetStateAction<string>>
	onSearchKey: (e) => void
	hasAddAccess: boolean
}

const GestorTable = ({
	data,
	columns,
	openModal,
	setOpenModal,
	inputValues,
	setInputValues,
	handleSearch,
	searchValue,
	setSearchValue,
	onSearchKey,
	rol,
	hasAddAccess = true
}: IProps) => {
	const { t } = useTranslation()
	const [selectedType, setSelectedType] = useState(null)
	const [filteredData, setFilteredData] = React.useState<any[]>([])
	const { idTypes } = useSelector(state => state.identification)
	const [selectedUser, setSelectedUser] = useState(null)
	const { usuarios } = useSelector(state => state.usuarioCatalogos)
	const { allRegionales } = useSelector(state => state.configuracion)
	// const [searchValue, setSearchValue] = useState(null)
	const { funcionariosIdentificacion } = useSelector(state => state.funcionarios)
	const [snackbar, handleClickNotification] = useNotification()
	const [snackbarContent, setSnackbarContent] = useState({
		msg: '',
		variant: ''
	})
	const selectNav = nav => {
		setSelectedType(nav)
	}

	const actions = useActions({
		getFuncionariosByTipoIdAndId,
		getInstitutionsPaginatedWithFilter,
		getCircuitosPaginated,
		getRegionalesPaginated,
		createUsuario,
		editUser,
		getCircuitosbyRegional,
		resetPassword,
		removeUser,
		getAllUsuarioCatalogosByRolId,
		getAllCircuitos,
		getAllRegionales
	})

	const onChange = e => {
		const { name, value } = e.target
		setInputValues({
			...inputValues,
			[name]: value
		})
	}
	useEffect(() => {
		if (idTypes) {
			setSelectedType(idTypes[0])
		}
	}, [idTypes])

	useEffect(() => {
		actions.getAllRegionales()
		actions.getAllCircuitos()
	}, [])

	const loadCircuitos = async (cb = null) => {
		const response = await actions.getCircuitosbyRegional(inputValues?.regionales?.id)
		if (cb) {
			cb(
				response?.options?.map(el => {
					const regional = allRegionales.find(item => item?.id === el?.regionalesId)
					return {
						...el,
						regionalNombre: regional?.nombre || ''
					}
				})
			)
		} else {
			setFilteredData(
				response?.options?.map(el => {
					const regional = allRegionales.find(item => item?.id === el?.regionalesId)
					return {
						...el,
						regionalNombre: regional?.nombre || ''
					}
				})
			)
		}
	}

	const loadOptions = async (searchQuery, loadedOptions, { page }) => {
		let response: any = {}
		if (rol.id === 2) {
			response = await actions.getInstitutionsPaginatedWithFilter(
				page,
				5,
				searchQuery || 'NULL'
			)
			response.options = response.options.map(el => ({
				...el,
				nombre: `${el.codigo} ${el.nombre}`
			}))
		}
		if (rol.id === 5) {
			response = await actions.getCircuitosPaginated({
				pagina: page,
				cantidad: 5,
				filterType: searchQuery ? 'nombre' : '',
				filterText: searchQuery
			})
		}
		if (rol.id === 6) {
			response = await actions.getRegionalesPaginated({
				pagina: page,
				cantidad: 5,
				filterType: searchQuery ? 'nombre' : '',
				filterText: searchQuery
			})
		}
		return {
			options: response.options || [],
			hasMore: searchQuery?.length > 0 ? false : response?.options?.length >= 1,
			additional: {
				page: searchQuery?.length > 0 ? page : page + 1
			}
		}
	}

	const searchUser = async () => {
		let response = null
		if (inputValues.numeroDeIdentificacion?.length === 9 && selectedType?.codigo === '01') {
			response = await actions.getFuncionariosByTipoIdAndId(
				selectedType?.id,
				inputValues?.numeroDeIdentificacion
			)
		}

		if (inputValues.numeroDeIdentificacion?.length === 12 && selectedType?.codigo === '03') {
			response = await actions.getFuncionariosByTipoIdAndId(
				selectedType?.id,
				inputValues?.numeroDeIdentificacion
			)
		}

		if (inputValues.numeroDeIdentificacion?.length === 12 && selectedType?.codigo === '04') {
			response = await actions.getFuncionariosByTipoIdAndId(
				selectedType?.id,
				inputValues?.numeroDeIdentificacion
			)
		}
		if (inputValues.numeroDeIdentificacion?.length > 6 && selectedType?.codigo === '05') {
			response = await actions.getFuncionariosByTipoIdAndId(
				selectedType?.id,
				inputValues?.numeroDeIdentificacion
			)
		}

		if (response !== null) {
			setInputValues({
				...inputValues,
				usuarioEncontrado: Boolean(response?.data),
				nombreDeUsuario: inputValues?.numeroDeIdentificacion
			})
		}
	}

	useEffect(() => {
		searchUser()
	}, [inputValues.numeroDeIdentificacion])

	useEffect(() => {
		if (inputValues.regionales) {
			loadCircuitos()
		}
	}, [inputValues.regionales])

	const guardarNuevaPersona = async user => {
		setOpenModal('add-user-form')
		setSelectedUser(user)
	}

	const modals = {
		'add-user': {
			title: t('gestion_usuarios>msj>agregar_usuario', 'Agregar usuario'),
			showOnlyBtnSubmit: inputValues?.usuarioEncontrado === null,
			btnSubmitText:
				inputValues?.usuarioEncontrado === null
					? t('general>cerrar', 'Cerrar')
					: inputValues?.usuarioEncontrado
					? t('general>crear_user', 'Crear usuario')
					: t('boton>general>registrar', 'Registrar'),
			handleClick: () => {
				if (inputValues.usuarioEncontrado) {
					setOpenModal('add-user-form')
					// setInputVa
				}

				if (inputValues.usuarioEncontrado === false) {
					setOpenModal('register-person')
				}
				setInputValues({
					...inputValues,
					numeroDeIdentificacion: '',
					usuarioEncontrado: null
				})
			},
			body: (
				<>
					<h6>
						{t('supervision_circ>expediente>recurso_hum>add>titulo', 'Buscar persona')}
					</h6>
					<p style={{ margin: 0 }}>
						{t(
							'configuracion>centro_educativo>ver_centro_educativo>asignar_director>asignar_director>mensaje',
							'Busca la persona a la cual se le creará el usuario. Si no está registrada podrás registrarla.'
						)}
					</p>
					<div className='my-3'>
						<p style={{ margin: 0 }}>
							{t(
								'estudiantes>buscador_per>info_gen>tipo_id',
								'Tipo de identificación'
							)}
						</p>
						<ReactSelect
							className='react-select'
							classNamePrefix='react-select'
							components={{ Input: CustomSelectInput }}
							options={
								idTypes ? idTypes.map(el => ({ label: el.nombre, value: el })) : []
							}
							placeholder={null}
							value={
								selectedType
									? { label: selectedType?.nombre, value: selectedType }
									: null
							}
							defaultValue={
								idTypes
									? idTypes.map(el => ({ label: el.nombre, value: el }))[0]
									: null
							}
							onChange={({ value }) => {
								setSelectedType(value)
							}}
						/>
					</div>
					<p style={{ margin: 0 }}>
						{t('estudiantes>buscador_per>info_gen>num_id', 'Número de identificación')}
					</p>
					<ReactInputMask
						mask={
							selectedType?.id === 1
								? '999999999' // 9
								: selectedType?.id === 3
								? '999999999999' // 12
								: selectedType?.id === 4
								? 'YR9999-99999'
								: '99999999999999999999'
						}
						type='text'
						name='numeroDeIdentificacion'
						maskChar={null}
						value={inputValues.numeroDeIdentificacion}
						onChange={onChange}
					>
						{inputProps => <Input {...inputProps} />}
					</ReactInputMask>
					{inputValues?.usuarioEncontrado === false && (
						<div
							style={{
								background: 'rgba(16, 158, 257, 0.3)',
								padding: '1rem',
								borderRadius: '10px',
								marginTop: '1rem'
							}}
						>
							<p style={{ margin: 0 }}>
								{t(
									'gestion_usuario>usuarios>id_not_found_message',
									'No se ha encontrado un funcionario con el número de identificación ingresado.'
								)}
							</p>
							<p style={{ margin: 0 }}>
								{t(
									'gestion_usuario>usuarios>register_person_message',
									'Puede registrarlo en el sistema haciendo click en registrar.'
								)}
							</p>
						</div>
					)}
					{inputValues?.usuarioEncontrado && (
						<div
							style={{
								borderRadius: '10px',
								overflow: 'hidden',
								border: `1px solid ${colors.primary}`,
								marginTop: '1rem'
							}}
							className='d-flex align-items-center'
						>
							<div
								style={{
									backgroundColor: colors.primary,
									padding: '1.5rem',
									width: '30%'
								}}
							/>
							<div className='text-left w-100 px-3'>{`${funcionariosIdentificacion?.nombre} ${funcionariosIdentificacion?.primerApellido} ${funcionariosIdentificacion?.segundoApellido}`}</div>
						</div>
					)}
				</>
			)
		},
		'add-user-form': {
			notCloseModal: true,
			title: t('general>crear_user', 'Crear usuario'),
			btnSubmitText: t('general>crear_user', 'Crear usuario'),
			handleClick: async () => {
				if (!inputValues.nombreDeUsuario) {
					setSnackbarContent({
						variant: 'error',
						msg: t(
							'gestion_usuarios>msj>indicar_username',
							'Debe indicar el username del usuario'
						)
					})
					handleClickNotification()
					return
				}

				if (!inputValues.email) {
					setSnackbarContent({
						variant: 'error',
						msg: t(
							'gestion_usuarios>msj>indicar_correo',
							'Debe indicar el correo eléctronico del usuario'
						)
					})
					handleClickNotification()
					return
				}
				interface IData {
					userId?: string
					nombreUsuario: string
					identidadId: number
					email: string
					roles: Array<{
						roleId: number
						nivelAccesoId: number
						alcanceId: number
					}>
				}
				const newUser: IData = {
					nombreUsuario: inputValues?.nombreDeUsuario,
					identidadId: funcionariosIdentificacion?.id || selectedUser?.id,
					email: inputValues?.email,
					roles: [
						{
							roleId: rol?.id,
							nivelAccesoId: rol?.nivelAccessoId,
							alcanceId: null
						}
					]
				}
				if (inputValues?.instituciones?.length > 0 && rol?.id === 2) {
					newUser.roles = inputValues?.instituciones.map<any>(el => ({
						roleId: rol?.id,
						nivelAccesoId: rol?.nivelAccessoId,
						alcanceId: el?.id
					}))
				}
				if (inputValues?.circuitos?.length > 0 && rol?.id === 5) {
					newUser.roles = inputValues?.circuitos.map<any>(el => ({
						roleId: rol?.id,
						nivelAccesoId: rol?.nivelAccessoId,
						alcanceId: el?.id
					}))
				}
				if (inputValues?.regionales?.length > 0 && rol?.id === 6) {
					newUser.roles = inputValues?.regionales.map<any>(el => ({
						roleId: rol?.id,
						nivelAccesoId: rol?.nivelAccessoId,
						alcanceId: el?.id
					}))
				}
				const response = await actions.createUsuario(newUser)

				if (!response.error) {
					setOpenModal('')
					swal({
						title: t('gestion_usuarios>msj>agregar_usuario', 'Agregar usuario'),
						text: t(
							'gestion_usuarios>msj>usuario_agregado',
							'Se ha agregado el usuario con éxito'
						),
						icon: 'success',
						className: 'text-alert-modal',
						buttons: {
							ok: {
								text: t('general>cerrar', 'Cerrar'),
								value: true,
								className: 'btn-alert-color'
							}
						}
					}).then(res => {
						actions.getAllUsuarioCatalogosByRolId(rol?.id, 1, 100, 'NULL')
						// actions.getAllUsuarioCatalogosByRolId(rol?.id, -1, -1)
						setInputValues({
							numeroDeIdentificacion: null,
							usuarioEncontrado: null,
							nombreDeUsuario: null,
							email: null,
							password: null,
							passwordConfirm: null,
							instituciones: [],
							circuitos: [],
							regionales: [],
							userId: ''
						})
					})
				} else {
					// Error al crear el usuario

					setSnackbarContent({
						variant: 'error',
						msg: response.mensajeError
					})
					handleClickNotification()
				}
			},
			body: (
				<>
					<p style={{ margin: 0 }}>
						{t(
							'gestion_usuarios>usuarios>funcionario_seleccionado',
							'Funcionario seleccionado:'
						)}
					</p>
					<div
						style={{
							borderRadius: '10px',
							overflow: 'hidden',
							border: `1px solid ${colors.primary}`,
							marginTop: '1rem'
						}}
						className='d-flex align-items-center'
					>
						<div
							style={{
								backgroundColor: colors.primary,
								padding: '1.5rem',
								width: '30%'
							}}
						/>
						<div className='text-left w-100 px-3'>
							{funcionariosIdentificacion
								? `${funcionariosIdentificacion?.nombre} ${funcionariosIdentificacion?.primerApellido} ${funcionariosIdentificacion?.segundoApellido}`
								: `${selectedUser?.nombre} ${selectedUser?.primerApellido} ${selectedUser?.segundoApellido}`}
						</div>
					</div>
					<div className='my-3'>
						<p style={{ margin: 0 }}>
							{t('gestion_usuario>usuarios>nombre_usuario', 'Nombre de usuario')}
						</p>
						<Input
							type='text'
							name='nombreDeUsuario'
							isDisabled
							value={inputValues.nombreDeUsuario}
							onChange={onChange}
							disabled
						/>
					</div>
					<div className='my-3'>
						<p style={{ margin: 0 }}>
							{t('gestion_usuario>usuarios>correo_electronico', 'Correo electrónico')}
						</p>
						<Input
							type='text'
							name='email'
							value={inputValues.email}
							onChange={onChange}
						/>
					</div>
					{rol?.id === 5 && (
						<div style={{ marginBottom: '15px' }}>
							<p style={{ margin: 0 }}>
								{t(
									'gestion_usuarios>usuarios>selecciona_regional',
									'Selecciona la regional'
								)}
							</p>
							<AsyncPaginate
								className='react-select'
								classNamePrefix='react-select'
								components={{ Input: CustomSelectInput }}
								key='async-instituciones'
								placeholder={t(
									'general>placeholder>seleccione_regional',
									'Seleccione la regional'
								)}
								defaultOptions={allRegionales}
								onChange={value => {
									setInputValues({
										...inputValues,
										regionales: value
									})
								}}
								getOptionValue={option => option}
								getOptionLabel={option => `${option?.nombre ? option?.nombre : ''}`}
								value={inputValues?.regionales}
							/>
						</div>
					)}
					{(rol?.id === 2 || rol?.id === 5 || rol?.id === 6) && (
						<div className='my-3'>
							{rol?.id === 2 && (
								<p style={{ margin: 0 }}>
									{t(
										'gestion_usuarios>usuarios>selecciona_instituciones',
										'Selecciona las instituciones'
									)}
								</p>
							)}
							{rol?.id === 5 && (
								<p style={{ margin: 0 }}>
									{t(
										'gestion_usuarios>usuarios>selecciona_circuito',
										'Selecciona los circuitos'
									)}
								</p>
							)}

							{rol?.id === 6 && (
								<p style={{ margin: 0 }}>
									{t(
										'gestion_usuarios>usuarios>selecciona_regionales',
										'Selecciona las regionales'
									)}
								</p>
							)}
							{rol.id === 5 ? (
								<ReactSelect
									className='react-select'
									classNamePrefix='react-select'
									components={{ Input: CustomSelectInput }}
									name='circuitos'
									defaultOptions
									options={filteredData}
									isMulti
									getOptionValue={option => option}
									getOptionLabel={option =>
										`${
											option?.regionalNombre ? option?.regionalNombre : ''
										} - ${option?.nombre}`
									}
									loadOptions={(
										inputValue: string,
										callback: (options: any[]) => void
									) => {
										loadCircuitos(callback)
									}}
									onChange={value => {
										setInputValues({
											...inputValues,
											circuitos: value
										})
									}}
								/>
							) : (
								<AsyncPaginate
									className='react-select'
									classNamePrefix='react-select'
									components={{ Input: CustomSelectInput }}
									key='async-instituciones'
									placeholder={t('general>placeholder>seleccione', 'Seleccione')}
									loadOptions={loadOptions}
									additional={{
										page: 1
									}}
									isMulti
									onChange={value => {
										if (rol?.id === 2) {
											setInputValues({
												...inputValues,
												instituciones: value
											})
										}
										if (rol?.id === 6) {
											setInputValues({
												...inputValues,
												regionales: value
												// parsedR: value.map(el => el.id)
											})
										}
									}}
									getOptionValue={option => option}
									getOptionLabel={option =>
										`${option?.nombre + '/'} ${
											option?.regional ? option?.regional : ''
										}`
									}
									value={
										rol?.id === 2
											? inputValues?.instituciones
											: rol?.id === 5
											? inputValues?.circuitos
											: inputValues?.regionales
									}
									// cacheUniqs={rol?.id === 2 ? inputValues?.instituciones : rol?.id === 5 ? inputValues?.circuitos : inputValues?.regionales}
								/>
							)}
						</div>
					)}
					{(rol?.id === 3 || rol?.id === 4 || rol?.id === 7 || rol?.id === 1) && (
						<div className='my-3'>
							<p style={{ margin: 0 }}>
								{t('gestion_usuario>usuarios>administradores>rol', 'Rol asociado')}
							</p>
							<ReactSelect
								className='react-select'
								classNamePrefix='react-select'
								components={{ Input: CustomSelectInput }}
								placeholder={t(
									'general>placeholder>busca_selecciona_rol',
									'Busca y selecciona un rol'
								)}
								options={[{ label: rol?.nombre, value: rol }]}
								defaultValue={{ label: rol?.nombre, value: rol }}
								isDisabled
							/>
						</div>
					)}
				</>
			)
		},
		'edit-user-form': {
			title: t('general>boton>editar_usuario', 'Editar usuario'),
			btnSubmitText: t('general>boton>guardar_cambios', 'Guardar cambios'),
			handleClick: async () => {
				if (!inputValues.nombreDeUsuario) {
					setSnackbarContent({
						variant: 'error',
						msg: t(
							'gestion_usuarios>msj>indicar_username',
							'Debe indicar el username del usuario'
						)
					})
					handleClickNotification()
					return
				}

				if (!inputValues.email) {
					setSnackbarContent({
						variant: 'error',
						msg: t(
							'gestion_usuarios>msj>indicar_correo',
							'Debe indicar el correo eléctronico del usuario'
						)
					})
					handleClickNotification()
					return
				}
				interface IData {
					nombreUsuario: string
					identidadId: number
					email: string
					roles: Array<{
						roleId: number
						nivelAccesoId: number
						alcanceId: number
					}>
				}
				const newUser: IData = {
					userId: inputValues?.userId || selectedUser?.id,
					nombreUsuario: inputValues?.nombreDeUsuario,
					identidadId: funcionariosIdentificacion?.id,
					email: inputValues?.email,
					roles: [
						{
							roleId: rol?.id,
							nivelAccesoId: rol?.nivelAccessoId,
							alcanceId: null
						}
					]
				}
				if (inputValues?.instituciones?.length > 0 && rol?.id === 2) {
					newUser.roles = inputValues?.instituciones.map<any>(el => ({
						roleId: rol?.id,
						nivelAccesoId: rol?.nivelAccessoId,
						alcanceId: el?.id
					}))
				}
				if (inputValues?.circuitos?.length > 0 && rol?.id === 5) {
					newUser.roles = inputValues?.circuitos.map<any>(el => ({
						roleId: rol?.id,
						nivelAccesoId: rol?.nivelAccessoId,
						alcanceId: el?.id
					}))
				}
				if (inputValues?.regionales?.length > 0 && rol?.id === 6) {
					newUser.roles = inputValues?.regionales.map<any>(el => ({
						roleId: rol?.id,
						nivelAccesoId: rol?.nivelAccessoId,
						alcanceId: el?.id
					}))
				}
				const response = await actions.editUser(newUser)
				// actions.getAllUsuarioCatalogosByRolId(rol?.id, -1, -1)

				if (!response.error) {
					actions.getAllUsuarioCatalogosByRolId(rol?.id, usuarios[rol?.id].page, 10)
					setOpenModal('')
					swal({
						title: t('gestion_usuarios>msj_usuario_editado', 'Usuario editado'),
						text: t(
							'gestion_usuarios>msj_editado_con_exito',
							'Se ha editado el usuario con éxito.'
						),
						icon: 'success',
						className: 'text-alert-modal',
						buttons: {
							ok: {
								text: t('general>cerrar', 'Cerrar'),
								value: true,
								className: 'btn-alert-color'
							}
						}
					}).then(res => {
						setInputValues({
							numeroDeIdentificacion: null,
							usuarioEncontrado: null,
							nombreDeUsuario: null,
							email: null,
							password: null,
							passwordConfirm: null,
							instituciones: [],
							circuitos: [],
							regionales: [],
							userId: ''
						})
					})
				} else {
					setSnackbarContent({
						variant: 'error',
						msg: response.mensajeError
					})
					handleClickNotification()
				}
			},
			body: (
				<>
					<p style={{ margin: 0 }}>
						{t(
							'gestion_usuarios>usuarios>funcionario_seleccionado',
							'Funcionario seleccionado:'
						)}
					</p>
					<div
						style={{
							borderRadius: '10px',
							overflow: 'hidden',
							border: `1px solid ${colors.primary}`,
							marginTop: '1rem'
						}}
						className='d-flex align-items-center'
					>
						<div
							style={{
								backgroundColor: colors.primary,
								padding: '1.5rem',
								width: '30%'
							}}
						/>
						<div className='text-center w-100'>{inputValues.nombreCompleto}</div>
					</div>
					<div className='my-3'>
						<p style={{ margin: 0 }}>
							{t('gestion_usuario>usuarios>nombre_usuario', 'Nombre de usuario')}
						</p>
						<Input
							type='text'
							name='nombreDeUsuario'
							value={inputValues.nombreDeUsuario}
							onChange={onChange}
							isDisabled
							disabled
						/>
					</div>
					<div className='my-3'>
						<p style={{ margin: 0 }}>
							{t(
								'buscador_ce>ver_centro>datos_contacto>correo',
								'Correo electrónico'
							)}
						</p>
						<Input
							type='text'
							name='email'
							value={inputValues.email}
							onChange={onChange}
						/>
					</div>
					{rol?.id === 5 && (
						<div style={{ marginBottom: '15px' }}>
							<p style={{ margin: 0 }}>
								{t(
									'gestion_usuarios>usuarios>selecciona_regional',
									'Selecciona la regional'
								)}
							</p>
							<AsyncPaginate
								className='react-select'
								classNamePrefix='react-select'
								components={{ Input: CustomSelectInput }}
								key='async-instituciones'
								placeholder={t(
									'general>placeholder>seleccione_regional',
									'Seleccione la regional'
								)}
								defaultOptions={allRegionales}
								onChange={value => {
									setInputValues({
										...inputValues,
										regionales: value
									})
								}}
								getOptionValue={option => option}
								getOptionLabel={option => `${option?.nombre ? option?.nombre : ''}`}
								value={inputValues?.regionales}
							/>
						</div>
					)}
					{(rol?.id === 2 || rol?.id === 5 || rol?.id === 6) && (
						<div className='my-3'>
							{rol?.id === 2 && (
								<p style={{ margin: 0 }}>
									{t(
										'gestion_usuarios>usuarios>selecciona_instituciones',
										'Selecciona las instituciones'
									)}
								</p>
							)}
							{rol?.id === 5 && (
								<p style={{ margin: 0 }}>
									{t(
										'gestion_usuarios>usuarios>selecciona_circuito',
										'Selecciona los circuitos'
									)}
								</p>
							)}
							{rol?.id === 6 && (
								<p style={{ margin: 0 }}>
									{t(
										'gestion_usuarios>usuarios>selecciona_regionales',
										'Selecciona las regionales'
									)}
								</p>
							)}
							{rol.id === 5 ? (
								<ReactSelect
									className='react-select'
									classNamePrefix='react-select'
									components={{ Input: CustomSelectInput }}
									name='circuitos'
									// defaultOptions={inputValues?.circuitos}
									value={inputValues?.circuitos}
									options={filteredData}
									isMulti
									getOptionValue={option => option}
									getOptionLabel={option => `${option?.nombre}`}
									loadOptions={(
										inputValue: string,
										callback: (options: any[]) => void
									) => {
										loadCircuitos(callback)
									}}
									onChange={value => {
										setInputValues({
											...inputValues,
											circuitos: value
										})
									}}
								/>
							) : (
								<AsyncPaginate
									className='react-select'
									classNamePrefix='react-select'
									components={{ Input: CustomSelectInput }}
									key='async-instituciones'
									placeholder={t('general>placeholder>seleccione', 'Seleccione')}
									loadOptions={loadOptions}
									additional={{
										page: 1
									}}
									isMulti
									onChange={value => {
										if (rol?.id === 2) {
											setInputValues({
												...inputValues,
												instituciones: value
											})
										}
										if (rol?.id === 5) {
											setInputValues({
												...inputValues,
												circuitos: value
											})
											console.log(value)
										}
										if (rol?.id === 6) {
											setInputValues({
												...inputValues,
												regionales: value
												// parsedR: value.map(el => el.id)
											})
										}
									}}
									getOptionValue={option => option}
									getOptionLabel={option =>
										`${option?.nombre} ${
											option?.regional ? option?.regional : ''
										}`
									}
									value={
										rol?.id === 2
											? inputValues?.instituciones
											: rol?.id === 5
											? inputValues?.circuitos
											: inputValues?.regionales
									}
									// cacheUniqs={rol?.id === 2 ? inputValues?.instituciones : rol?.id === 5 ? inputValues?.circuitos : inputValues?.regionales}
								/>
							)}
						</div>
					)}
					{(rol?.id === 3 || rol?.id === 4 || rol?.id === 7 || rol?.id === 1) && (
						<div className='my-3'>
							<p style={{ margin: 0 }}>
								{t('gestion_usuario>usuarios>administradores>rol', 'Rol asociado')}
							</p>
							<ReactSelect
								className='react-select'
								classNamePrefix='react-select'
								components={{ Input: CustomSelectInput }}
								placeholder={t(
									'general>placeholder>busca_selecciona_rol',
									'Busca y selecciona un rol'
								)}
								options={[{ label: rol?.nombre, value: rol }]}
								defaultValue={{ label: rol?.nombre, value: rol }}
								isDisabled
							/>
						</div>
					)}
				</>
			)
		},
		'register-person': {
			title: t(
				'estudiantes>registro_matricula>matricula_estudian>buscar>registrar_persona',
				'Registrar persona'
			),
			size: 'lg',
			notShowButtons: true,
			body: <WizardRegisterIdentityModal onConfirm={guardarNuevaPersona} />
		}
	}

	return (
		<Col>
			{snackbar(snackbarContent.variant, snackbarContent.msg)}
			<SimpleModal
				openDialog={openModal?.length > 0}
				onClose={() => setOpenModal('')}
				onConfirm={() => {}}
				actions={false}
				title={modals[openModal]?.title}
				stylesContent={{
					minWidth: '30rem'
				}}
			>
				{modals[openModal]?.body}
				{!modals[openModal]?.notShowButtons && (
					<ModalFooter>
						<div className='d-flex justify-content-center align-items-center w-100'>
							{!modals[openModal]?.showOnlyBtnSubmit && (
								<Button
									color='outline-primary'
									className='mr-3'
									onClick={() => {
										setOpenModal('')
										setInputValues({
											numeroDeIdentificacion: null,
											usuarioEncontrado: null,
											nombreDeUsuario: null,
											email: null,
											password: null,
											passwordConfirm: null,
											instituciones: [],
											circuitos: [],
											regionales: [],
											userId: ''
										})
									}}
								>
									{modals[openModal]?.btnCancelText ||
										t('boton>general>cancelar', 'Cancelar')}
								</Button>
							)}
							<Button
								color='primary'
								onClick={() => {
									if (!modals[openModal].notCloseModal) {
										setOpenModal('')
									}
									modals[openModal]?.handleClick()
								}}
							>
								{modals[openModal]?.btnSubmitText ||
									t('boton>general>confirmar', 'Confirmar')}
							</Button>
						</div>
					</ModalFooter>
				)}
			</SimpleModal>
			<div className='d-flex my-5 justify-content-between'>
				<div style={{ width: '40%' }}>
					<InputSearchDiv>
						<input
							type='text'
							name='keyword'
							id='search'
							onKeyDown={e => {
								if (e.key === 'Enter' || e.keyCode === 13) {
									handleSearch()
								}
							}}
							onChange={e => onSearchKey(e)}
							autoComplete='off'
							placeholder={t('search>buscar_usuario', 'Buscar usuario')}
						/>
						<StyledInputGroupAddon addonType='append'>
							<Button style={{ borderRadius: '0 8px 8px 0' }} onClick={handleSearch}>
								{t('general>buscar', 'Buscar')}
							</Button>
						</StyledInputGroupAddon>
					</InputSearchDiv>
				</div>
				{hasAddAccess && (
					<Button
						color='primary'
						className='d-flex justify-content-between align-items-center'
						onClick={() => setOpenModal('add-user')}
					>
						<AddIcon />{' '}
						<span>{t('gestion_usuarios>msj>agregar_usuario', 'Agregar usuario')}</span>
					</Button>
				)}
			</div>
			<Card>
				<CardBody>
					<TableReactImplementation data={data} columns={columns} avoidSearch />
				</CardBody>
			</Card>
		</Col>
	)
}

const InputSearchDiv = styled.div`
	position: relative;

	input {
		background: none;
		outline: initial !important;
		border: 0;
		border-radius: 10px !important;
		background: #ffffff !important;
		box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.2);
		padding: 0.25rem 0.75rem 0.25rem 0.75rem;
		font-size: 0.76rem;
		line-height: 1.3;
		color: ${props => props.theme.primary};
		height: 40px;
		padding-left: 45px;
		width: 100%;
	}

	&:before {
		font-family: 'simple-line-icons';
		content: '\\e090';
		font-size: 14px;
		border-top-left-radius: 10px;
		border-bottom-left-radius: 10px;
		color: ${props => props.theme.secondary};
		position: absolute;
		width: 40px;
		height: 40px;
		right: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		cursor: pointer;
		top: 0;
		left: 0;
		background-color: ${props => props.theme.primary};
		color: white;
	}
`

const StyledInputGroupAddon = styled(InputGroupAddon)`
  top: 0;
  right: 0;
  position: absolute;
  height: 100%;
  display: flex;
  align-items: center;
  }
`

export default GestorTable
