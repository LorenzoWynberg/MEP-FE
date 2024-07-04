import {
  LOAD_OFFERS,
  CREATE_OFFERS,
  DELETE_OFFERS,
  EDIT_OFFER
} from './types.ts'

const INITIAL_STATE = {
  ofertas: [],
  loading: false,
  loaded: false,
  error: false,
  errors: [],
  fields: []
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case EDIT_OFFER:
      return {
        ...state,
        ofertas: state.ofertas.map(ofr => {
          if (ofr.id === action.payload.id) {
            return { ...action.payload }
          }
          return ofr
        }),
        loading: false,
        loaded: false,
        error: false,
        errors: [],
        fields: []
      }
    case CREATE_OFFERS:
      return {
        ...state,
        ofertas: [...state.ofertas, action.payload],
        loading: false,
        loaded: false,
        error: false,
        errors: [],
        fields: []
      }
    case DELETE_OFFERS:
      return {
        ...state,
        ofertas: state.ofertas.map(item => {
          if (action.payload.includes(item.id)) {
            return { ...item, estado: false }
          }
          return item
        }),
        loading: false,
        loaded: false,
        error: false,
        errors: [],
        fields: []
      }
    case LOAD_OFFERS:
      return {
        ...state,
        ofertas: action.payload,
        loading: false,
        loaded: false,
        error: false,
        errors: [],
        fields: []
      }
    default: return state
  }
}
