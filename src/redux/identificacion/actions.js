import {
  IDENTIFICATION_LOAD,
  IDENTIFICATION_LOADING,
  IDENTIFICATION_ADD_CATALOGS,
  IDENTIFICATION_CLEAN,
  IDENTIFICATION_ERROR,
  IDENTIFICATION_LOAD_FICHA,
  IDENTIFICATION_LOAD_FICHA_DATOS_EDUCATIVOS,
  IDENTIFICATION_LOAD_FICHA_MEMBERS,
  CLEAN_FICHA,
  LOAD_MATRICULA_HISTORY
} from './types'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import { catalogsEnum } from '../../utils/catalogsEnum'
import { handleErrors } from '../../utils/handleErrors'

const loadIdentification = (payload) => ({
  type: IDENTIFICATION_LOAD,
  payload
})

const loading = () => ({
  type: IDENTIFICATION_LOADING
})

const clean = () => ({
  type: IDENTIFICATION_CLEAN
})

const errorDispatch = (payload) => ({
  type: IDENTIFICATION_ERROR,
  payload
})

const loadCatalog = (data, name) => ({
  type: IDENTIFICATION_ADD_CATALOGS,
  payload: {
    data,
    name
  }
})

const loadMatriculaHistory = (payload) => ({
  type: LOAD_MATRICULA_HISTORY,
  payload
})

const loadMembersFicha = (payload) => ({
  type: IDENTIFICATION_LOAD_FICHA_MEMBERS,
  payload
})

const loadDatosFicha = (payload) => ({
  type: IDENTIFICATION_LOAD_FICHA_DATOS_EDUCATIVOS,
  payload
})

const loadFichaPersona = (payload) => ({
  type: IDENTIFICATION_LOAD_FICHA,
  payload
})

export const cleanFicha = () => (dispatch) => {
  dispatch({ type: CLEAN_FICHA })
}

export const getIdentification =
	(id, redirect = true) =>
	  async (dispatch) => {
	    if (redirect) {
	      dispatch(loading())
	    }
	    try {
	      const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Expediente/GetById/${id}`
	      )
	      dispatch(loadIdentification(response.data))
	      return { data: { message: '', error: false, data: response.data } }
	    } catch (e) {
	      return { data: { message: e.message, error: true } }
	    }
	  }

export const updateIdentity = (identidad, file) => async (dispatch) => {
  const data = {
    ...identidad
  }
  dispatch(loading())
  try {
    if (file) {
      const profileImage = await uploadProfileImage(file)
      if (profileImage.error) {
        throw new Error(profileImage.message)
      }
      data.fotografiaUrl = profileImage
    }
    const response = await axios.put(
			`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Expediente/InfoGenral`,
			data
    )
    dispatch(loadIdentification(response.data))
    return { data: { message: '', error: false } }
  } catch (e) {
    dispatch(errorDispatch(handleErrors(e)))
    return { data: { message: e.message, error: true } }
  }
}

export const updateCurricularArea = (data) => async (dispatch) => {
  dispatch(loading())

  try {
    const response = await axios.put(
			`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Expediente/Hogar/AreaCurricular`,
			data
    )
    dispatch(loadIdentification(response.data))
    return { data: { message: '', error: false } }
  } catch (e) {
    dispatch(errorDispatch(handleErrors(e)))
    return { data: { message: e.message, error: true } }
  }
}

export const getCatalogs = (type, page = -1, size = -1) => async (dispatch, getState) => {
  try {
    const _type = catalogsEnum.find((item) => item.id === type)
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Catalogo/GetAllByType/${type}/${page}/${size}`
    )
    if (response.data.error) {
      return response
    } else {
      dispatch(loadCatalog(response.data, _type.name))
      return response
    }
  } catch (e) {
    dispatch(errorDispatch(handleErrors(e)))
    return { data: { message: e.message, error: true } }
  }
}

export const getCatalogsByCode = (type) => async (dispatch, getState) => {
  try {
    const _type = catalogsEnum.find((item) => item.id === type)
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Catalogo/GetAllbyCodeType/${type}`
    )
    if (response.data.error) {
      return response
    } else {
      dispatch(loadCatalog(response.data, _type.name))
      return response
    }
  } catch (e) {
    dispatch(errorDispatch(handleErrors(e)))
    return { data: { message: e.message, error: true } }
  }
}

export const updateInformacionOtrosEstudiante =
	(information) => async (dispatch) => {
	  try {
	    const response = await axios.put(
				`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Expediente/Hogar/OtrosDatos`,
				information
	    )
	    if (response.data.error) {
	      return {
	        data: { message: response.data.error.message, error: true }
	      }
	    } else {
	      return dispatch(loadIdentification(response.data))
	    }
	  } catch (error) {
	    return { data: { message: error.message, error: true } }
	  }
	}

export const cleanIdentity = () => (dispatch) => {
  dispatch(clean())
}

// HELPERS

export const uploadProfileImage = async (file) => {
  const data = new FormData()
  data.append('files', file)
  try {
    const response = await axios.post(
			`${envVariables.BACKEND_URL}/api/File`,
			data
    )
    return response.data[0]
  } catch (e) {
    return { message: e.message, error: true }
  }
}

export const uploadSingleFile = async (file, cb) => {
  const data = new FormData()
  data.append('files', file)
  try {
    const response = await axios.post(
			`${envVariables.BACKEND_URL}/api/File`,
			data,
			{
			  onUploadProgress: cb
			}
    )
    return response.data[0]
  } catch (e) {
    return { message: e.message, error: true }
  }
}

export const getFichaPersona = (id) => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Expediente/GetById/${id}`
    )
    dispatch(loadFichaPersona(response.data))
  } catch (e) {
    return { message: e.message, error: true }
  }
}

export const getFichaPersonaDatosEducativos = (id) => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Identidad/Persona/${id}/DatosAcademicos`
    )
    dispatch(loadDatosFicha(response.data))
  } catch (e) {
    return { message: e.message, error: true }
  }
}

export const getHistorialMatriculaEstudiante =
	(idEstudiante) => async (dispatch) => {
	  try {
	    const datosEducaivos = await axios.get(
				`${envVariables.BACKEND_URL}/api/Matricula/GetDatosEducativos/${idEstudiante}`
	    )
	    dispatch(loadMatriculaHistory(datosEducaivos.data))
	  } catch (e) {
	    return { message: e.message, error: true }
	  }
	}

export const getFamilyMembersFicha = (user) => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Miembro/GetMiembrosByStudent/${user}`
    )
    dispatch(loadMembersFicha(response.data))
    return { error: false }
  } catch (error) {
    return { error: 'Uno o mas errores han ocurrido' }
  }
}
