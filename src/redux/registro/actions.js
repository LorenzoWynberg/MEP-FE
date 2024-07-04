import { envVariables } from 'Constants/enviroment'
import axios from 'axios'
import * as types from './types'

export const registerLoading = () => ({
  type: types.REGISTER_LOADING
})

export const registerFailure = error => ({
  type: types.REGISTER_FAILURE,
  payload: error
})

const loadingUser = () => ({
  type: types.USER_LOADING
})

const loadUser = (payload) => ({
  type: types.USER_LOAD,
  payload
})

export const userFailure = error => ({
  type: types.USER_FAILURE,
  payload: error
})

export const registroUsuario = (data) => {
  return async (dispatch) => {
    dispatch(registerLoading())
    try {
      const response = await axios.post(`${envVariables.BACKEND_URL}/api/Authentication/Register`, data)
    } catch (error) {
      data = error.response.data.errors
      return {
        error: true,
        message: error.message,
        errors: data
      }
    }
  }
}

export const getIdentification = (identification) => {
  return async (dispatch) => {
    dispatch(loadingUser())
    try {
      // const response = await axios.get(`${envVariables.BACKEND_URL}/api/Authentication/GetByIdentification/${identification}/public`);
      const response = await axios.get(`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Identidad/GetByIdentification/${identification}`)
      dispatch(loadUser(response.data))
      return true
    } catch (error) {
      dispatch(userFailure(error.message))
      return false
    }
  }
}
