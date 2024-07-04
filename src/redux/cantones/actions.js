import {
  CANTONES_LOAD,
  CANTONES_ERROR,
  CANTONES_TEMPORAL_LOAD,
  CANTONES_LOADING
} from './types'
import { envVariables } from 'Constants/enviroment'
import axios from 'axios'

const loadCantones = (response) => ({
  type: CANTONES_LOAD,
  payload: response
})

const loadCantonesTemporales = (response) => ({
  type: CANTONES_TEMPORAL_LOAD,
  payload: response
})

const cantonesError = (error) => ({
  type: CANTONES_ERROR,
  payload: error
})

export const getCantonesByProvincia = (provinceId, temporal = false) => async (
  dispatch
) => {
  dispatch({
    type: CANTONES_LOADING
  })

  try {
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/Canton/GetByProvince/${provinceId}`
    )
    if (response.data.error) {
      return { data: { message: response.data.message, error: true } }
    } else {
      const _data = response.data !== null ? response.data : []
      if (temporal) {
        dispatch(loadCantonesTemporales(_data))
      } else {
        dispatch(loadCantones(_data))
      }
      return response
    }
  } catch (error) {
    dispatch(cantonesError(error.message))
    return { data: { message: error.message, error: true } }
  }
}
