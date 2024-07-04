import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import * as types from './types'
import { Dispatch } from 'redux'

const alertsLoading = () => ({
  type: types.ALERTS_REQUEST_LOADING
})

const loadSent = (payload) => ({
  type: types.ALERTS_REQUEST_SENT_LOAD,
  payload
})

const loadReceived = (payload) => ({
  type: types.ALERTS_REQUEST_RECEIVED_LOAD,
  payload
})

const loadApproved = (payload) => ({
  type: types.ALERTS_REQUEST_APPROVED_LOAD,
  payload
})

const loadRejected = (payload) => ({
  type: types.ALERTS_REQUEST_REJECTED_LOAD,
  payload
})

const alertsFail = (payload) => ({
  type: types.ALERTS_REQUEST_FAIL,
  payload
})

const stepGlobalLoading = () => ({
  type: types.ALERTS_GLOBAL_STEPS_LOADING
})

const stepGlobalLoad = (payload) => ({
  type: types.ALERTS_GLOBAL_STEPS_LOAD,
  payload
})

const stepGlobalError = (payload) => ({
  type: types.ALERTS_GLOBAL_STEPS_FAIL,
  payload
})

export const getAlertsByStatus = (estado: number, page: number, cantidad: number) => async (dispatch: Dispatch) => {
  try {
    dispatch(alertsLoading())
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/Alerta/Solicitud?EstadoId=${estado}&Pagina=${page}&Cantidad=${cantidad}`)
    switch (estado) {
      case 1:
      case 2:
        dispatch(loadSent(response.data))
      case 3:
        dispatch(loadReceived(response.data))
        break
      case 4:
        dispatch(loadApproved(response.data))
        break
      case 5:
        dispatch(loadRejected(response.data))
        break
    }
    return { error: false }
  } catch (error) {
    dispatch(alertsFail(error.response.data.errors))
    return {
      error: true,
      message: error.message,
      errors: error.response.data.errors
    }
  }
}

export const changeAlertToReview = (solicitudId: number) => async (dispatch: Dispatch) => {
  try {
    await axios.put(`${envVariables.BACKEND_URL}/api/Alerta/Solicitud/${solicitudId}/Revision`)
    return { error: false }
  } catch (error) {
    return {
      error: true,
      message: error.response.data.error,
      errors: error.response.data.errors
    }
  }
}

export const changeAlertStatus = (type: string, solicitudId: number, data: any) => async (dispatch: Dispatch) => {
  try {
    await axios.put(`${envVariables.BACKEND_URL}/api/Alerta/Solicitud/${solicitudId}/${type}`, data)
    return { error: false }
  } catch (error) {
    return {
      error: true,
      message: error.response.data.error
    }
  }
}

export const addCommentsToAlert = (data: any) => async (dispatch: Dispatch) => {
  try {
    await axios.post(`${envVariables.BACKEND_URL}/api/Alerta/Solicitud/Comentarios`, data)
    return { error: false }
  } catch (error) {
    return {
      error: true,
      message: error.response.data.error
    }
  }
}

export const getStepsGlobal = () => async (dispatch: Dispatch) => {
  try {
    dispatch(stepGlobalLoading())
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/Alerta/Pasos/Global`)
    dispatch(stepGlobalLoad(response.data))
    return { error: false }
  } catch (error) {
    dispatch(stepGlobalError(error.response.data.errors))
    return {
      error: true,
      message: error.message,
      errors: error.response.data.errors
    }
  }
}

export const addNewStep = (data: any) => async (dispatch: Dispatch) => {
  try {
    dispatch(stepGlobalLoading())
    await axios.post(`${envVariables.BACKEND_URL}/api/Alerta/Pasos`, data)
    return { error: false }
  } catch (error) {
    dispatch(stepGlobalError(error.response.data.errors))
    return {
      error: true,
      message: error.message,
      errors: error.response.data.errors
    }
  }
}

export const disableStep = (stepId: string) => async (dispatch: Dispatch) => {
  try {
    dispatch(stepGlobalLoading())
    await axios.put(`${envVariables.BACKEND_URL}/api/Alerta/Pasos/${stepId}/InhabilitarPaso`)
    return { error: false }
  } catch (error) {
    return {
      error: true,
      message: error.response.data.error,
      errors: error.response.data.errors
    }
  }
}
