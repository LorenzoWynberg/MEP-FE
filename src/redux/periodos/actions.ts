import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import * as types from './types'
import { handleErrors } from '../../utils/handleErrors'
import Periodos from '../../views/app/admin/AnioEducativo/_partials/Periodos/index'
import { constants } from 'fs/promises'

const loading = () => ({
	type: types.PERIODO_LOADING
})

const loadPeriodos = payload => ({
	type: types.PERIODO_LOAD,
	payload
})
const loadPeriodosCalendar = payload => ({
	type: types.PERIODO_LOAD_BY_CALENDAR,
	payload
})
const getPeriodo = payload => ({
	type: types.PERIODO_GET,
	payload
})
const putPeriodo = payload => ({
	type: types.PERIODO_EDIT,
	payload
})
const disabledPeriodo = payload => ({
	type: types.PERIODO_DISABLED,
	payload
})
const deletePeriodoCalendario = payload => ({
	type: types.PERIODO_DISABLED,
	payload
})
const changeState = payload => ({
	type: types.PERIODO_CHANGE_STATE,
	payload
})
const postPeriodo = payload => ({
	type: types.PERIODO_SAVE,
	payload
})

const failPeriodos = payload => ({
	type: types.PERIODO_ERROR,
	payload
})
const clearPeriodo = () => ({
	type: types.PERIODO_CLEAR_ACTIVE
})

const loadAllPeriodos = payload => ({
	type: types.PERIODO_GET_ALL,
	payload
})

const cleanPeriodos = () => ({
	type: types.PERIODO_CLEAR
})
const setBloquesPeriodo = payload => ({
	type: 'PERIODO_GET_BLOQUES_SELECTED',
	payload
})
const clearBloquesPeriodo = () => ({
	type: 'PERIODO_CLEAR_BLOQUES_SELECTED'
})

export const getPeriodos = calendarioId => async dispatch => {
	try {
		dispatch(loading())
		const response = await axios.get(`${envVariables.BACKEND_URL}/api/Periodo/getAll`)
		dispatch(loadPeriodos(response.data))
		return { error: false }
	} catch (e) {
		dispatch(failPeriodos(handleErrors(e)))
		return { error: e.message }
	}
}

export const getFechasBloque = (periodoId, calendarioId) => async dispatch => {
	try {
		dispatch(loading())
		const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Periodo/GetBloquesFechas/${periodoId}/${calendarioId}`
		)
		dispatch(setBloquesPeriodo(response.data))
		return { error: false }
	} catch (e) {
		dispatch(failPeriodos(handleErrors(e)))
		return { error: e.message }
	}
}
export const cleanFechasBloque = () => async dispatch => {
	try {
		dispatch(clearBloquesPeriodo())
		return { error: false }
	} catch (e) {
		dispatch(failPeriodos(handleErrors(e)))
		return { error: e.message }
	}
}

export const getPeriodosbyCalendar = calendarioId => async dispatch => {
	try {
		dispatch(loading())
		const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Periodo/GetAllPeriodoByCalendario/${calendarioId}`
		)
		dispatch(loadPeriodosCalendar(response.data))
		return { error: false }
	} catch (e) {
		dispatch(failPeriodos(handleErrors(e)))
		return { error: e.message }
	}
}

export const getAllPeriodos = () => async dispatch => {
	try {
		dispatch(loading())
		const response = await axios.get(`${envVariables.BACKEND_URL}/api/Periodo/getAll`)
		dispatch(loadAllPeriodos(response.data))
	} catch (e) {
		dispatch(failPeriodos(handleErrors(e)))
		return { error: e.message }
	}
}

export const GetByIdAnio = id => async dispatch => {
	try {
		dispatch(loading())
		const response = await axios.get(`${envVariables.BACKEND_URL}/api/Periodo/GetByIdAnio/${id}`)
		dispatch(loadAllPeriodos(response.data))
	} catch (e) {
		dispatch(failPeriodos(handleErrors(e)))
		return { error: e.message }
	}
}

