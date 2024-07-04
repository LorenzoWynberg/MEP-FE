import {
  DISTRITOS_LOAD,
  DISTRITOS_TEMPORALES_LOAD,
  DISTRITOS_ERROR,
  DISTRITOS_LOADING
} from './types'
import { envVariables } from 'Constants/enviroment'
import axios from 'axios'

const loadDistritos = (response) => ({
  type: DISTRITOS_LOAD,
  payload: response
})

const loadDistritosTemporales = (response) => ({
  type: DISTRITOS_TEMPORALES_LOAD,
  payload: response
})

const distritosError = (error) => ({
  type: DISTRITOS_ERROR,
  payload: error
})

export const getDistritosByCanton = (cantonId, temporal = false) => async (
  dispatch
) => {
  dispatch({
    type: DISTRITOS_LOADING
  })

  try {
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/Distrito/GetByCanton/${cantonId}`
    )
    if (response.data.error) {
      return { data: { message: response.data.message, error: true } }
    } else {
      const _data = response.data !== null ? response.data : []
      if (temporal) {
        dispatch(loadDistritosTemporales(_data))
      } else {
        dispatch(loadDistritos(_data))
      }
      return response
    }
  } catch (error) {
    dispatch(distritosError(error.message))
    return { data: { message: error.message, error: true } }
  }
}
