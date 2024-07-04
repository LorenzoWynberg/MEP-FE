import types, { LectionSubjectGroup } from './types'
import { envVariables } from 'Constants/enviroment'
import axios from 'axios'

const loading = () => ({
  type: types.LOADING_LECTIONS_SUBJECT_GROUP
})

const getAllLectionsSubjectGroup = (payload) => ({
  type: types.GET_LECTIONS_SUBJECT_GROUP,
  payload
})

const addLectionsSubjectGroup = (payload) => ({
  type: types.ADD_LECTIONS_SUBJECT_GROUP,
  payload
})

const addMultiple = (payload) => ({
  type: types.ADD_LECTIONS_SUBJECT_GROUP_MULTIPLE,
  payload
})

const updateLectionsSubjectGroup = (payload) => ({
  type: types.UPDATE_LECTIONS_SUBJECT_GROUP,
  payload
})

const removeLectionsSubjectGroup = (payload) => ({
  type: types.REMOVE_LECTIONS_SUBJECT_GROUP,
  payload
})

export const getLectionsSubjectGroup = () => async (dispatch) => {
  dispatch(loading())
  try {
    // TODO: replace url
    const response = await axios.get(`${envVariables.BACKEND_URL}/api/LeccionAsignaturaGrupo/getAll`)
    dispatch(getAllLectionsSubjectGroup(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const getLectionsSubjectGroupByLectionsIds = (lectionIds: Array<number>) => async (dispatch, getState) => {
  dispatch(loading())
  try {
    const { lectionsSubjectGroup } = getState().leccionAsignaturaGrupo
    const response: any = await axios.post(`${envVariables.BACKEND_URL}/api/LeccionAsignaturaGrupo/getAllbyleccionIds`, lectionIds)
    if (Array.isArray(response.data)) {
      lectionIds.forEach((item) => {
        if (!lectionsSubjectGroup[item]) {
          lectionsSubjectGroup[item] = []
        }
        lectionsSubjectGroup[item] = response.data.filter((el) => (el?.leccion_id === item || el?.leccionId === item))
      })
    }
    dispatch(getAllLectionsSubjectGroup(lectionsSubjectGroup))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const createLectionSubjectGroup = (lectionSubjectGroup: LectionSubjectGroup) => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.post(`${envVariables.BACKEND_URL}/api/LeccionAsignaturaGrupo`, lectionSubjectGroup)
    dispatch(addLectionsSubjectGroup(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const createLectionSubjectGroupMultiple = (arr: Array<LectionSubjectGroup>) => async (dispatch, getState) => {
  dispatch(loading())
  try {
    const { lectionsSubjectGroup } = getState().leccionAsignaturaGrupo
    const response: any = await axios.post(`${envVariables.BACKEND_URL}/api/LeccionAsignaturaGrupo/CreateMultiple`, arr)

    if (!response.data[0]) {
      const item = arr[0]
      const index = lectionsSubjectGroup[item.leccionId].findIndex((el) => el.leccionAsignaturaGrupoId === item.id)
      lectionsSubjectGroup[item.leccionId].splice(index, 1)
    }
    response.data.forEach((item) => {
      const index = lectionsSubjectGroup[item.leccion_id].findIndex((el) => el.leccionAsignaturaGrupoId === item.id)
      if (index !== -1) {
        lectionsSubjectGroup[item.leccion_id][index] = item.estado
          ? { ...item }
          : 0
      } else {
        lectionsSubjectGroup[item.leccion_id] &&
            lectionsSubjectGroup[item.leccion_id].push(
              {
                ...item
              }
            )
      }
    })
    dispatch(addMultiple(lectionsSubjectGroup))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const getLectionsSubjectGroupBySubjectGroupId = (subjectGroupId, page = -1, size = -1) => async (dispatch) => {
  dispatch(loading())
  try {
    const lectionsSubjectGroup = {}
    const response: any = await axios.get(`${envVariables.BACKEND_URL}/api/LeccionAsignaturaGrupo/getAllbyAsignaturaGrupoId/${subjectGroupId}/${page}/${size}`)
    response.data.forEach((item) => {
      if (!lectionsSubjectGroup[item.leccion_id]) {
        lectionsSubjectGroup[item.leccion_id] = []
      }
      lectionsSubjectGroup[item.leccion_id].push(
        {
          ...item,
          ...item.datosAsignaturaGrupo
        }
      )
    })
    dispatch(getAllLectionsSubjectGroup(lectionsSubjectGroup))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const updateLectionSubjectGroup = (lectionSubjectGroup: LectionSubjectGroup) => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.put(`${envVariables.BACKEND_URL}/api/LeccionAsignaturaGrupo`, lectionSubjectGroup)
    dispatch(updateLectionsSubjectGroup(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const deleteLectionSubjectGroup = (id: number) => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.delete(`${envVariables.BACKEND_URL}/api/LeccionAsignaturaGrupo/${id}`)
    dispatch(removeLectionsSubjectGroup(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}