export const getPeriodoById = id => async dispatch => {
	try {
		dispatch(loading())
		const response = await axios.get(`${envVariables.BACKEND_URL}/api/Periodo/GetByIdJoin/${id}`)
		dispatch(getPeriodo(response.data))
		return { error: false }
	} catch (e) {
		dispatch(failPeriodos(handleErrors(e)))
		return { error: e.message }
	}
}
export const setPeriodo = data => async dispatch => {
	try {
		dispatch(getPeriodo(data))
	} catch (e) {
		dispatch(failPeriodos(handleErrors(e)))
		return { error: e.message }
	}
}
export const clearPeriodoActivo = () => async dispatch => {
	try {
		dispatch(clearPeriodo())
	} catch (e) {
		dispatch(failPeriodos(handleErrors(e)))
		return { error: e.message }
	}
}
export const removeBlockFromPeriod = id => async dispatch => {
	try {
		dispatch(loading())
		const response = await axios.delete(`${envVariables.BACKEND_URL}/api/Periodo/deleteBloquePeriodo/${id}`)
		return { error: false, data: response.data, message: '' }
	} catch (e) {
		dispatch(failPeriodos(handleErrors(e)))
		return {
			error: true,
			data: null,
			message: e.response.message || e.response.data.error || e.message
		}
	}
}
export const getBlocksFromPeriod = id => async (dispatch, getState) => {
	try {
		const { periodosAll } = getState().periodos
		dispatch(loading())
		const response = await axios.get(`${envVariables.BACKEND_URL}/api/Periodo/getBloquesPeriodo/${id}`)

		const newData = periodosAll.map(x => {
			return {
				...x,
				bloques: response.data
			}
		})
		dispatch(loadAllPeriodos(newData))

		return { error: false, data: response.data, message: '' }
	} catch (e) {
		dispatch(failPeriodos(handleErrors(e)))
		return {
			error: true,
			data: null,
			message: e.response.message || e.response.data.error || e.message
		}
	}
}
export const savePeriodo = data => async dispatch => {
	try {
		dispatch(loading())
		const response = await axios.post(`${envVariables.BACKEND_URL}/api/Periodo`, data)
		dispatch(postPeriodo(response.data))
		return { error: false }
	} catch (e) {
		dispatch(failPeriodos(handleErrors(e)))
		return {
			error: e.response.message || e.response.data.error || e.message
		}
	}
}
export const saveFechaPeriodoPeriodo = data => async (dispatch, getState) => {
	try {
		dispatch(loading())
		const response = await axios.post(`${envVariables.BACKEND_URL}/api/Periodo/FechaBloquePeriodo`, data)
		dispatch(setBloquesPeriodo(response.data))
		return { error: false }
	} catch (e) {
		dispatch(failPeriodos(handleErrors(e)))
		return {
			error: e.response.message || e.response.data.error || e.message
		}
	}
}

export const updatePeriodo = data => async (dispatch, getState) => {
	try {
		dispatch(loading())
		const response = await axios.put(`${envVariables.BACKEND_URL}/api/Periodo`, data)
		dispatch(putPeriodo(response.data))
		return { error: false }
	} catch (e) {
		dispatch(failPeriodos(handleErrors(e)))
		return {
			error: e.response.message || e.response.data.error || e.message
		}
	}
}
export const deletePeriodo = id => async (dispatch, getState) => {
	try {
		dispatch(loading())
		const res = await axios.delete(`${envVariables.BACKEND_URL}/api/Periodo/${id}`)
		dispatch(disabledPeriodo(id))
		return { error: false }
	} catch (e) {
		dispatch(failPeriodos(handleErrors(e)))
		return { error: e.response.data.error || e.message }
	}
}
export const deleteBloquePeriodo = id => async (dispatch, getState) => {
	try {
		dispatch(loading())
		await axios.delete(`${envVariables.BACKEND_URL}/api/FechaPeriodoCalendario/${id}`)
		dispatch(deletePeriodoCalendario(id))
		return { error: false }
	} catch (e) {
		dispatch(failPeriodos(handleErrors(e)))
		return { error: e.message }
	}
}
export const changeStatePerido = (id, state) => async (dispatch, getState) => {
	try {
		dispatch(loading())
		await axios.put(`${envVariables.BACKEND_URL}/api/Periodo/UpdateEstadoPeriodo/${id}/${state}`)
		dispatch(changeState({ id, state }))
		return { error: false }
	} catch (e) {
		dispatch(failPeriodos(handleErrors(e)))
		return { error: e.message }
	}
}
export const clearPeriodos = () => async (dispatch, getState) => {
	try {
		dispatch(cleanPeriodos())
		return { error: false }
	} catch (e) {
		dispatch(failPeriodos(handleErrors(e)))
		return { error: e.message }
	}
}
export const habilitaDeshabilitaPeriodo = id => async dispatch => {
	try {
		const response = await axios.put(`${envVariables.BACKEND_URL}/api/Periodo/HabilitarDeshabilitar/${id}`)
		return response.data
	} catch (e) {
		return {
			error: e.response.message || e.response.data.error || e.message
		}
	}
}
export const desvincularPeriodoCalendario = (id, calendarioId) => async dispatch => {
	try {
		await axios.delete(`${envVariables.BACKEND_URL}/api/Periodo/desvincularPeriodoCalendario/${id}/${calendarioId}`)
		return { error: false }
	} catch (e) {
		return {
			error: e.response.message || e.response.data.error || e.message
		}
	}
}
