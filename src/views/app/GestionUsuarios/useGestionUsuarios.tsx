import React, { useReducer } from 'react'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import TableUserComponent from './_partials/TableUserComponent'
import ActionsButtonsComponents from './_partials/ActionsButtonsComponent'
import * as yup from 'yup'
import swal from 'sweetalert'
import { useTranslation } from 'react-i18next'

type CREATE_USUARIO_REQUEST = {
	NombreUsuario: string
	Email: string
	IdentidadId: number
	RolId: number
	NivelAccesoId: number
	AlcanceId: number[]
}
type ROLE_UPDATE_REQUEST = {
	RoleId: number
	NivelAccesoId: number
	AlcanceId: number
}
type UPDATE_USUARIO_REQUEST = {
	UserId: string
	Email: string
	Roles: ROLE_UPDATE_REQUEST[]
}
type VIEW_STATE = {
	showInstitucion: boolean
	showInstitucionMulti: boolean
	showRegional: boolean
	showRegionalMulti: boolean
	showCircuito: boolean
	showDepartamento: boolean
	showCompania: boolean
}
enum TYPES {
	SET_ACTIVE_TAB,
	SET_TIPO_ROLES,
	SET_OPTION_TABS,
	SET_TABS,
	SET_FILAS,
	SET_PAGINATION_OBJECT,
	SET_TAB_DATA,
	SET_SHOW_FORM,
	SET_TIPO_IDENTIFICACION_ID,
	SET_NUMERO_IDENTIFICACION,
	SET_EMAIL,
	SET_ROL_ID,
	SET_REGIONAL_ID,
	SET_CIRCUITO_ID,
	SET_CIRCUITOS_ID,
	SET_INSTITUCION_ID,
	SET_INSTITUCIONES_ID,
	SET_CONTROL_VIEW_STATE,
	SET_REGIONALES_ID,
	SET_CIRCUITOS_CATALOG,
	SET_FULLNAME,
	SET_ROLES_CATALOG,
	CLEAR_FORMDATA,
	SET_FORMDATA,
	SET_EDITING_FORM,
	SET_SHOW_REGISTER_MODAL,
	SET_LOADING,
	SET_COMPANIA_CATALOG,
	SET_DEPARTAMENTO_CATALOG,
	SET_DEPARTAMENTO_ID,
	SET_COMPANIA_ID,
	SET_ROL_TABINDEX_MAP,
	SET_SELECTED_ROW,
	SET_SHOW_ROL_INFO_MODAL
}

type InstitucionType = {
	id: number
	codigo: string
	nombre: string
	estado: boolean
}

type RegionalType = {
	id: number
	nombre: string
	codigo: string
}

type CircuitoType = {
	id: number
	nombre: string
	estado: boolean
}

type NivelesAccesoType = {
	id: number
	nivelAccesoId: number
	estado: boolean
}

type RolOrganizacionType = {
	id: number
	nombre: string
	tipoRolId: number
	tipoRolNombre: string
	color?: string
	estado: boolean
}

const defaultTipoIdentificacion = [
	{ value: 1, label: 'CÉDULA' },
	{ value: 3, label: 'DIMEX' },
	{ value: 4, label: 'YÍS RÖ - IDENTIFICACIÓN MEP' }
	
]

const defaultViewState: VIEW_STATE = {
	showInstitucion: false,
	showInstitucionMulti: false,
	showRegional: false,
	showRegionalMulti: false,
	showCircuito: false,
	showDepartamento: false,
	showCompania: false
}

const initialState = {
	usuarioId: null,
	isEditing: false,
	activeTab: 0,
	tipoRoles: [],
	optionTabs: [],
	tabs: {},
	filas: [],
	paginationObject: { totalCount: 0, page: 0 },
	showForm: false,
	identidadId: null,
	tipoIdentificacionId: null,
	numeroIdentificacion: '',
	fullName: '',
	email: '',
	rolId: null,
	nivelAcceso: null,
	tipoRolId: null,
	tipoIdentificacionOptions: defaultTipoIdentificacion,
	rolOptions: [], // defaultRoles,
	tipoRolTabIndexMap: new Map(),
	institucionId: null,
	institucionesId: [],
	circuitoId: null,
	circuitosId: [],
	regionalesId: [],
	regionalId: null,
	viewControlState: defaultViewState,
	cricuitosCatalog: [],
	showRegisterModal: false,
	encontrado: null,
	loading: false,
	departamentoOptions: [],
	companiaOptions: [],
	departamentoId: null,
	companiaId: null,
	selectedItem: {},
	showRolInfoModal: false,
	multiselectInstitucionesValue: [],
	multiselectCircuitosValue: null,
	tipoRolesCatalog: []
}

