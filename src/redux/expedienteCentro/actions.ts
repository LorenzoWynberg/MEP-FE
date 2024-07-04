import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import * as types from './types'
import { Dispatch } from 'redux'

const loading = () => ({
  type: types.CENTRO_LOADING
})

const loadCentro = (payload: any) => ({
  type: types.CENTRO_LOAD,
  payload
})

const centroFailed = (payload: any) => ({
  type: types.CENTRO_FAILED,
  payload
})

const loadCenterOffer = (payload: array) => ({
  type: types.LOAD_CENTER_OFFERS,
  payload
})

const loadExpedienteCenterOffers = (payload: array) => ({
  type: types.LOAD_CENTER_OFFERS_BY_EDYEAR,
  payload
})

const cleanExpedienteCenterOffers = (payload: array) => ({
  type: types.CLEAN_CENTER_OFFERS_BY_EDYEAR,
  payload
})

export const getCentroById = (institutionId: number) => async (dispatch: Dispatch) => {
  try {
    dispatch(loading())
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/Institucion/GetById/${institutionId}`)
    dispatch(loadCentro(response.data))
    return { error: false }
  } catch (error) {
    dispatch(centroFailed(error.message))
    return {
      error: true,
      message: error.message,
      errors: error.response.data.errors
    }
  }
}

export const getFichaCentro = (institutionId: number) => async (dispatch: Dispatch) => {
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/Institucion/${institutionId}/Ficha`)
    let data
    if (Array.isArray(response.data)) {
      data = response.data[0]
    } else {
      data = response.data
    }
    if (data.ubicacion) {
      const id = JSON.parse(data.ubicacion)['9905c516-75b5-6c94-4703-507b2dfc00d0']
      const pobladoResponse = await axios.get(`${envVariables.BACKEND_URL}/api/Poblado/GetById/${id}`)
      data.poblado = pobladoResponse.data.nombre
    }

    dispatch(loadCentro(data))
    return { error: false }
  } catch (error) {
    dispatch(centroFailed(error.message))
    return {
      error: true,
      message: error.message,
      errors: error.response.data.errors
    }
  }
}

export const getCenterOffers = (institutionId: number, edYear: number) => async (dispatch: Dispatch) => {
  try {
    dispatch(loading())
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/Matricula/getOfertasmatricula/${edYear}/${institutionId}`)
    dispatch(loadCenterOffer(response.data))
    return { error: false }
  } catch (error) {
    dispatch(centroFailed(error.message))
    return {
      error: true,
      message: error?.message,
      errors: error?.response?.data?.errors
    }
  }
}

export const getCenterOffersByYear = (institutionId: number, edYear: number) => async (dispatch: Dispatch) => {
  try {
    dispatch(loading())
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/NivelOfertas/GetNivelesOfertaByInstitucionAndEdYear/${institutionId}/${edYear}`)
    dispatch(loadExpedienteCenterOffers(response.data))
    return { error: false }
  } catch (error) {
    dispatch(centroFailed(error.message))
    return {
      error: true,
      message: error.message,
      errors: error.response.data.errors
    }
  }
}

export const cleanDataCenterOffersByYear = () => (dispatch: Dispatch) => {
  dispatch(cleanExpedienteCenterOffers([]))
}
