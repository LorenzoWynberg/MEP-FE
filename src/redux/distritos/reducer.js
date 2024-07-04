import {
  DISTRITOS_LOAD,
  DISTRITOS_TEMPORALES_LOAD,
  DISTRITOS_ERROR,
  DISTRITOS_LOADING
} from './types'

const INITIAL_STATE = {
  distritos: [],
  distritosTemporales: [],
  loadingDistritos: false,
  error: ''
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DISTRITOS_LOAD:
      return {
        ...state,
        distritos: action.payload,
        loadingDistritos: false,
        error: ''
      }

    case DISTRITOS_TEMPORALES_LOAD:
      return {
        ...state,
        distritosTemporales: action.payload,
        loadingDistritos: false,
        error: ''
      }

    case DISTRITOS_LOADING:
      return { ...state, loadingDistritos: true, error: '' }

    case DISTRITOS_ERROR:
      return { ...state, error: action.payload, loadingDistritos: false }

    default:
      return state
  }
}
