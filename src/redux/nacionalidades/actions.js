import axios from 'axios'
import { NACIONALIDADES_LOAD, NACIONALIDADES_LOADING, NACIONALIDADES_ERROR } from './nacionalidadesTypes'
import { envVariables } from '../../constants/enviroment'

export const getNacionalidades = () => async (dispatch) => {
  dispatch({
    type: NACIONALIDADES_LOADING
  })
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/nacionalidades`)
    dispatch({
      type: NACIONALIDADES_LOAD,
      payload: response.data
    })
    return response.data
  } catch (error) {
    dispatch({
      type: NACIONALIDADES_ERROR,
      payload: error.message
    })
  }
}
