import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import {
  LOAD_LEVELS,
  CREATE_LEVELS,
  DELETE_LEVELS,
  EDIT_LEVEL,
  GET_LEVELS_BY_MODEL_OFFER,
  UPDATE_LEVEL
} from './types'

const loadLevels = (payload) => ({
  type: LOAD_LEVELS,
  payload
})
const createLevel = (payload) => ({
  type: CREATE_LEVELS,
  payload
})

const deleteLevels = (payload) => ({
  type: DELETE_LEVELS,
  payload
})

const editLevel = (payload) => ({
  type: EDIT_LEVEL,
  payload
})

const getLevels = (payload) => ({
  type: GET_LEVELS_BY_MODEL_OFFER,
  payload
})

const updateLevel = (payload) => ({
  type: UPDATE_LEVEL,
  payload
})
export const getNiveles = () => async (dispatch, getState) => {
  const { niveles } = getState()
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/Nivel/`)
    dispatch(loadLevels(response.data))
    return { error: false, data: response.data }
  } catch (e) {
    return { error: e.message }
  }
}

export const getLevelsByModelOffer = (modelOfferId: number) => async (dispatch, getState) => {
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/Nivel/ByOfertaModalServ/${modelOfferId}`)
    dispatch(getLevels(response.data))
  } catch (e) {
    return { error: e.message }
  }
}

export const getLevelsByOfertaModalServInCalendar = (modelOfferId: number) => async (dispatch, getState) => {
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/Nivel/ByOfertaModalServInCalendar/${modelOfferId}`)
    dispatch(getLevels(response.data))
  } catch (e) {
    return { error: e.message }
  }
}

export const createNivel = (data) => async (dispatch) => {
  try {
    const response = await axios.post(`${envVariables.BACKEND_URL}/api/Nivel`, data)
    dispatch(createLevel(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.response.data.error }
  }
}

export const editNivel = (data) => async (dispatch) => {
  try {
    const response = await axios.put(`${envVariables.BACKEND_URL}/api/Nivel`, data)
    dispatch(editLevel(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.response.data.error }
  }
}

export const deleteNiveles = (ids) => async (dispatch) => {
  try {
    const response = await axios.delete(`${envVariables.BACKEND_URL}/api/Nivel/multiple`, { data: ids })
    dispatch(deleteLevels(ids))
    return { error: false }
  } catch (e) {
    return { error: true, data: e.response.data.error }
  }
}

export const updateNivel = (ids) => async (dispatch) => {
  try {
    const response = await axios.put(
			`${envVariables.BACKEND_URL}/api/Nivel/ActivareInactivar`, ids
    )
    dispatch(updateLevel(ids))
    return { error: false }
  } catch (e) {
    return { error: true, data: e.response.data.error }
  }
}
