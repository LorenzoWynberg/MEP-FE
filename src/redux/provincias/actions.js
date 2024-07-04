import { PROVINCIAS_LOAD, PROVINCIAS_ERROR, PROVINCIAS_LOADING } from './types'
import { envVariables } from 'Constants/enviroment'
import axios from 'axios'

const loadProvincias = (response) => ({
  type: PROVINCIAS_LOAD,
  payload: response
})

const provinciasError = (error) => ({
  type: PROVINCIAS_ERROR,
  payload: error
})

export const getProvincias = () => async (dispatch) => {
  dispatch({
    type: PROVINCIAS_LOADING
  })

  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/Provincia`)
    if (response.data.error) {
      return { data: { message: response.data.message, error: true } }
    } else {
      const _data = response.data !== null ? response.data : []
      dispatch(loadProvincias(_data))
      return response
    }
  } catch (error) {
    dispatch(provinciasError(error.message))
    return { data: { message: error.message, error: true } }
  }
}
