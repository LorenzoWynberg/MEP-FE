import { LOAD_FALTAS, SET_TIPOS_FALTAS } from './types'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'

const loadTypeFalta = (payload) => ({
  type: LOAD_FALTAS,
  payload
})

const setTiposFaltas = (payload) => {
  return {
    type: SET_TIPOS_FALTAS,
    payload
  }
}

export const getTipoFalta = () => async (dispatch) => {
  try {
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/Conducta/GetAllTipoFalta`
    )
    dispatch(setTiposFaltas(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const getFalta = (institucionId) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/TipoIncumplimiento/GetTipoIncumplimientoByInstitucionId/${institucionId}`
    )

    dispatch(loadTypeFalta(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const deleteFalta = (tipoIncumplimientoId) => async (dispatch) => {
  try {
    const response = await axios.delete(
      `${envVariables.BACKEND_URL}/api/TipoIncumplimiento/${tipoIncumplimientoId}`
    )
    return { error: false, data: response }
  } catch (e) {
    return { error: true, data: e.response.data }
  }
}

export const createFalta = (data) => async (dispatch) => {
  try {
    await axios.post(`${envVariables.BACKEND_URL}/api/TipoIncumplimiento`, data)
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const updateFalta = (tipoIncumplimiento) => async (dispatch, state) => {
  try {
    const response = await axios.put(
      `${envVariables.BACKEND_URL}/api/TipoIncumplimiento/${tipoIncumplimiento.id}`,
      tipoIncumplimiento
    )
    return { error: false, data: response }
  } catch (e) {
    return { error: true, data: e.response.data }
  }
}

/* export const getFalta = (institucionId) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/TipoIncumplimiento/GetAllTipoIncumplimiento`,
    )

    dispatch(loadTypeFalta(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
} */
