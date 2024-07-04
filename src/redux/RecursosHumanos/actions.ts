import {
  LOAD_FUNCIONARIO,
  LOAD_ASIGNATURAS_BY_PROFESORINSTITUCION,
  FUNCIONARIO_DETAIL,
  LOAD_FUNCIONARIOS_BY_ID,
  LOAD_CATALOGOS,
  LOAD_ROL_INFO,
  LOAD_ROLES_SECCIONES_DATA
} from './types'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'

const loadFuncionario = (payload) => ({
  type: LOAD_FUNCIONARIO,
  payload
})

const loadFuncionarioIdentificacion = (payload) => ({
  type: FUNCIONARIO_DETAIL,
  payload
})

const loadLeccionesByProfesor = (payload) => ({
  type: LOAD_ASIGNATURAS_BY_PROFESORINSTITUCION,
  payload
})

const loadFuncionarioid = (payload) => ({
  type: LOAD_FUNCIONARIOS_BY_ID,
  payload
})

export const deleteFuncionario = (data) => async (displatch) => {
  try {
    await axios.delete(
			`${envVariables.BACKEND_URL}/api/Funcionario/${data.id}`
    )
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const getFuncionarios = (institutionId) => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Funcionario/GetFuncionarioByInstitucionId/${institutionId}`
    )
    dispatch(loadFuncionario(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const createFuncionario = (data) => async (dispatch) => {
  try {
    const response = await axios.post(
			`${envVariables.BACKEND_URL}/api/ProfesoresInstitucion`,
			data
    )
    return { error: false }
  } catch (e) {
    return { error: e.response?.data?.error || e.message }
  }
}

export const getLeccionesByProfesorID = (profesorId) => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Funcionario/GetLeccionesByProfesorInstitucionId/${profesorId}`
    )
    dispatch(loadLeccionesByProfesor(response.data))
  } catch (e) {
    return { error: e.message }
  }
}
export const getFuncionariosIdentificacion =
	(identificacion) => async (dispatch) => {
	  try {
	    const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/Identidad/Persona/GetByIdentification/${identificacion}`
	    )
	    dispatch(loadFuncionarioIdentificacion(response.data))
	    return { error: false, data: response.data }
	  } catch (e) {
	    return { error: e.message }
	  }
	}

export const getFuncionariosid = (id) => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Identidad/Persona/GetById/${id}`
    )
    dispatch(loadFuncionarioid(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

const loadCatalogosReducer = (payload) => {
  return { type: LOAD_CATALOGOS, payload }
}
export const loadCatalogos = () => async (dispatch) => {
  try {
    // {{HOST}}/api/Catalogo/List
    const response = await axios.post(
			`${envVariables.BACKEND_URL}/api/Catalogo/List`,
			[4, 5, 8, 9, 1, 2, 3]
    )

    dispatch(loadCatalogosReducer(response.data))
  } catch (e) {}
}

export const getFuncionariosByTipoIdAndId =
	(tipoId, identificacion) => async (dispatch) => {
	  try {
	    const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/Identidad/Persona/GetByTipoIdAndId/${tipoId}_${identificacion}`
	    )
	    dispatch(loadFuncionarioIdentificacion(response.data))
	    return { error: false, data: response.data }
	  } catch (e) {
	    return { error: e.message }
	  }
	}

export const getRolInfoByIdentificacion =
	(identificacion) => async (dispatch) => {
	  try {
	    const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/GetRolesInfoByIdentidad?identidad=${identificacion}`
	    )

	    dispatch({ type: LOAD_ROL_INFO, payload: response.data })
	    return response.data
	  } catch (e) {
	    console.log(e)
	  }
	}
export const getGetAllRolesProfesorByUsuarioId =
	(usuarioId) => async (dispatch) => {
	  try {
	    const response = await axios.get<any>(
				`${envVariables.BACKEND_URL}/api/ProfesoresInstitucion/GetAllRolesProfesorByUsuarioId?usuarioId=${usuarioId}`
	    )
	    const { errorCode, errorMessage, data } = response.data
	    if (errorCode) {
	      throw new Error(errorMessage)
	    }
	    dispatch({ type: LOAD_ROLES_SECCIONES_DATA, payload: data })
	    return data
	  } catch (e) {
	    console.log(e)
	  }
	}
