import { OFFICE365_ACTION, OFFICE365_ERROR, OFFICE365_LOADING } from './types'
import { envVariables } from 'Constants/enviroment'
import { catalogsEnum } from '../../utils/catalogsEnum'
import axios from 'axios'

const loading = () => ({
  type: OFFICE365_LOADING
})

const error = (payload) => ({
  type: OFFICE365_ERROR,
  payload
})

const action = (payload) => ({
  type: OFFICE365_ACTION,
  payload
})

export const graphApi = (data) => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.post(
      `${envVariables.BACKEND_URL}/api/Cuenta/graphApi`,
      data
    )

    dispatch(action(response.data))
    return { error: false, data: response.data }
  } catch (e) {
    let msg = 'Ha ocurrido un error no controlado'
    if (e.response) {
      msg = e.response.data.error
    }
    dispatch(error(msg))
    return {
      error: true,
      data: msg
    }
  }
}

export const graphApiTeam = (data) => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.post(
      `${envVariables.BACKEND_URL}/api/Team/graphApi`,
      data
    )

    dispatch(action(response.data))
    return { error: false, data: response.data }
  } catch (e) {
    dispatch(error(e.message))
    return { data: e.message, error: true }
  }
}

export const getMotivos = (type) => async (dispatch) => {
  try {
    const _type = catalogsEnum.find((item) => item.name === type)
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/Catalogo/GetAllByType/35/-1/-1`
    )
    if (response.data.error) {
      return { error: true, data: response.data }
    } else {
      return { error: false, data: response.data }
    }
  } catch (error) {
    return { data: error.message, error: true }
  }
}

export const getTemplatesModulo = (moduloId) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/Template/GetByModule/${moduloId}`
    )
    if (response.data.error) {
      return { error: true, data: response.data }
    } else {
      return { error: false, data: response.data }
    }
  } catch (error) {
    return { data: error.message, error: true }
  }
}

export const updateIdentityEmail =
  (correoId, identidadId, username) => async (dispatch) => {
    try {
      const response = await axios.post(
        `${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Expediente/CuentaCorreo/Data`,
        { IdCorreo: correoId, IdIdentidad: identidadId, Username: username }
      )
      return { data: { message: '', error: false } }
    } catch (e) {
      return { data: { message: e.message, error: true } }
    }
  }
