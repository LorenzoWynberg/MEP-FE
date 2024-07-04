import { envVariables } from 'Constants/enviroment'
import axios from 'axios'
import { MENSAJES_PROFILES_LOAD, MENSAJES_SECTIONS_LOAD, MENSAJES_ERROR, MENSAJES_LOAD, MENSAJES_CREATE, MENSAJES_DELETE } from './mensajesTypes'

const loadMensajesEstructura = (response) => ({
  type: MENSAJES_PROFILES_LOAD,
  payload: response
})

const loadMensajes = (payload) => ({
  type: MENSAJES_LOAD,
  payload
})

const removeMensajes = (payload) => ({
  type: MENSAJES_DELETE,
  payload
})

const createMensajes = (payload) => ({
  type: MENSAJES_CREATE,
  payload
})

const loadMensajesSections = (response) => ({
  type: MENSAJES_SECTIONS_LOAD,
  payload: response
})

const MensajesError = (error) => ({
  type: MENSAJES_ERROR,
  payload: error
})

export const getMensajesEstructura = (id) => async (dispatch) => {
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}
      ​/api​/Areas​/GestorCatalogos​/TipoCatalogo​/GetByEstructura​/${id}/{estructuraId}`)
    if (response.data.error) {
      return { data: { message: response.data.message, error: true } }
    } else {
      dispatch(loadMensajesEstructura(response.data))
      return { error: false }
    }
  } catch (error) {
    dispatch(MensajesError(error.message))
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

export const getMensajes = () => async (dispatch) => {
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/Template`)
    if (response.data.error) {
      return { data: { message: response.data.message, error: true } }
    } else {
      dispatch(loadMensajes(response.data))
      return { error: false }
    }
  } catch (error) {
    dispatch(MensajesError(error.message))
    return { data: { message: error.message, error: true } }
  }
}

export const saveMensajes = (data) => async (dispatch) => {
  try {
    const response = await axios.post(`${envVariables.BACKEND_URL}/api/Template`, data)
    if (response.data.error) {
      dispatch(MensajesError(response.data.message))
      return { data: { message: response.data.message, error: true } }
    } else {
      dispatch(createMensajes(response.data))
      return { error: false }
    }
  } catch (error) {
    dispatch(MensajesError(error.message))
    return { data: { message: error.message, error: true } }
  }
}

export const updateMensajes = (data) => async (dispatch) => {
  try {
    const response = await axios.put(`${envVariables.BACKEND_URL}/api/Template`, data)
    if (response.data.error) {
      dispatch(MensajesError(response.data.message))
      return { data: { message: response.data.message, error: true } }
    } else {
      return { data: { error: false } }
    }
  } catch (error) {
    dispatch(MensajesError(error.message))
    return { data: { message: error.message, error: true } }
  }
}

/* export const deleteCatalogos = (id) => async (dispatch) => {

    try {
      const response = await axios.delete(`${envVariables.BACKEND_URL}/api/Admin/Roles/${id}`)
          if (response.data.error) {
              dispatch(catalogosError(response.data.message))
              return { data: { message: response.data.message, error: true } };
          } else {
              dispatch(removeCatalogos(id))
              return {error: false};
          }
    }
    catch (error) {
      dispatch(catalogosError(error.message))
      return { data: { message: error.message, error: true } };
  }
}
 */
