import {
  CANTONES_LOAD,
  CANTONES_TEMPORAL_LOAD,
  CANTONES_ERROR,
  CANTONES_LOADING
} from './types'

const INITIAL_STATE = {
  cantones: [],
  cantonesTemporales: [],
  loadingCantones: false,
  error: ''
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CANTONES_LOAD:
      return {
        ...state,
        cantonesTemporales: state.cantonesTemporales,
        cantones: action.payload,
        loadingCantones: false,
        error: ''
      }
    case CANTONES_TEMPORAL_LOAD:
      return {
        ...state,
        cantonesTemporales: action.payload,
        cantones: state.cantones,
        loadingCantones: false,
        error: ''
      }

    case CANTONES_LOADING:
      return { ...state, loadingCantones: true, error: '' }

    case CANTONES_ERROR:
      return { ...state, error: action.payload, loadingCantones: false }

    default:
      return state
  }
}
