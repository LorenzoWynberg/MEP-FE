import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import { showProgress, hideProgress } from 'Utils/progress'

import {
  TRASLADOS_DATA,
  TRASLADO_CENTROS,
  TRASLADO_CENTRO_DATA,
  TRASLADO_LOADING,
  TRASLADO_CLEAR_CENTRO,
  TRASLADO_CLEAR_CENTROS,
  TRASLADO_CLEAR_STUDENT,
  TRASLADO_CLEAR_STUDENTS,
  TRASLADO_ERROR,
  TRASLADO_REVISION_UPDATE,
  TRASLADO_SAVE,
  TRASLADO_CLEAR,
  TRASLADOS_CLEAR,
  TRASLADO_SET_TRASLADO,
  TRASLADO_SET_WIZARD_STEPS,
  TRASLADO_STUDENTS,
  TRASLADO_STUDENT_DATA,
  TRASLADO_NIVELES,
  TRASLADO_NIVEL_DATA,
  TRASLADO_CLEAR_NIVEL,
  TRASLADO_ADD_MOTIVO,
  TRASLADO_ADD_MOTIVO_RECHAZO,
  TRASLADO_REVISION_RESULT,
  TRASLADO_DIRECTOR_TIENE_PERMISO,
  TRASLADO_SET_VALIDADOR,
  TRASLADO_CLEAR_VALIDADOR,
  TRASLADO_EXTERIOR
} from './types'

const setTrasladoData = (payload) => ({
  type: TRASLADOS_DATA,
  payload
})

const trasladoExteriorDispatch = (payload) => ({
  type: TRASLADO_EXTERIOR,
  payload
})
const setCentros = (payload) => ({
  type: TRASLADO_CENTROS,
  payload
})

const setCentroData = (payload) => ({
  type: TRASLADO_CENTRO_DATA,
  payload
})
const trasladoLoading = (payload) => ({
  type: TRASLADO_LOADING,
  payload
})
const setMotivoSolicitud = (payload) => ({
  type: TRASLADO_ADD_MOTIVO,
  payload
})

const setMotivoRechazo = (payload) => ({
  type: TRASLADO_ADD_MOTIVO_RECHAZO,
  payload
})

const setRevisionResult = (payload) => ({
  type: TRASLADO_REVISION_RESULT,
  payload
})

const setValidacionDirectorAprueba = (payload) => ({
  type: TRASLADO_DIRECTOR_TIENE_PERMISO,
  payload
})

const clearCentros = (payload) => ({
  type: TRASLADO_CLEAR_CENTROS,
  payload
})

const setValidadorTrasladoData = (payload) => ({
  type: TRASLADO_SET_VALIDADOR,
  payload
})

const clearValidadorTrasladoData = (payload) => ({
  type: TRASLADO_CLEAR_VALIDADOR,
  payload
})

const clearCentro = (payload) => ({
  type: TRASLADO_CLEAR_CENTRO,
  payload
})

const clearStudent = (payload) => ({
  type: TRASLADO_CLEAR_STUDENT,
  payload
})

const clearStudents = (payload) => ({
  type: TRASLADO_CLEAR_STUDENTS,
  payload
})

const errorTraslado = (payload) => ({
  type: TRASLADO_ERROR,
  payload
})

const saveTraslado = (payload) => ({
  type: TRASLADO_SAVE,
  payload
})

const saveRevisionTraslado = (payload) => ({
  type: TRASLADO_REVISION_UPDATE,
  payload
})

const clearTraslado = (payload) => ({
  type: TRASLADO_CLEAR,
  payload
})
const clearTraslados = (payload) => ({
  type: TRASLADOS_CLEAR,
  payload
})

const setTraslado = (payload) => ({
  type: TRASLADO_SET_TRASLADO,
  payload
})

const setPasosTrasladoWizard = (payload, step, tipoTraslado) => ({
  type: TRASLADO_SET_WIZARD_STEPS,
  step,
  tipoTraslado,
  payload
})
const getStudents = (payload) => ({
  type: TRASLADO_STUDENTS,
  payload
})
const setStudentData = (payload) => ({
  type: TRASLADO_STUDENT_DATA,
  payload
})

const getNivelesData = (payload) => ({
  type: TRASLADO_NIVELES,
  payload
})

const setEntidadMatriculaId = (payload) => ({
  type: TRASLADO_NIVEL_DATA,
  payload
})
const clearNivel = (payload) => ({
  type: TRASLADO_CLEAR_NIVEL,
  payload
})
const clearNiveles = (payload) => ({
  type: 'TRASLADOS_CLEAR_NIVELES',
  payload
})
const loadInstitutions = (payload) => ({
  type: 'TRASLADOS_LOAD_INSTITUTIONS',
  payload
})

