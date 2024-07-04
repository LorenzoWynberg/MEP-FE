import {
  SALUD_LOADING,
  LOAD_CURRENT_SALUD,
  CLEAN_CURRENT_SALUD,
  LOAD_SALUD_ITEMS,
  SALUD_ADD,
  SALUD_EDIT,
  SALUD_REMOVE,
  SALUD_FAILURE
} from './types'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import { handleErrors } from '../../utils/handleErrors'

const loading = () => ({
  type: SALUD_LOADING
})

const currentSalud = (payload) => ({
  type: LOAD_CURRENT_SALUD,
  payload
})
const cleanCurrentSalud = () => ({
  type: CLEAN_CURRENT_SALUD
})

const loadItems = (payload) => ({
  type: LOAD_SALUD_ITEMS,
  payload
})

const add = (payload) => ({
  type: SALUD_ADD,
  payload
})

const edit = (payload) => ({
  type: SALUD_EDIT,
  payload
})

const remove = (payload) => ({
  type: SALUD_REMOVE,
  payload
})

const failure = (payload) => ({
  type: SALUD_FAILURE,
  payload
})

export const addSalud = (data) => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.post(
      `${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Salud`,
      data
    )
    dispatch(add(response.data))
    return { error: false }
  } catch (e) {
    dispatch(failure(handleErrors(e)))
    return { error: e.message }
  }
}

export const editSalud = (data) => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.put(
      `${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Salud`,
      data
    )
    dispatch(edit(response.data))
    return { error: false }
  } catch (e) {
    dispatch(failure(handleErrors(e)))
    return { error: e.message }
  }
}

export const deleteSalud = (id) => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.delete(
      `${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Salud/${id}`
    )
    dispatch(remove(id))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const getSaludItems = (identidadId) => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Salud/${identidadId}`
    )
    dispatch(loadItems(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const setCurrentItem = (id = 0) => async (dispatch) => {
  dispatch(loading())
  dispatch(currentSalud(id))
}

export const cleanCurrentSaludItem = () => async (dispatch) => {
  dispatch(loading())
  dispatch(cleanCurrentSalud())
}