const reducer = (state = initialState, action): typeof initialState => {
	const { type, payload } = action
	switch (type) {
		case TYPES.SET_ACTIVE_TAB: {
			return {
				...state,
				activeTab: payload,
				numeroIdentificacion: '',
				showForm: false
			}
		}
		case TYPES.SET_OPTION_TABS: {
			return { ...state, optionTabs: payload }
		}
		case TYPES.SET_TABS: {
			return { ...state, tabs: payload }
		}
		case TYPES.SET_FILAS: {
			return { ...state, filas: payload }
		}
		case TYPES.SET_PAGINATION_OBJECT: {
			return { ...state, paginationObject: payload }
		}
		case TYPES.SET_TAB_DATA: {
			const tabs = { ...state.tabs }
			const { index, tab } = payload
			tabs[index] = tab
			return { ...state, tabs }
		}
		case TYPES.SET_SHOW_FORM: {
			return { ...state, showForm: payload }
		}
		case TYPES.SET_TIPO_IDENTIFICACION_ID: {
			return {
				...state,
				tipoIdentificacionId: payload,
				numeroIdentificacion: ''
			}
		}
		case TYPES.SET_NUMERO_IDENTIFICACION: {
			return { ...state, numeroIdentificacion: payload, fullName: '' }
		}
		case TYPES.SET_EMAIL: {
			return { ...state, email: payload }
		}
		case TYPES.SET_ROL_ID: {
			return { ...state, rolId: payload }
		}
		case TYPES.SET_INSTITUCIONES_ID: {
			return { ...state, institucionesId: payload }
		}
		case TYPES.SET_INSTITUCION_ID: {
			return { ...state, institucionId: payload }
		}
		case TYPES.SET_REGIONAL_ID: {
			return { ...state, regionalId: payload }
		}
		case TYPES.SET_REGIONALES_ID: {
			return { ...state, regionalesId: payload }
		}
		case TYPES.SET_CIRCUITOS_ID: {
			return { ...state, circuitosId: payload }
		}
		case TYPES.SET_CIRCUITOS_CATALOG: {
			return { ...state, cricuitosCatalog: payload }
		}
		case TYPES.SET_CONTROL_VIEW_STATE: {
			return { ...state, viewControlState: payload }
		}
		case TYPES.SET_FULLNAME: {
			return {
				...state,
				identidadId: payload.identidadId,
				fullName: payload.nombre,
				encontrado: payload.encontrado
			}
		}
		case TYPES.SET_ROLES_CATALOG: {
			return { ...state, rolOptions: payload }
		}
		case TYPES.CLEAR_FORMDATA: {
			return {
				...state,
				identidadId: null,
				tipoIdentificacionId: null,
				usuarioId: null,
				numeroIdentificacion: '',
				fullName: '',
				email: '',
				rolId: null,
				// typeRolId: null,
				// rolOptions: [], //defaultRoles,
				institucionId: null,
				institucionesId: [],
				circuitoId: null,
				circuitosId: [],
				regionalesId: [],
				regionalId: null,
				cricuitosCatalog: []
			}
		}
		case TYPES.SET_EDITING_FORM: {
			return { ...state, isEditing: payload }
		}
		case TYPES.SET_FORMDATA: {
			return {
				...state,
				usuarioId: payload.usuarioId,
				rolId: payload.rolId,
				tipoRolId: payload.tipoRolId,
				multiselectInstitucionesValue: payload.multiselectInstitucionesValue,
				multiselectCircuitosValue: payload.multiselectCircuitosValue,
				regionalId: payload.regionalId,
				regionalesId: payload.regionalesId,
				circuitosId: payload.circuitosId,
				circuitoId: payload.circuitoId,
				institucionesId: payload.institucionesId,
				fullName: payload.fullName,
				tipoIdentificacionId: payload.tipoIdentificacionId,
				numeroIdentificacion: payload.numeroIdentificacion,
				email: payload.email,
				departamentoId: null,
				companiaId: null,
				nivelAcceso: payload.nivelAcceso
			}
		}
		case TYPES.SET_SHOW_REGISTER_MODAL: {
			return { ...state, showRegisterModal: payload }
		}
		case TYPES.SET_LOADING: {
			return { ...state, loading: payload }
		}
		case TYPES.SET_DEPARTAMENTO_CATALOG: {
			return { ...state, departamentoOptions: payload }
		}
		case TYPES.SET_COMPANIA_CATALOG: {
			return { ...state, companiaOptions: payload }
		}
		case TYPES.SET_DEPARTAMENTO_ID: {
			return { ...state, departamentoId: payload }
		}
		case TYPES.SET_COMPANIA_ID: {
			return { ...state, companiaId: payload }
		}
		case TYPES.SET_ROL_TABINDEX_MAP: {
			return { ...state, tipoRolTabIndexMap: payload }
		}
		case TYPES.SET_SELECTED_ROW: {
			return { ...state, selectedItem: payload }
		}
		case TYPES.SET_SHOW_ROL_INFO_MODAL: {
			return { ...state, showRolInfoModal: payload }
		}
		case TYPES.SET_TIPO_ROLES: {
			return { ...state, tipoRolesCatalog: payload }
		}
		default: {
			return state
		}
	}
}

const buildRolColumn = (arr, fullRowItem, onRolClick) => {
	if (typeof arr === 'string') arr = JSON.parse(arr)
	arr = arr.filter((i: RolOrganizacionType) => i.estado === true)
	const role = []

	arr.filter(item => {
		return !role.map(e => e.nombre).includes(item.nombre) ? role.push(item) : false
	})

	return (
		<div style={{ display: 'flex' }}>
			{role.map((i: RolOrganizacionType, index) => {
				return (
					<span
						onClick={e => {
							onRolClick(e, fullRowItem)
						}}
						key={index}
						style={{
							padding: '3px',
							borderRadius: '5px',
							margin: '2px',
							background: i.color || 'lightgray',
							cursor: 'pointer'
						}}
					>
						{i.nombre}
					</span>
				)
			})}
		</div>
	)
}

const buildFullVariableColumn = arreglosStr => {
	let arreglos = []

	for (const arrStr of arreglosStr) {
		let arr = arrStr
		if (typeof arr === 'string') arr = JSON.parse(arr)
		arr = arr.filter(i => i.estado == true)
		arreglos = arreglos.concat(
			arr.map(i => {
				return {
					codigo: i.codigo,
					nombre: i.nombre
				}
			})
		)
	}

	return (
		<div style={{ display: 'flex', flexDirection: 'column' }}>
			{arreglos.map((i: InstitucionType) => {
				return (
					<label style={{ marginRight: '2px' }}>
						{`${i.codigo ? i.codigo + ' - ' : ''} ${i.nombre}`}
					</label>
				)
			})}
		</div>
	)
}
const buildVariableColumn = arr => {
	if (typeof arr === 'string') arr = JSON.parse(arr)
	arr = arr.filter(i => i.estado == true)
	return (
		<div style={{ display: 'flex', flexDirection: 'column' }}>
			{arr.map((i: InstitucionType) => {
				return <label style={{ marginRight: '2px' }}>{`${i.codigo} ${i.nombre}`}</label>
			})}
		</div>
	)
}

