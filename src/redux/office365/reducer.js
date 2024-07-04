import {
  OFFICE365_ACTION,
  OFFICE365_ERROR,
  OFFICE365_LOADING
} from './types'

const INITIAL_STATE = {
  data: {},
  loading: false,
  error: ''
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case OFFICE365_ACTION:
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: ''
      }

    case OFFICE365_LOADING:
      return { ...state, loading: true, error: '' }

    case OFFICE365_ERROR:
      return { ...state, error: action.payload, loading: false }

    default: return state
  }
}
