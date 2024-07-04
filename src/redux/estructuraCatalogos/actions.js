import { envVariables } from 'Constants/enviroment'
import axios from 'axios'
import { ESTRUCTURA_PROFILES_LOAD, ESTRUCTURA_SECTIONS_LOAD, ESTRUCTURA_ERROR, ESTRUCTURA_LOAD, ESTRUCTURA_CREATE, ESTRUCTURA_DELETE } from './estructuraCatalogosTypes'

const loadEstructuraCatalogos = (response) => ({
  type: ESTRUCTURA_PROFILES_LOAD,
  payload: response
})

const loadEstructura = (payload) => ({
  type: ESTRUCTURA_LOAD,
  payload
})

const removeEstructura = (payload) => ({
  type: ESTRUCTURA_DELETE,
  payload
})

const createEstructura = (payload) => ({
  type: ESTRUCTURA_CREATE,
  payload
})

const loadEstructuraSections = (response) => ({
  type: ESTRUCTURA_SECTIONS_LOAD,
  payload: response
})

const estructuraError = (error) => ({
  type: ESTRUCTURA_ERROR,
  payload: error
})

export const getEstructura = (id) => async (dispatch) => {
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}
      ​/api​/Areas​/GestorCatalogos​/TipoCatalogo​/GetByEstructura​/${id}/{estructuraId}`)
    if (response.data.error) {
      return { data: { message: response.data.message, error: true } }
    } else {
      dispatch(loadEstructuraCatalogos(response.data))
      return { error: false }
    }
  } catch (error) {
    dispatch(estructuraError(error.message))
    return { data: { message: error.message, error: true } }
  }
}

export const getEstructuraCatalogo = () => async (dispatch) => {
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/EstructuraCatalogo`)

    if (response.data.error) {
      return { data: { message: response.data.message, error: true } }
    } else {
      dispatch(loadEstructura(response.data))
      return { error: false }
    }
  } catch (error) {
    dispatch(estructuraError(error.message))
    return { data: { message: error.message, error: true } }
  }
}

export const saveEstructura = (data) => async (dispatch) => {
  try {
    const response = await axios.post(`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/TipoCatalogo`, data)

    if (response.data.error) {
      dispatch(estructuraError(response.data.message))
      return { data: { message: response.data.message, error: true } }
    } else {
      dispatch(createEstructura(response.data))
      return { error: false }
    }
  } catch (error) {
    dispatch(estructuraError(error.message))
    return { data: { message: error.message, error: true } }
  }
}