const cleanInstitutions = () => ({
  type: 'TRASLADOS_CLEAN_INSTITUTIONS'
})

export const clearNivelData = () => (dispatch) => {
  dispatch(clearNivel())
}
export const clearNivelesData = () => (dispatch) => {
  dispatch(clearNiveles())
}

export const clearTrasladoData = () => (dispatch) => {
  dispatch(clearTraslado())
}

export const clearTrasladosData = () => (dispatch) => {
  dispatch(clearTraslados())
}

export const clearStudentsData = () => (dispatch) => {
  dispatch(clearStudents())
}

export const clearStudentData = () => (dispatch) => {
  dispatch(clearStudent())
}

export const clearCentrosData = () => (dispatch) => {
  dispatch(clearCentros())
}

export const clearCentroData = () => (dispatch) => {
  dispatch(clearCentro())
}

export const setNivelEntidadMatriculaId = (id) => (dispatch) => {
  dispatch(setEntidadMatriculaId(id))
}

export const setMotivoRechazoText = (motivo) => (dispatch) => {
  dispatch(setMotivoRechazo(motivo))
}

export const setMotivoSolicitudText = (motivo) => (dispatch) => {
  dispatch(setMotivoSolicitud(motivo))
}

export const setRevisionAnwser = (estado) => (dispatch) => {
  dispatch(setRevisionResult(estado))
}

export const setDataCentro = (idCentro) => async (dispatch) => {
  dispatch(trasladoLoading())
  try {
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/Traslado/GetCentroPropuesto/${idCentro}`
    )

    dispatch(setCentroData(response.data))
    return { error: false }
  } catch (error) {
    dispatch(errorTraslado({}))
    return { error: true, message: 'Uno o mas errores han ocurrido' }
  }
}

export const trasladoExterior =
  ({
    matriculaId = 0,
    institucionOrigenId = 0,
    entidadMatriculaId = 0,
    motivoTraslado = '',
    nombreInstitucionDestino = ''
  }) =>
    async (dispatch) => {
      try {
        const res = await axios.post(
          `${envVariables.BACKEND_URL}/api/Traslado/Exterior`,
          {
            matriculaId,
            institucionOrigenId,
            entidadMatriculaId,
            motivoTraslado,
            nombreInstitucionDestino
          }
        )
        dispatch(trasladoExteriorDispatch(res.data.data))
      } catch (error) {
        dispatch(errorTraslado({}))
        return { error: true, message: 'Uno o mas errores han ocurrido' }
      }
    }

export const getCentrosSearchPaginated =
  (
    idCentroOrigen,
    textoFiltro,
    pagina,
    cantidadPagina,
    orderColumn = 'nombre',
    isAsc = true
  ) =>
    async (dispatch) => {
      dispatch(trasladoLoading())
      try {
        const response = await axios.get(
          `${envVariables.BACKEND_URL}/api/Traslado/GetSearchCentrosPaginated/${idCentroOrigen}/${textoFiltro}/${pagina}/${cantidadPagina}?orderBy=${orderColumn}&isAsc=${isAsc}`
        )
        dispatch(setCentros(response.data))
        return { error: false }
      } catch (error) {
        dispatch(errorTraslado({}))
        return { error: true, message: 'Uno o mas errores han ocurrido' }
      }
    }

export const setDataEstudiante = (idMatricula) => async (dispatch) => {
  dispatch(trasladoLoading())
  dispatch(clearValidadorTrasladoData())
  try {
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/Traslado/ValidarEstudianteParaTraslado/${idMatricula}`
    )
    const responseStudent = await axios.get(
      `${envVariables.BACKEND_URL}/api/Traslado/GetCondicionActualEstudianteByMatriculaId/${idMatricula}`
    )

    dispatch(setStudentData(responseStudent.data))

    if (!response.data.general) {
      return { error: false }
    } else {
      dispatch(setValidadorTrasladoData(response.data))
      return { error: true, message: 'no' }
    }
  } catch (error) {
    dispatch(errorTraslado({}))
    return { error: true, message: 'Uno o mas errores han ocurrido' }
  }
}

export const getStudentSearchPaginated =
  (
    tipo,
    idCentro,
    textoFiltro,
    searchby,
    pagina,
    cantidadPagina,
    orderColumn = 'nombre',
    isAsc = true
  ) =>
    async (dispatch) => {
      dispatch(trasladoLoading())
      try {
        const response = await axios.get(
          `${envVariables.BACKEND_URL}/api/Traslado/GetSearchEstudiantesMatriculadosPaginated/${tipo}/${idCentro}/${textoFiltro}/${searchby}/${pagina}/${cantidadPagina}?orderBy=${orderColumn}&isAsc=${isAsc}`
        )
        dispatch(getStudents(response.data))
        return { error: false }
      } catch (error) {
        dispatch(errorTraslado({}))
        return { error: true, message: 'Uno o mas errores han ocurrido' }
      }
    }

