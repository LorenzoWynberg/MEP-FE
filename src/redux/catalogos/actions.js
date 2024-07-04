import { envVariables } from 'Constants/enviroment'
import axios from 'axios'
import { CATALOGOS_PROFILES_LOAD, CATALOGOS_SECTIONS_LOAD, CATALOGOS_ERROR, CATALOGOS_LOAD, CATALOGOS_CREATE, CATALOGOS_SET_ACTIVE, CATALOGOS_CHANGE_STATE } from './catalogosTypes'

const loadCatalogoEstructura = (response) => ({
  type: CATALOGOS_PROFILES_LOAD,
  payload: response
})

const loadCatalogos = (payload) => ({
  type: CATALOGOS_LOAD,
  payload
})

const createCatalogos = (payload) => ({
  type: CATALOGOS_CREATE,
  payload
})

const loadCatalogosSections = (response) => ({
  type: CATALOGOS_SECTIONS_LOAD,
  payload: response
})

const catalogosError = (error) => ({
  type: CATALOGOS_ERROR,
  payload: error
})

const setActive = (payload) => ({
  type: CATALOGOS_SET_ACTIVE,
  payload
})

const changeStateCatalogos = (payload) => ({
  type: CATALOGOS_CHANGE_STATE,
  payload
})

export const getCatalogoEstructura = (id) => async (dispatch) => {
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}
      ​/api​/Areas​/GestorCatalogos​/TipoCatalogo​/GetByEstructura​/${id}/{estructuraId}`)
    if (response.data.error) {
      return { data: { message: response.data.message, error: true } }
    } else {
      dispatch(loadCatalogoEstructura(response.data))
      return { error: false }
    }
  } catch (error) {
    dispatch(catalogosError(error.message))
    return { data: { message: error.message, error: true } }
  }
}

/* export const getSections = () => async (dispatch) => {

    try {
      const response = await axios.get(`${envVariables.BACKEND_URL}/api/Admin/Roles/Secciones`)
          if (response.data.error) {
          return { data: { message: response.data.message, error: true } };
          } else {
              dispatch(loadCatalogosSections(response.data))
              return {error: false};
          }
    }
    catch (error) {
      dispatch(rolesError(error.message))
      return { data: { message: error.message, error: true } };
  }
} */

export const getCatalogos = () => async (dispatch) => {
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/TipoCatalogo`)
    if (response.data.error) {
      return { data: { message: response.data.message, error: true } }
    } else {
      dispatch(loadCatalogos(response.data))
      return { error: false }
    }
  } catch (error) {
    dispatch(catalogosError(error.message))
    return { data: { message: error.message, error: true } }
  }
}

export const saveCatalogos = (data) => async (dispatch) => {
  try {
    const response = await axios.post(`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/TipoCatalogo/Create`, data)
    if (response.data.error) {
      dispatch(catalogosError(response.data.message))
      return { data: { message: response.data.message, error: true } }
    } else {
      dispatch(createCatalogos(response.data))
      return { error: false }
    }
  } catch (error) {
    dispatch(catalogosError(error.message))
    return { data: { message: error.message, error: true } }
  }
}

export const updateCatalogos = (data) => async (dispatch) => {
  try {
    const response = await axios.put(`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/TipoCatalogo/Update`, data)
    if (response.data.error) {
      dispatch(catalogosError(response.data.message))
      return { data: { message: response.data.message, error: true } }
    } else {
      return { data: { error: false } }
    }
  } catch (error) {
    dispatch(catalogosError(error.message))
    return { data: { message: error.message, error: true } }
  }
}

export const updateStateCatalogos = (id, state) => async (dispatch) => {
  try {
    const response = await axios.put(`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/TipoCatalogo/UpdateEstadoTipoCatalogo/${id}/${state}`)
    if (response.data.error) {
      dispatch(catalogosError(response.data.message))
      return { data: { message: response.data.message, error: true } }
    } else {
      dispatch(changeStateCatalogos({ id, state }))
      return { error: false }
    }
  } catch (error) {
    dispatch(catalogosError(error.message))
    return { data: { message: error.message, error: true } }
  }
}

export const setCatalogoActive = (item) => async (dispatch, getState) => {
  try {
    dispatch(setActive(item))
    return { error: false }
  } catch (e) {
    return { error: e.response.data.error }
  }
}

export const canDeactivateTipoCatalogo = async (tipoCatalogoId) => {
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/TipoCatalogo/CanDeactivateTipoCatalogo/${tipoCatalogoId}`)
    return response.data
  } catch (error) {
    return { data: { message: error.message, error: true } }
  }
}
