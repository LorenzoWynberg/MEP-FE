import {
	MATRICULA_APOYOS_LOADING,
	MATRICULA_APOYOS_LOADING_ITEMS,
	MATRICULA_APOYOS_LOAD_TIPOS,
	MATRICULA_APOYOS_LOAD_DEPENDENCIAS,
	MATRICULA_APOYOS_LOAD_CATEGORIAS,
	MATRICULA_APOYOS_LOAD_APOYOS,
	MATRICULA_APOYOS_LOAD_DISCAPACIDADES,
	MATRICULA_APOYOS_LOAD_RECURSOS,
	MATRICULA_APOYOS_LOAD_CONDICIONES,
	MATRICULA_APOYOS_CLEAR_CURRENT_DISCAPACIDADES,
	MATRICULA_APOYOS_CLEAR_CURRENT_APOYOS,
	MATRICULA_APOYOS_ADD,
	MATRICULA_APOYOS_EDIT,
	MATRICULA_APOYOS_DISCAPACIDADES_SAVE,
	MATRICULA_APOYOS_CONDICIONES_SAVE,
	MATRICULA_APOYOS_DISCAPACIDADES_RECURSOS_SAVE,
	MATRICULA_APOYOS_CONDICIONES_RECURSOS_SAVE,
	MATRICULA_APOYOS_DISCAPACIDADES_RECURSOS_DELETE,
	MATRICULA_APOYOS_CONDICIONES_RECURSOS_DELETE,
	MATRICULA_APOYOS_DELETE,
	MATRICULA_LOAD_APOYOS_RECIBIDOS,
	MATRICULA_CLEAR_CURRENT_APOYOS_RECIBIDOS,
	MATRICULA_APOYOS_RECIBIDOS_SAVE,
	MATRICULA_LOAD_APOYOS_NO_RECIBIDOS,
	MATRICULA_CLEAR_CURRENT_APOYOS_NO_RECIBIDOS,
	MATRICULA_APOYOS_NO_RECIBIDOS_SAVE,
	MATRICULA_APOYOS_RECIBIDOS_ADD,
	MATRICULA_APOYOS_RECIBIDOS_EDIT,
	MATRICULA_APOYOS_RECIBIDOS_DELETE,
	MATRICULA_APOYOS_NO_RECIBIDOS_ADD,
	MATRICULA_APOYOS_NO_RECIBIDOS_EDIT,
	MATRICULA_APOYOS_NO_RECIBIDOS_DELETE,
	MATRICULA_LOAD_VER_APOYOS_RECIBIDOS,
	MATRICULA_CLEAR_CURRENT_VER_APOYOS_RECIBIDOS,
	MATRICULA_VER_APOYOS_RECIBIDOS_SAVE,
	MATRICULA_LOAD_VER_APOYOS_NO_RECIBIDOS,
	MATRICULA_CLEAR_CURRENT_VER_APOYOS_NO_RECIBIDOS,
	MATRICULA_VER_APOYOS_NO_RECIBIDOS_SAVE,
	MATRICULA_VER_APOYOS_RECIBIDOS_ADD,
	MATRICULA_VER_APOYOS_NO_RECIBIDOS_ADD
} from './types'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'

const editApoyos = (index, payload, name) => ({
	type: MATRICULA_APOYOS_EDIT,
	index,
	payload,
	name
})

const addApoyos = (payload, name) => ({
	type: MATRICULA_APOYOS_ADD,
	payload,
	name
})

const deleteApoyos = (payload, name) => ({
	type: MATRICULA_APOYOS_DELETE,
	payload,
	name
})
const editApoyosRecibidos = (index, payload, name) => ({
	type: MATRICULA_APOYOS_RECIBIDOS_EDIT,
	index,
	payload,
	name
})

const addApoyosRecibidos = (payload, name) => ({
	type: MATRICULA_APOYOS_RECIBIDOS_ADD,
	payload,
	name
})

