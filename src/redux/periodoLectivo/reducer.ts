import * as types from './types'

const INITIAL_STATE = {
  niveles: {
    entityList: []
  },
  errorFields: {},
  errorMessages: {},
  loading: false,
  error: false
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.PERIODO_LOADING_NIVELES:
      return {
        ...state,
        loading: true,
        error: false
      }
    case types.PERIODO_LOAD_NIVELES:
      return {
        ...state,
        niveles: action.payload,
        loading: false
      }
    case types.PERIODO_ERROR_NIVELES:
      return {
        ...state,
        loading: false,
        errorFields: action.payload.fields,
        errorMessages: action.payload.errors
      }
    default:
      return state
  }
}
