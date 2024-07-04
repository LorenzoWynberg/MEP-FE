import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import * as types from './types'
import { Dispatch } from 'redux'

const alertsLoading = () => ({
  type: types.ALERTS_LOADING
})

const alertsErrors = (payload) => ({
  type: types.ALERTS_ERRROS,
  payload
})

const loading = () => ({
  type: types.EARLY_ALERT_LOAD
})

const setAlert = (payload) => ({
  type: types.ALERT_LOAD,
  payload
})

const getDataFilter = (response) => ({
  type: types.EARLY_ALERT_FILTER,
  payload: response
})

const cleanAlertDataFilter = () => ({
  type: types.EARLY_ALERT_CLEAR
})

const changeColumnSearch = (response) => ({
  type: types.CHANGE_COLUMN,
  payload: response
})

const changeFilterOptionSearch = (response) => ({
  type: types.CHANGE_FILTER_OPTION,
  payload: response
})

const loadingContexto = () => ({
  type: types.CONTEXTS_LOADING
})

const loadContextoInterno = (payload) => ({
  type: types.CONTEXTS_INTERNO_LOAD,
  payload
})

const loadContextoExterno = (payload) => ({
  type: types.CONTEXTS_EXTERNO_LOAD,
  payload
})

const errorContexto = (payload) => ({
  type: types.CONTEXTS_ERROR,
  payload
})

const loadingStatistics = () => ({
  type: types.STATISTICS_LOADING
})

const loadStatisticsAlerts = (payload) => ({
  type: types.STATISTICS_ALERTS_LOAD,
  payload
})

const loadStatisticsAlertsEnrollment = (payload) => ({
  type: types.STATISTICS_ALERTS_ENROLLMENT_LOAD,
  payload
})

const loadStatisticsAlertsPercent = (payload) => ({
  type: types.STATISTICS_ALERTS_PERCENT,
  payload
})

const loadStatisticsAlertsIncident = (payload) => ({
  type: types.STATISTICS_ALERTS_INCIDENTS,
  payload
})

const errorStatistics = (payload) => ({
  type: types.STATISTICS_ERROR,
  payload
})

const loadAlertsCatalog = (payload) => ({
  type: types.ALERTS_CATALOG_LOAD,
  payload
})

const errorAlertsCatalog = (payload) => ({
  type: types.ALERTS_CATALOG_FAIL,
  payload
})
const alertsDimensionLoad = (payload) => ({
  type: types.ALERTS_DIMENSION_LOAD,
  payload
})

export const cleanAlert = () => async (dispatch) => {
  dispatch({
    type: types.ALERTS_CLEAR
  })
}

export const downloadReportFile = async (name: string, resource: string) => {
  try {
    axios({
      url: `${envVariables.BACKEND_URL}/api/Alerta/Estadistica/${resource}`,
      method: 'GET',
      responseType: 'blob'
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${name}.xlsx`)
      document.body.appendChild(link)
      link.click()
    })
  } catch (error) {
    return {
      error: true
    }
  }
}

export const getContexts = (contexto: string) => async (dispatch) => {
  try {
    dispatch(loadingContexto())
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Alerta/Estadistica/Contexto/${contexto}`
    )
    if (contexto === 'Interno') {
      dispatch(loadContextoInterno(response.data))
    } else {
      dispatch(loadContextoExterno(response.data))
    }
    return { error: false }
  } catch (error) {
    dispatch(errorContexto(error.message))
    return {
      error: true,
      message: error.message,
      errors: error.response?.data?.errors
    }
  }
}

export const getStatisticsAlerts = (period: number) => async (dispatch) => {
  try {
    dispatch(loadingStatistics())
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Alerta/Estadistica/Cantidad/Periodo?periodo=${period}`
    )
    dispatch(loadStatisticsAlerts(response.data))
    return { error: false }
  } catch (error) {
    dispatch(errorStatistics(error.message))
    return {
      error: true,
      message: error.message,
      errors: error.response?.data?.errors
    }
  }
}

export const getStatisticsAlertsEnrollment = () => async (dispatch) => {
  try {
    dispatch(loadingStatistics())
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Alerta/Estadistica/Regional/MatriculaVsContexto`
    )
    dispatch(loadStatisticsAlertsEnrollment(response.data))
    return { error: false }
  } catch (error) {
    dispatch(errorStatistics(error.message))
    return {
      error: true,
      message: error.message,
      errors: error.response?.data?.errors
    }
  }
}