const deleteApoyosRecibidos = (payload, name) => ({
	type: MATRICULA_APOYOS_RECIBIDOS_DELETE,
	payload,
	name
})
const editApoyosNoRecibidos = (index, payload, name) => ({
	type: MATRICULA_APOYOS_NO_RECIBIDOS_EDIT,
	index,
	payload,
	name
})

const addApoyosNoRecibidos = (payload, name) => ({
	type: MATRICULA_APOYOS_NO_RECIBIDOS_ADD,
	payload,
	name
})

const deleteApoyosNoRecibidos = (payload, name) => ({
	type: MATRICULA_APOYOS_NO_RECIBIDOS_DELETE,
	payload,
	name
})

// const editApoyosRecibidos = (index, payload, name) => ({
//   type: MATRICULA_APOYOS_RECIBIDOS_EDIT,
//   index,
//   payload,
//   name
// })

const addVerApoyosRecibidos = (payload, name) => ({
	type: MATRICULA_VER_APOYOS_RECIBIDOS_ADD,
	payload,
	name
})

// const deleteApoyosRecibidos = (payload, name) => ({
//   type: MATRICULA_APOYOS_RECIBIDOS_DELETE,
//   payload,
//   name
// })
// const editApoyosNoRecibidos = (index, payload, name) => ({
//   type: MATRICULA_APOYOS_NO_RECIBIDOS_EDIT,
//   index,
//   payload,
//   name
// })

const addVerApoyosNoRecibidos = (payload, name) => ({
	type: MATRICULA_VER_APOYOS_NO_RECIBIDOS_ADD,
	payload,
	name
})

// const deleteApoyosNoRecibidos = (payload, name) => ({
//   type: MATRICULA_APOYOS_NO_RECIBIDOS_DELETE,
//   payload,
//   name
// })
const saveApoyosDiscapacidades = payload => ({
	type: MATRICULA_APOYOS_DISCAPACIDADES_SAVE,
	payload
})
const saveApoyosCondiciones = payload => ({
	type: MATRICULA_APOYOS_CONDICIONES_SAVE,
	payload
})
const saveApoyosDiscapacidadesRecursos = payload => ({
	type: MATRICULA_APOYOS_DISCAPACIDADES_RECURSOS_SAVE,
	payload
})
const saveApoyosCondicionesRecursos = payload => ({
	type: MATRICULA_APOYOS_CONDICIONES_RECURSOS_SAVE,
	payload
})
const deleteApoyosDiscapacidadesRecursos = payload => ({
	type: MATRICULA_APOYOS_DISCAPACIDADES_RECURSOS_DELETE,
	payload
})
const deleteApoyosCondicionesRecursos = payload => ({
	type: MATRICULA_APOYOS_CONDICIONES_RECURSOS_DELETE,
	payload
})

const loading = payload => ({
	type: MATRICULA_APOYOS_LOADING,
	payload
})

const loadingApoyos = payload => ({
	type: MATRICULA_APOYOS_LOADING_ITEMS,
	payload
})

const loadTypes = payload => ({
	type: MATRICULA_APOYOS_LOAD_TIPOS,
	payload
})

const loadDependencias = payload => ({
	type: MATRICULA_APOYOS_LOAD_DEPENDENCIAS,
	payload
})

const loadCategories = payload => ({
	type: MATRICULA_APOYOS_LOAD_CATEGORIAS,
	payload
})

export const loadDiscapacidades = payload => ({
	type: MATRICULA_APOYOS_LOAD_DISCAPACIDADES,
	payload
})
export const loadApoyosRecibidos = payload => ({
	type: MATRICULA_LOAD_APOYOS_RECIBIDOS,
	payload
})
export const loadApoyosNoRecibidos = payload => ({
	type: MATRICULA_LOAD_APOYOS_NO_RECIBIDOS,
	payload
})
export const loadVerApoyosRecibidos = payload => ({
	type: MATRICULA_LOAD_VER_APOYOS_RECIBIDOS,
	payload
})
export const loadVerApoyosNoRecibidos = payload => ({
	type: MATRICULA_LOAD_VER_APOYOS_NO_RECIBIDOS,
	payload
})
const loadCondiciones = payload => ({
	type: MATRICULA_APOYOS_LOAD_CONDICIONES,
	payload
})

