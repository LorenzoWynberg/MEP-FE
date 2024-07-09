import {
	AUTH_LOADING,
	AUTH_SUCCESS,
	AUTH_FAILURE,
	AUTH_LOGOUT,
	REGISTER_USER_LOADING,
	REGISTER_USER_SUCCESS,
	REGISTER_USER_FAILURE,
	FORGOT_PASSWORD,
	CONFIRM_FORGOT_PASSWORD,
	GET_ROLE,
	SET_USER_INSTITUTION,
	SET_PERIODO_LECTIVO_BY_INSTITUTION,
	AUTH_LOAD_INSTITUTIONS,
	ROLE_ERROR,
	CREATE_PASSWORD_ERROR,
	LOAD_CURRENTDIRECTOR,
	API_VERSION,
	LOAD_CURRENT_ACCESS_ROLE,
	LOAD_ACTIVE_YEAR,
	LOAD_ACTIVE_YEARS,
	LOAD_ROLES_PERMISOS,
	LOAD_USER_DATA,
	CLEAR_CURRENT_INSTITUTION,
	AUTH_CLEAR_FAILURE
} from '../actions'
import moment from 'moment'
import { envVariables } from 'Constants/enviroment'

import axios from 'axios'
import { AccessRole } from './interfaces.ts'
const defaultInstitution = {
	id: -1,
	esPrivado: false,
	codigo: '',
	codigoPresupuestario: '',
	nombre: '',
	circuitosId: -1,
	imagen: '',
	conocidoComo: '',
	fechaFundacion: new Date(Date.now()),
	sede: false,
	centroPrimario: 0,
	observaciones: null,
	motivoEstado: '',
	historia: '',
	mision: '',
	vision: '',
	estado: false,
	estadoId: 1,
	ubicacionGeografica: null,
	provincia: null,
	canton: null,
	distrito: null,
	poblado: null,
	telefonoCentroEducativo: null,
	correoInstitucional: null
}
export const forgotPassword = () => ({
	type: FORGOT_PASSWORD
})

export const confirmForgotPassword = () => ({
	type: CONFIRM_FORGOT_PASSWORD
})

export const loginUserLoading = (payload = true) => ({
	type: AUTH_LOADING,
	payload
})

export const setDefaultInstitution = () => {
	return setInstitutionDispatch(defaultInstitution)
}

const setInstitutionDispatch = payload => ({
	type: SET_USER_INSTITUTION,
	payload
})

const setPeriodosLectivosDispatch = payload => ({
	type: SET_PERIODO_LECTIVO_BY_INSTITUTION,
	payload
})

export const loginUserSuccess = (loggedUser, history) => {
	const user = {
		rolesOrganizaciones: loggedUser.data.rolesOrganizaciones,
		userName: loggedUser.data.userName,
		token: loggedUser.data.accessToken,
		expiration: loggedUser.data.expiration,
		nombre: loggedUser.data.nombre,
		primerApellido: loggedUser.data.primerApellido,
		segundoApellido: loggedUser.data.segundoApellido
	}
	localStorage.setItem('persist:auth-refreshToken', loggedUser.data.refreshToken)
	localStorage.setItem('persist:auth-accessToken', loggedUser.data.accessToken)
	localStorage.setItem('persist:expiration', loggedUser.data.expiration)
	localStorage.setItem('persist:u', loggedUser.data.userName)
	localStorage.setItem('persist:uid', loggedUser.data.userId)
	localStorage.setItem('persist:uNombre', loggedUser.data.nombre)
	localStorage.setItem('persist:uPrimerApellido', loggedUser.data.primerApellido)
	localStorage.setItem('persist:uSegundoApellido', loggedUser.data.segundoApellido)
	return {
		type: AUTH_SUCCESS,
		payload: { user, history }
	}
}
const loadUserInstitutions = payload => ({
	type: AUTH_LOAD_INSTITUTIONS,
	payload
})

export const loginUserFailure = error => ({
	type: AUTH_FAILURE,
	payload: error
})
export const loginUserClearFailure = () => ({
	type: AUTH_CLEAR_FAILURE
})
export const registerUserLoading = () => ({
	type: REGISTER_USER_LOADING
})
export const registerUserSuccess = user => ({
	type: REGISTER_USER_SUCCESS,
	payload: user
})
export const registerUserFailure = error => ({
	type: REGISTER_USER_FAILURE,
	payload: error
})

