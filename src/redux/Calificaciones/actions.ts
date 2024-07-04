import axios from 'axios'
import types from './types'
import { envVariables } from 'Constants/enviroment'

const loading = () => ({
  type: types.LOADING_SCORES
})

const getAllScores = (payload) => ({
  payload,
  type: types.GET_SCORES
})

const add = (payload) => ({
  payload,
  type: types.QUALIFY_STUDENT
})

const update = (payload) => ({
  payload,
  type: types.UPDATE_QUALIFY
})

const json = (payload) => ({
  payload,
  type: types.UPDATE_SUBJECT_GROUP_JSON
})

const removeScores = () => ({
  type: types.REMOVE_SCORES_BY_SUBJECT_GROUP
})

const getScoresBitacora = (payload) => ({
  type: types.LOAD_SCORES_BITACORA,
  payload
})

export const getBitacoraBySubject = (asignaturaId: number, grupoId: number) => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.get(`${envVariables?.BACKEND_URL}/api/AsignaturaGrupoEstudianteCalificaciones/GetBitacoraByGrupoYAsignatura/${asignaturaId}/${grupoId}`)
    dispatch(getScoresBitacora(response.data))
    return { error: false }
  } catch (error) {
    return { error: error?.message }
  }
}

export const getScoresBySubjectGroup = (subjectGroupId: number, page: number = -1, size: number = -1) => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.get(`${envVariables?.BACKEND_URL}/api/AsignaturaGrupoEstudianteMatriculado/GetAllACalificacionesbyAsignaturaGrupoId/${subjectGroupId}/${page}/${size}`)
    dispatch(getAllScores(response.data))
    return { error: false }
  } catch (error) {
    return { error: error?.message }
  }
}

export const qualifyStudent = (qualify: any) => async (dispatch) => {
  dispatch(loading())
  try {
    let response
    if (qualify.id) {
      response = await axios.put(`${envVariables?.BACKEND_URL}/api/Calificaciones`, qualify)
    } else {
      response = await axios.post(`${envVariables?.BACKEND_URL}/api/Calificaciones`, qualify)
    }
    dispatch(add(response.data))
    return { error: false }
  } catch (error) {
    return { error: error?.message }
  }
}

export const updateQualify = (qualify: any) => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.put(`${envVariables?.BACKEND_URL}/api/Calificaciones`, qualify)
    dispatch(update(response.data))
    return { error: false }
  } catch (error) {
    return { error: error?.message }
  }
}

export const updateJSON = (type: 'Componentes' | 'Rubrica' | 'ConfiguracionCalificacion' = 'Componentes', data, subject, period) => async (dispatch, getState) => {
  try {
    const subjectsGroup = getState().asignaturaGrupo?.asignaturas || []
    const asignaturasGruposByNivelOferta = getState().asignaturaGrupo.asignaturasGruposByNivelOferta || []

    const index = subjectsGroup.findIndex((el) => el.id === subject?.id)
    const indexSubjectByLevel = asignaturasGruposByNivelOferta.findIndex((el) => el.id === subject?.id)
    let newData = JSON.parse(JSON.stringify(data))
    if (type === 'ConfiguracionCalificacion') {
      newData = subject?.configuracionCalificacion ? { ...JSON.parse(subject?.configuracionCalificacion), ...data } : data
    }

    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        if (!item.fechaPeriodoCalendarioId) {
          newData[index] = {
            ...newData[index],
            fechaPeriodoCalendarioId: period?.fechaPeriodoCalendarioId
          }
        }
      })
    }

    const response: any = await axios.put(`${envVariables.BACKEND_URL}/api/AsignaturaGrupo/UpdateJsonData/${type}`, { data: JSON.stringify(newData), asignaturaId: subject?.id })
    if (index !== -1) {
      subjectsGroup[index] = {
        ...subjectsGroup[index],
        ...response.data
      }
    }
    if (indexSubjectByLevel !== -1) {
      asignaturasGruposByNivelOferta[indexSubjectByLevel] = {
        ...asignaturasGruposByNivelOferta[indexSubjectByLevel],
        ...response.data
      }
    }

    dispatch(json({ subjectsGroup, asignaturasGruposByNivelOferta }))
    return { error: false }
  } catch (error) {
    return { error: error.message }
  }
}

export const removeScoresBySubjectGroup = (subjectGroupId: number) => async (dispatch) => {
  try {
    const response: any = await axios.delete(`${envVariables.BACKEND_URL}/api/Calificaciones/DeletebyAsignaturaGrupoId/${subjectGroupId}`)
    dispatch(removeScores())
    return { error: false }
  } catch (error) {
    return { error: error.message }
  }
}
