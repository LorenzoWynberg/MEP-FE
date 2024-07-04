import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import * as TYPES from './types'

export const setEstudianteSeleccionado = (data) => {
  return {
    type: TYPES.SET_SELECTED_ESTUDIANTE,
    payload: data
  }
}

export const setHorario =
    (idEstudiante: number, idInstitucion: number) => async (dispatch) => {
      try {
        const endpoint = `/api/Areas/Externos/Estudiante/GetAllLeccionByEstudianteId/${idEstudiante}/${idInstitucion}/1/100`

        const response = await axios.get(
                `${envVariables.BACKEND_URL}${endpoint}`
        )
        dispatch({
          type: TYPES.SET_HORARIO,
          payload: response.data
        })
        return response.data
      } catch (e) {
        return { error: e.message }
      }
    }

export const setEstudiantesDeEncargado =
    (idEncargado: number) => async (dispatch) => {
      try {
        const endpoint = `/api/ExpedienteEstudiante/Miembro/GetEstudiantesByEncargado/${idEncargado}`
        const response = await axios.get(
                `${envVariables.BACKEND_URL}${endpoint}`
        )
        dispatch({
          type: TYPES.SET_ESTUDIANTES_ENCARAGADO,
          payload: response.data
        })
        return response.data
      } catch (e) {
        return { error: e.message }
      }
    }

export const setIncidenciasEstudiante =
    (idEstudiante: number, idInstitucion) => async (dispatch) => {
      try {
        const endpoint = `/api/Areas/Externos/Estudiante/GetAllIncidenciasByIdEstudiante/${idEstudiante}/${idInstitucion}/1/50`
        const response = await axios.get(
                `${envVariables.BACKEND_URL}${endpoint}`
        )
        dispatch({
          type: TYPES.SET_INCIDENCIAS_ESTUDIANTE,
          payload: response.data
        })
      } catch (e) {
        return { error: e.message }
      }
    }

export const setAsistenciasEstudiante =
    (idEstudiante: number, idInstitucion) => async (dispatch) => {
      try {
        const endpoint = `/api/Areas/Externos/Estudiante/GetAllAsistenciabyEstudianteId/${idEstudiante}/${idInstitucion}/1/50`
        const response = await axios.get(
                `${envVariables.BACKEND_URL}${endpoint}`
        )
        dispatch({
          type: TYPES.SET_ASISTENCIA_ESTUDIANTE,
          payload: response.data
        })
      } catch (e) {
        return { error: e.message }
      }
    }

export const setCalificacionesEstudiante =
    (idEstudiante: number, idInstitucion) => async (dispatch) => {
      try {
        const endpoint = `/api/Areas/Externos/Estudiante/GetAllCalificacionesByEstudianteId/${idEstudiante}/${idInstitucion}/1/50`
        const response = await axios.get<any>(
                `${envVariables.BACKEND_URL}${endpoint}`
        )

        dispatch({
          type: TYPES.SET_CALIFICACIONES_ESTUDIANTE,
          payload: response.data
        })
        return response.data
      } catch (e) {
        return { error: e.message }
      }
    }

export const setUsuarioActual = () => async (dispatch) => {
  try {
    const endpoint = '/api/Areas/Externos/Estudiante/GetIdentificacion'
    const response = await axios.get(
            `${envVariables.BACKEND_URL}${endpoint}`
    )
    dispatch({
      type: TYPES.SET_USUARIO_ACTUAL,
      payload: response.data
    })
    return response.data
  } catch (e) {
    return { error: e.message }
  }
}

export const setEstudianteIndex = (index) => async (dispatch) => {
  try {
    dispatch({
      type: TYPES.SET_ESTUDIANTE_INDEX,
      payload: index
    })
  } catch (e) {
    return { error: e.message }
  }
}

/* const loadInfo = (payload) => ({
    type: TYPES.SET_INFO_ACAMEDICA,
    payload,
}) */

const loadInfoGeneral = (payload) => ({
  type: TYPES.SET_INFO_GENERAL,
  payload
})

export const setSelectedAcademia = (data) => {
  return {
    type: TYPES.SET_SELECTED_INSTITUTION,
    payload: data
  }
}

export const getInfoAcademica =
    (idEstudiante, index) => async (dispatch) => {
      try {
        const response = await axios.get(
                `${envVariables.BACKEND_URL}/api/Areas/Externos/Estudiante/GetAllInstitucionesbyEstudiante/${idEstudiante}/1/100`
        )
        dispatch({
          type: TYPES.SET_ALL_INFO_ACADEMICA,
          payload: {
            data: response.data,
            index
          }
        })
        return { error: false }
      } catch (e) {
        return { error: e.message }
      }
    }

export const getSelectedEstudianteInfoAcademica =
    (idEstudiante) => async (dispatch, store) => {
      try {
        const response = await axios.get(
                `${envVariables.BACKEND_URL}/api/Areas/Externos/Estudiante/GetAllInstitucionesbyEstudiante/${idEstudiante}/1/100`
        )
        dispatch({
          type: TYPES.SET_SELECTED_ESTUDIANTE_INFO_ACADEMICA,
          payload: response.data
        })
        return { error: false }
      } catch (e) {
        return { error: e.message }
      }
    }

export const getInfoGeneralStudent =
    (idEstudiante, idInstitucion) => async (dispatch) => {
      try {
        const response = await axios.get(
                `${envVariables.BACKEND_URL}/api/Areas/Externos/Estudiante/GetInformacionGeneralEstudiante/${idEstudiante}/${idInstitucion}`
        )
        dispatch(loadInfoGeneral(response.data))
        return response.data
      } catch (e) {
        return { error: e.message }
      }
    }

export const getIdentidadById = (idEntidad) => async (dispatch) => {
  try {
    const response = await axios.get(
            `${envVariables.BACKEND_URL}/api/Identidad/Persona/GetById/${idEntidad}`
    )
    dispatch({
      type: TYPES.SET_SELECTED_ESTUDIANTE,
      payload: response.data
    })
    return response.data
  } catch (e) {
    return { error: e.message }
  }
}

export const setMallaAsignaturaInformacion = (ids:number[]) => async (dispatch) => {
  try {
    const response = await axios.post(
            `${envVariables.BACKEND_URL}/api/MallaCurricularAsignatura/GetMallaAsignaturaInstitucionInfo`,
            ids
    )
    dispatch({
      type: TYPES.SET_INFO_MALLA,
      payload: response.data
    })
    return response.data
  } catch (e) {
    return { error: e.message }
  }
}