const setCurrentYears = payload => ({
	type: LOAD_ACTIVE_YEARS,
	payload
})

export const setCurrentYear = payload => ({
	type: LOAD_ACTIVE_YEAR,
	payload
})

const loadRolesPermisos = payload => ({
	type: LOAD_ROLES_PERMISOS,
	payload
})

const loadUserData = payload => ({
	type: LOAD_USER_DATA,
	payload
})

export const clearCurrentInstitution = () => async dispatch => {
	dispatch({
		type: CLEAR_CURRENT_INSTITUTION
	})
}

export const setUserInstitution =
	(institution, dropdown = false) =>
		async (dispatch, getState) => {
			const { authObject } = getState().authUser
			try {
				!dropdown && dispatch(setInstitutionDispatch(institution))

				if (dropdown) {
					const role = authObject.user.rolesOrganizaciones.filter(
						role => role.organizacionId == institution.id
					)[0]
					dispatch(handleChangeRole(role))
				}

				// Periodos lectivos activos por institucion
				const response = await axios.get(
					`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/Institucion/GetPeriodosLectivos/${institution.id}`
				)

				dispatch(setPeriodosLectivosDispatch(response.data))
			} catch (e) {
				return { data: { message: e.message, error: true } }
			}
		}

export const updatePeriodosLectivos = institucionId => async dispatch => {
	try {
		const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/Institucion/GetPeriodosLectivos/${institucionId}`
		)

		dispatch(setPeriodosLectivosDispatch(response.data))
		return { data: response.data, error: false }
	} catch (e) {
		return { data: { message: e.message, error: true } }
	}
}

export const logoutUser = timeout => {
	localStorage.removeItem('persist:auth-refreshToken')
	localStorage.removeItem('persist:auth-accessToken')
	localStorage.removeItem('persist:expiration')
	localStorage.removeItem('persist:u')
	localStorage.removeItem('censoModalWasShown')

	return {
		type: AUTH_LOGOUT,
		payload: timeout
	}
}

const loadCurrentAccessRole = payload => ({
	type: LOAD_CURRENT_ACCESS_ROLE,
	payload
})

// Action Creators
export const sendPasswordRecovery = user => async dispatch => {
	await axios.post(`${envVariables.BACKEND_URL}/api/Authentication/password/recovery`, user)
	dispatch(forgotPassword())
}
export const ConfirmForgotPassword = user => async (dispatch, getState) => {
	const response = await axios.post(`${envVariables.BACKEND_URL}/api/Authentication/password/confirm`, user)
	dispatch(confirmForgotPassword())
	return response
}

export const getDirector = id => async dispatch => {
	dispatch(loginUserLoading())
	try {
		const response = await axios.get(`${envVariables.BACKEND_URL}/api/users/perfilDirector/${id}`)
		dispatch({
			type: LOAD_CURRENTDIRECTOR,
			payload: response.data.data
		})
	} catch (e) {
		logoutCurrentUser()
	}
}


export const desactivarServicioComunal = (id,history) => async dispatch => {
	dispatch(loginUserLoading())

	await axios.put(`${envVariables.BACKEND_URL}/api/ServicioComunal/DesactivarServicioComunal/${id}`)
	history.push('/')
}

export const createPassword = (user, history) => async dispatch => {
	dispatch(loginUserLoading())
	try {
		const loggedUser = await axios.post(envVariables.BACKEND_URL + '/api/Authentication/login/challenge/new', user)

		dispatch(loginUserSuccess(loggedUser, history))
		dispatch(getUserData(loggedUser.data.userId))
		localStorage.setItem('firstLoggin', true)
		history.push('/')
	} catch (e) {
		const message = e.message
		dispatch({
			type: CREATE_PASSWORD_ERROR,
			payload: message
		})
	}
}

export const editDirector = (data, history) => async dispatch => {
	dispatch(loginUserLoading())
	try {
		const editedDirector = await axios.post(envVariables.BACKEND_URL + '/api/users/perfil/director', data)
		dispatch({
			type: LOAD_CURRENTDIRECTOR,
			payload: editedDirector.data
		})
		history.push('/app')
	} catch (e) {
		dispatch(loginUserFailure(e.message))
		let _res
		if (e.response.status === 409) {
			_res = {
				data: {
					error: 'El correo seleccionado ya existe'
				}
			}
		} else {
			_res = {
				data: {
					error: 'Hubo un error'
				}
			}
		}

		return _res
	}
}

export const changePassword =
	(data: { username: string; currentPassword: string; newPassword: string }) => async dispatch => {
		dispatch(loginUserLoading())
		try {
			const passwordChanged = await axios.post(
				envVariables.BACKEND_URL + '/api/Areas/GestorCatalogos/UsuarioCatalogo/ChangePasswordByUsername',
				data
			)
			dispatch(loginUserLoading(false))
			dispatch(loginUserClearFailure())

			return passwordChanged
		} catch (e) {
			if (e.response) {
				dispatch(loginUserFailure(e.response.data.error))
				return { error: e.response.data.error }
			} else {
				return {
					error: 'Ha ocurrido un error no controlado al intentar cambiar contraseña'
				}
			}
		}
	}

export const changePasswordbyCurrentUser =
	(data: { username: string; currentPassword: string; newPassword: string }) => async dispatch => {
		dispatch(loginUserLoading())
		try {
			const passwordChanged = await axios.post(
				envVariables.BACKEND_URL + '/api/Areas/GestorCatalogos/UsuarioCatalogo/ChangePasswordByCurrentUsername',
				data
			)
			dispatch(loginUserLoading(false))

			return { ...passwordChanged, error: false }
		} catch (e) {
			if (e.response) {
				dispatch(loginUserFailure(e.response.data.error))
				return { error: e.response.data.error }
			} else {
				return {
					error: 'Ha ocurrido un error no controlado al intentar cambiar contraseña'
				}
			}
		}
	}

export const loginUser = (user, history) => {
	const _user = {
		grantType: 0,
		accessToken: '',
		refreshToken: '',
		userName: user.username,
		password: user.password
	}
	return async (dispatch, getState) => {
		dispatch(loginUserLoading())

		try {
			console.log('_user', _user)
			const loggedUser = await axios.post(`${envVariables.BACKEND_URL}/api/Authentication/login`, _user)
			console.log('loggedUser', loggedUser)
			dispatch(loginUserSuccess(loggedUser, history))
			dispatch(getUserData(loggedUser.data.userId))
			const globalAccess = loggedUser.data.rolesOrganizaciones.filter(rol => rol.nivelAccesoId === 4)
			dispatch(handleChangeRole(globalAccess[0] ? globalAccess[0] : loggedUser.data.rolesOrganizaciones[0]))

			dispatch(getRoles(loggedUser.data.userId))

			dispatch(getUserInstitutions())

			const isEstudiante = loggedUser.data.rolesOrganizaciones.find(
				rol => rol.rolNombre.toLowerCase() === 'estudiante'
			)
			if (isEstudiante) {
				history.push('/view/estudiante/0')
				return
			}
			const isEncargado = loggedUser.data.rolesOrganizaciones.find(
				rol => rol.rolNombre.toLowerCase() === 'encargado'
			)
			if (isEncargado) {
				history.push('/view/encargado')
				return
			}

			history.push('/app')
			return { error: false }
		} catch (e) {
			console.log('e', e)
			if (e.response) {
				const _error = e.response.data.error
				if (_error.includes('cambiar contraseña')) {
					history.push('/user/forgot-password/' + _user.userName)
					return
				}
				dispatch(loginUserFailure(_error))
			} else {
				dispatch(loginUserFailure('Ha ocurrido un error no controlado al intentar acceder.'))
			}
			return { error: true, message: e?.response?.data?.error }
		}
	}
}

export const getUserInstitutions = () => async dispatch => {
	try {
		const response = await axios.get(`${envVariables.BACKEND_URL}/api/Authentication/InstitucionesUsuario`)

		const selectedInstitution = localStorage.getItem('selectedRolInstitution')

		dispatch(loadUserInstitutions(response.data))
		if (selectedInstitution) {
			const _parsedInstitution = JSON.parse(selectedInstitution)
			dispatch(setUserInstitution(_parsedInstitution.institutionObject, false))
		} else {
			dispatch(setUserInstitution(response.data[0], false))
		}
	} catch (e) {
		dispatch({
			type: ROLE_ERROR,
			payload: e.message
		})
	}
}

export const getUserData = userId => async dispatch => {
	try {
		const response = await axios.get(`${envVariables.BACKEND_URL}/api/Authentication/Identidad/${userId}`)
		dispatch(loadUserData(response.data))
	} catch (e) {
		dispatch({
			type: ROLE_ERROR,
			payload: e.message
		})
	}
}

export const getRole = id => async dispatch => {
	dispatch(loginUserLoading())
	try {
		const role = await axios.get(`${envVariables.BACKEND_URL}/api/users/${id}/roles/`)

		dispatch({
			type: GET_ROLE,
			payload: role.data[0]
		})
	} catch (error) {
		logoutCurrentUser()
		dispatch({
			type: ROLE_ERROR,
			payload: error.message
		})
	}
}

export const logoutCurrentUser = (history, timeout) => {
	return async (dispatch, getState) => {
		dispatch(loginUserLoading())
		localStorage.removeItem('censoModalWasShown')
		const _timeOut = timeout || false
		try {
			// await axios.post(envVariables.BACKEND_URL + '/api/Authentication/logout')
			localStorage.clear()
			if (history) {
				history.push('/user/login')
			}
			dispatch(logoutUser(_timeOut))
		} catch (error) {
			localStorage.clear()
			if (history) {
				history.push('/user/login')
			}
			dispatch(logoutUser(_timeOut))
		}
	}
}

export const getApiVersion = () => async dispatch => {
	try {
		const response = await axios.get(`${envVariables.BACKEND_URL}/api/authentication/version`)
		dispatch({
			type: API_VERSION,
			payload: response.data
		})
	} catch (e) {
		dispatch({
			type: API_VERSION,
			payload: '0.0.0'
		})
	}
}

export const handleChangeRole = (organizationRole: AccessRole) => async dispatch => {
	try {
		const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Authentication/AccesosRol/${organizationRole.rolId}`
		)
		dispatch(
			loadCurrentAccessRole({
				accessRole: organizationRole,
				perfiles: response.data
			})
		)
		if (organizationRole.nivelAccesoId == 1 && organizationRole.organizacionId) {
			dispatch(handleChangeInstitution(organizationRole.organizacionId))
		} else {
			dispatch(setDefaultInstitution())
		}
	} catch (e) { }
}

