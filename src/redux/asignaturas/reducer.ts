import {
  LOAD_ASIGNATURAS,
  LOAD_ASIGNATURAS_TIPOS,
  LOAD_ASIGNATURAS_OPTIONS,
  LOAD_ASIGNATURAS_PAGINATED,
  LOAD_TIPOS_EVALUACIONES
} from './types'

const INITIAL_STATE = {
  asignaturas: [],
  asignaturasOptions: [],
  tiposAsignaturas: [],
  asignaturasPaginated: {},
  error: false,
  loading: false,
  tiposEvaluacion: []
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOAD_ASIGNATURAS_PAGINATED:
      return {
        ...state,
        asignaturasPaginated: action.payload
      }
    case LOAD_ASIGNATURAS_OPTIONS:
      return {
        ...state,
        asignaturasOptions: action.payload
      }
    case LOAD_ASIGNATURAS_TIPOS:
      return {
        ...state,
        tiposAsignaturas: action.payload
      }
    case LOAD_ASIGNATURAS:
      return {
        ...state,
        asignaturas: action.payload
      }
    case LOAD_TIPOS_EVALUACIONES:
      return {
        ...state,
        tiposEvaluacion: action.payload
      }
    default:
      return state
  }
}
