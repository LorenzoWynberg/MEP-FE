import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import * as types from './types'
import { Dispatch } from 'redux'

const alertsLoading = () => ({
  type: types.ALERTS_LOADING
})

const alertLoad = (payload) => ({
  type: types.ALERT_LOAD,
  payload
})

const alertStudenLoad = (payload) => ({
  type: types.ALERTS_STUDENTS_LOAD,
  payload
})

const alertsErrors = (payload) => ({
  type: types.ALERTS_ERRROS,
  payload
})

const activeLoading = () => ({
  type: types.ALERTS_ACTIVES_LOADING
})

const activeLoad = (payload) => ({
  type: types.ALERTS_ACTIVES_LOAD,
  payload
})

const activeErrors = (payload) => ({
  type: types.ALERTS_ACTIVES_FAIL,
  payload
})

const alertStudentStepsLoading = () => ({
  type: types.ALERTS_STUDENT_STEPS_LOADING
})

const alertStudentStepsLoad = (payload) => ({
  type: types.ALERTS_STUDENT_STEPS_LOAD,
  payload
})

const alertStudentDetailLoad = (payload) => ({
  type: types.ALERTS_STUDENT_DETAIL_LOAD,
  payload
})

const alertStudentStepsFail = (payload) => ({
  type: types.ALERTS_STUDENT_STEPS_FAIL,
  payload
})

export const getAlertStudents = () => async (dispatch: Dispatch) => {
  try {
    dispatch(activeLoading())
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/Alerta/Estudiantes`)
    dispatch(activeLoad(response.data))
    return { error: false }
  } catch (error) {
    dispatch(activeErrors(error.response.data.errors))
    return {
      error: true,
      message: error.message,
      errors: error.response.data.errors
    }
  }
}

export const getAlertStudentsPaginated = (order: string, type: string, search: string, pagina: number, cantidad: number) => async (dispatch: Dispatch) => {
  try {
    dispatch(activeLoading())
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/Alerta/Estudiantes?OrdenarPor=${order}&TipoColumna=${type}&Busqueda=${search}&Pagina=${pagina}&CantidadPagina=${cantidad}`)
    dispatch(activeLoad(response.data))
    return { error: false }
  } catch (error) {
    dispatch(activeErrors(error.response.data.errors))
    return {
      error: true,
      message: error.message,
      errors: error.response.data.errors
    }
  }
}

export const getAlertStudent = (pagina: number, cantidad: number) => async (dispatch: Dispatch) => {
  try {
    dispatch(alertsLoading())
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/Alerta/PorEstudiantes/filter?Pagina=${pagina}&Cantidad=${cantidad}&OrdenarPor=fecha&Direccion=DESC`)
    dispatch(alertStudenLoad(response.data))
    return { error: false }
  } catch (error) {
    dispatch(alertsErrors(error.response.data.errors))
    return {
      error: true,
      message: error.message,
      errors: error.response.data.errors
    }
  }
}

export const getAlertStudentPaginated = (pagina: number, cantidad: number, type: string, search: string) => async (dispatch: Dispatch) => {
  try {
    dispatch(alertsLoading())
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/Alerta/PorEstudiantes/filter?Pagina=${pagina}&Cantidad=${cantidad}&FiltrarPor=${type}&Filtro=${search}`)
    dispatch(alertStudenLoad(response.data))
    return { error: false }
  } catch (error) {
    dispatch(alertsErrors(error.response.data.errors))
    return {
      error: true,
      message: error.message,
      errors: error.response.data.errors
    }
  }
}

export const getAlertById = (alertId: number) => async (dispatch: Dispatch) => {
  try {
    dispatch(alertsLoading())
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/Alerta/${alertId}`)
    dispatch(alertLoad(response.data))
    return { error: false }
  } catch (error) {
    dispatch(alertsErrors(error.response.data.errors))
    return {
      error: true,
      message: error.message,
      errors: error.response.data.errors
    }
  }
}

export const getAlertByStudent = (alertByStudent: number) => async (dispatch: Dispatch) => {
  try {
    dispatch(alertStudentStepsLoading())
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/Alerta/PorEstudiante/${alertByStudent}/Completo`)
    dispatch(alertStudentStepsLoad(response.data))
    return { error: false }
  } catch (error) {
    dispatch(alertStudentStepsFail(error.response.data.errors))
    return {
      error: true,
      message: error.message,
      errors: error.response.data.errors
    }
  }
}

export const createAlertStepByStudent = (alertStudentId: number, data: any) => async (dispatch: Dispatch) => {
  try {
    dispatch(alertStudentStepsLoading())
    const response = await axios.post(`${envVariables.BACKEND_URL}/api/Alerta/PorEstudiante/${alertStudentId}/Pasos`, data)
    dispatch(alertStudentStepsLoad(response.data))
    return { error: false }
  } catch (error) {
    dispatch(alertStudentStepsFail(error.response.data.errors))
    return {
      error: true,
      message: error.response.data.error,
      errors: error.response.data.errors
    }
  }
}

export const activeAlertStudent = (alertId: number, alertStudentId: number, data: any) => async (dispatch: Dispatch) => {
  try {
    dispatch(alertsLoading())
    await axios.post(`${envVariables.BACKEND_URL}/api/Alerta/${alertId}/Estudiante/${alertStudentId}`, data)
    return { error: false }
  } catch (error) {
    dispatch(alertsErrors(error.response.data.errors))
    return {
      error: true,
      message: error.response.data.error,
      errors: error.response.data.errors
    }
  }
}

export const closeAlertStudent = (alertStudentId: number, data: any) => async (dispatch: Dispatch) => {
  try {
    dispatch(alertsLoading())
    await axios.put(`${envVariables.BACKEND_URL}/api/Alerta/CerrarAlerta/${alertStudentId}`, data)
    return { error: false }
  } catch (error) {
    dispatch(alertsErrors(error.response.data.errors))
    return {
      error: true,
      message: error.message,
      errors: error.response.data.errors
    }
  }
}

export const getDetailStudent = (identidadId: number) => async (dispatch: Dispatch) => {
  try {
    dispatch(alertsLoading())
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/Alerta/Estudiante/${identidadId}`)
    dispatch(alertStudentDetailLoad(response.data))
    return { error: false }
  } catch (error) {
    dispatch(alertsErrors(error.response.data.errors))
    return {
      error: true,
      message: error.message,
      errors: error.response.data.errors
    }
  }
}

export const clearStudent = () => async (dispatch: Dispatch) => {
  dispatch(alertStudentDetailLoad({}))
}

export const setAlertResolution = (alertStudentId: number, data: any) => async (dispatch: Dispatch) => {
  try {
    dispatch(alertsLoading())
    await axios.put(`${envVariables.BACKEND_URL}/api/Alerta/PorEstudiante/${alertStudentId}/EnResolucion`, data)
    return { error: false }
  } catch (error) {
    return {
      error: true,
      message: error.response.data.error,
      errors: error.response.data.errors
    }
  }
}
