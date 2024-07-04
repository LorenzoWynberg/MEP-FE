import {
  LISTAS_LOAD_NEW,
  LISTAS_LOAD,
  LISTAS_LOADING,
  LISTAS_REMOVE,
  LISTAS_LOAD_UPDATED,
  LISTAS_LOAD_ONE,
  LISTAS_LOAD_ENVIO
} from './types'
import { envVariables } from 'Constants/enviroment'
import axios from 'axios'

const loading = () => ({
  type: LISTAS_LOADING
})

const loadListas = (payload) => ({
  type: LISTAS_LOAD,
  payload
})

const loadNewLista = (payload) => ({
  type: LISTAS_LOAD_NEW,
  payload
})

const updateLista = (payload) => ({
  type: LISTAS_LOAD_UPDATED,
  payload
})

const getOneLista = (payload) => ({
  type: LISTAS_LOAD_ONE,
  payload
})

const loadListasEnvio = (payload) => ({
  type: LISTAS_LOAD_ENVIO,
  payload
})

const removePrevLista = (payload) => ({
  type: LISTAS_REMOVE,
  payload
})

export const getListasDifusionByUser = () => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/ListaDifusion/ByUsers`)
    dispatch(loadListas(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const getListaDifusion = (id, listasEnvio = false) => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/ListaDifusion/${id}`)
    if (listasEnvio) {
      dispatch(loadListasEnvio(response.data))
    } else {
      dispatch(getOneLista(response.data))
    }
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const createListaDifusionByUser = (data) => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.post(`${envVariables.BACKEND_URL}/api/ListaDifusion/Create`, data)
    dispatch(loadNewLista(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const updateListaDifusionByUser = (data) => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.put(`${envVariables.BACKEND_URL}/api/ListaDifusion/${data.id}`, data)
    dispatch(updateLista(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const deleteListaDifusion = (id) => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.delete(`${envVariables.BACKEND_URL}/api/ListaDifusion/${id}`)
    dispatch(removePrevLista(id))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const addUsersEmailsListaDifusion = (data) => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.post(`${envVariables.BACKEND_URL}/api/ListaDifusion/Create`, data)
    dispatch(loadNewLista(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}
