import {
  APOYOS_LOADING,
  APOYOS_LOADING_ITEMS,
  LOAD_TIPOS,
  LOAD_DEPENDENCIAS,
  LOAD_CATEGORIAS,
  LOAD_APOYOS,
  LOAD_DISCAPACIDADES,
  LOAD_RECURSOS,
  LOAD_CONDICIONES,
  CLEAR_CURRENT_DISCAPACIDADES
} from './types'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'

const loading = (payload) => ({
  type: APOYOS_LOADING,
  payload
})

const loadingApoyos = (payload) => ({
  type: APOYOS_LOADING_ITEMS,
  payload
})

const loadTypes = (payload) => ({
  type: LOAD_TIPOS,
  payload
})

const loadDependencias = (payload) => ({
  type: LOAD_DEPENDENCIAS,
  payload
})

const loadCategories = (payload) => ({
  type: LOAD_CATEGORIAS,
  payload
})

export const loadDiscapacidades = (payload) => ({
  type: LOAD_DISCAPACIDADES,
  payload
})

const loadCondiciones = (payload) => ({
  type: LOAD_CONDICIONES,
  payload
})

const loadApoyos = (data, name) => ({
  type: LOAD_APOYOS,
  payload: {
    data,
    name
  }
})

const loadResources = (data, name) => ({
  type: LOAD_RECURSOS,
  payload: {
    data,
    name
  }
})

const cleadDiscapacidades = () => ({
  type: CLEAR_CURRENT_DISCAPACIDADES
})