export const getDataNiveles =
  (institucionId, cursoLectivoId) => async (dispatch) => {
    try {
      const response = await axios.get(
        `${envVariables.BACKEND_URL}/api/NivelOfertas/GetNivelesOfertaByInstitucion/${institucionId}/${cursoLectivoId}`
      )
      dispatch(getNivelesData(response.data))
      return { error: false }
    } catch (e) {
      dispatch(getNivelesData([]))
      dispatch(errorTraslado({}))
      return { error: true }
    }
  }
export const createMultipleTraslado = (data) => async (dispatch) => {
  dispatch(trasladoLoading())
  try {
    const responseSave = await axios.post(
      `${envVariables.BACKEND_URL}/api/Traslado/multiple`,
      data
    )

    dispatch(
      saveTraslado(data.tipoTraslado == 0 ? null : responseSave.data)
    )

    if (responseSave.data?.errorCode) {
      return {
        error: true,
        message: responseSave.data.errorMessage
      }
    }
    return {
      error: false,
      data: responseSave.data.data
    }
  } catch (e) {
    if (e.response) {
      const _error = e.response.data.error
      dispatch(errorTraslado(_error))
      return { error: true, message: _error }
    } else {
      dispatch(errorTraslado({}))
      return {
        error: true,
        message: 'Ha fallado al guardar, inténtelo mas tarde.'
      }
    }
  }
}
export const createTraslado = (data) => async (dispatch) => {
  dispatch(trasladoLoading())
  dispatch(clearValidadorTrasladoData())
  try {
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/Traslado/ValidarEstudianteParaTraslado/${data.matriculaId}`
    )

    const urlTraslado = data.tipoTraslado == 0 ? '/Interno' : ''
    if (response.data.general) {
      dispatch(setValidadorTrasladoData(response.data))
      return {
        error: true,
        message:
          'EL estudiante no cumple con los requisitos para el traslado'
      }
    }
    const responseSave = await axios.post(
      `${envVariables.BACKEND_URL}/api/Traslado${urlTraslado}`,
      data
    )

    dispatch(
      saveTraslado(data.tipoTraslado == 0 ? null : responseSave.data)
    )
    return {
      error: false,
      message: data.tipoTraslado == 0 ? responseSave.data : null
    }
  } catch (e) {
    if (e.response) {
      const _error = e.response.data.error
      dispatch(errorTraslado(_error))
      return { error: true, message: _error }
    } else {
      dispatch(errorTraslado({}))
      return {
        error: true,
        message: 'Ha fallado al guardar, intentalo mas tarde'
      }
    }
  }
}

export const cancelarSolicitud = (idTraslado) => async (dispatch) => {
  dispatch(trasladoLoading())
  try {
    const response = await axios.put(
      `${envVariables.BACKEND_URL}/api/Traslado/Cancelar`,
      { idTraslado }
    )
    dispatch(saveRevisionTraslado(response.data))
    return { error: false }
  } catch (e) {
    const message = e?.response?.data?.error || 'Ha ocurrido un error'
    dispatch(errorTraslado({}))
    return { error: message }
  }
}

export const saveRevisionSimple = (data) => async (dispatch) => {
  dispatch(trasladoLoading())
  try {
    const response = await axios.put(
      `${envVariables.BACKEND_URL}/api/Traslado/RevisionSimple`,
      data
    )
    dispatch(saveRevisionTraslado(response.data))
    return { error: false }
  } catch (e) {
    dispatch(errorTraslado({}))
    return { error: true }
  }
}

export const saveRevisionConNivel = (data) => async (dispatch) => {
  dispatch(trasladoLoading())
  try {
    const response = await axios.put(
      `${envVariables.BACKEND_URL}/api/Traslado/RevisionConNivel`,
      data
    )

    dispatch(saveRevisionTraslado(response.data))
    return { error: false }
  } catch (e) {
    dispatch(errorTraslado({}))
    const message =
      e.response.data.error ||
      e.response.message ||
      e.message ||
      'Ha ocurrido un error'
    return { error: message }
  }
}

export const rechazarSolicitudDesdeMiCentro = (data) => async (dispatch) => {
  dispatch(trasladoLoading())
  try {
    const response = await axios.put(
      `${envVariables.BACKEND_URL}/api/Traslado/RechazarSolicitudDesdeMiCentro`,
      data
    )

    dispatch(saveRevisionTraslado(response.data))
    return { error: false }
  } catch (e) {
    dispatch(errorTraslado({}))
    const message = e.response.message || e.message || 'Ha ocurrido un error'
    return { error: message }
  }
}

export const setDirectorApruebaValidacion =
  (idTraslado) => async (dispatch) => {
    dispatch(trasladoLoading())
    try {
      const response = await axios.get(
        `${envVariables.BACKEND_URL}/api/Traslado/ValidarRevisorEsDirector/${idTraslado}`
      )
      dispatch(setValidacionDirectorAprueba(response.data))
      return { error: false }
    } catch (error) {
      dispatch(errorTraslado({}))
      return { error: true, message: 'Uno o mas errores han ocurrido' }
    }
  }

export const setOneTrasladoData =
  (idTraslado, tipo = '') =>
    async (dispatch) => {
      dispatch(trasladoLoading())
      try {
        const response = await axios.get(
          `${envVariables.BACKEND_URL}/api/Traslado/GetTrasladoById/${idTraslado}`
        )
        dispatch(
          setTraslado({
            ...response.data,
            infoTraslado: {
              ...response.data.infoTraslado,
              tipo
            }
          })
        )

        return { error: false }
      } catch (error) {
        dispatch(errorTraslado({}))
        return { error: true, message: 'Uno o mas errores han ocurrido' }
      }
    }

export const setTrasladosData =
  (
    idCentro,
    textoFiltro,
    recibido,
    enviado,
    sortBy,
    orientacion,
    pagina,
    cantidadPagina
  ) =>
    async (dispatch) => {
      dispatch(trasladoLoading())
      try {
        const response = await axios.get(
          `${envVariables.BACKEND_URL}/api/Traslado/GetSearchTrasladosPaginated/${idCentro}/${textoFiltro}/${recibido}/${enviado}/${sortBy}/${orientacion}/${pagina}/${cantidadPagina}`
        )

        dispatch(setTrasladoData(response.data))
        return { error: false }
      } catch (error) {
        dispatch(errorTraslado({}))
        return { error: true, message: 'Uno o mas errores han ocurrido' }
      }
    }

export const setTrasladoWizardPasos =
  (data, step, tipo) => async (dispatch) => {
    dispatch(setPasosTrasladoWizard(data, step, tipo))
  }

export const getCantidadTrasladosByMatriculaId = (matriculaId) => async () => {
  try {
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/Traslado/GetCantidadTrasladosByMatriculaId?matriculaId=${matriculaId}`
    )
    const { data, errorMessage } = response.data
    if (errorMessage) throw new Error(errorMessage)
    return data
  } catch (e) {
    return e.message
  }
}
export const getCantidadTrasladosByIdentidadId = (identidadId) => async () => {
  try {
    const response = await axios.get(
      `${envVariables.BACKEND_URL}/api/Traslado/GetCantidadTrasladosByIdentidadId?identidadId=${identidadId}`
    )
    const { data, errorMessage } = response.data
    if (errorMessage) throw new Error(errorMessage)
    return data
  } catch (e) {
    return e.message
  }
}
export const getStudentFilter =
  (filter = 'NULL', page = 1, size = 100) =>
    async (dispatch, getState) => {
      try {
        showProgress()
        const response = await axios.get(
          `${envVariables.BACKEND_URL}/api/Traslado/GetByFilter/${filter}/${page}/${size}`
        )
        if (response.data.error) {
          hideProgress()
          return response
        } else {
          dispatch(getStudents(response.data))
          hideProgress()
          return response
        }
      } catch (error) {
        hideProgress()
        return { data: { message: error.message, error: true } }
      }
    }
export const getCentrosEducativos =
  (filter = '', page = 1, size = 100, regionId, circuitoId, institucionId) =>
    async (dispatch) => {
      try {
        showProgress()
        const response = await axios.get(
          `${envVariables.BACKEND_URL}/api/Traslado/GetCentrosEducativos`,
          {
            params: {
              publicos: false,
              filtro: filter || 'NULL',
              regionId,
              circuitoId,
              institucionId,
              pageNum: page,
              pageSize: size
            }
          }
        )
        const result = {
          entityList: response.data,
          pageNumber: 1,
          pageSize: 100,
          totalCount: 1,
          totalPages: 1
        }
        dispatch(loadInstitutions(result))

        hideProgress()
        return { error: false, options: response.data }
      } catch (e) {
        hideProgress()
        return { error: e.message }
      }
    }

export const clearInstitutions = () => (dispatch) => {
  dispatch(cleanInstitutions())
}
