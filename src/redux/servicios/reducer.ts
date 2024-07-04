import {
  LOAD_SERVICES,
  CREATE_SERVICES,
  DELETE_SERVICES,
  EDIT_SERVICE
} from './types.ts'

const INITIAL_STATE = {
  servicios: [],
  loading: false,
  loaded: false,
  error: false,
  errors: [],
  fields: []
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CREATE_SERVICES:
      return {
        ...state,
        servicios: [...state.servicios, action.payload],
        loading: false,
        loaded: false,
        error: false,
        errors: [],
        fields: []
      }
    case EDIT_SERVICE:
      return {
        ...state,
        servicios: state.servicios.map(mdlt => {
          if (mdlt.id === action.payload.id) {
            return { ...action.payload }
          }
          return mdlt
        }),
        loading: false,
        loaded: false,
        error: false,
        errors: [],
        fields: []
      }
    case DELETE_SERVICES:
      return {
        ...state,
        servicios: state.servicios.map(mdlt => {
          if (action.payload.includes(mdlt.id)) {
            return { ...mdlt, estado: false }
          }
          return mdlt
        }),
        loading: false,
        loaded: false,
        error: false,
        errors: [],
        fields: []
      }
    case LOAD_SERVICES:
      return {
        ...state,
        servicios: action.payload,
        loading: false,
        loaded: false,
        error: false,
        errors: [],
        fields: []
      }
    default: return state
  }
}
