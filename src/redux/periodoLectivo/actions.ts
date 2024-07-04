import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import * as types from './types'

const loading = () => ({
  type: types.PERIODO_LOADING_NIVELES
})

const loadNiveles = (payload) => ({
  type: types.PERIODO_LOAD_NIVELES,
  payload
})

const failNiveles = (payload) => ({
  type: types.PERIODO_ERROR_NIVELES,
  payload
})

export const getNiveles = () => async (dispatch) => {
  try {
    dispatch(loading())
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/Identidad/Persona/GetByIdentification`
    )
    dispatch(loadNiveles(response.data))
    return { error: false, data: response.data }
  } catch (e) {
    dispatch(failNiveles(e.message))
    return { error: true }
  }
}
