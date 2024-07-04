import { APOYOS_LOADING, LOAD_TIPOS, LOAD_DEPENDENCIAS, LOAD_CATEGORIAS, LOAD_APOYOS, APOYOS_LOADING_ITEMS, LOAD_DISCAPACIDADES, LOAD_RECURSOS, LOAD_CONDICIONES, CLEAR_CURRENT_DISCAPACIDADES } from './types'

const INITIAL_STATE = {
  discapacidadesIdentidad: [],
  recursosDiscapacidadesIdentidad: [],
  condicionesIdentidad: [],
  recursosCondicionesIdentidad: [],
  tipos: [],
  dependencias: [],
  categorias: [],
  loading: false,
  errorMessages: [],
  errorFields: []
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOAD_RECURSOS:
      return {
        ...state,
        [action.payload.name]: action.payload.data
      }
    case CLEAR_CURRENT_DISCAPACIDADES:
      return {
        ...state,
        discapacidadesIdentidad: []
      }
    case LOAD_DISCAPACIDADES:
      return {
        ...state,
        discapacidadesIdentidad: action.payload
      }
    case LOAD_CONDICIONES:
      return {
        ...state,
        condicionesIdentidad: action.payload
      }
    case APOYOS_LOADING_ITEMS:
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          loading: true
        }
      }
    case LOAD_TIPOS:
      return {
        ...state,
        tipos: action.payload
      }
    case LOAD_CATEGORIAS:
      return {
        ...state,
        categorias: action.payload
      }
    case LOAD_DEPENDENCIAS:
      return {
        ...state,
        dependencias: action.payload
      }
    case LOAD_APOYOS:
      return {
        ...state,
        [action.payload.name]: action.payload.data
      }
    case APOYOS_LOADING:
      return {
        ...state,
        loading: action.payload
      }
    default:
      return state
  }
}
