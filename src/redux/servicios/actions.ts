import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import {
  LOAD_SERVICES,
  CREATE_SERVICES,
  DELETE_SERVICES,
  EDIT_SERVICE,
  UPDATE_SERVICE
} from './types'

const loadServices = (payload) => ({
  type: LOAD_SERVICES,
  payload
})
const createServices = (payload) => ({
  type: CREATE_SERVICES,
  payload
})

const deleteServices = (payload) => ({
  type: DELETE_SERVICES,
  payload
})

const editServices = (payload) => ({
  type: EDIT_SERVICE,
  payload
})
const updateServices = (payload) => ({
  type: UPDATE_SERVICE,
  payload
})
export const getServicios = () => async (dispatch, getState) => {
  const { servicios } = getState()
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/Servicio/`)
    dispatch(loadServices(response.data))
    return { error: false, data: response.data }
  } catch (e) {
    return { error: e.message }
  }
}

export const createServicio = (data) => async (dispatch) => {
  try {
    const response = await axios.post(`${envVariables.BACKEND_URL}/api/Servicio`, data)
    dispatch(createServices(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.response.data.error }
  }
}

export const editServicio = (data) => async (dispatch) => {
  try {
    const response = await axios.put(`${envVariables.BACKEND_URL}/api/Servicio`, data)
    dispatch(editServices(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.response.data.error }
  }
}

export const deleteServicios = (ids) => async (dispatch) => {
  try {
    const response = await axios.delete(`${envVariables.BACKEND_URL}/api/Servicio/multiple`, { data: ids })
    dispatch(deleteServices(ids))
    return { error: false }
  } catch (e) {
    return { error: true, data: e.response.data.error }
  }
}

export const updateServicios = (ids) => async (dispatch) => {
  try {
    const response = await axios.put(
            `${envVariables.BACKEND_URL}/api/Servicio/ActivareInactivar`, ids
    )
    dispatch(updateServices(ids))
    return { error: false }
  } catch (e) {
    return { error: true, data: e.response.data.error }
  }
}