const standardAlert = (props: {
	title: string
	msg: string
	icon: 'warning' | 'error' | 'success' | 'info'
}) => {
	return swal({
		title: props.title,
		icon: props.icon,
		text: props.msg
	})
}
interface IProps {
	snackbarHandleClick?: Function
}

const useGestionUsuarios = (props: IProps) => {
	const { t } = useTranslation()
	const [state, dispatch] = useReducer(reducer, initialState)
	const [snackbarData, setSnackbarData] = React.useState<{
		variant: 'success' | 'error'
		msg: string
	}>({ variant: 'success', msg: '' })

	const questionAlert = (props: {
		title: string
		msg: string
		cancelText?: string
		okText?: string
		icon: 'warning' | 'error' | 'success' | 'info'
		dangerMode: boolean
	}) => {
		return swal({
			title: props.title,
			icon: props.icon,
			text: props.msg,
			className: 'text-alert-modal',
			buttons: {
				cancelar: {
					text:
						props.cancelText || t('gestion_usuario>usuarios>btn_cancelar', 'Cancelar'),
					value: false,
					className: 'btn-gray-color'
				},
				aceptar: {
					text: props.okText || t('gestion_usuario>usuarios>btn_si_seguro', 'Sí, seguro'),
					value: true,
					className: 'btn-alert-color'
				}
			}
		})
	}

	const toggleLoading = (loading?: boolean) => {
		dispatch({
			type: TYPES.SET_LOADING,
			payload: loading == undefined || loading == null ? !state.isEditing : loading
		})
	}
	const toggleRegisterModal = (show?: boolean) => {
		dispatch({
			type: TYPES.SET_SHOW_REGISTER_MODAL,
			payload: show == undefined || show == null ? !state.isEditing : show
		})
	}
	const toggleEditing = (editing?: boolean) => {
		dispatch({
			type: TYPES.SET_EDITING_FORM,
			payload: editing == undefined || editing == null ? !state.isEditing : editing
		})
	}
	const clearFormData = () => {
		dispatch({ type: TYPES.CLEAR_FORMDATA })
	}
	const errorMessage = (msg: string) => {
		setSnackbarData({ variant: 'error', msg })
		props.snackbarHandleClick()
	}
	const successMessage = (msg: string) => {
		setSnackbarData({ variant: 'success', msg })
		props.snackbarHandleClick()
	}
	const toggleForm = (showForm?: boolean) => {
		dispatch({
			type: TYPES.SET_SHOW_FORM,
			payload: showForm === undefined ? !state.showForm : showForm
		})
	}

	const updateActivaInactivaUsuario = async (usuarioId, estado) => {
		// api/Areas/GestorCatalogos/UsuarioCatalogo/ActivareInactivarUsuario/{userId}/{activo}
		try {
			const url = `${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/ActivareInactivarUsuario/${usuarioId}/${estado}`
			const response = await axios.put<any>(url)
			return response.data
		} catch (e) {
			console.log(e)
			throw e
		}
	}
	const resetContrasenia = async userId => {
		//
		try {
			const url = `${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/ResetPassword/${userId}`
			const response = await axios.put<any>(url)
			return response.data
		} catch (e) {
			console.log(e)
			throw e
		}
	}
	const deleteUsuario = async userId => {
		//
		try {
			const url = `${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/Eliminar/${userId}`
			const response = await axios.delete<any>(url)
			return response.data
		} catch (e) {
			console.log(e)
			throw e
		}
	}
	const onResetPasswordEvent = userId => {
		resetContrasenia(userId)
			.then(r => {
				successMessage(
					t(
						'gestion_usuario>usuarios>se_ha_restablecido_la_contrasenia_message',
						'Se ha restablecido la contraseña del usuario'
					)
				)
			})
			.catch(e => {
				errorMessage(e.message)
			})
	}
	const onBloquearUsuarioEvent = (userId, tipoRolId) => {
		toggleLoading(true)
		updateActivaInactivaUsuario(userId, 0)
			.then(_ => {
				fetchUsuarios(tipoRolId).then(r => {
					successMessage(
						t(
							'gestion_usuario>usuarios>usuario_bloqueado_message',
							'Usuario bloqueado correctamente'
						)
					)
					toggleLoading(false)
				})
			})
			.catch(e => {
				errorMessage(e.message)
				toggleLoading(false)
			})
	}
	const onDesbloquearUsuarioEvent = (userId, tipoRolId) => {
		toggleLoading(true)
		updateActivaInactivaUsuario(userId, 1)
			.then(_ => {
				fetchUsuarios(tipoRolId).then(r => {
					successMessage(
						t(
							'gestion_usuario>usuarios>usuario_desbloqueado_message',
							'Usuario desbloqueado correctamente'
						)
					)
					toggleLoading(false)
				})
			})
			.catch(e => {
				errorMessage(e.message)
				toggleLoading(false)
			})
	}
	const onDeleteUsuarioEvent = (userId, tipoRolId) => {
		toggleLoading(true)
		deleteUsuario(userId)
			.then(_ => {
				fetchUsuarios(tipoRolId).then(_ => {
					successMessage(
						t(
							'gestion_usuario>usuarios>usuario_eliminado_message',
							'Usuario eliminado correctamente'
						)
					)
					toggleLoading(false)
				})
			})
			.catch(e => {
				errorMessage(e.message)
				toggleLoading(false)
			})
	}
	const buildActionsComponent = (userId, item, tipoRolId) => {
		const deleteEvent = (uId, e) => {
			e.preventDefault()
			questionAlert({
				dangerMode: true,
				icon: 'warning',
				msg: t(
					'gestion_usuario>usuarios>esta_seguro_de_eliminar_usuario_message',
					'¿Está seguro que desea eliminar el usuario seleccionado?'
				),
				title: t('gestion_usuario>usuarios>title_gestion_usuarios', 'Gestión de Usuarios')
			}).then(response => {
				if (response == true) onDeleteUsuarioEvent(uId, tipoRolId)
			})
		}
		const lockEvent = (uId, e) => {
			e.preventDefault()
			questionAlert({
				dangerMode: true,
				icon: 'warning',
				msg: t(
					'gestion_usuario>usuarios>desea_bloquear_el_usuario_message',
					'¿Desea bloquear el usuario seleccionado?'
				),
				title: t('gestion_usuario>usuarios>title_gestion_usuarios', 'Gestión de Usuarios')
			}).then(response => {
				if (response == true) onBloquearUsuarioEvent(uId, tipoRolId)
			})
		}
		const unlockEvent = (uId, e) => {
			e.preventDefault()
			questionAlert({
				dangerMode: true,
				icon: 'warning',
				msg: t(
					'gestion_usuario>usuarios>desea_desbloquear_usuario_message',
					'¿Desea desbloquear el usuario seleccionado?'
				),
				title: t('gestion_usuario>usuarios>title_gestion_usuarios', 'Gestión de Usuarios')
			}).then(response => {
				if (response == true) onDesbloquearUsuarioEvent(uId, tipoRolId)
			})
		}
		const editEvent = (uId, e) => {
			e.preventDefault()
			// alert('Agregar evento de edit ' + uId)
			toggleEditing(true)
			toggleForm(true)
			item.usuarioId = uId
			setFormValues(item)
		}
		const resetPasswordEvent = (uId, e) => {
			e.preventDefault()
			questionAlert({
				dangerMode: true,
				icon: 'warning',
				msg: t(
					'gestion_usuario>usuarios>desea_restaurar_contrasenia_message',
					'¿Desea restaurar la contraseña de este usuario?'
				),
				title: t('gestion_usuario>usuarios>title_gestion_usuarios', 'Gestión de Usuarios')
			}).then(response => {
				if (response == true) onResetPasswordEvent(uId)
			})
		}

		return (
			<ActionsButtonsComponents
				UserId={userId}
				DeleteEvent={deleteEvent}
				EditEvent={editEvent}
				LockEvent={lockEvent}
				UnlockEvent={unlockEvent}
				ResetPasswordEvent={resetPasswordEvent}
				isActive={item.activo}
			/>
		)
	}
	const toggleShowRolInfoModal = (show?: boolean) => {
		dispatch({
			type: TYPES.SET_SHOW_ROL_INFO_MODAL,
			payload: show === undefined ? !state.showRolInfoModal : show
		})
	}
	const setSelectedRow = rowObject => {
		dispatch({ type: TYPES.SET_SELECTED_ROW, payload: rowObject })
	}
	const onRolClick = (e, fullRowItem) => {
		setSelectedRow(fullRowItem)
		toggleShowRolInfoModal(true)
	}
	const onRolModalClose = () => {
		setSelectedRow({})
		toggleShowRolInfoModal(false)
	}
	const fetchUsuarios = async (tipoRolId = null, filtro = 'NULL', pageNum = 1, pageSize = 10) => {
		const nullable = (key, value) => {
			if (!key || !value) {
				return ''
			} else {
				return `${key}=${value}&`
			}
		}
		const url = `${
			envVariables.BACKEND_URL
		}/api/Areas/GestorCatalogos/UsuarioCatalogo/GetAllUsuariobyTipoRolId?${nullable(
			'tipoRolId',
			tipoRolId
		)}Filtro=${filtro}&PageNum=${pageNum}&PageSize=${pageSize}`
		try {
			const response = await axios.get<any>(url)

			const filas = response.data.map(item => {
				return {
					id: item.id,
					nombreUsuario: item.nombreUsuario,
					identificacion: item.identificacion,
					nombreCompleto: item.nombreCompleto,
					emailusuario: item.emailusuario,
					ultimoInicioSesion: item.ultimoInicioSesion,
					roles: buildRolColumn(item.roles, item, onRolClick),
					nivelesAcceso: item.nivelesAcceso,
					instituciones: item.instituciones,
					circuitos: item.circuitos,
					regionales: item.regionales,
					activo:
						item.activo == true
							? t('gestion_usuario>usuarios>usuario_activo', 'Activo')
							: t('gestion_usuario>usuarios>usuario_inactivo', 'Inactivo'),
					// instituciones:item.instituciones,
					// codigoInstitucion:item.codigoInstitucion,
					// regionales:item.regionales,
					// circuitos:item.circuitos,
					// rolAsignadoNombre:item.rolAsignadoNombre,
					variable: buildFullVariableColumn([
						item.instituciones,
						item.circuitos,
						item.regionales
					]),
					acciones: buildActionsComponent(item.id, item, tipoRolId)
				}
			})
			//
			const findTabIndex = (map, rolId) => {
				if (!rolId) return 0
				for (const [key, value] of map.entries()) {
					if (rolId == value.id) return key
				}
			}
			const tabIndex = findTabIndex(state.tipoRolTabIndexMap, tipoRolId)

			if (response.data.length > 0) {
				dispatch({ type: TYPES.SET_FILAS, payload: filas })
				const pagObject = {
					totalCount: response.data[0].totalPages,
					page: response.data[0].pageNumber
				}
				dispatch({
					type: TYPES.SET_PAGINATION_OBJECT,
					payload: pagObject
				})
				rebuildTab(tabIndex, pagObject, filas)
			} else {
				dispatch({
					type: TYPES.SET_PAGINATION_OBJECT,
					payload: { totalCount: 1, page: 1 }
				})
				rebuildTab(tabIndex, { totalCount: 1, page: 1 }, [])
			}
		} catch (e) {
			console.log(e)
		}
	}
	const fetchIdentidad = async (tipoId, identificacion) => {
		try {
			const url = `${envVariables.BACKEND_URL}/api/Identidad/Persona/GetByTipoIdAndId/${tipoId}_${identificacion}`
			const response = await axios.get<any>(url)
			if (response.data && response.data.id > 0) {
				const { id, nombre, primerApellido, segundoApellido, identidadDatos } =
					response.data

				dispatch({
					type: TYPES.SET_FULLNAME,
					payload: {
						identidadId: id,
						nombre: `${nombre} ${primerApellido} ${segundoApellido}`,
						encontrado: true
					}
				})
				dispatch({
					type: TYPES.SET_EMAIL,
					payload: identidadDatos?.email
				})
				return response.data
			} else {
				dispatch({
					type: TYPES.SET_FULLNAME,
					payload: {
						identidadId: null,
						nombre: '',
						encontrado: false
					}
				})
			}
		} catch (e) {
			console.log(e)
		}
	}
	const fetchAllRoles = async () => {
		try {
			const url = `${envVariables.BACKEND_URL}/api/Admin/Roles/GetAllTipoRoles`
			const response = await axios.get<any>(url)

			if (response.data) {
				const roles = response.data.map(i => {
					return {
						label: i.name,
						value: i.id
					}
				})
				dispatch({ type: TYPES.SET_ROLES_CATALOG, payload: roles })
				return roles
			}
		} catch (e) {
			console.log(e)
		}
	}
	const fetchRolesByTipoRolId = async tipoRolId => {
		try {
			const url = `${envVariables.BACKEND_URL}/api/Admin/Roles/GetAllRolbyTipoRol?TipoRolId=${tipoRolId}`
			const response = await axios.get<any>(url)

			if (response.data) {
				const roles = response.data.map(i => {
					return {
						label: i.nombre,
						value: i.id
					}
				})
				dispatch({ type: TYPES.SET_ROLES_CATALOG, payload: roles })
				return roles
			}
		} catch (e) {
			console.log(e)
		}
	}
	const createDepartamento = async nombre => {
		try {
			const url = `${envVariables.BACKEND_URL}/api/Admin/Departamento/Create`
			const response = await axios.post<any>(url, {
				nombre
			})
			return response.data
		} catch (e) {
			console.log(e)
		}
	}
	const fetchAllDepartamentos = async (nombre?) => {
		try {
			const url = `${envVariables.BACKEND_URL}/api/Admin/Departamento`
			const response = await axios.get<any>(url)

			const departamentos = response.data.map(i => {
				return {
					label: i.nombre,
					value: i?.departamentoId,
					el: i
				}
			})
			const filtered =
				nombre != null && nombre != undefined && nombre != ''
					? departamentos.filter(i => i.toUpperCase().includes(nombre.toUpperCase()))
					: departamentos
			dispatch({
				type: TYPES.SET_DEPARTAMENTO_CATALOG,
				payload: departamentos
			})
			return filtered
		} catch (e) {
			console.log(e)
		}
	}
	const createEmpresas = async nombre => {
		try {
			const url = `${envVariables.BACKEND_URL}/api/Admin/Empresas/Create`
			const response = await axios.post<any>(url, {
				nombre
			})
			return response.data
		} catch (e) {
			console.log(e)
		}
	}
	const fetchAllEmpresas = async (nombre?) => {
		try {
			const url = `${envVariables.BACKEND_URL}/api/Admin/Empresas`
			const response = await axios.get<any>(url)

			const empresas = response.data.map(i => {
				return {
					label: i.nombre,
					value: i?.empresasId,
					el: i
				}
			})
			const filtered = nombre
				? empresas.filter(i => i.toUpperCase().includes(nombre.toUpperCase()))
				: empresas
			dispatch({ type: TYPES.SET_COMPANIA_CATALOG, payload: empresas })
			return filtered
		} catch (e) {
			console.log(e)
		}
	}

	const handleSearch = (
		searchValue: string,
		filterColumn: string | undefined | null,
		pageSize: number = 10,
		page: number = 1,
		column: string,
		order: string,
		activeTab: number
	) => {
		toggleLoading(true)
		const tipoRolId = state.tipoRolTabIndexMap.get(activeTab)?.id
		fetchUsuarios(tipoRolId, searchValue, page, pageSize).then(_ => toggleLoading(false))
	}

	const rebuildTab = (index, paginationObject, rows) => {
		const searchEvent = (searchValue, filterColumn, pageSize, page, column, order) => {
			handleSearch(searchValue, filterColumn, pageSize, page, column, order, index)
		}
		const tab = (
			<TableUserComponent
				btnAgregarEvent={onBtnAgregarEvent}
				isTabTodos={index == 0}
				paginationObject={paginationObject}
				data={rows}
				handleSearch={searchEvent}
			/>
		)
		dispatch({
			type: TYPES.SET_TAB_DATA,
			payload: {
				index,
				tab
			}
		})
	}

	const setTabs = tipoRoles => {
		if (tipoRoles?.length > 0) {
			//
			const optionTabs = [
				{ id: 0, nombre: t('gestion_usuario>usuarios>todos', 'Todos') }
			].concat(tipoRoles.map(i => ({ id: i.id, nombre: i.nombre })))
			dispatch({
				type: TYPES.SET_OPTION_TABS,
				payload: optionTabs.map(i => i.nombre)
			})
			const mapa = new Map()

			const tabs = {}

			optionTabs.forEach((item, index) => {
				tabs[index] = rebuildTab(index, state.paginationObject, [])
				mapa.set(index, item)
			})
			dispatch({ type: TYPES.SET_ROL_TABINDEX_MAP, payload: mapa })
			dispatch({ type: TYPES.SET_TABS, payload: tabs })
		}
	}

	const fetchTipoRoles = async () => {
		const url = `${envVariables.BACKEND_URL}/api/Admin/Roles/GetAllTipoRoles`
		try {
			const response = await axios.get<any>(url)
			let tipoRoles = []
			if (response.data && response.data.length > 0) {
				tipoRoles = response.data.map(i => {
					return {
						id: i.id,
						nombre: i.nombre,
						nivelAcceso: i.nivelAcceso
					}
				})
			}
			dispatch({ type: TYPES.SET_TIPO_ROLES, payload: tipoRoles })
			setTabs(tipoRoles)
		} catch (e) {
			console.log(e)
		}
	}

	const setActiveTab = tab => {
		//
		clearFormData()
		if (tab == state.activeTab) return
		dispatch({ type: TYPES.SET_ACTIVE_TAB, payload: tab })
		const tipoRolId = state.tipoRolTabIndexMap.get(tab).id
		toggleLoading(true)
		fetchUsuarios(tipoRolId == 0 ? null : tipoRolId).then(_ => toggleLoading(false))
		setViewState(tipoRolId)
		if (tipoRolId == 0) {
			fetchAllRoles()
		} else {
			fetchRolesByTipoRolId(tipoRolId)
		}
	}

	const onBtnAgregarEvent = e => {
		e.preventDefault()
		clearFormData()
		toggleEditing(false)
		toggleForm(true)
	}
	const onRegresarEvent = e => {
		e && e.preventDefault()
		toggleForm(false)
	}
	const onChangeSelectTipoIdentificacion = obj => {
		// const { value } = obj
		dispatch({ type: TYPES.SET_TIPO_IDENTIFICACION_ID, payload: obj })
	}
	const onChangeInputNumeroIdentificacion = e => {
		const value = e.target.value
		dispatch({ type: TYPES.SET_NUMERO_IDENTIFICACION, payload: value })

		if (value && value.length > 8 && state?.tipoIdentificacionId?.value) {
			toggleLoading(true)
			fetchIdentidad(state.tipoIdentificacionId.value, value).then(_ => toggleLoading(false))
		} else {
			dispatch({
				type: TYPES.SET_FULLNAME,
				payload: { nombre: '', encontrado: null }
			})
		}
	}
	const onChangeInputEmail = e => {
		const value = e.target.value
		dispatch({ type: TYPES.SET_EMAIL, payload: value })
	}
	const onChangeSelectRol = obj => {
		const { value } = obj
		dispatch({ type: TYPES.SET_ROL_ID, payload: obj })
		// setViewState(value)
	}
	const onBtnSaveEvent = async e => {
		e.preventDefault()
		if (state.isEditing == false) await crearUsuario()
		else await actualizarUsuario()
	}

	const validatorCreateUsuarioRequest = (body: CREATE_USUARIO_REQUEST) => {
		const schema = yup.object({
			NombreUsuario: yup
				.string()
				.required(
					t('gestion_usuario>usuarios>invalid_username', 'Nombre de usuario no válido')
				),
			Email: yup
				.string()
				.email(
					t('gestion_usuario>usuarios>ingrese_un_email_valido', 'Ingrese un email válido')
				),
			IdentidadId: yup.number().positive().integer(),
			RolId: yup.number().positive().integer(),
			NivelAccesoId: yup.number().positive().integer(),
			AlcanceId: yup.array().of(yup.number())
		})
		try {
			const validated = schema.validateSync(body)
			return { error: false, object: validated }
		} catch (e) {
			return { error: true, object: e }
		}
	}
	const crearUsuario = async () => {
		try {
			const body: CREATE_USUARIO_REQUEST = {
				Email: state.email,
				IdentidadId: state.identidadId,
				AlcanceId: [],
				NivelAccesoId: 0,
				NombreUsuario: state.numeroIdentificacion,
				RolId: state.rolId.value
			}

			body.NivelAccesoId = state.tipoRolTabIndexMap.get(state.activeTab).nivelAcceso
			// Selects de institucion
			body.AlcanceId = body.AlcanceId.concat(
				state.institucionesId.map(i => parseInt(i.value))
			)
			if (state.institucionId?.value) {
				body.AlcanceId.push(parseInt(state.institucionId.value))
			}

			// Selects de Regional
			body.AlcanceId = body.AlcanceId.concat(state.regionalesId.map(i => parseInt(i.value)))
			if (state.regionalId?.value) {
				body.AlcanceId.push(parseInt(state.regionalId.value))
			}

			// select de circuito
			body.AlcanceId = body.AlcanceId.concat(state.circuitosId.map(i => parseInt(i.value)))

			const { error, object } = validatorCreateUsuarioRequest(body)
			if (error == true) {
				console.log(object)
				return
			}

			const url = `${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/CrearUsuario`
			const response: any = await axios.post(url, object)
			if (!response.data.error) {
				successMessage(
					t(
						'gestion_usuario>usuarios>usuario_creado_correctamente_message',
						'Usuario creado correctamente'
					)
				)
				toggleForm(false)
			} else {
				errorMessage(
					t('gestion_usuario>usuarios>usuario_ya_existe_message', 'El usuario ya existe')
				)
			}
		} catch (e) {
			errorMessage(
				t(
					'gestion_usuario>usuarios>error_al_crear_usuario_message',
					'Error al crear el usuario'
				)
			)
			console.error(e)
		}
	}
	const actualizarUsuario = async () => {
		try {
			const body: UPDATE_USUARIO_REQUEST = {
				Email: state.email,
				UserId: state.usuarioId,
				Roles: []
			}
			const NivelAccesoId = state.nivelAcceso

			// Lo que hay dentro de multiselect instituciones
			body.Roles = body.Roles.concat(
				state.institucionesId.map(i => {
					return {
						RoleId: state.rolId.value,
						AlcanceId: i.value,
						NivelAccesoId
					}
				})
			)
			// Lo que hay en el select institucion
			if (state.institucionId?.value) {
				body.Roles.push({
					RoleId: state.rolId.value,
					AlcanceId: parseInt(state.institucionId.value),
					NivelAccesoId
				})
			}
			// Lo que hay en selects de regional
			body.Roles = body.Roles.concat(
				state.regionalesId.map(i => {
					return {
						RoleId: state.rolId.value,
						AlcanceId: i.value,
						NivelAccesoId
					}
				})
			)
			if (state.regionalId?.value) {
				body.Roles.push({
					RoleId: state.rolId.value,
					AlcanceId: parseInt(state.institucionId.value),
					NivelAccesoId
				})
			}
			// Lo que hay en selects de circuito
			body.Roles = body.Roles.concat(
				state.circuitosId.map(i => {
					return {
						RoleId: state.rolId.value,
						AlcanceId: i.value,
						NivelAccesoId
					}
				})
			)

			// const {error, object} = validatorCreateUsuarioRequest(body)
			// if(error ==true) return

			const url = `${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/Actualizar`
			const response: any = await axios.put(url, body)
			if (!response.data.error) {
				successMessage(
					t(
						'gestion_usuario>usuarios>usuario_actualizado_correctamente_message',
						'Usuario actualizado correctamente'
					)
				)
				clearFormData()

				toggleForm(false)
			} else {
				errorMessage(
					t(
						'gestion_usuario>usuarios>error_al_actualizar_usuario_message',
						'Error al actualizar el usuario'
					)
				)
			}
		} catch (e) {
			errorMessage(
				t(
					'gestion_usuario>usuarios>error_al_actualizar_usuario_message',
					'Error al actualizar el usuario'
				)
			)
			console.error(e)
		}
	}
	const fetchInstituciones = async inputValue => {
		try {
			const url = `${envVariables.BACKEND_URL}/api/Admin/Institucion/FindInstitucionByNombre?nombre=${inputValue}`
			const response = await axios.get<any>(url)
			if (response.data && response.data.length > 0) {
				const map = response.data.map(i => {
					return {
						label: `${i.institucion} / ${i.circuito} / ${i.regional}`,
						value: i.institucionId
					}
				})
				return map
			}
		} catch (e) {
			console.log(e)
		}
	}
	const fetchRegionales = async nombre => {
		try {
			const url = `${envVariables.BACKEND_URL}/api/Admin/Regional`
			const response = await axios.get<any>(url)
			if (response.data && response.data.length) {
				const regionales = response.data.map(i => {
					return {
						label: i.nombre,
						value: i.id
					}
				})
				return nombre && nombre != ''
					? regionales.filter(i => i.label.toUpperCase().includes(nombre.toUpperCase()))
					: regionales
			}
		} catch (e) {
			console.log(e)
		}
	}
	const fetchCircuitos = async regionalId => {
		try {
			const url = `${envVariables.BACKEND_URL}/api/Admin/Circuito/GetByRegional/${regionalId}`
			const response = await axios.get<any>(url)
			if (response.data && response.data.length) {
				const circuitos = response.data.map(i => {
					return {
						label: i.nombre,
						value: i.id
					}
				})
				return circuitos
			}
		} catch (e) {
			console.log(e)
		}
	}
	const onRegionalSelectChange = obj => {
		dispatch({ type: TYPES.SET_REGIONAL_ID, payload: obj })
		fetchCircuitos(obj.value).then(r => {
			dispatch({ type: TYPES.SET_CIRCUITOS_CATALOG, payload: r })
		})
	}
	const onRegionalMultiselectChange = (value, actionMeta) => {
		const regionalesId = [...state.regionalesId]
		switch (actionMeta.action) {
			case 'select-option':
				regionalesId.push(actionMeta.option)
				dispatch({
					type: TYPES.SET_REGIONALES_ID,
					payload: regionalesId
				})
				break
			case 'remove-value':
				const newState = regionalesId.filter(i => actionMeta.removedValue.value != i.value)
				dispatch({ type: TYPES.SET_REGIONALES_ID, payload: newState })
				break
			case 'pop-value':
				break
			case 'clear':
				dispatch({ type: TYPES.SET_REGIONALES_ID, payload: [] })
				break
		}
	}
	const onCircuitoSelectChange = obj => {
		dispatch({ type: TYPES.SET_CIRCUITO_ID, payload: obj })
	}
	const onChangeMultiselectCircuitos = (value, actionMeta) => {
		const circuitosId = [...state.circuitosId]
		switch (actionMeta.action) {
			case 'select-option':
				circuitosId.push(actionMeta.option)
				dispatch({ type: TYPES.SET_CIRCUITOS_ID, payload: circuitosId })
				break
			case 'remove-value':
				const newState = circuitosId.filter(i => actionMeta.removedValue.value != i.value)
				dispatch({ type: TYPES.SET_CIRCUITOS_ID, payload: newState })
				break
			case 'pop-value':
				break
			case 'clear':
				dispatch({ type: TYPES.SET_CIRCUITOS_ID, payload: [] })
				break
		}
	}
	const onChangeMultiselectInstituciones = (value, actionMeta, institucionesValue) => {
		const institucionesId = [...institucionesValue]
		switch (actionMeta.action) {
			case 'select-option':
				institucionesId.push(actionMeta.option)
				dispatch({
					type: TYPES.SET_INSTITUCIONES_ID,
					payload: institucionesId
				})
				break
			case 'remove-value':
				const newState = institucionesId.filter(
					i => actionMeta.removedValue.value != i.value
				)
				dispatch({
					type: TYPES.SET_INSTITUCIONES_ID,
					payload: newState
				})
				break
			case 'pop-value':
				/* if (actionMeta.removedValue.isFixed) {
				return;
			  } */
				break
			case 'clear':
				// value = colourOptions.filter((v) => v.isFixed);
				dispatch({ type: TYPES.SET_INSTITUCIONES_ID, payload: [] })
				break
		}
	}
	const setViewState = tipoRolId => {
		const viewState: VIEW_STATE = {
			showCircuito: false,
			showCompania: false,
			showDepartamento: false,
			showInstitucion: false,
			showInstitucionMulti: false,
			showRegional: false,
			showRegionalMulti: false
		}
		switch (tipoRolId) {
			case 1: // Director
				viewState.showInstitucionMulti = true
				break
			case 4: // administrativo
				viewState.showInstitucionMulti = true
				break
			case 6: // supervisor circuital
				viewState.showRegional = true
				viewState.showCircuito = true
				break
			case 5: // supervisor regional
				viewState.showRegionalMulti = true
				break
			case 7: // Nacionales
				viewState.showDepartamento = true
				break
			case 9: // Administradores nacionales
				viewState.showDepartamento = true
				break
			case 10: // Externos
				viewState.showCompania = true
				break
		}
		dispatch({ type: TYPES.SET_CONTROL_VIEW_STATE, payload: viewState })
	}
	const setFormValues = obj => {
		const formValues = {
			rolId: {},
			tipoRolId: {},
			multiselectInstitucionesValue: [],
			multiselectCircuitosValue: [],
			regionalesId: [],
			regionalId: {},
			circuitosId: [],
			circuitoId: {},
			institucionesId: [],
			fullName: '',
			tipoIdentificacionId: {},
			numeroIdentificacion: '',
			email: '',
			usuarioId: null,
			nivelAcceso: null
		}
		const getObject = (str, keyName, valueName) => {
			const arr = JSON.parse(str)
			return {
				label: arr[0][valueName],
				value: arr[0][keyName]
			}
		}
		const getArray = (str, keyName, valueName) => {
			const arr = JSON.parse(str)
			return arr.map(i => {
				return {
					label: i[valueName],
					value: i[keyName]
				}
			})
		}
		formValues.numeroIdentificacion = obj.identificacion
		formValues.fullName = obj.nombreCompleto
		formValues.email = obj.emailusuario
		formValues.usuarioId = obj.usuarioId
		formValues.tipoIdentificacionId = getObject(obj.tipoIdentificacion, 'id', 'nombre')
		// Rol
		formValues.rolId = getObject(obj.roles, 'sb_rolesId', 'nombre')
		formValues.nivelAcceso = getObject(obj.roles, 'nivelAcceso', 'nombre')?.value
		formValues.tipoRolId = getObject(obj.roles, 'tipoRolId', 'tipoRolNombre')
		// Circuitos
		formValues.circuitosId = getArray(obj.circuitos, 'id', 'nombre')
		// Instituciones
		formValues.institucionesId = getArray(obj.instituciones, 'id', 'nombre')
		// Regiones
		formValues.regionalesId = getArray(obj.regionales, 'id', 'nombre')

		dispatch({ type: TYPES.SET_FORMDATA, payload: formValues })
	}
	const onConfirmRegisterModalCallback = response => {
		if (!response) return
		const tipoIdObject = response.datos.find(i => i.catalogoId == 1)
		const tipoIdLocalObject = state.tipoIdentificacionOptions.find(
			i => i.value == tipoIdObject.elementoId
		)

		onChangeSelectTipoIdentificacion(tipoIdLocalObject)
		dispatch({
			type: TYPES.SET_NUMERO_IDENTIFICACION,
			payload: response.identificacion
		})
		fetchIdentidad(tipoIdObject.elementoId, response.identificacion)
		toggleRegisterModal(false)
	}
	const onDepartamentoSelectChange = obj => {
		dispatch({ type: TYPES.SET_DEPARTAMENTO_ID, payload: obj })
	}
	const onCompaniaSelectChange = obj => {
		dispatch({ type: TYPES.SET_COMPANIA_ID, payload: obj })
	}
	const onCreateDepartamento = nombre => {
		toggleLoading(true)
		createDepartamento(nombre).then(res => {
			fetchAllDepartamentos().then(departamentos => {
				successMessage(
					t(
						'gestion_usuario>usuarios>departamento_creado_message',
						'Departamento creado exitosamente!'
					)
				)
				const index = departamentos.findIndex(
					el => el?.el?.departamentoId === res?.departamentoId
				)
				if (index && index !== -1) {
					onDepartamentoSelectChange(departamentos[index])
				}
				toggleLoading(false)
			})
		})
	}
	const onCreateCompania = nombre => {
		toggleLoading(true)
		createEmpresas(nombre).then(res => {
			fetchAllEmpresas().then(empresas => {
				successMessage(
					t(
						'gestion_usuario>usuarios>empresa_creada_message',
						'Empresa creada exitosamente!'
					)
				)
				const index = empresas.findIndex(el => el?.el?.empresasId === res?.empresasId)
				if (index && index !== -1) {
					onCompaniaSelectChange(empresas[index])
				}
				toggleLoading(false)
			})
		})
	}
	return {
		crearUsuario,
		actualizarUsuario,
		onBtnSaveEvent,
		fetchTipoRoles,
		fetchUsuarios,
		fetchAllDepartamentos,
		fetchAllEmpresas,
		createDepartamento,
		createEmpresas,
		setActiveTab,
		handleSearch,
		activeTab: state.activeTab,
		optionTabs: state.optionTabs,
		tabs: state.tabs,
		showForm: state.showForm,
		rolOptions: state.rolOptions,
		tipoIdentificacionOptions: state.tipoIdentificacionOptions,
		onRegresarEvent,
		onChangeSelectTipoIdentificacion,
		onChangeInputNumeroIdentificacion,
		onChangeInputEmail,
		onChangeSelectRol,
		fetchInstituciones,
		fetchRegionales,
		fetchCircuitos,
		identificacion: state.numeroIdentificacion,
		tipoIdentificacionId: state.tipoIdentificacionId,
		email: state.email,
		regionalesId: state.regionalesId,
		regionalId: state.regionalId,
		circuitoId: state.circuitoId,
		circuitosId: state.circuitosId,
		institucionId: state.institucionId,
		institucionesId: state.institucionesId,
		circuitosCatalog: state.cricuitosCatalog,
		rolId: state.rolId,
		onRegionalSelectChange,
		onCircuitoSelectChange,
		onChangeMultiselectInstituciones,
		onRegionalMultiselectChange,
		viewState: state.viewControlState,
		onChangeMultiselectCircuitos,
		fullName: state.fullName,
		snackbarData,
		isEditing: state.isEditing,
		onConfirmRegisterModalCallback,
		toggleRegisterModal,
		showRegisterModal: state.showRegisterModal,
		encontrado: state.encontrado,
		loading: state.loading,
		departamentoOptions: state.departamentoOptions,
		companiaOptions: state.companiaOptions,
		onDepartamentoSelectChange,
		onCompaniaSelectChange,
		departamentoId: state.departamentoId,
		companiaId: state.companiaId,
		toggleLoading,
		onCreateDepartamento,
		onCreateCompania,
		showRolInfoModal: state.showRolInfoModal,
		toggleShowRolInfoModal,
		selectedItem: state.selectedItem,
		onRolModalClose
		// paginationObject: state.paginationObject
	}
}

export default useGestionUsuarios
