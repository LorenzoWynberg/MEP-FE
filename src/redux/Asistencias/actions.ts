import types from './types'
import { envVariables } from 'Constants/enviroment'
import axios from 'axios'

type FileResourceResponse = {
  id: number,
  url: string,
  titulo: string,
  descripcion: string,
  estado: boolean,
  link: string,
}

const getAll = (payload) => ({
  type: types.GET_ALL_ASSISTS,
  payload
})

const updateResource = (payload) => ({
  type: types.UPDATE_RESOURCE,
  payload
})

const getByIdentidadIds = (payload) => ({
  type: types.GET_ASSISTANCES_BY_IDENTIDAD_ID,
  payload
})

const getAssistancesBySingleStudent = (payload) => ({
  type: types.GET_ASSISTANCES_BY_SINGLE_STUDENT_ID,
  payload
})

const loading = () => ({
  type: types.LOADING_ASSISTANCES
})

const getPaginated = (payload) => ({
  type: types.GET_ASSISTS_PAGINATED,
  payload
})

const add = (payload) => ({
  type: types.ADD_ASSISTANCE,
  payload
})

const update = (payload) => ({
  type: types.UPDATE_ASSISTANCE,
  payload
})

const remove = (payload) => ({
  type: types.DELETE_ASSISTANCE,
  payload
})

const getTypes = (payload) => ({
  type: types.GET_ASSISTANCE_TYPES,
  payload
})

const getStudentsConsolidado = (payload) => ({
  type: types.GET_ASSISTANCE_CONSOLIDADOS,
  payload
})

const getAttendancesQuantity = (payload) => ({
  type: types.GET_ASSISTANCES_QUANTITY,
  payload
})

const getAcumulado = (payload) => ({
  type: types.GET_ACUMULADO,
  payload
})

const getAcumuladoByMatriculas = (payload) => ({
  type: types.GET_ACUMULADOS_MATRICULA,
  payload
})

const loadBitacoraAsistencia = (payload) => ({
  type: types.GET_ASISTENCIA_ESTUDIANTE_BITACORA,
  payload
})

