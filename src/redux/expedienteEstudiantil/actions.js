import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import {
	ESTUDIANTE_FILTER,
	ESTUDIANTE_LOAD,
	EXPEDIENTEESTUDIANTIL_LOADING,
	ESTUDIANTE_CLEAR,
	CHANGE_COLUMN,
	CHANGE_FILTER_OPTION,
	FILTER_CLEAR
} from './types'
import { showProgress, hideProgress } from 'Utils/progress'

const loading = () => ({
	type: EXPEDIENTEESTUDIANTIL_LOADING
})
const getDataFilter = response => ({
	type: ESTUDIANTE_FILTER,
	payload: response
})

const setStudent = response => ({
	type: ESTUDIANTE_LOAD,
	payload: response
})

const cleanStudentDataFilter = () => ({
	type: FILTER_CLEAR
})

const changeColumnSearch = response => ({
	type: CHANGE_COLUMN,
	payload: response
})

const changeFilterOptionSearch = response => ({
	type: CHANGE_FILTER_OPTION,
	payload: response
})

export const getStudentDataFilter =
	(filterText, filterType, fallecidos = null, soloEstudiantes = null) =>
	async (dispatch, getState) => {
		try {
			const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/Identidad/GetByFilter/${filterText}/${filterType}${
					fallecidos !== null ? `?IncluirFallecido=${fallecidos}` : ''
				}${
					soloEstudiantes !== null
						? `${fallecidos !== null ? '&' : '?'}SoloEstudiantes=${soloEstudiantes}`
						: ''
				}`
			)
			if (response.data.error) {
				console.log('res', response)
				return response
			} else {
				dispatch(loading())
				dispatch(getDataFilter(response))
				return response
			}
		} catch (error) {
			return { data: { message: error.message, error: true } }
		}
	}

export const getStudentFilterExpediente =
	(filter = 'NULL', page = 1, size = 100, idInstitution) =>
	async dispatch => {
		try {
			showProgress()
			const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Identidad/GetByFilter/${filter}/${idInstitution}/${page}/${size}`
			)
			if (response.data.error) {
				hideProgress()
				return response
			} else {
				dispatch(loading())
				dispatch(getDataFilter(response))
				hideProgress()
				return response
			}
		} catch (error) {
			hideProgress()
			return { data: { message: error.message, error: true } }
		}
	}

export const getStudentsSCE =
	(filter = 'NULL', idInstitution, page = 1, size = 100) =>
	async dispatch => {
		try {
			showProgress()
			const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/ServicioComunal/Buscador/${filter}/${idInstitution}/${page}/${size}`
			)
			if (response.data.error) {
				hideProgress()
				return response
			} else {
				dispatch(loading())
				dispatch(getDataFilter(response))
				hideProgress()
				return response
			}
		} catch (error) {
			hideProgress()
			return { data: { message: error.message, error: true } }
		}
	}

export const getStudentFilter =
	(filter = 'NULL', page = 1, size = 100) =>
	async (dispatch, getState) => {
		try {
			showProgress()
			const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/Identidad/GetByFilter/${filter}/${page}/${size}`
			)
			if (response.data.error) {
				hideProgress()
				return response
			} else {
				dispatch(loading())
				dispatch(getDataFilter(response))
				hideProgress()
				return response
			}
		} catch (error) {
			hideProgress()
			return { data: { message: error.message, error: true } }
		}
	}

export const clearDataFilter = () => dispatch => {
	dispatch(getDataFilter({ data: [] }))
}

export const loadStudent = data => async dispatch => {
	dispatch(setStudent(data))
}

export const sendStudentData = data => async (dispatch, getState) => {
	try {
		const response = await axios.put(`${envVariables.BACKEND_URL}/api/Expedientes`, data)
		if (response.data.error) {
			return response
		} else {
			dispatch(loading())
			dispatch(getDataFilter(response))
			return response
		}
	} catch (error) {
		return { data: { message: error.message, error: true } }
	}
}

export const cleanStudentsFilter = () => dispatch => {
	dispatch(cleanStudentDataFilter())
}

export const changeColumn = data => dispatch => {
	dispatch(changeColumnSearch(data))
}

export const changeFilterOption = data => dispatch => {
	dispatch(changeFilterOptionSearch(data))
}
