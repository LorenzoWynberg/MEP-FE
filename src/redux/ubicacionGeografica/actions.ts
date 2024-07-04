import { envVariables } from 'Constants/enviroment'
import axios from 'axios'

import types from './types'

export const getAllCountrys = () => async (dispatch) => {
  try {
    const res = await axios.get(`${envVariables.BACKEND_URL}/api/UbicacionGeografica/GetPaises`)
    dispatch({
      type: types.GET_ALL_COUNTRIES,
      payload: res?.data?.data
    })
    return { error: false, data: res?.data?.data }
  } catch (error) {
    return { error: true, message: error?.message || error?.response?.data?.error || 'Ha ocurrido un error' }
  }
}

export const getStatesByCountryId = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`${envVariables.BACKEND_URL}/api/UbicacionGeografica/GetEstadosByPaisId`, {
      params: {
        paisId: id
      }
    })
    dispatch({
      type: types.GET_STATES_BY_COUNTRY_ID,
      payload: res?.data?.data
    })
    return { error: false, data: res?.data?.data }
  } catch (error) {
    return { error: true, message: error?.message || error?.response?.data?.error || 'Ha ocurrido un error' }
  }
}

export const getCitiesByStateId = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`${envVariables.BACKEND_URL}/api/UbicacionGeografica/GetCiudadesByEstadoId`, {
      params: {
        estadoId: id
      }
    })
    dispatch({
      type: types.GET_CITIES_BY_STATE_ID,
      payload: res?.data?.data
    })
    return { error: false, data: res?.data?.data }
  } catch (error) {
    return { error: true, message: error?.message || error?.response?.data?.error || 'Ha ocurrido un error' }
  }
}
