import * as types from './types'

const INITIAL_STATE = {
  currentUser: {},
  error: '',
  loading: false
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.USER_LOADING:
      return {
        ...state,
        error: '',
        loading: true
      }
    case types.USER_LOAD:
      return {
        ...state,
        currentUser: action.payload,
        error: '',
        loading: false
      }
    case types.USER_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    default: return state
  }
}
