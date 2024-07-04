import {
  POBLADOS_LOAD,
  POBLADOS_TEMPORAL_LOAD,
  POBLADOS_ERROR,
  POBLADOS_LOADING
} from './types'
import { envVariables } from 'Constants/enviroment'
import axios from 'axios'

const loadPoblados = (response) => ({
  type: POBLADOS_LOAD,
  payload: response
})
const loadPobladosTemporales = (response) => ({
  type: POBLADOS_TEMPORAL_LOAD,
  payload: response
})

const districtError = (error) => ({
  type: POBLADOS_ERROR,
  payload: error
})

export const getPobladosByDistrito = (distrito, temporal = false) => async (
  dispatch
) => {
  dispatch({
    type: POBLADOS_LOADING
  })

  try {
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/Poblado/GetByDistrict/${distrito}`
    )
    if (response.data.error) {
      return { data: { message: response.data.message, error: true } }
    } else {
      const _data = response.data !== null ? response.data : []
      if (temporal) {
        dispatch(loadPobladosTemporales(_data))
      } else {
        dispatch(loadPoblados(_data))
      }
      return response
    }
  } catch (error) {
    dispatch(districtError(error.message))
    return { data: { message: error.message, error: true } }
  }
}