const loadApoyos = (data, name) => ({
	type: MATRICULA_APOYOS_LOAD_APOYOS,
	payload: {
		data,
		name
	}
})

const loadResources = (data, name) => ({
	type: MATRICULA_APOYOS_LOAD_RECURSOS,
	payload: {
		data,
		name
	}
})

const clearDiscapacidades = () => ({
	type: MATRICULA_APOYOS_CLEAR_CURRENT_DISCAPACIDADES
})
const clearApoyosRecibidos = () => ({
	type: MATRICULA_CLEAR_CURRENT_APOYOS_RECIBIDOS
})
const clearApoyosNoRecibidos = () => ({
	type: MATRICULA_CLEAR_CURRENT_APOYOS_NO_RECIBIDOS
})
const clearVerApoyosRecibidos = () => ({
	type: MATRICULA_CLEAR_CURRENT_VER_APOYOS_RECIBIDOS
})
const clearVerApoyosNoRecibidos = () => ({
	type: MATRICULA_CLEAR_CURRENT_VER_APOYOS_NO_RECIBIDOS
})

export const addApoyo = (data, categoryKeyName) => async dispatch => {
	loadingApoyos(categoryKeyName)
	try {
		dispatch(addApoyos(data, categoryKeyName))
		return { error: false }
	} catch (e) {
		return { error: e.message }
	}
}

export const editApoyo = (index, data, categoryKeyName) => async dispatch => {
	try {
		dispatch(editApoyos(index, data, categoryKeyName))
		return { error: false }
	} catch (e) {
		return { error: e.message }
	}
}

export const deleteApoyo = (index, categoryKeyName) => async dispatch => {
	try {
		dispatch(deleteApoyos(index, categoryKeyName))
		return { error: false }
	} catch (e) {
		return { error: e.message }
	}
}

export const addApoyoRecibido = (data, categoryKeyName) => async dispatch => {
	loadingApoyos(categoryKeyName)
	try {
		dispatch(addApoyosRecibidos(data, categoryKeyName))
		return { error: false }
	} catch (e) {
		return { error: e.message }
	}
}

export const editApoyoRecibido = (index, data, categoryKeyName) => async dispatch => {
	try {
		dispatch(editApoyosRecibidos(index, data, categoryKeyName))
		return { error: false }
	} catch (e) {
		return { error: e.message }
	}
}

export const deleteApoyoRecibido = (index, categoryKeyName) => async dispatch => {
	try {
		dispatch(deleteApoyosRecibidos(index, categoryKeyName))
		return { error: false }
	} catch (e) {
		return { error: e.message }
	}
}

export const addVerApoyoRecibido = (data, categoryKeyName) => async dispatch => {
	loadingApoyos(categoryKeyName)
	try {
		dispatch(addVerApoyosRecibidos(data, categoryKeyName))
		return { error: false }
	} catch (e) {
		return { error: e.message }
	}
}

export const editVerApoyoRecibido = (index, data, categoryKeyName) => async dispatch => {
	try {
		dispatch(editVerApoyosRecibidos(index, data, categoryKeyName))
		return { error: false }
	} catch (e) {
		return { error: e.message }
	}
}

export const deleteVerApoyoRecibido = (index, categoryKeyName) => async dispatch => {
	try {
		dispatch(deleteVerApoyosRecibidos(index, categoryKeyName))
		return { error: false }
	} catch (e) {
		return { error: e.message }
	}
}

