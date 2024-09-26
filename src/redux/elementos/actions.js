import { envVariables } from 'Constants/enviroment'
import axios from 'axios'
import {
	ELEMENTOS_SECTIONS_LOAD,
	ELEMENTOS_ERROR,
	ELEMENTOS_LOAD,
	ELEMENTOS_CREATE,
	ELEMENTOS_SET_ACTIVE,
	ELEMENTOS_CHANGE_STATE
} from './elementosTypes'

const loadElementosEstructura = payload => ({
	type: ELEMENTOS_LOAD,
	payload
})

const loadElementos = payload => ({
	type: ELEMENTOS_LOAD,
	payload
})

const createElementos = payload => ({
	type: ELEMENTOS_CREATE,
	payload
})

const loadElementosSections = response => ({
	type: ELEMENTOS_SECTIONS_LOAD,
	payload: response
})

const elementosError = error => ({
	type: ELEMENTOS_ERROR,
	payload: error
})

const setActive = payload => ({
	type: ELEMENTOS_SET_ACTIVE,
	payload
})

const changeStateElementos = payload => ({
	type: ELEMENTOS_CHANGE_STATE,
	payload
})

export const getElementosByTipoCatalogoId =
	tipoCatalogoId => async dispatch => {
		try {
			const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/Catalogo/GetElementosByTipo/${tipoCatalogoId}`
			)
			if (response.data.error) {
				return { data: { message: response.data.message, error: true } }
			} else {
				dispatch(loadElementos(response.data))
				return { error: false }
			}
		} catch (error) {
			dispatch(elementosError(error.message))
			return { data: { message: error.message, error: true } }
		}
	}

export const getElementosFilterText =
	(name, pageNum, pageSize) => async dispatch => {
		try {
			const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/Catalogo/GetAllbyName/${name}/${pageNum}/${pageSize}`
			)
			if (response.data.error) {
				return { data: { message: response.data.message, error: true } }
			} else {
				dispatch(loadElementos(response.data))
				return { error: false }
			}
		} catch (error) {
			dispatch(elementosError(error.message))
			return { data: { message: error.message, error: true } }
		}
	}

export const getElementosEstructura =
	(page, quantity, id) => async dispatch => {
		try {
			const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/Catalogo/paginatedElement/${page}/${quantity}/${id}`
			)

			if (response.data.error) {
				return { data: { message: response.data.message, error: true } }
			} else {
				response.data.entityList.forEach(element => {
					if (element.estado === true) {
						element.strEstado = 'ACTIVO'
					} else {
						element.strEstado = 'INACTIVO'
					}
				})
				dispatch(loadElementosEstructura(response.data))
				return { error: false }
			}
		} catch (error) {
			dispatch(elementosError(error.message))
			return { data: { message: error.message, error: true } }
		}
	}

export const getElementos = () => async dispatch => {
	try {
		const response = await axios.get(`${envVariables.BACKEND_URL}/api/Catalogo`)
		if (response.data.error) {
			return { data: { message: response.data.message, error: true } }
		} else {
			dispatch(loadElementos(response.data))
			return { error: false }
		}
	} catch (error) {
		dispatch(elementosError(error.message))
		return { data: { message: error.message, error: true } }
	}
}

export const saveElementos = data => async dispatch => {
	try {
		const response = await axios.post(
			`${envVariables.BACKEND_URL}/api/Catalogo`,
			data
		)
		if (response.data.error) {
			dispatch(elementosError(response.data.message))
			return { data: { message: response.data.message, error: true } }
		} else {
			dispatch(createElementos(response.data))
			return { error: false }
		}
	} catch (error) {
		dispatch(elementosError(error.message))
		return { data: { message: error.message, error: true } }
	}
}

export const updateElementos = data => async dispatch => {
	try {
		const response = await axios.put(
			`${envVariables.BACKEND_URL}/api/Catalogo`,
			data
		)
		if (response.data.error) {
			dispatch(elementosError(response.data.message))
			return { data: { message: response.data.message, error: true } }
		} else {
			return { data: { error: false } }
		}
	} catch (error) {
		dispatch(elementosError(error.message))
		return { data: { message: error.message, error: true } }
	}
}

export const updateStateElementos = (id, state) => async dispatch => {
	try {
		const response = await axios.put(
			`${envVariables.BACKEND_URL}/api/Catalogo/UpdateEstadoElementoCatalogo/${id}/${state}`
		)
		if (response.data.error) {
			dispatch(elementosError(response.data.message))
			return { data: { message: response.data.message, error: true } }
		} else {
			dispatch(changeStateElementos({ id, state }))
			return { error: false }
		}
	} catch (error) {
		dispatch(elementosError(error.message))
		return { data: { message: error.message, error: true } }
	}
}

export const setElementosActive = item => async (dispatch, getState) => {
	try {
		dispatch(setActive(item))
		return { error: false }
	} catch (e) {
		return { error: e.response.data.error }
	}
}