export const addApoyo = (data, category, categoryKeyName, pageNumber) => async (
  dispatch
) => {
  loadingApoyos(categoryKeyName)
  try {
    const response = await axios.post(
      `${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Apoyo`,
      data
    )
    dispatch(getApoyosByType(data.identidadesId, pageNumber, 5, category))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const editApoyo = (
  data,
  category,
  categoryKeyName,
  pageNumber
) => async (dispatch) => {
  loadingApoyos(categoryKeyName)
  try {
    const response = await axios.put(
      `${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Apoyo`,
      data
    )
    dispatch(getApoyosByType(data.identidadesId, pageNumber, 5, category))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const clearCurrentDiscapacidades = () => (dispatch) => {
  dispatch(cleadDiscapacidades())
}

export const deleteApoyo = (
  id,
  categoryKeyName,
  identidadesId,
  pageNumber,
  category
) => async (dispatch) => {
  loadingApoyos(categoryKeyName)
  try {
    const response = await axios.delete(
      `${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Apoyo/${id}`
    )
    dispatch(getApoyosByType(identidadesId, pageNumber, 5, category))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const getTiposApoyos = () => async (dispatch) => {
  dispatch(loading(true))
  try {
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/TipoApoyo`
    )
    dispatch(loadTypes(response.data))
  } catch (e) {
    return { error: true, message: e.message }
  }
}

export const getDependenciasApoyos = () => async (dispatch) => {
  dispatch(loading(true))
  try {
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/DependenciaApoyo`
    )
    dispatch(loadDependencias(response.data))
  } catch (e) {
    return { error: true, message: e.message }
  }
}

export const getCategoriasApoyos = () => async (dispatch) => {
  dispatch(loading(true))
  try {
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/CategoriaApoyo`
    )
    dispatch(loadCategories(response.data))
  } catch (e) {
    return { error: true, message: e.message }
  }
}

export const getApoyosByType = (identidad, page, quantity, type) => async (
  dispatch
) => {
  dispatch(loading(true))
  dispatch(loadingApoyos(type.nombre.replace(/\s/g, '') + `${type.id}`))
  try {
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Apoyo/categoria/${type.id}/${page}/${quantity}?identidadId=${identidad}`
    )
    const responseData = {
      ...response.data,
      errors: [],
      fields: [],
      currentApoyoId: null,
      loading: false
    }
    dispatch(
      loadApoyos(responseData, type.nombre.replace(/\s/g, '') + `${type.id}`)
    )
  } catch (e) {
    return { error: true, message: e.message }
  }
}

export const getDiscapacidades = (identidad) => async (dispatch) => {
  try {
    debugger
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/DiscapacidadesPorUsuario/GetByIdentityId/${identidad}`
    )
    dispatch(loadDiscapacidades(response.data))
    return response.data
  } catch (e) {
    return { error: true, message: e.message }
  }
}

export const getCondiciones = (identidad) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/CondicionesPorUsuario/GetByIdentidad/${identidad}`
    )
    dispatch(loadCondiciones(response.data))
  } catch (e) {
    return { error: true, message: e.message }
  }
}

export const getResources = (type, identidadId) => async (dispatch) => {
  const url =
    type === 'discapacidades'
      ? `${envVariables.BACKEND_URL}/api/RecursosDiscapacidad/GetByIdentidad/${identidadId}`
      : `${envVariables.BACKEND_URL}/api/RecursosCondicion/GetRecursosByCondicion/${identidadId}`
  const name =
    type === 'discapacidades'
      ? 'recursosDiscapacidadesIdentidad'
      : 'recursosCondicionesIdentidad'
  try {
    const response = await axios.get(url)
    dispatch(loadResources(response.data || [], name))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const saveDiscapacidades = (
  dataDiscapacidades,
  dataConditions,
  uploadFilesDiscapacidades,
  uploadFilesCondition,
  discapacidadesToDelete,
  condicionesToDelete,
  identidadId
) => async (dispatch) => {
  try {
    if (uploadFilesDiscapacidades[0]) {
      for (const resource of uploadFilesDiscapacidades) {
        await createResource(resource, identidadId, 'discapacidad')
      }
    }
    if (uploadFilesCondition[0]) {
      for (const resource of uploadFilesCondition) {
        await createResource(resource, identidadId, 'condicion')
      }
    }

    if (discapacidadesToDelete[0]) {
      for (const resource of discapacidadesToDelete) {
        await deleteResource(resource.id, 'discapacidad')
      }
    }

    if (condicionesToDelete[0]) {
      for (const resource of condicionesToDelete) {
        await deleteResource(resource.id, 'condicion')
      }
    }

    if (dataDiscapacidades) {
      const DiscapacidadesResponse = await axios.post(
        `${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/DiscapacidadesPorUsuario/CreateMultiple/${identidadId}`,
        dataDiscapacidades
      )
      dispatch(loadDiscapacidades(DiscapacidadesResponse.data))
    }

    if (dataConditions) {
      const condicionesResponse = await axios.post(
        `${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/CondicionesPorUsuario/CreateMultiple/${identidadId}`,
        dataConditions
      )
      dispatch(loadCondiciones(condicionesResponse.data))
    }
    dispatch(getResources('discapacidades', identidadId))
    dispatch(getResources('condiciones', identidadId))

    return {
      error: false,
      message: ''
    }
  } catch (e) {
    return {
      error: true,
      message: e.message
    }
  }
}

// helpers
const createResource = async (file, identidadId, type) => {
  try {
    const data = new FormData()
    data.append('file', file)
    data.append('identidadId', identidadId)
    const response = await axios.post(
      `${envVariables.BACKEND_URL}/api/${
        type === 'discapacidad' ? 'RecursosDiscapacidad' : 'RecursosCondicion'
      }`,
      data
    )
    return { data: response.data, error: false }
  } catch (e) {
    return { data: null, error: true }
  }
}

const deleteResource = async (id, type) => {
  const url =
    type === 'discapacidad'
      ? `${envVariables.BACKEND_URL}/api/RecursosDiscapacidad/deleteById/${id}`
      : `${envVariables.BACKEND_URL}/api/RecursosCondicion/deleteById/${id}`
  try {
    const response = await axios.delete(url)
    return { data: response.data, error: false }
  } catch (e) {
    return { data: null, error: true }
  }
}
