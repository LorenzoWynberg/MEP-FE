import {
  LOAD_COMPONENTE_CALIFICACION,
  LOAD_COMPONENTE_CALIFICACION_PAGINATED,
  LOAD_COMPONENTE_CALIFICACION_ALL,
  LOAD_COMPONENT_CALIFICACION_BY_IDS
} from './types'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'

const loadComponenteCalificacion = (payload) => ({
  type: LOAD_COMPONENTE_CALIFICACION,
  payload
})

const loadComponentePaginated = (payload) => ({
  type: LOAD_COMPONENTE_CALIFICACION_PAGINATED,
  payload
})

const loadComponenteCalificacionOptions = (payload) => ({
  type: LOAD_COMPONENTE_CALIFICACION_ALL,
  payload
})

const loadComponenteCalificacionByIds = (payload) => ({
  type: LOAD_COMPONENT_CALIFICACION_BY_IDS,
  payload
})

export const getComponenteCalificacion = () => async (dispatch) => {
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/ComponentCalificacion`)
    dispatch(loadComponenteCalificacion(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const getComponenteCalificacionByListIds = (mallacurricularInstitucionID, asignaturaId, Ids: any) => async (dispatch) => {
  try {
    const response = await axios.post(`${envVariables.BACKEND_URL}/api/ComponentCalificacion/getAllbyListIds/${mallacurricularInstitucionID}/${asignaturaId}`, Ids)

    dispatch(loadComponenteCalificacionByIds(response.data))
    return { error: false }
  } catch (error) {
    return { error: error.message }
  }
}

export const getAllComponenteCalificacion = () => async (dispatch) => {
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/ComponentCalificacion/GetAllJoin`)
    dispatch(loadComponenteCalificacionOptions(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const getComponenteCalificacionPaginated = (page, pageQuantity, filter) => async (dispatch) => {
  try {
    const response = await axios.get(
            `${envVariables.BACKEND_URL}/api/ComponentCalificacion?Pagina=${page}&Cantidad=${pageQuantity}&Filtro=${filter}`
    )
    dispatch(loadComponentePaginated(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const createComponenteCalificacion = (data) => async (dispatch) => {
  try {
    const response = await axios.post(
            `${envVariables.BACKEND_URL}/api/ComponentCalificacion`, data
    )
    // dispatch(loadTiposAsignaturas(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const updateComponenteCalificacion = (data) => async (dispatch) => {
  try {
    const response = await axios.put(
            `${envVariables.BACKEND_URL}/api/ComponentCalificacion/${data.id}`, data
    )
    // dispatch(loadTiposAsignaturas(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const deleteComponenteCalificacion = (data) => async (dispatch) => {
  try {
    const response = await axios.delete(`${envVariables.BACKEND_URL}/api/ComponentCalificacion/${data.id}`)
    // dispatch(loadTiposAsignaturas(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const toggleComponenteEstado = (data) => async (dispatch) => {
  try {
    const response = await axios.put(`${envVariables.BACKEND_URL}/api/ComponentCalificacion/toggle/${data.id}`)

    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}
