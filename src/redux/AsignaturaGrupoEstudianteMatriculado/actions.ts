import types from './types'
import { envVariables } from 'Constants/enviroment'
import axios from 'axios'

const update = (payload) => ({
  type: types.UPDATE_SUBJECT_GROUP_ENROLLED_STUDENT,
  payload
})

const createMultiple = (payload) => ({
  type: types.CREATE_MULTIPLE_SUBJECT_GROUP_ENROLLED_STUDENT,
  payload
})

export const updateSubjectGroupEnrolledStudent =
  (item: any) => async (dispatch) => {
    try {
      const response: any = await axios.put(
        `${envVariables.BACKEND_URL}/api/AsignaturaGrupoEstudianteMatriculado/${item?.id}`,
        item
      )
      dispatch(update(response.data))
      return { error: false }
    } catch (error) {
      return { error: error.message }
    }
  }

export const createMultipleSubjectGroupEnrolledStudent =
  (matriculas: Array<any>, id: number) => async (dispatch) => {
    try {
      const response: any = await axios.post(
        `${envVariables.BACKEND_URL}/api/AsignaturaGrupoEstudianteMatriculado/CreateMultiple?asignaturaGrupoId=${id}`,
        matriculas
      )
      dispatch(createMultiple(response.data))
      return { error: false }
    } catch (error) {
      return { error: error.message }
    }
  }
