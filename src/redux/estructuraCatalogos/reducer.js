import { ESTRUCTURA_LOAD, ESTRUCTURA_CREATE, ESTRUCTURA_ERROR, ESTRUCTURA_LOADING, ESTRUCTURA_PROFILES_LOAD, ESTRUCTURA_SECTIONS_LOAD, ESTRUCTURA_DELETE } from './estructuraCatalogosTypes'

const INITIAL_STATE = {
  estructura: [],
  loadingEstructura: false,
  perfiles: [],
  secciones: [],
  error: ''
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ESTRUCTURA_LOAD:
      return {
        ...state,
        estructura: action.payload,
        loadingEstructura: false,
        error: ''
      }

    case ESTRUCTURA_CREATE:
      return {
        ...state,
        estructura: [...state.estructura, { ...action.payload, id: action.payload.estructuraId }],
        loadingEstructura: false,
        error: ''
      }
    case ESTRUCTURA_DELETE:
      return {
        ...state,
        estructura: state.estructura.filter(estructura => estructura.id !== action.payload),
        loadingEstructura: false,
        error: ''
      }

    case ESTRUCTURA_SECTIONS_LOAD:
      return { ...state, loadingEstructura: false, error: '', secciones: action.payload }

    case ESTRUCTURA_LOADING:
      return { ...state, loadingEstructura: true, error: '' }

    case ESTRUCTURA_PROFILES_LOAD:
      return { ...state, perfiles: action.payload, error: '', loadingEstructura: false }

    case ESTRUCTURA_ERROR:
      return { ...state, error: action.payload, loadingEstructura: false }

    default: return state
  }
}
