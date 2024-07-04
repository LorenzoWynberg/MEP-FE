import {
  POBLADOS_LOAD,
  POBLADOS_TEMPORAL_LOAD,
  POBLADOS_ERROR,
  POBLADOS_LOADING
} from './types'

const INITIAL_STATE = {
  poblados: [],
  pobladosTemporales: [],
  loadingPoblados: false,
  error: ''
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case POBLADOS_LOAD:
      return {
        ...state,
        poblados: action.payload,
        loadingPoblados: false,
        error: ''
      }
    case POBLADOS_TEMPORAL_LOAD:
      return {
        ...state,
        pobladosTemporales: action.payload,
        loadingPoblados: false,
        error: ''
      }

    case POBLADOS_LOADING:
      return { ...state, loadingPoblados: true, error: '' }

    case POBLADOS_ERROR:
      return { ...state, error: action.payload, loadingPoblados: false }

    default:
      return state
  }
}
