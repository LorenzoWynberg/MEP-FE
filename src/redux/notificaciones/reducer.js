import {
  NOTIFICACION_LOAD,
  NOTIFICACION_ERROR,
  NOTIFICACION_MARK_READ
} from './types'
const INITIAL_STATE = {
  notificaciones: [],
  loading: false,
  error: ''
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case NOTIFICACION_LOAD:
      return {
        ...state,
        notificaciones: action.payload,
        loading: false,
        error: ''
      }
    case NOTIFICACION_ERROR:
      return {
        ...state,
        notificacion: action.payload,
        loading: false,
        error: ''
      }
    case NOTIFICACION_MARK_READ:
      return {
        ...state,
        notificaciones: action.payload
      }
    default:
      return state
  }
}
