import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import {
  LOAD_MODALITIES,
  CREATE_MODALITIES,
  DELETE_MODALITIES,
  EDIT_MODALITY,
  LOAD_MODALITIES_CATEGORIES,
  UPDATE_MODALITIES
} from './types'

const loadModalities = (payload) => ({
  type: LOAD_MODALITIES,
  payload
})
const createModalities = (payload) => ({
  type: CREATE_MODALITIES,
  payload
})

const deleteModalities = (payload) => ({
  type: DELETE_MODALITIES,
  payload
})

const editModalities = (payload) => ({
  type: EDIT_MODALITY,
  payload
})

const loadModalitiesCategories = (payload) => ({
  type: LOAD_MODALITIES_CATEGORIES,
  payload
})

const updateModalities = (payload) => ({
  type: UPDATE_MODALITIES,
  payload
})

export const getCategoriasModalidades = () => async (dispatch) => {
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/CategoriaModalidad`)
    dispatch(loadModalitiesCategories(response.data))
  } catch (e) {
    return { error: e.message }
  }
}

export const getModalidades = () => async (dispatch, getState) => {
  const { modalidades } = getState()
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/Modalidad/`)
    dispatch(loadModalities([...response.data]))
    return { error: false, data: response.data }
  } catch (e) {
    return { error: e.message }
  }
}

export const createModalidad = (data) => async (dispatch) => {
  try {
    const response = await axios.post(`${envVariables.BACKEND_URL}/api/Modalidad`, data)
    dispatch(createModalities(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.response.data.error }
  }
}

export const editModalidad = (data) => async (dispatch) => {
  try {
    const response = await axios.put(`${envVariables.BACKEND_URL}/api/Modalidad`, data)
    dispatch(editModalities(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.response.data.error }
  }
}

export const deleteModalidades = (ids) => async (dispatch) => {
  try {
    const response = await axios.delete(`${envVariables.BACKEND_URL}/api/Modalidad/multiple`, { data: ids })
    dispatch(deleteModalities(ids))
    return { error: false }
  } catch (e) {
    return { error: true, data: e.response.data.error }
  }
}

export const updateModalidades = (ids) => async (dispatch) => {
  try {
    const response = await axios.put(
			`${envVariables.BACKEND_URL}/api/Modalidad/ActivareInactivar`, ids
    )
    dispatch(updateModalities(ids))
    return { error: false }
  } catch (e) {
    return { error: true, data: e.response.data.error }
  }
}