export const addApoyoNoRecibido = (data, categoryKeyName) => async dispatch => {
	loadingApoyos(categoryKeyName)
	try {
		dispatch(addApoyosNoRecibidos(data, categoryKeyName))
		return { error: false }
	} catch (e) {
		return { error: e.message }
	}
}

export const editApoyoNoRecibido = (index, data, categoryKeyName) => async dispatch => {
	try {
		dispatch(editApoyosNoRecibidos(index, data, categoryKeyName))
		return { error: false }
	} catch (e) {
		return { error: e.message }
	}
}

export const deleteApoyoNoRecibido = (index, categoryKeyName) => async dispatch => {
	try {
		dispatch(deleteApoyosNoRecibidos(index, categoryKeyName))
		return { error: false }
	} catch (e) {
		return { error: e.message }
	}
}

export const addVerApoyoNoRecibido = (data, categoryKeyName) => async dispatch => {
	loadingApoyos(categoryKeyName)
	try {
		dispatch(addVerApoyosNoRecibidos(data, categoryKeyName))
		return { error: false }
	} catch (e) {
		return { error: e.message }
	}
}

export const editVerApoyoNoRecibido = (index, data, categoryKeyName) => async dispatch => {
	try {
		dispatch(editVerApoyosNoRecibidos(index, data, categoryKeyName))
		return { error: false }
	} catch (e) {
		return { error: e.message }
	}
}

export const deleteVerApoyoNoRecibido = (index, categoryKeyName) => async dispatch => {
	try {
		dispatch(deleteVerApoyosNoRecibidos(index, categoryKeyName))
		return { error: false }
	} catch (e) {
		return { error: e.message }
	}
}

export const getTiposApoyos = () => async dispatch => {
	dispatch(loading(true))
	try {
		const response = await axios.get(`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/TipoApoyo`)
		dispatch(loadTypes(response.data))
	} catch (e) {
		return { error: true, message: e.message }
	}
}

export const getDependenciasApoyos = () => async dispatch => {
	dispatch(loading(true))
	try {
		const response = await axios.get(`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/DependenciaApoyo`)
		dispatch(loadDependencias(response.data))
	} catch (e) {
		return { error: true, message: e.message }
	}
}

export const getCategoriasApoyos = () => async dispatch => {
	dispatch(loading(true))
	try {
		const response = await axios.get(`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/CategoriaApoyo`)
		dispatch(loadCategories(response.data))
	} catch (e) {
		return { error: true, message: e.message }
	}
}

