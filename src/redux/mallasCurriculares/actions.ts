import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import {
  LOAD_MALLA,
  LOAD_MALLAS_PAGINATED,
  LOAD_MALLA_ASIGNATURA,
  LOAD_MALLA_NIVELES_OFERTA,
  LOAD_MALLA_NIVELES_EDITED,
  LOAD_MALLA_PERIODO_BLOQUES,
  LOAD_MALLA_EDITED,
  LOAD_MALLA_COMPONENTS,
  MALLA_REMOVE_MALLA_ASIGNATURA,
  MALLAS_CLEAN_BLOQUES,
  MALLA_LOAD_MALLAS_INSTITUCION,
  MALLA_LOAD_MALLAS_ASIGNATURAS_INSTITUCION,
  MALLA_LOAD_CURRENT_MALLAS_ASIGNATURAS_INSTITUCION
} from './types'

const cleanBloquesDispatch = (payload) => ({
  type: MALLAS_CLEAN_BLOQUES,
  payload
})

const loadMallaAsignatura = (payload) => ({
  type: LOAD_MALLA_ASIGNATURA,
  payload
})

const loadMalla = (payload) => ({
  type: LOAD_MALLA,
  payload
})

const loadMallas = (payload) => ({
  type: LOAD_MALLAS_PAGINATED,
  payload
})

const loadModelOfferNivelOferta = (payload) => ({
  type: LOAD_MALLA_NIVELES_OFERTA,
  payload
})

const loadEditedMalla = (payload) => ({
  type: LOAD_MALLA_EDITED,
  payload
})

const loadMallaAsignaturaEdited = (payload) => ({
  type: LOAD_MALLA_NIVELES_EDITED,
  payload
})

const loadMallaAsignaturaComponents = (payload) => ({
  type: LOAD_MALLA_COMPONENTS,
  payload
})

const loadPeriodoBloques = (payload) => ({
  type: LOAD_MALLA_PERIODO_BLOQUES,
  payload
})

const removeMallasAsignaturas = (payload) => ({
  type: MALLA_REMOVE_MALLA_ASIGNATURA,
  payload
})

const loadMallasInstitutcion = (payload) => ({
  type: MALLA_LOAD_MALLAS_INSTITUCION,
  payload
})

const loadMallasAsignaturasInstitutcion = (payload) => ({
  type: MALLA_LOAD_MALLAS_ASIGNATURAS_INSTITUCION,
  payload
})

const loadCurrentMallaAsignaturaInstitutcion = (payload) => ({
  type: MALLA_LOAD_CURRENT_MALLAS_ASIGNATURAS_INSTITUCION,
  payload
})

export const saveMalla = (data) => async (dispatch) => {
  try {
    const response = await axios.post(`${envVariables.BACKEND_URL}/api/MallaCurricular`, data)
    dispatch(loadMalla(response.data))
    return { error: false }
  } catch (e) {
    dispatch(loadMalla({}))
    return { error: e.message }
  }
}

export const editMalla = (data, disable = false) => async (dispatch) => {
  try {
    const response = await axios.put(`${envVariables.BACKEND_URL}/api/MallaCurricular/${data.id}`, data)
    if (!disable) {
      dispatch(loadEditedMalla(response.data))
    }
    dispatch(getMallas(1, 10, ''))
    return { error: false }
  } catch (e) {
    dispatch(loadMalla({}))
    return { error: e.message }
  }
}

