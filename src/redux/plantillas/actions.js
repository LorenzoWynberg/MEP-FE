import { envVariables } from 'Constants/enviroment'
import axios from 'axios'
import { PLANTILLAS_PROFILES_LOAD, PLANTILLAS_SECTIONS_LOAD, PLANTILLAS_ERROR, PLANTILLAS_LOAD, PLANTILLAS_CREATE, PLANTILLAS_DELETE } from './plantillasTypes'

const loadPlantillasEstructura = (response) => ({
  type: PLANTILLAS_PROFILES_LOAD,
  payload: response
})

const loadPlantillas = (payload) => ({
  type: PLANTILLAS_LOAD,
  payload
})

const removePlantillas = (payload) => ({
  type: PLANTILLAS_DELETE,
  payload
})

const createPlantillas = (payload) => ({
  type: PLANTILLAS_CREATE,
  payload
})

const loadPlantillasSections = (response) => ({
  type: PLANTILLAS_SECTIONS_LOAD,
  payload: response
})

const PlantillasError = (error) => ({
  type: PLANTILLAS_ERROR,
  payload: error
})

export const getPlantillasEstructura = (id) => async (dispatch) => {
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}
      ​/api​/Areas​/GestorCatalogos​/TipoCatalogo​/GetByEstructura​/${id}/{estructuraId}`)
    if (response.data.error) {
      return { data: { message: response.data.message, error: true } }
    } else {
      dispatch(loadPlantillasEstructura(response.data))
      return { error: false }
    }
  } catch (error) {
    dispatch(PlantillasError(error.message))
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

export const getPlantillas = () => async (dispatch) => {
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/ComunicadoPlantilla`)
    if (response.data.error) {
      return { data: { message: response.data.message, error: true } }
    } else {
      dispatch(loadPlantillas(response.data))
      return { error: false }
    }
  } catch (error) {
    dispatch(PlantillasError(error.message))
    return { data: { message: error.message, error: true } }
  }
}

export const savePlantillas = (data) => async (dispatch) => {
  try {
    const response = await axios.post(`${envVariables.BACKEND_URL}/api/ComunicadoPlantilla/`, data)
    if (response.data.error) {
      dispatch(PlantillasError(response.data.message))
      return { data: { message: response.data.message, error: true } }
    } else {
      dispatch(createPlantillas(response.data))
      return { error: false }
    }
  } catch (error) {
    dispatch(PlantillasError(error.message))
    return { data: { message: error.message, error: true } }
  }
}

export const updatePlantillas = (data) => async (dispatch) => {
  try {
    const response = await axios.put(`${envVariables.BACKEND_URL}/api/ComunicadoPlantilla/${data.id}`, data)
    if (response.data.error) {
      dispatch(PlantillasError(response.data.message))
      return { data: { message: response.data.message, error: true } }
    } else {
      return { data: { error: false } }
    }
  } catch (error) {
    dispatch(PlantillasError(error.message))
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
/* export const updateRole = (rolId, perfilId, data) => async (dispatch) => {

    try {
      const response = await axios.put(`${envVariables.BACKEND_URL}/api/Admin/Roles/${rolId}/Perfiles/${perfilId}`, data)
          if (response.data.error) {
              dispatch(rolesError(response.data.message))
              return { data: { message: response.data.message, error: true } };
          } else {
              return {data: {error: false}};
          }
    }
    catch (error) {
      dispatch(rolesError(error.message))
      return { data: { message: error.message, error: true } };
  }
}
 */