export const getApoyosByType = (identidad, page, quantity, type) => async dispatch => {
	dispatch(loading(true))
	dispatch(loadingApoyos(type.nombre.replace(/\s/g, '') + `${type.id}`))
	try {
		const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Apoyo/categoria/${type.id}/${page}/${quantity}?identidadId=${identidad}`
		)
		const responseData = {
			...response.data,
			errors: [],
			fields: [],
			currentApoyoId: null,
			loading: false
		}
		dispatch(loadApoyos(responseData, type.nombre.replace(/\s/g, '') + `${type.id}`))
	} catch (e) {
		return { error: true, message: e.message }
	}
}

export const getDiscapacidades = identidad => async dispatch => {
	try {
		const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/DiscapacidadesPorUsuario/GetByIdentityId/${identidad}`
		)
		dispatch(loadDiscapacidades(response.data))
	} catch (e) {
		return { error: true, message: e.message }
	}
}
//se agregan para obtener los apoyos recibidos
export const getTiposApoyosRecibidos = identidad => async dispatch => {
	try {
		const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Apoyo/GetByApoyoRecibidoIdJoin/${identidad}`
		)
		dispatch(loadApoyosRecibidos(response.data))
	} catch (e) {
		return { error: true, message: e.message }
	}
}
//se agregan para obtener los apoyos recibidos en el modal ver estudiante
export const getVerApoyosRecibidos = identidad => async dispatch => {
	try {
		const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Apoyo/GetVerApoyoRecibidoIdJoin/${identidad}`
		)
		dispatch(loadVerApoyosRecibidos(response.data))
	} catch (e) {
		return { error: true, message: e.message }
	}
}
//se agregan para obtener los apoyos no recibidos
export const getTiposApoyosNoRecibidos = identidad => async dispatch => {
	try {
		const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Apoyo/GetByApoyoNoRecibidoIdJoin/${identidad}`
		)
		dispatch(loadApoyosNoRecibidos(response.data))
	} catch (e) {
		return { error: true, message: e.message }
	}
}
//se agregan para obtener los apoyos no recibidos en el modal ver estudiante
export const getVerApoyosNoRecibidos = identidad => async dispatch => {
	try {
		const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Apoyo/GetVerApoyoNoRecibidoIdJoin/${identidad}`
		)
		dispatch(loadVerApoyosNoRecibidos(response.data))
	} catch (e) {
		return { error: true, message: e.message }
	}
}
export const getCondiciones = identidad => async dispatch => {
	try {
		const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/CondicionesPorUsuario/GetByIdentidad/${identidad}`
		)
		dispatch(loadCondiciones(response.data))
	} catch (e) {
		return { error: true, message: e.message }
	}
}

export const getResources = (type, identidadId) => async dispatch => {
	const url =
		type === 'discapacidades'
			? `${envVariables.BACKEND_URL}/api/RecursosDiscapacidad/GetByIdentidad/${identidadId}`
			: `${envVariables.BACKEND_URL}/api/RecursosCondicion/GetRecursosByCondicion/${identidadId}`
	const name = type === 'discapacidades' ? 'recursosDiscapacidadesIdentidad' : 'recursosCondicionesIdentidad'
	try {
		const response = await axios.get(url)
		dispatch(loadResources(response.data || [], name))
		return { error: false }
	} catch (e) {
		return { error: e.message }
	}
}

export const saveDiscapacidades = data => async dispatch => {
	try {
		dispatch(saveApoyosDiscapacidades(data))
		return {
			error: false,
			message: ''
		}
	} catch (e) {
		return {
			error: true,
			message: e.message
		}
	}
}
export const saveDiscapacidadesRecursos = data => async dispatch => {
	try {
		dispatch(saveApoyosDiscapacidadesRecursos(data))
		return {
			error: false,
			message: ''
		}
	} catch (e) {
		return {
			error: true,
			message: e.message
		}
	}
}

export const deleteDiscapacidadesRecursos = index => async dispatch => {
	try {
		dispatch(deleteApoyosDiscapacidadesRecursos(index))
		return {
			error: false,
			message: ''
		}
	} catch (e) {
		return {
			error: true,
			message: e.message
		}
	}
}

export const saveCondiciones = data => async dispatch => {
	try {
		dispatch(saveApoyosCondiciones(data))
		return {
			error: false,
			message: ''
		}
	} catch (e) {
		return {
			error: true,
			message: e.message
		}
	}
}
export const saveCondicionesRecursos = data => async dispatch => {
	try {
		dispatch(saveApoyosCondicionesRecursos(data))
		return {
			error: false,
			message: ''
		}
	} catch (e) {
		return {
			error: true,
			message: e.message
		}
	}
}
export const deleteCondicionesRecursos = index => async dispatch => {
	try {
		dispatch(deleteApoyosCondicionesRecursos(index))
		return {
			error: false,
			message: ''
		}
	} catch (e) {
		return {
			error: true,
			message: e.message
		}
	}
}

export const clearCurrentDiscapacidades = () => dispatch => {
	dispatch(clearDiscapacidades())
}

export const clearCurrentApoyosRecibidos = () => dispatch => {
	dispatch(clearApoyosRecibidos())
}
export const clearCurrentApoyosNoRecibidos = () => dispatch => {
	dispatch(clearApoyosNoRecibidos())
}
