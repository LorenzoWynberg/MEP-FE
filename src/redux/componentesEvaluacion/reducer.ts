import {
  LOAD_COMPONENTE_CALIFICACION,
  LOAD_COMPONENTE_CALIFICACION_PAGINATED,
  LOAD_COMPONENTE_CALIFICACION_ALL,
  LOAD_COMPONENT_CALIFICACION_BY_IDS
} from './types'

const INITIAL_STATE = {
  componenteCalificacion: [],
  componenteCalificacionOptions: [],
  tiposcomponenteCalificacion: {},
  componenteCalificacionPaginated: {},
  componenteCalificacionAll: [],
  componentesCalificacionByIds: [],
  error: false,
  loading: false
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOAD_COMPONENTE_CALIFICACION:{
      return {
        ...state,
        componenteCalificacion: action.payload
      }
    }
    case LOAD_COMPONENTE_CALIFICACION_ALL:
      return {
        ...state,
        componenteCalificacionAll: action.payload
      }
    case LOAD_COMPONENTE_CALIFICACION_PAGINATED:
      return {
        ...state,
        componenteCalificacionPaginated: action.payload
      }
    case LOAD_COMPONENT_CALIFICACION_BY_IDS:
      return {
        ...state,
        componentesCalificacionByIds: action.payload
      }
    default:
      return state
  }
}