export const getStatisticsAlertsPercent = () => async (dispatch) => {
  try {
    dispatch(loadingStatistics())
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Alerta/Estadistica/Dimensiones/Porcentaje`
    )
    dispatch(loadStatisticsAlertsPercent(response.data))
    return { error: false }
  } catch (error) {
    dispatch(errorStatistics(error.message))
    return {
      error: true,
      message: error.message,
      errors: error.response?.data?.errors
    }
  }
}

export const getStatisticsAlertsIncidents = () => async (dispatch) => {
  try {
    dispatch(loadingStatistics())
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Alerta/Estadistica/Max/Incidencias`
    )
    dispatch(loadStatisticsAlertsIncident(response.data))
    return { error: false }
  } catch (error) {
    dispatch(errorStatistics(error.message))
    return {
      error: true,
      message: error.message,
      errors: error.response?.data?.errors
    }
  }
}

export const getAlertsByCatalog =
	(pagina: number, cantidad: number, type: string, search: string) =>
	  async (dispatch) => {
	    try {
	      dispatch(loadingStatistics())
	      const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/Alerta/All?Pagina=${pagina}&Cantidad=${cantidad}&Inactivas=true&FiltrarPor=${type}&Filtro=${search}&OrdenarPor=id&Direccion=ASC`
	      )
	      // dispatch(loadAlertsCatalog(response.data))
	      return { error: false }
	    } catch (error) {
	      dispatch(errorAlertsCatalog(error.message))
	      return {
	        error: true,
	        message: error.message,
	        errors: error.response?.data?.errors
	      }
	    }
	  }

export const getAlertsByCatalogUpre =
	(pagina: number, cantidad: number, type: string, search: string) =>
	  async (dispatch) => {
	    try {
	      dispatch(loadingStatistics())
	      const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/Alerta/All?Pagina=${pagina}&Cantidad=${cantidad}&Inactivas=true&FiltrarPor=${type}&Filtro=${search}&OrdenarPor=id&Direccion=ASC`
	      )
	      // dispatch(loadAlertsCatalog(response.data))
	      return { error: false }
	    } catch (error) {
	      dispatch(errorAlertsCatalog(error.message))
	      return {
	        error: true,
	        message: error.message,
	        errors: error.response?.data?.errors
	      }
	    }
	  }

export const inhabilitarAlerta =
	(alertaId: number, data: any) => async (dispatch) => {
	  try {
	    dispatch(loadingStatistics())
	    await axios.put(
				`${envVariables.BACKEND_URL}/api/Alerta/${alertaId}/Inhabilitar`,
				data
	    )
	    return { error: false }
	  } catch (error) {
	    dispatch(errorAlertsCatalog(error.message))
	    return {
	      error: true,
	      message: error.response.data.error,
	      errors: error.response?.data?.errors
	    }
	  }
	}

export const getAlertsByCatalogPaginated =
	(pagina: number, cantidad: number, type: string, search: string) =>
	  async (dispatch) => {
	    try {
	      dispatch(loadingStatistics())
	      const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/Alerta/All?Pagina=${pagina}&Cantidad=${cantidad}&FiltrarPor=${type}&Filtro=${search}&inactivas=true`
	      )
	      // dispatch(loadAlertsCatalog(response.data))
	      return { error: false }
	    } catch (error) {
	      dispatch(errorAlertsCatalog(error.message))
	      return {
	        error: true,
	        message: error.message,
	        errors: error.response?.data?.errors
	      }
	    }
	  }

export const getAlertById = (alertaId: number) => async (dispatch) => {
  try {
    dispatch(alertsLoading())
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Alerta/${alertaId}`
    )
    dispatch(setAlert(response.data))
    return { error: false }
  } catch (error) {
    return {
      error: true,
      message: error.message,
      errors: error.response?.data?.errors
    }
  }
}

export const clearAlert = () => async (dispatch) => {
  dispatch(setAlert({}))
}

export const createAlerta =
	(data: any, cb = (error: boolean) => {}) =>
	  async (dispatch: Dispatch) => {
	    try {
	      dispatch(alertsLoading())
	      const headers = {
	        Accept: 'application/json',
	        'Content-Type': 'application/json;charset=UTF-8'
	      }
	      await axios
	        .post(`${envVariables.BACKEND_URL}/api/Alerta`, data, {
	          headers
	        })
	        .then((response) => {
	          cb(false)
	        })
	      return { error: false }
	    } catch (error) {
	      const errors = []
	      const data = error.response?.data?.errors
	      for (const property in data) {
	        errors.push(data[property][0])
	      }
	      dispatch(alertsErrors(errors))
	      cb(true)
	      return {
	        error: true,
	        message: error.message,
	        errors: error.response?.data?.errors
	      }
	    }
	  }