export const getMallas = (page, pageQuantity, filter) => async (dispatch) => {
  try {
    const response = await axios.get(
            `${envVariables.BACKEND_URL}/api/MallaCurricular?Pagina=${page}&Cantidad=${pageQuantity}&Filtro=${filter}`
    )
    dispatch(loadMallas(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const getMalla = (id) => async (dispatch) => {
  try {
    const response = await axios.get(
            `${envVariables.BACKEND_URL}/api/MallaCurricular/GetByIdJoin/${id}`
    )
    dispatch(loadMalla(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const saveMallaAsignatura = (data) => async (dispatch) => {
  try {
    const response = await axios.post(
            `${envVariables.BACKEND_URL}/api/MallaCurricularAsignatura`,
            data
    )
    dispatch(loadMallaAsignatura(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const editMallaAsignatura = (data) => async (dispatch) => {
  try {
    const response = await axios.put(
            `${envVariables.BACKEND_URL}/api/MallaCurricularAsignatura/${data.id}`,
            data
    )
    dispatch(loadMallaAsignaturaEdited(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const getPeriodoBloques = (id) => async (dispatch) => {
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/Periodo/GetByIdJoin/${id}`)
    dispatch(loadPeriodoBloques(response.data.fechaPeriodoCalendario))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const getLvlOfertas = (id) => async (dispatch) => {
  try {
    const response = await axios.get(
            `${envVariables.BACKEND_URL}/api/NivelOfertas/GetByOfertaModalServ?ofertaModalServId=${id}`
    )
    dispatch(loadModelOfferNivelOferta(response.data))
    return {
      error: false,
      data: response.data
    }
  } catch (e) {
    return { error: e.message }
  }
}

export const saveOfertasList = (data, mallaId) => async (dispatch) => {
  try {
    const response = await axios.post(
            `${envVariables.BACKEND_URL}/api/MallaCurricularAsignatura/saveListComponents`,
            data
    )
    dispatch(loadMallaAsignaturaComponents(data.listItems))
    dispatch(getMalla(mallaId))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const deleteMallasAsignaturasMultiples = (data) => async (dispatch) => {
  try {
    const response = await axios.post(
            `${envVariables.BACKEND_URL}/api/MallaCurricularAsignatura/deleteMultiple`,
            data
    )
    dispatch(removeMallasAsignaturas(data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const cleanBloques = () => (dispatch) => {
  dispatch(cleanBloquesDispatch())
}

// MALLAS CONFIGURACION

export const getCentroMallas = (institutionId) => async (dispatch) => {
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/MallaCurricularInstitucion/GetByIdJoin/${institutionId}`)
    dispatch(loadMallasInstitutcion(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const getAsignaturasMallaInstitucionByMallaInstitucionId = (id) => async (dispatch) => {
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/MallaCurricularAsignaturaInstitucion/GetByIdJoin/${id}`)
    dispatch(loadMallasAsignaturasInstitutcion(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const syncMalla = (mallaId, anioId) => async (dispatch) => {
  try {
    const response = await axios.post(`${envVariables.BACKEND_URL}/api/MallaCurricular/SyncMalla/${mallaId}/${anioId}`)
    return response.data
  } catch (e) {
    return e
  }
}

export const createAsignaturasMallaInstitucionByMallaInstitucion = (data) => async (dispatch) => {
  try {
    const response = await axios.post(`${envVariables.BACKEND_URL}/api/MallaCurricularAsignaturaInstitucion`, data)
    dispatch(loadCurrentMallaAsignaturaInstitutcion(response.data))
    return { error: false, newId: response.data.id }
  } catch (e) {
    return { error: e.message }
  }
}

export const editAsignaturasMallaInstitucionByMallaInstitucion = (data) => async (dispatch) => {
  try {
    const response = await axios.put(`${envVariables.BACKEND_URL}/api/MallaCurricularAsignaturaInstitucion/${data.mallaCurricularAsignaturaInstitucionId}`, data)
    dispatch(loadCurrentMallaAsignaturaInstitutcion(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const deleteMallasAsignaturasInstitucionMultiples = (data) => async (dispatch) => {
  try {
    const response = await axios.post(
            `${envVariables.BACKEND_URL}/api/MallaCurricularAsignaturaInstitucion/deleteMultiple`,
            data
    )

    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const deleteMalla = (id: number, institucion: number) => async (dispatach: any) => {
  try {
    const response = await axios.delete(`${envVariables.BACKEND_URL}/api/MallaCurricularInstitucion/FullDelete/${id}`)
    dispatach(getCentroMallas(institucion))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}
