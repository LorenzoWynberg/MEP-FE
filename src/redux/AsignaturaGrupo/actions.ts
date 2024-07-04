import types, { ISubjectGroup } from './types'
import { envVariables } from 'Constants/enviroment'
import axios from 'axios'

const loading = () => ({
  type: types.LOADING_SUBJECTS_GROUP
})

const getAll = (payload) => ({
  type: types.GET_ALL_SUBJECTS_GROUP,
  payload
})

const add = (payload) => ({
  type: types.ADD_SUBJECT_GROUP,
  payload
})

const update = (payload) => ({
  type: types.UPDATE_SUBJECT_GROUP,
  payload
})

const remove = (payload) => ({
  type: types.REMOVE_SUBJECT_GROUP,
  payload
})

const getAllByGroupId = (payload) => ({
  type: types.GET_ALL_BY_GROUP_ID,
  payload
})

const getAllByModelOfferId = (payload) => ({
  type: types.GET_ALL_BY_MODEL_OFFER_ID,
  payload
})

const getAllByNivelOferta = (payload) => ({
  type: types.GET_ALL_ASIGNATURA_GRUPO_BY_NIVEL_OFERTA,
  payload
})

export const getAllSubjectGrupoByModelOffer =
  (modelOfferId: number) => async (dispatch) => {
    dispatch(loading())
    try {
      const response = await axios.get(
        `${envVariables.BACKEND_URL}/api/AsignaturaGrupo/GetAllbyModeloOfertaId/${modelOfferId}`
      )
      dispatch(getAllByModelOfferId(response.data))
      return { error: false }
    } catch (e) {
      return { error: e.message }
    }
  }

export const getAllSubjectsGroup =
  ({
    page,
    quantity,
    filter
  }: {
    page: number
    quantity: number
    filter: any
  }) =>
    async (dispatch) => {
      dispatch(loading())
      try {
      // TODO: replace url
        const query = `${page ? `&Pagina=${page}` : ''}${
        filter ? `&Filtro=${filter}` : ''
      }${quantity ? `&Cantidad=${quantity}` : ''}`
        const response = await axios.get(
        `${envVariables.BACKEND_URL}/api/AsignaturaGrupo/${query}`
        )
        dispatch(getAll(response.data))
        return { error: false }
      } catch (e) {
        return { error: e.message }
      }
    }

export const createSubjectGroup =
  (subjectGroup: ISubjectGroup) => async (dispatch) => {
    dispatch(loading())
    try {
      const response = await axios.post(
        `${envVariables.BACKEND_URL}/api/AsignaturaGrupo`,
        subjectGroup
      )
      dispatch(add(response.data))
      return { error: false }
    } catch (e) {
      return { error: e.message }
    }
  }

export const updateSubjectGroup =
  (subjectGroup: ISubjectGroup) => async (dispatch) => {
    dispatch(loading())
    try {
      const response = await axios.put(
        `${envVariables.BACKEND_URL}/api/AsignaturaGrupo/${subjectGroup.id}`,
        subjectGroup
      )
      dispatch(update(response.data))
      return { error: false }
    } catch (e) {
      return { error: e.message }
    }
  }

export const deleteSubjectGroup = (id: number) => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.delete(
      `${envVariables.BACKEND_URL}/api/LeccionAsignaturaGrupo/${id}`
    )
    dispatch(remove(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const getAllSubjectGroupByGroupId =
  (groupId: number) => async (dispatch) => {
    dispatch(loading())
    try {
      const response = await axios.get(
        `${envVariables.BACKEND_URL}/api/AsignaturaGrupo/GetAllByGrupoId/${groupId}`
      )
      dispatch(getAllByGroupId(response.data))
      return { error: false }
    } catch (e) {
      return { error: e.message }
    }
  }

export const getAsignaturasByGrupoId =
  (groupId: number, institutionId: number) => async (dispatch) => {
    dispatch(loading())
    try {
      const response = await axios.get(
        `${envVariables.BACKEND_URL}/api/LeccionAsignaturaGrupo/GetAsignaturasByGrupoId/${groupId}/${institutionId}`
      )
      // debugger
      dispatch(getAllByGroupId(response.data?.data))
      return { error: false }
    } catch (e) {
      return { error: e.message }
    }
  }

export const getAllSubjectsGroupByNivelOferta =
  (lvlOfferId) => async (dispatch, getState) => {
    dispatch(loading())
    const institutionId = getState().authUser.currentInstitution?.id
    try {
      const response = await axios.get(
        `${envVariables.BACKEND_URL}/api/AsignaturaGrupo/GetByNivelOferta/${lvlOfferId}/${institutionId}`
      )
      dispatch(getAllByNivelOferta(response.data))
      return { error: false }
    } catch (e) {
      return { error: e.message }
    }
  }
