import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import HeaderTab from 'Components/Tab/HeaderTabNoBottom'
import ContentTab from 'Components/Tab/Content'
import { FormGroup, Label, Input, CustomInput, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import Datetime from 'react-datetime'
import Froala from '../../../../components/Froala'

import Switch from '@material-ui/core/Switch'
import { Typography } from '@material-ui/core'
import Checkbox from '@material-ui/core/Checkbox'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { cloneDeep } from 'lodash'
import CheckIcon from '@material-ui/icons/Check'
import colors from 'Assets/js/colors'
import RolesChangeMenu from './RolesChangeMenu'
import DeleteIcon from '@material-ui/icons/Delete'
import moment from 'moment'
import 'moment/locale/es'
import { isEmail } from '../../FormResponse/utils'
import { useTranslation } from 'react-i18next'

const ModalConfiguracion = props => {
	const { onClose, openDialog, action, actions, btnCancel, loading, onChange, data, formId, state } = props

	const [activeTab, setActiveTab] = React.useState<number>(0)
	const [typingTimer, setTypingTimer] = React.useState(null)
	const [addingAdmin, setAddingAdmin] = React.useState<boolean>(false)
	const [stagedAdmins, setStagedAdmins] = React.useState<any>([])
	const [selectedUser, setSelectedUser] = React.useState<any>({})
	const { t } = useTranslation()
	const [notificationMessages, setNotificationMessages] = React.useState<any>({})
	const [idsToDelete, setIdsToDelete] = React.useState<any>([])
	const [openMenu, setOpenMenu] = React.useState<any>(null)
	const [admindIds, setAdmindIds] = React.useState<any>([])
	const [emailError, setEmailError] = React.useState<any>([])

	React.useEffect(() => {
		actions.getAdmins(formId)
	}, [openDialog])

	React.useEffect(() => {
		setAdmindIds(state.formAdmins.map(el => el.usuarioId))
	}, [state.formAdmins])

	const options = [
		t('formularios>crear_formulario>configuracion>general', 'General'),
		t('formularios>crear_formulario>configuracion>presentacion', 'Presentación'),
		t('formularios>crear_formulario>configuracion>administradores', 'Administradores'),
		t('formularios>crear_formulario>configuracion>contacto', 'Contacto')
	]

	const handleDelete = (stagedItems, el) => {
		handleAdminRoleChange(null, el.usuarioId)
		handleNotificationChange(false, el.usuarioId)
		if (stagedItems) {
			return setStagedAdmins(stagedAdmins.filter(item => item.usuarioId != el.usuarioId))
		}
		return setIdsToDelete([...idsToDelete, el.usuarioId])
	}

	const adminMapperFunction = (el, stagedItems = true) => {
		if (!stagedItems && idsToDelete.includes(el.usuarioId)) return
		return (
			<StyledAdminContent>
				<div style={{ width: '100%' }}>
					<span>{el.emailUsuario}</span>
				</div>
				<RolesChangeMenu
					open={openMenu == el.usuarioId}
					setOpenMenu={() => setOpenMenu(el.usuarioId)}
					closeMenu={() => setOpenMenu(null)}
					role={data.adminsRoles[el.usuarioId]}
					handleChangeRole={value => handleAdminRoleChange(value, el.usuarioId)}
					handleDelete={() => handleDelete(stagedItems, el)}
				/>
				<div className='role'>
					<DeleteIcon style={{ cursor: 'pointer' }} onClick={() => handleDelete(stagedItems, el)} />
				</div>
			</StyledAdminContent>
		)
	}

	const handleSearch = value => {
		actions.getUsersByEmail(value)
	}

	const handleChangeInputSearch = value => {
		clearTimeout(typingTimer)
		setTypingTimer(
			setTimeout(() => {
				handleSearch(value)
			}, 500)
		)
	}

	const handleAdminRoleChange = (value, item = null) => {
		const _data = cloneDeep({ ...data.adminsRoles })
		if (!value) {
			delete _data[item]
		}
		onChange('adminsRoles', {
			...data.adminsRoles,
			[item || selectedUser.usuarioId]: value
		})
	}

	const discardUser = () => {
		if (data.adminsRoles) {
			const _roles = cloneDeep(data.adminsRoles)
			delete _roles[selectedUser.usuarioId]
			onChange('adminsRoles', { ..._roles })
		}
		setSelectedUser({})
		actions.clearSearch()
	}

	const handleNotificationChange = (value, item = null) => {
		setNotificationMessages({
			...notificationMessages,
			[item || selectedUser.usuarioId]: value
		})
	}

	const deleteAdmins = async () => {
		return await actions.deleteAdmins(props.formId, idsToDelete)
	}

	const saveAdmins = () => {
		const Notifications = Object.keys(notificationMessages)
			.filter(key => notificationMessages[key])
			.map(key => {
				return {
					AdminId: key,
					Text: notificationMessages[key]
				}
			})
		const UsersIds = stagedAdmins.map(el => el.usuarioId)
		actions.saveAdmins(props.formId, { UsersIds, Notifications })
	}

	const validateContactInfo = () => {
		if (data.contactoNombre || data.contactoCorreo) {
			if (isEmail(data.contactoCorreo)) {
				return false
			}
			setEmailError(
				t(
					'formularios>crear_formulario>configuracion>correo_formato',
					'El correo electrónico no cumple con el formato adecuado'
				)
			)
			props.handleSnackbarShow(
				t(
					'formularios>crear_formulario>configuracion>correo_formato',
					'El correo electrónico no cumple con el formato adecuado'
				),
				'error'
			)
			return true
		}
		return false
	}

	return (
		<Modal className='override-modal-styles' isOpen={openDialog} size='lg' centered style={{ boxShadow: 'none' }}>
			<ModalHeader
				className='p-3  header-custom'
				style={{
					borderBottom: '1px solid #d9d6d6;',
					paddingBottom: 10,
					width: '100%',
					fontSize: '24px'
				}}
				toggle={onClose}
			>
				<h2>Configuración</h2>
			</ModalHeader>
			<ModalBody className='pt-0'>
				<HeaderTab
					options={options}
					activeTab={activeTab}
					setActiveTab={async (index: number) => {
						setActiveTab(index)
					}}
				/>

				<ContentTab activeTab={activeTab} numberId={activeTab}>
					{
						{
							0: (
								<div style={{ marginLeft: 10 }}>
									<div className='row'>
										{' '}
										<CustomInput
											type='checkbox'
											label={t(
												'ormularios>crear_formulario>configuracion>requiere_autenticacion',
												'Requiere autenticarse'
											)}
											inline
											onClick={e => {
												onChange('requiereAuntenticacion', !data.requiereAuntenticacion)
											}}
											checked={data.requiereAuntenticacion}
										/>{' '}
									</div>
									<div className='row'>
										{' '}
										<CustomInput
											type='checkbox'
											label={t(
												'formularios>crear_formulario>configuracion>fecha_y_hora',
												'Fecha y hora de inicio'
											)}
											inline
											onClick={e => {
												onChange('fechaHoraInicioOption', !data.fechaHoraInicioOption)
											}}
											checked={data.fechaHoraInicioOption}
										/>
									</div>
									{data.fechaHoraInicioOption && (
										<div className='row' style={{ marginLeft: 10 }}>
											<Datetime
												closeOnSelect
												isValidDate={(currentDate, selectedDate) => {
													return currentDate.isSameOrAfter(moment())
												}}
												onChange={e => {
													onChange('fechaHoraInicio', e._d)
												}}
												timeFormat='hh:mm A'
												dateFormat='DD/MM/YYYY'
												value={
													data.fechaHoraInicio != null
														? moment(data.fechaHoraInicio).format('DD/MM/YYYY hh:mm A')
														: ''
												}
											/>
										</div>
									)}
									<div className='row'>
										{' '}
										<CustomInput
											type='checkbox'
											label='Fecha y hora de fin'
											inline
											onClick={e => {
												onChange('fechaHoraFinOption', !data.fechaHoraFinOption)
											}}
											checked={data.fechaHoraFinOption}
										/>
									</div>

									{data.fechaHoraFinOption && (
										<div className='row' style={{ marginLeft: 10 }}>
											<Datetime
												closeOnSelect
												isValidDate={(currentDate, selectedDate) => {
													if (data.fechaHoraInicio) {
														return currentDate.isSameOrAfter(moment(data.fechaHoraInicio))
													}
													return currentDate.isSameOrAfter(moment())
												}}
												onChange={e => {
													onChange('fechaHoraFin', e._d)
												}}
												timeFormat='hh:mm A'
												dateFormat='DD/MM/YYYY'
												value={
													data.fechaHoraFin != null
														? moment(data.fechaHoraFin).format('DD/MM/YYYY hh:mm A')
														: ''
												}
											/>
										</div>
									)}
									<div className='row'>
										<CustomInput
											type='checkbox'
											label='Agregar contraseña al formulario'
											inline
											onClick={e => {
												onChange('claveOption', !data.claveOption)
											}}
											checked={data.claveOption}
										/>
									</div>
									{data.claveOption && (
										<Input value={data.clave} onChange={e => onChange('clave', e.target.value)} />
									)}

									<div className='row'>
										<CustomInput
											type='checkbox'
											label='Permite reenvío de respuesta'
											inline
											onClick={e => {
												onChange('permiteReenvio', !data.permiteReenvio)
											}}
											checked={data.permiteReenvio}
										/>
									</div>

									<div className='row'>
										<CustomInput
											type='checkbox'
											label='Notificar por correo electrónico cada respuesta'
											inline
											onClick={e => {
												onChange('notificarRespuesta', !data.notificarRespuesta)
											}}
											checked={data.notificarRespuesta}
										/>
									</div>
									<div className='row'>
										<CustomInput
											type='checkbox'
											label='Ocultar numeración de preguntas'
											inline
											onClick={e => {
												onChange(
													'ocultarNumeracionRespuestas',
													!data.ocultarNumeracionRespuestas
												)
											}}
											checked={data.ocultarNumeracionRespuestas}
										/>
									</div>
									<div className='row'>
										<CustomInput
											type='checkbox'
											label='Modo clásico'
											inline
											onClick={e => {
												onChange('oneByOne', !data.oneByOne)
											}}
											checked={!data.oneByOne}
										/>
									</div>
								</div>
							),

							1: (
								<div>
									<h2>{t('formularios>crear_formulario>configuracion>mensajes', 'Mensajes')}</h2>
									<div
										style={{
											display: 'flex',
											alignItems: 'center'
										}}
									>
										<p style={{ margin: 0 }}>
											{t(
												'formularios>crear_formulario>configuracion>mensaje_de_bienvenida',
												'Mensaje de bienvenida'
											)}
										</p>
										<Switch
											checked={!!data.hasMensajeBienvenida}
											color='primary'
											onClick={() => {
												onChange('hasMensajeBienvenida', !data.hasMensajeBienvenida)
											}}
										/>
									</div>
									{data.hasMensajeBienvenida && (
										<Froala
											uploadUrl={props.uploadUrl}
											resourcesUrl={props.resourcesUrl}
											deleteResourceUrl={props.deleteResourceUrl}
											value={data.mensajeBienvenida}
											onChange={value => {
												onChange('mensajeBienvenida', value)
											}}
										/>
									)}
									<br />
									<div
										style={{
											display: 'flex',
											alignItems: 'center'
										}}
									>
										<p style={{ margin: 0 }}>Mensaje de agradecimiento</p>
										<Switch
											checked={!!data.hasMensajeAgradecimiento}
											color='primary'
											onClick={() => {
												onChange('hasMensajeAgradecimiento', !data.hasMensajeAgradecimiento)
											}}
										/>
									</div>
									{data.hasMensajeAgradecimiento && (
										<Froala
											uploadUrl={props.uploadUrl}
											resourcesUrl={props.resourcesUrl}
											deleteResourceUrl={props.deleteResourceUrl}
											value={data.mensajeAgradecimiento}
											onChange={value => {
												onChange('mensajeAgradecimiento', value)
											}}
										/>
									)}
								</div>
							),
							2: (
								<div>
									<h6>Administradores del formulario</h6>
									{state.formAdmins.map(el => adminMapperFunction(el, false))}
									{stagedAdmins.map(el => adminMapperFunction(el))}
									{addingAdmin ? (
										<div>
											{selectedUser.usuarioId ? (
												<div>
													<div
														style={{
															border: '1px solid gray',
															borderRadius: '5px',
															padding: '10px',
															display: 'flex',
															justifyContent: 'space-between'
														}}
													>
														<div
															style={{
																display: 'flex',
																alignItems: 'center'
															}}
														>
															<div>
																<ArrowBackIcon
																	fontSize='large'
																	style={{
																		cursor: 'pointer'
																	}}
																	onClick={() => {
																		discardUser()
																	}}
																/>
															</div>
															<StyledAdminCreator>
																{selectedUser.emailUsuario}
															</StyledAdminCreator>
														</div>
														<div
															style={{
																display: 'flex',
																alignItems: 'center'
															}}
														>
															<Input
																type='select'
																onChange={e => {
																	handleAdminRoleChange(e.target.value)
																}}
															>
																<option />
																<option value='lector'>
																	{t(
																		'formularios>crear_formulario>configuracion>lector',
																		'Lector'
																	)}
																</option>
																<option value='editor'>
																	{t(
																		'formularios>crear_formulario>configuracion>editor',
																		'Editor'
																	)}
																</option>
															</Input>
															<div>
																<CheckIcon
																	style={{
																		cursor: 'pointer'
																	}}
																	onClick={() => {
																		if (data.adminsRoles[selectedUser.usuarioId]) {
																			setStagedAdmins([
																				...stagedAdmins,
																				selectedUser
																			])
																			setSelectedUser({})
																			setAddingAdmin(false)
																		}
																	}}
																/>
															</div>
														</div>
													</div>
													<div
														style={{
															display: 'flex',
															alignItems: 'center'
														}}
													>
														<Checkbox
															color='primary'
															checked={!!notificationMessages[selectedUser.usuarioId]}
															onClick={() => {
																if (notificationMessages[selectedUser.usuarioId]) {
																	handleNotificationChange('')
																} else {
																	handleNotificationChange(null)
																}
															}}
														/>
														<span>
															{t(
																'formularios>crear_formulario>configuracion>notificar',
																'Notificar'
															)}
														</span>
													</div>
													<Input
														type='textarea'
														value={notificationMessages[selectedUser.usuarioId]}
														onChange={e => {
															handleNotificationChange(e.target.value)
														}}
													/>
												</div>
											) : (
												<Input
													onChange={e => {
														handleChangeInputSearch(e.target.value)
													}}
												/>
											)}
											{state.searchUsers.length > 0 && !selectedUser.usuarioId && (
												<div
													style={{
														paddingTop: '0.5rem',
														paddingBottom: '0.5rem',
														backgroundColor: 'white',
														borderRadius: '7px',
														boxShadow:
															'0 1px 2px 0 rgb(60 64 67 / 30%), 0 2px 6px 2px rgb(60 64 67 / 15%)'
													}}
												>
													{state.searchUsers.map((el, idx) => {
														if (admindIds.includes(el.usuarioId)) {
															return
														}
														if (
															stagedAdmins
																.map(item => item.usuarioId)
																.includes(el.usuarioId)
														) {
															return
														}
														if (!el.emailUsuario) {
															return (
																<div
																	className='select-hover'
																	style={{
																		borderBottom:
																			idx + 1 != state.searchUsers.length
																				? '1px solid #eaeaea'
																				: '0'
																	}}
																>
																	Usuario sin correo registrado
																</div>
															)
														}
														return (
															<div
																className='select-hover'
																style={{
																	borderBottom:
																		idx + 1 != state.searchUsers.length
																			? '1px solid #eaeaea'
																			: '0'
																}}
																onClick={() => {
																	setSelectedUser(el)
																	actions.clearSearch()
																}}
															>
																{el.emailUsuario}
															</div>
														)
													})}
												</div>
											)}
										</div>
									) : (
										<Typography
											color='primary'
											onClick={() => {
												setAddingAdmin(true)
											}}
										>
											+ Agregar una persona
										</Typography>
									)}
								</div>
							),
							3: (
								<div>
									<h6>
										{t(
											'formularios>crear_formulario>configuracion>informacion_contacto',
											'Información de contacto del formulario'
										)}
									</h6>
									<div>
										<FormGroup>
											<Label>Nombre</Label>
											<Input
												type='text'
												value={data.contactoNombre}
												onChange={e => {
													onChange('contactoNombre', e.target.value)
												}}
											/>
										</FormGroup>
										<span style={{ color: 'red' }}>
											<p>{emailError}</p>
										</span>
										<FormGroup>
											<Label>
												{t('formularios>crear_formulario>configuracion>correo', 'Correo')}
											</Label>
											<Input
												type='email'
												value={data.contactoCorreo}
												onChange={e => {
													onChange('contactoCorreo', e.target.value)
												}}
											/>
										</FormGroup>
									</div>
								</div>
							)
						}[activeTab]
					}
				</ContentTab>
			</ModalBody>
			<ModalFooter className='container-center w-100 p-3 border-none'>
				{btnCancel && (
					<Button
						className='mr-3 cursor-pointer'
						onClick={() => {
							onClose()
							setEmailError(null)
							discardUser()
						}}
						color='btn btn-outline-primary'
					>
						{t('formularios>crear_formulario>configuracion>cancelar', 'Cancelar')}
					</Button>
				)}
				{loading && <div className='loading loading-form ml-4' />}
				{!loading && (
					<Button
						className='mr-3 cursor-pointer'
						onClick={async () => {
							if (btnCancel) {
								if (validateContactInfo()) {
									return
								}
								if (idsToDelete.length > 0) {
									await deleteAdmins()
								}
								if (stagedAdmins.length > 0) {
									saveAdmins()
								}
								action()
								setEmailError(null)
							} else {
								onClose()
							}
						}}
						color='primary'
					>
						{t('general>aceptar', 'Aceptar')}
					</Button>
				)}
			</ModalFooter>
		</Modal>
	)
}

const StyledAdminContent = styled.div`
	display: flex;
	justify-content: space-between;
	padding-left: 10px;
	padding-right: 10px;
	border-radius: 15px;
	background-color: #eaeaea;
	align-items: center;
	margin: 20px;

	.role {
		padding: 10px;
		border-left: 1px solid gray;
	}
`

const StyledAdminCreator = styled.span`
	border: 1px solid gray;
	border-radius: 20px;
	padding: 4px;
	color: white;
	font-size: 10px;
	justify-content: center;
	display: flex;
	align-items: center;
	height: 2rem;
	background-color: ${colors.primary};
`

ModalConfiguracion.propTypes = {
	openDialog: PropTypes.bool,
	btnCancel: PropTypes.bool,
	action: PropTypes.func,
	onClose: PropTypes.func
}

ModalConfiguracion.defaultProps = {
	btnCancel: true,
	openDialog: false,
	loading: false,
	action: () => {},
	onClose: () => {}
}
export default ModalConfiguracion