export const updateAlerta =
	(data: any, cb = (error: boolean, message: string) => {}) =>
	  async (dispatch: Dispatch) => {
	    try {
	      dispatch(alertsLoading())
	      const headers = {
	        Accept: 'application/json',
	        'Content-Type': 'application/json;charset=UTF-8'
	      }

	      const res = await axios
	        .put(`${envVariables.BACKEND_URL}/api/Alerta`, data, {
	          headers
	        })
	        .then((response) => {
	          cb(false, '')
	        })

	      return { error: false }
	    } catch (error) {
	      const errors = []
	      const data = error.response?.data?.errors
	      for (const property in data) {
	        errors.push(data[property][0])
	      }
	      dispatch(alertsErrors(errors))
	      cb(true, error.response.data.error)
	      return {
	        error: true,
	        message: error.message,
	        errors: error.response?.data?.errors
	      }
	    }
	  }

export const getAlertsContext = () => async (dispatch) => {
  try {
    dispatch({ type: types.ALERTS_CONTEXT_LOADING })
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Alerta/Contexto`
    )
    dispatch({
      type: types.ALERTS_CONTEXT_LOAD,
      payload: response.data
    })
    return { error: false }
  } catch (error) {
    dispatch({
      type: types.ALERTS_CONTEXT_FAIL,
      payload: error.response?.data?.errors
    })
    return {
      error: true,
      message: error.message,
      errors: error.response?.data?.errors
    }
  }
}
export const getAlertsDimension = () => async (dispatch) => {
  try {
    dispatch(loadingStatistics())
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Alerta/dimensiones`
    )
    dispatch(alertsDimensionLoad(response.data))
    return { error: false }
  } catch (error) {
    return {
      error: true,
      message: error.message,
      errors: error.response?.data?.errors
    }
  }
}

export const getCatAlertsByDimension =
	(dimensionId: number) => async (dispatch) => {
	  try {
	    const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/Alerta/${dimensionId}/catalogo`
	    )
	    dispatch(loadAlertsCatalog(response.data))
	    return { error: false }
	  } catch (error) {
	    return {
	      error: true,
	      message: error.message,
	      errors: error.response?.data?.errors
	    }
	  }
	}

export const getAlertsDimensionByContext =
	(contextoId: number) => async (dispatch) => {
	  try {
	    dispatch(loadingStatistics())
	    const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/Alerta/Contexto/${contextoId}/Dimensiones`
	    )
	    // dispatch(loadAlertsCatalog(response.data))
	    return { error: false }
	  } catch (error) {
	    dispatch(errorAlertsCatalog(error.message))
	    return {
	      error: true,
	      message: error.message,
	      errors: error.response?.data?.errors
	    }
	  }
	}

export const getAlertDataFilter =
	(filterText, filterType) => async (dispatch, getState) => {
	  const fakeData = [
	    {
	      estatoAlerta: 'Estado',
	      diasActivos: '15',
	      dirrecionRegional: 'San José',
	      centroEducativo: 'Rincon',
	      estudiante: 'Pedro'
	    },
	    {
	      estatoAlerta: 'Estado',
	      diasActivos: '20',
	      dirrecionRegional: 'San José',
	      centroEducativo: 'Rincon',
	      estudiante: 'Pedro'
	    }
	  ]

	  dispatch(loading())
	  dispatch(getDataFilter(fakeData))
	}

export const requestAlert =
	(data: any, cb = (error: boolean, message: string) => {}) =>
	  async (dispatch: Dispatch) => {
	    try {
	      dispatch(alertsLoading())
	      const headers = {
	        Accept: 'application/json',
	        'Content-Type': 'application/json;charset=UTF-8'
	      }
	      axios
	        .post(
					`${envVariables.BACKEND_URL}/api/Alerta/Solicitud`,
					data,
					{
					  headers
					}
	        )
	        .then((response) => {
	          cb(false, '')
	        })
	      return { error: false }
	    } catch (error) {
	      const errors = []
	      const data = error.response?.data?.errors
	      for (const property in data) {
	        errors.push(data[property][0])
	      }
	      dispatch(alertsErrors(errors))
	      cb(true, error.response.data.error)
	      return {
	        error: true,
	        message: error.response.data.error,
	        errors: error.response?.data?.errors
	      }
	    }
	  }

export const requestAlertDirector =
	(data: any) => async (dispatch: Dispatch) => {
	  try {
	    dispatch(alertsLoading())
	    await axios.post(
				`${envVariables.BACKEND_URL}/api/Alerta/Solicitud`,
				data
	    )
	    return { error: false }
	  } catch (error) {
	    dispatch(alertsErrors(error.response?.data?.errors))
	    return {
	      error: true,
	      message: error.response.data.error,
	      errors: error.response?.data?.errors
	    }
	  }
	}

export const loadAlert = (data) => async (dispatch) => {
  dispatch(setAlert(data))
}

export const cleanAlertFilter = () => (dispatch) => {
  dispatch(cleanAlertDataFilter())
}

export const changeColumn = (data) => (dispatch) => {
  dispatch(changeColumnSearch(data))
}

export const changeFilterOption = (data) => (dispatch) => {
  dispatch(changeFilterOptionSearch(data))
}