export const getAllAssistances = (modelOfferId: number) => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/AsignaturaGrupo/GetAllbyModeloOfertaId/${modelOfferId}`
    )
    dispatch(getAll(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const getAssistanceByIdentidadIdsAndLectionId =
  (ids: Array<number>, lectionId: number) => async (dispatch) => {
    dispatch(loading())
    try {
      if (!lectionId) {
        dispatch(getByIdentidadIds({}))
        return
      }
      const newAssistances = {}
      const response: any = await axios.post(
        `${envVariables.BACKEND_URL}/api/AsistenciaEstudianteGrupoAsignatura/GetAllAsistenciabyEstudiante/${lectionId}`,
        ids
      )

      response.data.forEach((assis) => {
        newAssistances[assis?.identidades_Id] = assis
      })

      dispatch(getByIdentidadIds(newAssistances))
      return { error: false }
    } catch (e) {
      return { error: e.message }
    }
  }

export const createRecursosPorAsistencia = (file: File, arr: Array<any>, type: 'add-resource' | 'add-assis-resource' = 'add-resource') => async (dispatch) => {
  dispatch(loading())
  try {
    const data = new FormData()
    data.append('file', file)
    if (type === 'add-resource') {
      const resource = await axios.post<FileResourceResponse>(`${envVariables.BACKEND_URL}/api/File/resource`, data)
      const response = await axios.post<Array<{
        asistenciaEstudianteGrupoAsignaturaid: number;
        recursosPorAsistenciaId: number,
        nombreArchivo: string,
        recursoId: number,
        descripcion: string,
        titulo: string,
        url: string,
        estado: boolean,
      }>>(`${envVariables.BACKEND_URL}/api/RecursosPorAsistencia/CreateOrUpdateMultiple`, arr.map((el) => ({ ...el, recursos_id: resource.data.id })))
      dispatch(updateResource({ ...response.data[0], identidadId: arr[0]?.identidadId || null }))
    } else {
      const response = await axios.post<Array<{
        asistenciaEstudianteGrupoAsignaturaid: number;
        recursosPorAsistenciaId: number,
        nombreArchivo: string,
        recursoId: number,
        descripcion: string,
        titulo: string,
        url: string,
        estado: boolean,
      }>>(`${envVariables.BACKEND_URL}/api/RecursosPorAsistencia/CreateOrUpdateMultiple`, arr.map((el) => ({ ...el, recursos_id: file?.id })))
    }
    return { data: response.data, error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const getAssistanceByIdentidadId =
  (ids: Array<number>) => async (dispatch) => {
    dispatch(loading())
    try {
      const response: any = await axios.post(
        `${envVariables.BACKEND_URL}/api/AsistenciaEstudianteGrupoAsignatura/GetAllAsistenciabyEstudiante`,
        ids
      )

      dispatch(getAssistancesBySingleStudent(response.data))
      return { error: false }
    } catch (e) {
      return { error: e.message }
    }
  }

export const getAsistenciasByTipo = (identidadId, subjectId, periodoId, tiporegistroasistenciaId) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/AsistenciaEstudianteGrupoAsignatura/GetDetailTipoRegistroAsistencia/${identidadId}/${subjectId}/${periodoId}/${tiporegistroasistenciaId}`
    )
    dispatch({
      type: types.GET_ASISTENCIA_BY_TIPO,
      payload: response.data
    })
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const getAcumuladoAsistencia = (asignaturagrupomatriculadoId: number, institucionId, fechaPeriodoCalendarioId: number) => async (dispatch) => {
  try {
    const response: any = await axios.get(`${envVariables.BACKEND_URL}/api/AcumuladoAsistenciaEstudianteGrupo/GetAllbyIdJoin/${asignaturagrupomatriculadoId}/${institucionId}/${fechaPeriodoCalendarioId}`)
    dispatch(getAcumulado(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const getAcumuladoAsistenciaByAsignaturaGrupo = (asignaturaGrupoId: number, institucionId, fechaPeriodoCalendarioId: number) => async (dispatch) => {
  try {
    const response: any = await axios.get(`${envVariables.BACKEND_URL}/api/AcumuladoAsistenciaEstudianteGrupo/GetAcumuladosByAsignaturaGrupoId/${asignaturaGrupoId}/${institucionId}/${fechaPeriodoCalendarioId}`)
    dispatch(getAcumulado(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const getAllAssistanceByIdentidadIds =
(ids: Array<number>) => async (dispatch) => {
  dispatch(loading())
  try {
    const newAssistances = {}
    const response: any = await axios.post(
      `${envVariables.BACKEND_URL}/api/AsistenciaEstudianteGrupoAsignatura/GetAllAsistenciabyEstudiante/`,
      ids
    )

    response.data.forEach((assis) => {
      newAssistances[assis?.datosIdentidadEstudiante?.id] = assis
    })

    dispatch(getByIdentidadIds(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const createMultipleAssistance =
  (assis: any) => async (dispatch, getState) => {
    try {
      const { assistancesByIdentidadId: assistances } = getState().asistencias
      const response: any = await axios.post(
        `${envVariables.BACKEND_URL}/api/AsistenciaEstudianteGrupoAsignatura/CreateOrUpdateMultiple`,
        assis
      )
      response.data?.forEach((item) => {
        assistances[item?.datosIdentidadEstudiante?.id] = item
      })
      dispatch(getByIdentidadIds(assistances))
      return { error: false }
    } catch (e) {
      return { error: e.message }
    }
  }

export const getAssistanceTypes = () => async (dispatch) => {
  try {
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/TipoRegistroAsistencia/GetAll`
    )
    dispatch(getTypes(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}
export const getAllAttendanceByGroup = (groupId) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/AsignaturaGrupoEstudianteMatriculado/GetAllAEstudiantebyGrupoId/${groupId}`
    )

    dispatch(getStudentsConsolidado(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const getAllAttendanceBySubjectGroup = (subjectGroupId: number) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/AsignaturaGrupoEstudianteMatriculado/GetAllAEstudiantebyAsignaturaGrupoId/${subjectGroupId}/`
    )

    dispatch(getStudentsConsolidado(response.data))
    return { error: false }
  } catch (error) {
    return { error: error.message }
  }
}

export const getAttendancesQuantityTypes = (identidadId: number, subjectId: number, periodId: number) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/AsistenciaEstudianteGrupoAsignatura/GetCantidadTipoRegistroAsistencia/${identidadId},${subjectId},${periodId}`
    )
    dispatch(getAttendancesQuantity(response.data))
    return { error: false }
  } catch (error) {
    return { error: error.message }
  }
}

export const getAllAssistancesPaginated =
  ({ page = '', filter = '', quantity = '' }) =>
    async (dispatch) => {
      dispatch(loading)
      try {
        const query = `${page ? `&Pagina=${page}` : ''}${
        filter ? `&Filtro=${filter}` : ''
      }${quantity ? `&Cantidad=${quantity}` : ''}`
        const response = await axios.get(
        `${envVariables.BACKEND_URL}/api/AsistenciaEstudianteGrupoAsignatura/${query}`
        )
        dispatch(getPaginated(response.data))
        return { error: false }
      } catch (e) {
        return { error: e.message }
      }
    }

export const createAssistance =
  (assistance: any, studentId: number = 0) =>
    async (dispatch) => {
      dispatch(loading)
      try {
        const response = await axios.post(
        `${envVariables.BACKEND_URL}/api/AsistenciaEstudianteGrupoAsignatura/`,
        assistance
        )
        dispatch(add({ [studentId]: response.data }))
        return { error: false }
      } catch (e) {
        return { error: e.message }
      }
    }

export const updateAssistance =
  (assistance, studentId: number = 0) =>
    async (dispatch) => {
      dispatch(loading)
      try {
        const response = await axios.put(
        `${envVariables.BACKEND_URL}/api/AsistenciaEstudianteGrupoAsignatura/${assistance?.id}`,
        assistance
        )
        dispatch(update({ [studentId]: response.data }))
        return { error: false }
      } catch (e) {
        return { error: e.message }
      }
    }

export const removeAssistance = (assistanceId: number) => async (dispatch) => {
  dispatch(loading)
  try {
    const response = await axios.delete(
      `${envVariables.BACKEND_URL}/api/AsistenciaEstudianteGrupoAsignatura/${assistanceId}`
    )
    dispatch(remove(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const getAcumuladosByMatricula = (ids: number[], grupoId: number) => async (dispatch) => {
  try {
    const response: any = await axios.post(`${envVariables.BACKEND_URL}/api/AcumuladoAsistenciaEstudianteGrupo/GetAcumuladoByMatricula/${grupoId}`, ids)
    dispatch(getAcumuladoByMatriculas(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const getBitacoraAsistencia = (grupoId, asignaturaId) => async (dispatch) => {
  try {
    const response: any = await axios.get(`${envVariables.BACKEND_URL}/api/AsistenciaEstudianteGrupoAsignatura/GetBitacora/${grupoId}/${asignaturaId}`)
    dispatch(loadBitacoraAsistencia(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}
