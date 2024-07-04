import {
  LOAD_ASIGNATURAS,
  LOAD_ASIGNATURAS_TIPOS,
  LOAD_ASIGNATURAS_OPTIONS,
  LOAD_ASIGNATURAS_PAGINATED,
  LOAD_TIPOS_EVALUACIONES
} from './types'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'

const loadAsignaturas = (payload) => ({
  type: LOAD_ASIGNATURAS,
  payload
})

const loadAsignaturasPaginated = (payload) => ({
  type: LOAD_ASIGNATURAS_PAGINATED,
  payload
})

const loadTiposAsignaturas = (payload) => ({
  type: LOAD_ASIGNATURAS_TIPOS,
  payload
})

const loadAsignaturasOptions = (payload) => ({
  type: LOAD_ASIGNATURAS_OPTIONS,
  payload
})

const loadTiposEvaluaciones = (payload) => ({
  type: LOAD_TIPOS_EVALUACIONES,
  payload
})

export const getAsignaturas =
  (page, pageQuantity, filter) => async (dispatch) => {
    try {
      const response = await axios.get(
        `${envVariables.BACKEND_URL}/api/Asignatura?Pagina=${page}&Cantidad=${pageQuantity}&Filtro=${filter}`
      )
      dispatch(loadAsignaturasPaginated(response.data))
      return { error: false }
    } catch (e) {
      return { error: e.message }
    }
  }

export const getAllTiposAsignaturas = () => async (dispatch) => {
  try {
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/TipoAsignatura/getAll`
    )
    dispatch(
      loadTiposAsignaturas(
        response.data?.filter((item) => item.estado == true)
      )
    )
    dispatch(
      loadAsignaturasOptions(
        response.data?.filter((item) => item.estado == true)
      )
    )
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const getAllAsignaturas = () => async (dispatch) => {
  try {
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/Asignatura/getAll`
    )
    dispatch(loadAsignaturas(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const getAllAsignaturasByGroup = (GrupoId) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/AsignaturaGrupo/GetAllByGrupoId/${GrupoId}`
    )
    dispatch(loadAsignaturas(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const getTiposAsignaturas =
  (page, pageQuantity, filter) => async (dispatch) => {
    try {
      const response = await axios.get(
        `${envVariables.BACKEND_URL}/api/TipoAsignatura?Pagina=${page}&Cantidad=${pageQuantity}&Filtro=${filter}`
      )
      dispatch(loadTiposAsignaturas(response.data))
      return { error: false }
    } catch (e) {
      return { error: e.message }
    }
  }

export const createTipoAsignatura = (data) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${envVariables.BACKEND_URL}/api/TipoAsignatura`,
      data
    )
    // dispatch(loadTiposAsignaturas(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const createAsignatura = (data) => async (dispatch, getState) => {
  const state = getState().asignaturas.asignaturas
  try {
    const response = await axios.post(
      `${envVariables.BACKEND_URL}/api/Asignatura`,
      data
    )
    dispatch(loadAsignaturas([...state, response.data]))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const updateAsignatura = (data) => async (dispatch, getState) => {
  const state = getState().asignaturas.asignaturas
  try {
    const response = await axios.put(
      `${envVariables.BACKEND_URL}/api/Asignatura/${data.id}`,
      data
    )
    const _data = state.map((el) => {
      if (el.id === data.id) {
        return response.data
      } else {
        return { ...el }
      }
    })
    dispatch(loadAsignaturas([..._data]))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}
export const deleteAsignatura = (data) => async (dispatch) => {
  try {
    const response = await axios.delete(
      `${envVariables.BACKEND_URL}/api/Asignatura/${data.id}`
    )
    getAllAsignaturas()
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const updateTipoAsignatura = (data) => async (dispatch) => {
  try {
    const response = await axios.put(
      `${envVariables.BACKEND_URL}/api/TipoAsignatura/${data.id}`,
      data
    )
    // dispatch(loadTiposAsignaturas(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}
export const deleteTipoAsignatura = (data) => async (dispatch) => {
  try {
    const response = await axios.delete(
      `${envVariables.BACKEND_URL}/api/TipoAsignatura/${data.id}`
    )
    getAllTiposAsignaturas()
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}
export const toggleAsignaturaEstado = (data) => async () => {
  try {
    const response = await axios.put(
      `${envVariables.BACKEND_URL}/api/Asignatura/toggle/${data.id}`
    )
    getAllAsignaturas()
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}
export const toggleTipoAsignaturaEstado = (data) => async () => {
  try {
    const response = await axios.put(
      `${envVariables.BACKEND_URL}/api/TipoAsignatura/toggle/${data.id}`
    )
    getAllTiposAsignaturas()
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}
export const getTiposEvaluacion = () => async (dispatch) => {
  try {
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/MallaCurricular/GetTiposEvaluacion`
    )
    dispatch(loadTiposEvaluaciones(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}
