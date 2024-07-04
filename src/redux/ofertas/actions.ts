import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import {
  LOAD_OFFERS,
  CREATE_OFFERS,
  DELETE_OFFERS,
  EDIT_OFFER,
  UPDATE_OFFER
} from './types'

const loadOffers = (payload) => ({
  type: LOAD_OFFERS,
  payload
})
const createOffer = (payload) => ({
  type: CREATE_OFFERS,
  payload
})

const deleteOffers = (payload) => ({
  type: DELETE_OFFERS,
  payload
})

const editOffer = (payload) => ({
  type: EDIT_OFFER,
  payload
})

const updateOffer = (payload) => ({
  type: UPDATE_OFFER,
  payload
})

export const getOfertas = () => async (dispatch, getState) => {
  const { ofertas } = getState()
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/Oferta/`)
    dispatch(loadOffers(response.data))
    return { error: false, data: response.data }
  } catch (e) {
    return { error: e.message }
  }
}

export const createOferta = (data) => async (dispatch) => {
  try {
    const response = await axios.post(`${envVariables.BACKEND_URL}/api/Oferta`, data)
    dispatch(createOffer(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.response.data.error }
  }
}

export const editOferta = (data) => async (dispatch) => {
  try {
    const response = await axios.put(`${envVariables.BACKEND_URL}/api/Oferta`, data)
    dispatch(editOffer(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.response.data.error }
  }
}

export const deleteOfertas = (ids) => async (dispatch) => {
  try {
    const response = await axios.delete(`${envVariables.BACKEND_URL}/api/Oferta`, { data: ids })
    dispatch(deleteOffers(ids))
    return { error: false }
  } catch (e) {
    return { error: true, data: e.response.data.error }
  }
}

export const updateOferta = (ids) => async (dispatch) => {
  try {
    const response = await axios.put(
			`${envVariables.BACKEND_URL}/api/Oferta/ActivareInactivar`, ids
    )
    dispatch(updateOffer(ids))
    return { error: false }
  } catch (e) {
    return { error: true, data: e.response.data.error }
  }
}
