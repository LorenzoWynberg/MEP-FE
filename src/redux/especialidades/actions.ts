import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import {
  LOAD_SPECIALITIES,
  CREATE_SPECIALITIES,
  DELETE_SPECIALITIES,
  EDIT_SPECIALITY,
  UPDATE_SPECIALITY
} from './types'

const loadSpecialities = (payload) => ({
  type: LOAD_SPECIALITIES,
  payload
})
const createSpecialities = (payload) => ({
  type: CREATE_SPECIALITIES,
  payload
})

const deleteSpecialities = (payload) => ({
  type: DELETE_SPECIALITIES,
  payload
})

const editSpecialities = (payload) => ({
  type: EDIT_SPECIALITY,
  payload
})
const updateSpecialities = (payload) => ({
  type: UPDATE_SPECIALITY,
  payload
})

export const getEspecialidades = () => async (dispatch, getState) => {
  const { especialidades } = getState()
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/Especialidad/`)
    dispatch(loadSpecialities(response.data))
    return { error: false, data: response.data }
  } catch (e) {
    return { error: e.message }
  }
}

export const createEspecialidad = (data) => async (dispatch) => {
  try {
    const response = await axios.post(`${envVariables.BACKEND_URL}/api/Especialidad`, data)
    dispatch(createSpecialities(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.response.data.error }
  }
}

export const editEspecialidad = (data) => async (dispatch) => {
  try {
    const response = await axios.put(`${envVariables.BACKEND_URL}/api/Especialidad`, data)
    dispatch(editSpecialities(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.response.data.error }
  }
}

export const deleteEspecialidades = (ids) => async (dispatch) => {
  try {
    const response = await axios.delete(`${envVariables.BACKEND_URL}/api/Especialidad/multiple`, { data: ids })
    dispatch(deleteSpecialities(ids))
    return { error: false }
  } catch (e) {
    return { error: true, data: e.response.data.error }
  }
}

export const updateEspecialidad = (ids) => async (dispatch) => {
  try {
    const response = await axios.put(
            `${envVariables.BACKEND_URL}/api/Especialidad/ActivareInactivar`, ids
    )
    dispatch(updateSpecialities(ids))
    return { error: false }
  } catch (e) {
    return { error: true, data: e.response.data.error }
  }
}