export const handleChangeInstitution = (organizationId: number) => async dispatch => {
	try {
		const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/Institucion/GetById/${organizationId}`
		)
		const settings = { color: response.data.color, idioma: response.data.idioma }

		if (JSON.stringify(settings) != localStorage.getItem('institutionSetting')) {
			localStorage.setItem('institutionSetting', JSON.stringify(settings))
			// location.reload()
		}
		dispatch(setUserInstitution(response.data))
	} catch (e) { }
}

export const getActiveYears = () => async dispatch => {
	try {
		const response = await axios.get(`${envVariables.BACKEND_URL}/api/AnioEducativo/Activos`)
		const start = moment(new Date('04/01/2022 06:59:59'))
		const end = new Date(new Date('04/01/2022 08:00:00'))
		const actual = moment()
		const test = moment(actual).isBetween(start, end)
		// dispatch(setCurrentYear(response.data[0]))
		dispatch(
			setCurrentYears(
				response.data.map(year => ({
					...year,
					value: year.id,
					label: `Año educativo ${year.nombre}`
				}))
			)
		)
		dispatch({
			type: 'SHOW_CENSO_MODAL',
			payload: test
		})
	} catch (e) { }
}

export const setSelectedActiveYear = element => async dispatch => {
	dispatch(setCurrentYear(element))
}

export const getRoles = userId => async dispatch => {
	try {
		const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/GetAllPermisosbyUsuarioId/${userId}`
		)

		dispatch(loadRolesPermisos(response.data))
	} catch (e) {
		const foo = e.message
		dispatch({
			type: ROLE_ERROR,
			payload: e.message
		})
	}
}
