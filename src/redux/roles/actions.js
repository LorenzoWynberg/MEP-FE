import { envVariables } from 'Constants/enviroment'
import axios from 'axios'
import {
  ROLES_PROFILES_LOAD,
  ROLES_SECTIONS_LOAD,
  ROLES_MODULOS_LOAD,
  ROLES_APARTADOS_LOAD,
  ROLES_ERROR,
  ROLES_LOAD,
  ROLES_CREATE,
  ROLES_DELETE,
  ROLES_TIPO_LOAD,
  ROLES_GET_LOAD,
  ROLES_CLEAR,
  ROLES_UPDATE,
  ROLES_CREATE_PERFIL
} from './rolesTypes'

const loadRolesProfiles = (response) => ({
  type: ROLES_PROFILES_LOAD,
  payload: response
})

const loadRol = (payload) => ({
  type: ROLES_GET_LOAD,
  payload
})
const loadRoles = (payload) => ({
  type: ROLES_LOAD,
  payload
})
const loadTipoRoles = (payload) => ({
  type: ROLES_TIPO_LOAD,
  payload
})

const removeRoles = (payload) => ({
  type: ROLES_DELETE,
  payload
})

const createRoles = (payload) => ({
  type: ROLES_CREATE,
  payload
})
const createPerfil = (payload) => ({
  type: ROLES_CREATE_PERFIL,
  payload
})
const updateRoles = (payload) => ({
  type: ROLES_UPDATE,
  payload
})

const loadRolesSections = (response) => ({
  type: ROLES_SECTIONS_LOAD,
  payload: response
})
const loadRolesModulos = (response) => ({
  type: ROLES_MODULOS_LOAD,
  payload: response
})
const loadRolesApartados = (response) => ({
  type: ROLES_APARTADOS_LOAD,
  payload: response
})

const rolesError = (error) => ({
  type: ROLES_ERROR,
  payload: error
})
const rolesClear = () => ({
  type: ROLES_CLEAR
})

export const getById = (id) => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Admin/Roles/get/${id}`
    )
    if (response.data.error) {
      return { message: response.data.message, error: true }
    } else {
      dispatch(loadRol(response.data))
      return { error: false }
    }
  } catch (error) {
    dispatch(rolesError(error.message))
    return { message: error.message, error: true }
  }
}

export const getRoleProfiles = (id) => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Admin/Roles/${id}/Perfiles`
    )
    if (response.data.error) {
      return { message: response.data.message, error: true }
    } else {
      dispatch(loadRolesProfiles(response.data))
      return { error: false }
    }
  } catch (error) {
    dispatch(rolesError(error.message))
    return { message: error.message, error: true }
  }
}

export const getSections = () => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Admin/Roles/Secciones`
    )
    if (response.data.error) {
      return { message: response.data.message, error: true }
    } else {
      dispatch(loadRolesSections(response.data))
      return { error: false }
    }
  } catch (error) {
    dispatch(rolesError(error.message))
    return { message: error.message, error: true }
  }
}

export const getSectionsByApartado = (apartadoId) => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Admin/Roles/SeccionesByApartado/${apartadoId}`
    )
    if (response.data.error) {
      return { message: response.data.message, error: true }
    } else {
      dispatch(loadRolesSections(response.data))
      return { error: false }
    }
  } catch (error) {
    dispatch(rolesError(error.message))
    return { message: error.message, error: true }
  }
}

export const getApartados = () => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Admin/Roles/Apartados`
    )
    if (response.data.error) {
      return { message: response.data.message, error: true }
    } else {
      dispatch(loadRolesApartados(response.data))
      return { error: false }
    }
  } catch (error) {
    dispatch(rolesError(error.message))
    return { message: error.message, error: true }
  }
}

export const getApartadosByModulo = (moduloId) => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Admin/Roles/ApartadosByModulo/${moduloId}`
    )
    if (response.data.error) {
      return { message: response.data.message, error: true }
    } else {
      dispatch(loadRolesApartados(response.data))
      return { error: false }
    }
  } catch (error) {
    dispatch(rolesError(error.message))
    return { message: error.message, error: true }
  }
}

