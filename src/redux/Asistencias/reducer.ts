import types from './types'

const INITIAL_STATE = {
  currentAssistances: [],
  assitances: [],
  assistancesByIdentidadId: {},
  consolidado: [],
  types: [],
  loading: false,
  error: '',
  assistancesQuantity: [],
  acumulados: [],
  acumuladosMatricula: [],
  historial: [],
  asistenciasByTipo: []
}

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case types.GET_ASISTENCIA_ESTUDIANTE_BITACORA:
      return {
        ...state,
        historial: payload,
        loading: false,
        error: ''
      }
    case types.GET_ALL_ASSISTS:
      return {
        ...state,
        assitances: payload,
        loading: false,
        error: ''
      }
    case types.GET_ACUMULADOS_MATRICULA:
      return {
        ...state,
        acumuladosMatricula: payload,
        loading: false,
        error: ''
      }
    case types.UPDATE_RESOURCE:
      // TODO: Añadir asistenciaId para poder unirlo en la respuesta
      const newAssis = state.assistancesByIdentidadId
      const recursos = JSON.parse(newAssis[payload.identidadId].recursosPorAsistencia || '[]')
      recursos[0] = {
        Recursos: [
          {
            RecursoId: payload.recursoId,
            descripcion: payload.descripcion,
            titulo: payload.titulo,
            url: payload.url
          }
        ],
        RecursosPorAsistenciaId: payload.recursosPorAsistenciaId,
        asistenciaEstudianteGrupoAsignaturaId: payload.asistenciaEstudianteGrupoAsignaturaid,
        nombreArchivo: payload.titulo,
        estado: true
      }
      newAssis[payload.identidadId] = {
        ...newAssis[payload.identidadId],
        recursosPorAsistencia: JSON.stringify(recursos)
      }
      return {
        assistancesByIdentidadId: newAssis,
        ...state
      }
    case types.GET_ASSISTANCES_QUANTITY: {
      return {
        ...state,
        loading: false,
        error: '',
        assistancesQuantity: payload

      }
    }
    case types.GET_ASISTENCIA_BY_TIPO:
      return {
        ...state,
        loading: false,
        asistenciasByTipo: payload
      }
    case types.GET_ACUMULADO:
      return {
        ...state,
        acumulados: payload
      }
    case types.GET_ASSISTANCE_CONSOLIDADOS:
      return {
        ...state,
        consolidado: payload,
        loading: false,
        error: ''
      }
    case types.GET_ASSISTANCES_BY_IDENTIDAD_ID:

      return {
        ...state,
        loading: false,
        assistancesByIdentidadId: payload,
        error: ''
      }
    case types.GET_ASSISTS_PAGINATED:
      return {
        ...state,
        assitances: [...state.assitances, ...payload],
        loading: false,
        error: ''
      }
    case types.ADD_ASSISTANCE:
      return {
        ...state,
        assitances: [...state.assitances, payload],
        loading: false,
        error: ''
      }
    case types.GET_ASSISTANCES_BY_SINGLE_STUDENT_ID:
      return {
        ...state,
        currentAssistances: payload,
        loading: false,
        error: ''
      }
    case types.UPDATE_ASSISTANCE:
      return {
        ...state,
        loading: false,

        error: ''
      }
    case types.DELETE_ASSISTANCE:
      return {
        ...state,
        assitances: state.assitances.filter((item) => item.id !== payload.id),
        loading: false,
        error: ''
      }
    case types.GET_ASSISTANCE_TYPES:
      return {
        ...state,
        loading: false,
        error: '',
        types: payload
      }
    default:
      return state
  }
}
