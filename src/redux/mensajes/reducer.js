import { MENSAJES_CREATE, MENSAJES_DELETE, MENSAJES_LOAD, MENSAJES_ERROR, MENSAJES_LOADING, MENSAJES_PROFILES_LOAD, MENSAJES_SECTIONS_LOAD } from './mensajesTypes'

const INITIAL_STATE = {
  mensajes: [],
  loadingMensajes: false,
  perfiles: [],
  secciones: [],
  error: ''
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MENSAJES_LOAD:
      return {
        ...state,
        mensajes: action.payload,
        loadingMensajes: false,
        error: ''
      }

    case MENSAJES_CREATE:
      return {
        ...state,
        mensajes: [...state.mensajes, { ...action.payload, id: action.payload.mensajesId }],
        loadingMensajes: false,
        error: ''
      }
    case MENSAJES_DELETE:
      return {
        ...state,
        mensajes: state.mensajes.filter(mensaje => mensaje.id !== action.payload),
        loadingMensajes: false,
        error: ''
      }

    case MENSAJES_SECTIONS_LOAD:
      return { ...state, loadingMensajes: false, error: '', secciones: action.payload }

    case MENSAJES_LOADING:
      return { ...state, loadingMensajes: true, error: '' }

    case MENSAJES_PROFILES_LOAD:
      return { ...state, perfiles: action.payload, error: '', loadingMensajes: false }

    case MENSAJES_ERROR:
      return { ...state, error: action.payload, loadingMensajes: false }

    default: return state
  }
}
