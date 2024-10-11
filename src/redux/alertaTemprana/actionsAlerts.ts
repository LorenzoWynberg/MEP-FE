import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import * as types from './types'
import { Dispatch } from 'redux'

const alertsContextLoading = () => ({
	type: types.ALERTS_CONTEXT_LOADING
})

const alertsContextLoad = payload => ({
	type: types.ALERTS_CONTEXT_LOAD,
	payload
})

const alertsContextError = payload => ({
	type: types.ALERTS_CONTEXT_FAIL,
	payload
})

const alertsDimensionLoading = () => ({
	type: types.ALERTS_DIMENSION_LOADING
})

const alertsDimensionLoad = payload => ({
	type: types.ALERTS_DIMENSION_LOAD,
	payload
})

const alertsDimensionError = payload => ({
	type: types.ALERTS_DIMENSION_FAIL,
	payload
})

const alertStatisticsLoading = () => ({
	type: types.ALERTS_STATISTICS_LOADING
})

const alertStatisticsLoad = payload => ({
	type: types.ALERTS_STATISTICS_LOAD,
	payload
})

const alertStatisticsError = payload => ({
	type: types.ALERTS_STATISTICS_FAIL,
	payload
})

const alertResponsibleLoading = () => ({
	type: types.ALERTS_RESPONSIBLE_LOADING
})

const alertResponsibleLoad = payload => ({
	type: types.ALERTS_RESPONSIBLE_LOAD,
	payload
})

const alertResponsibleError = payload => ({
	type: types.ALERTS_RESPONSIBLE_FAIL,
	payload
})

const getEstudiantesConAlertaDispatch = payload => ({
	type: types.GET_ESTUDIANTE_CON_ALERTA,
	payload
})

const getAlertasPorEstudianteDispatch = payload => ({
	type: types.GET_ALERTAS_POR_ESTUDIANTE,
	payload
})
const getObservacionesAlertasDispatch = payload => ({
	type: types.GET_ALERTS_OBSERVACIONES,
	payload
})
const getEstadosAlertasDispatch = payload => ({
	type: types.GET_ESTADOS_CON_ALERTA,
	payload
})

export const getEstudiantesConAlerta =
	(institutionId, textoBuscado, estadoMatricula, estadoAlerta, size = 10, page = 1) =>
	async dispatch => {
		try {
			//todo JP
			/* const res = await axios(
				`${envVariables.BACKEND_URL}/api/Alerta/GetEstudiantesConAlertasAll/${institutionId}/${textoBuscado}/${page}/${size}/${estadoMatricula}/${estadoAlerta}`
			) */

			const res = await axios(
				`${envVariables.BACKEND_URL}/api/Alerta/GetEstudiantesConAlerta/${institutionId}/${textoBuscado}/${page}/${size}/${estadoMatricula}/${estadoAlerta}`
			)

			dispatch(getEstudiantesConAlertaDispatch(res.data))
			return { error: false }
		} catch (error) {
			return { error: true }
		}
	}

export const getAlertasPorEstudiante =
	(estudianteId, size = 10, page = 1) =>
	async (dispatch, getState) => {
		const { currentInstitution } = getState().authUser

		try {
			const res = await axios(
				`${envVariables.BACKEND_URL}/api/Alerta/GetAlertasPorEstudiante/${currentInstitution.id}/${estudianteId}/${page}/${size}`
			)
			debugger
			dispatch(getAlertasPorEstudianteDispatch(res.data))
		} catch (error) {}
	}

export const getAlertStatistics = (pagina: number, cantidad: number) => async (dispatch: Dispatch) => {
	try {
		dispatch(alertStatisticsLoading())
		const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Alerta/EstadisticaGeneral?Pagina=${pagina}&Cantidad=${cantidad}`
		)
		dispatch(alertStatisticsLoad(response.data))
		return { error: false }
	} catch (error) {
		dispatch(alertStatisticsError(error.response.data.errors))
		return {
			error: true,
			message: error.message,
			errors: error.response.data.errors
		}
	}
}

export const getAlertStatisticsPaginated =
	(pagina: number, cantidad: number, type: string, search: string) => async (dispatch: Dispatch) => {
		try {
			dispatch(alertStatisticsLoading())
			const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/Alerta/EstadisticaGeneral?Pagina=${pagina}&Cantidad=${cantidad}&FiltrarPor=${type}&Filtro=${search}`
			)
			dispatch(alertStatisticsLoad(response.data))
			return { error: false }
		} catch (error) {
			dispatch(alertStatisticsError(error.response.data.errors))
			return {
				error: true,
				message: error.message,
				errors: error.response.data.errors
			}
		}
	}