export const getModulos = () => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Admin/Roles/Modulos`
    )
    if (response.data.error) {
      return { message: response.data.message, error: true }
    } else {
      dispatch(loadRolesModulos(response.data))
      return { error: false }
    }
  } catch (error) {
    dispatch(rolesError(error.message))
    return { message: error.message, error: true }
  }
}

export const getRoles = () => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Admin/Roles`
    )
    if (response.data.error) {
      return { message: response.data.message, error: true }
    } else {
      dispatch(loadRoles(response.data))
      return { error: false }
    }
  } catch (error) {
    dispatch(rolesError(error.message))
    return { message: error.message, error: true }
  }
}

export const editRoles = (data) => async (dispatch) => {
  try {
    const response = await axios.put(
			`${envVariables.BACKEND_URL}/api/Admin/Roles`,
			data
    )
    if (response.data.error) {
      dispatch(rolesError(response.data.message))
      return { message: response.data.message, error: true }
    } else {
      dispatch(updateRoles(response.data))
      return { error: false }
    }
  } catch (error) {
    dispatch(rolesError(error.message))
    return { message: error.message, error: true }
  }
}

export const saveRoles = (data) => async (dispatch) => {
  try {
    const response = await axios.post(
			`${envVariables.BACKEND_URL}/api/Admin/Roles`,
			data
    )
    if (response.data.error) {
      dispatch(rolesError(response.data.message))
      return { message: response.data.message, error: true }
    } else {
      dispatch(createRoles(response.data))
      return { error: false }
    }
  } catch (error) {
    dispatch(rolesError(error.message))
    return { message: error.message, error: true }
  }
}

export const crearPerfil = (data) => async (dispatch) => {
  try {
    const response = await axios.post(
			`${envVariables.BACKEND_URL}/api/Admin/Roles/perfil`,
			data
    )
    if (response.data.error) {
      dispatch(rolesError(response.data.message))
      return { message: response.data.message, error: true }
    } else {
      dispatch(createPerfil(response.data))
      return { error: false, data: response.data }
    }
  } catch (error) {
    dispatch(rolesError(error.message))
    return { message: error.message, error: true }
  }
}

export const deleteRoles = (id) => async (dispatch) => {
  try {
    const response = await axios.delete(
			`${envVariables.BACKEND_URL}/api/Admin/Roles/${id}`
    )
    if (response.data.error) {
      dispatch(rolesError(response.data.message))
      return { message: response.data.message, error: true }
    } else {
      dispatch(removeRoles(id))
      return { error: false }
    }
  } catch (error) {
    dispatch(rolesError(error.message))
    return { message: error.message, error: true }
  }
}

export const duplicarRoles = (id) => async (dispatch) => {
  try {
    const response = await axios.post(
			`${envVariables.BACKEND_URL}/api/Admin/Roles/duplicar/${id}`
    )
    if (response.data.error) {
      dispatch(rolesError(response.data.message))
      return { message: response.data.message, error: true }
    } else {
      return { error: false }
    }
  } catch (error) {
    dispatch(rolesError(error.message))
    return { message: error.message, error: true }
  }
}

export const updateRole = (rolId, perfilId, data) => async (dispatch) => {
  try {
    const response = await axios.put(
			`${envVariables.BACKEND_URL}/api/Admin/Roles/${rolId}/Perfiles/${perfilId}`,
			data
    )
    if (response.data.error) {
      dispatch(rolesError(response.data.message))
      return { message: response.data.message, error: true }
    } else {
      return { error: false }
    }
  } catch (error) {
    dispatch(rolesError(error.message))
    return { message: error.message, error: true }
  }
}

export const getTipoRoles = () => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Admin/Roles/GetAllTipoRoles`
    )
    if (response.data.error) {
      dispatch(rolesError(response.data.message))
      return { message: response.data.message, error: true }
    } else {
      dispatch(loadTipoRoles(response.data))
      return { error: false }
    }
  } catch (error) {
    dispatch(rolesError(error.message))
    return { message: error.message, error: true }
  }
}

export const getRolesByTipo = (tipoRolId) => async (dispatch) => {
  try {
    const url = `${envVariables.BACKEND_URL}/api/Admin/Roles/GetAllRolbyTipoRol?TipoRolId=${tipoRolId}`
    const response = await axios.get(url)

    if (response.data) {
      dispatch(loadRoles(response.data))
      return { data: response.data, error: false }
    }
  } catch (e) {
    dispatch(rolesError(e.message))
    return { message: e.message, error: true }
  }
}

export const clearRol = () => async (dispatch) => {
  try {
    dispatch(rolesClear())
    return { error: false }
  } catch (error) {
    dispatch(rolesError(error.message))
    return { message: error.message, error: true }
  }
}
