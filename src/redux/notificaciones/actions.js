import { envVariables } from 'Constants/enviroment'
import axios from 'axios'
import {
  NOTIFICACION_LOAD,
  NOTIFICACION_ERROR,
  NOTIFICACION_MARK_READ
} from './types'
const loadNotifications = (payload) => ({
  type: NOTIFICACION_LOAD,
  payload
})
const error = (payload) => ({
  type: NOTIFICACION_ERROR,
  payload
})

const leidos = (payload) => ({
  type: NOTIFICACION_MARK_READ,
  payload
})

export const GetComunicadosPaginados = () => async (dispatch) => {
  try {
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/Notificacion/noLeidas`
    )
    if (response.data.error) {
      dispatch(error(response.data))
      return { error: true, mensaje: response.data, data: {} }
    } else {
      dispatch(loadNotifications(response.data))
      return { error: false, mensaje: '', data: response.data }
    }
  } catch (e) {
    dispatch(error(e.message))
    return { error: true, mensaje: e.message, data: {} }
  }
}

export const MarcarComoLeidos = (data) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${envVariables.BACKEND_URL}/api/Notificacion/marcarLeido`,
      data
    )
    dispatch(leidos(response.data))
    return { error: false, data: response.data }
  } catch (err) {
    return { error: err.message, message: err.response.data.error }
  }
}
