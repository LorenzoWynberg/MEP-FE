import {
  DIRECCION_LOAD,
  DIRECCION_CLEAN,
  DIRECCION_ADD,
  DIRECCION_LOADING,
  DIRECCION_ERROR
} from './types'

const INITIAL_STATE = {
  data: {},
  loaded: false,
  loading: false,
  error: false,
  errors: [],
  fields: []
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DIRECCION_LOADING:
      return {
        ...state,
        loading: true,
        error: false,
        errors: [],
        fields: []
      }
    case DIRECCION_LOAD:
      return {
        ...state,
        data: action.payload,
        loaded: true,
        loading: false,
        error: false,
        errors: [],
        fields: []
      }
    case DIRECCION_ADD:
      return {
        ...state,
        data: action.payload,
        loaded: true,
        loading: false,
        error: false,
        errors: [],
        fields: []
      }
    case DIRECCION_CLEAN:
      return INITIAL_STATE
    case DIRECCION_ERROR:
      return {
        ...state,
        loading: false,
        errors: [],
        fields: []
      }
    default: return state
  }
}