export const getResponsibleAlerts = () => async (dispatch: Dispatch) => {
	try {
		dispatch(alertResponsibleLoading())
		const response = await axios.get(`${envVariables.BACKEND_URL}/api/Alerta/RolesResponsables`)
		dispatch(alertResponsibleLoad(response.data))
		return { error: false }
	} catch (error) {
		dispatch(alertResponsibleError(error.response.data.errors))
		return {
			error: true,
			message: error.message,
			errors: error.response.data.errors
		}
	}
}

export const deleteNormativa = (alertaId: number, normativaId: number) => async (dispatch: Dispatch) => {
	try {
		dispatch(alertResponsibleLoading())
		await axios.delete(`${envVariables.BACKEND_URL}/api/Alerta/${alertaId}/Normativa/${normativaId}`)
		return { error: false }
	} catch (error) {
		return {
			error: true,
			message: error.response.data.error
		}
	}
}

export const getAlertsContext = () => async (dispatch: Dispatch) => {
	try {
		dispatch(alertsContextLoading())
		const response = await axios.get(`${envVariables.BACKEND_URL}/api/Alerta/AlertaContexto`)
		dispatch(alertsContextLoad(response.data))
		return { error: false }
	} catch (error) {
		dispatch(alertsContextError(error.response.data.errors))
		return {
			error: true,
			message: error.message,
			errors: error.response.data.errors
		}
	}
}

export const getAlertsDimensionByContext = (contextoId: number) => async (dispatch: Dispatch) => {
	try {
		dispatch(alertsDimensionLoading())
		const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Alerta/AlertaContexto/${contextoId}/Dimensiones`
		)
		dispatch(alertsDimensionLoad(response.data))
		return { error: false }
	} catch (error) {
		dispatch(alertsDimensionError(error.message))
		return {
			error: true,
			message: error.message,
			errors: error.response.data.errors
		}
	}
}
export const getObservacionesAlertas = (alertaId: number) => async (dispatch: Dispatch) => {
	try {
		dispatch(alertsDimensionLoading())
		const response = await axios.get(`${envVariables.BACKEND_URL}/api/Alerta/AlertaObservaciones/${alertaId}`)
		dispatch(getObservacionesAlertasDispatch(response.data))
		return { error: false }
	} catch (error) {
		return {
			error: true,
			message: error.message,
			errors: error.response.data.errors
		}
	}
}
export const getEstadosAlerta = () => async (dispatch: Dispatch) => {
	try {
		dispatch(alertsDimensionLoading())
		const response = await axios.get(`${envVariables.BACKEND_URL}/api/Alerta/estados`)
		dispatch(getEstadosAlertasDispatch(response.data))
		return { error: false }
	} catch (error) {
		return {
			error: true,
			message: error.message,
			errors: error.response.data.errors
		}
	}
}
export const getAccionAlerta = accionId => async () => {
	try {
		const response = await axios.get(`${envVariables.BACKEND_URL}/api/Alerta/accionAlerta/${accionId}`)
		return { error: false, data: response.data }
	} catch (error) {
		return {
			error: true,
			message: error.message,
			errors: error?.response?.data?.errors
		}
	}
}
export const getAlertaEstudiante = alertaId => async (dispatch, getState) => {
	try {
		const { currentInstitution } = getState().authUser

		const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Alerta/alertasPorEstudiante/${currentInstitution.id}/${alertaId}`
		)
		return { error: false, data: response.data }
	} catch (error) {
		return {
			error: true,
			message: error.message,
			errors: error?.response?.data?.errors
		}
	}
}
export const saveAccionAlerta = data => async (dispatch: Dispatch) => {
	try {
		dispatch(alertsDimensionLoading())
		const response = await axios.post(`${envVariables.BACKEND_URL}/api/Alerta/AccionAlerta`, data)
		return { error: false, data: response.data }
	} catch (error) {
		return {
			error: true,
			message: error.message,
			errors: error?.response?.data?.errors
		}
	}
}

export const uploadFicha = async (file, cb) => {
	const data = new FormData()
	data.append('files', file)
	try {
		const response = await axios.post(`${envVariables.BACKEND_URL}/api/File/resources`, data, {
			onUploadProgress: cb
		})
		return response.data[0]
	} catch (e) {
		return { message: e.message, error: true }
	}
}
