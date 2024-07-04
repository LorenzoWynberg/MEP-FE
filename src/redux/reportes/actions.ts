import {
  LOAD_STUDENTS_NIVEL,
  LOAD_STUDENTS_DISABILITIES,
  LOAD_STUDENTS_NATIONALITIES,
  LOAD_STUDENTS_GENDERS,
  LOAD_STUDENTS_INSTITUTIONS,
  LOAD_SELECTS_FILTERS,
  LOAD_REGIONALES_FILTROS,
  LOAD_REPORTES_INCIDENCIAS,
  LOAD_REPORTES_ASISTENCIAS,
} from './types'
import { envVariables } from 'Constants/enviroment'
import axios from 'axios'

interface requestType {
    regionalId: number
    circuitoId: number
    institucionId: number
    ofertaModalServId: number
}

const loadStudentsNivel = (payload) => ({
  type: LOAD_STUDENTS_NIVEL,
  payload
})

const loadStudentsDisabilities = (payload) => ({
  type: LOAD_STUDENTS_DISABILITIES,
  payload
})

const loadStudentsNationalities = (payload) => ({
  type: LOAD_STUDENTS_NATIONALITIES,
  payload
})

const loadStudentsGenderes = (payload) => ({
  type: LOAD_STUDENTS_GENDERS,
  payload
})

const loadStudentsInstitutions = (payload) => ({
  type: LOAD_STUDENTS_INSTITUTIONS,
  payload
})

const loadSelectsFilters = (payload) => ({
  type: LOAD_SELECTS_FILTERS,
  payload
})

const loadRegionales = (payload) => ({
  type: LOAD_REGIONALES_FILTROS,
  payload
})

const getStudentsNivel = (request: requestType) => async (dispatch) => {
  try {
    const response = await axios.post(`${envVariables.BACKEND_URL}/api/Areas/Reportes/TableroDeDatos/PersonasEstudiantesPorNivel`, request)
    dispatch(loadStudentsNivel(response.data || []))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

const getStudentsDisabilites = (request: requestType) => async (dispatch) => {
  try {
    const response = await axios.post(`${envVariables.BACKEND_URL}/api/Areas/Reportes/TableroDeDatos/PersonasEstudiantesConDiscapacidad`, request)
    dispatch(loadStudentsDisabilities(response.data || []))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

const getStudentsNationalities = (request: requestType) => async (dispatch) => {
  try {
    const response = await axios.post(`${envVariables.BACKEND_URL}/api/Areas/Reportes/TableroDeDatos/PersonasEstudiantesPorNacionalidad`, request)
    dispatch(loadStudentsNationalities(response.data || []))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

const getStudentsGenders = (request: requestType) => async (dispatch) => {
  try {
    const response = await axios.post(`${envVariables.BACKEND_URL}/api/Areas/Reportes/TableroDeDatos/PersonasEstudiantesPorGenero`, request)
    dispatch(loadStudentsGenderes(response.data || []))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

const getStudentsInstitutions = (request: requestType) => async (dispatch) => {
  try {
    const response = await axios.post(`${envVariables.BACKEND_URL}/api/Areas/Reportes/TableroDeDatos/PersonasEstudiantesPorInstitucion`, request)
    dispatch(loadStudentsInstitutions(response.data || []))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

const getDataFromRegional = (regionalId: number) => async (dispatch) => {
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/Areas/Reportes/TableroDeDatos/GetCircuitosbyRegionalId/${regionalId}`)
    dispatch(loadSelectsFilters(response.data.map(el => {
      return { ...el, circuitos: JSON.parse(el.circuitos) }
    })))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

const getRegionales = () => async (dispatch) => {
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/Admin/Regional`)
    dispatch(loadRegionales(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

const getIncidentsReports = () => async (dispatch) => {
  try {
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/Admin/Regional`)
    dispatch(loadRegionales(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export default {
  getStudentsNivel,
  getStudentsDisabilites,
  getStudentsNationalities,
  getStudentsGenders,
  getStudentsInstitutions,
  getDataFromRegional,
  getRegionales
}
