import types, { Lection } from './types'

interface IState {
  lections: Array<Lection>;
  loading: boolean;
  error: string;
  currentLection: Lection | {}
}

const INITIAL_STATE: IState = {
  lections: [],
  loading: false,
  error: '',
  currentLection: {}
}

export default (state: IState = INITIAL_STATE, { type, payload }) => {
  const _state = JSON.parse(JSON.stringify(state))
  switch (type) {
    case types.LOADING_LECTIONS:
      return {
        ...state,
        loading: true
      }
    case types.GET_ALL_LECTIONS:
      return {
        ...state,
        lections: payload,
        loading: false,
        error: ''
      }
    case types.ADD_LECTION:
      _state.lections.push(payload)
      return {
        ..._state,
        loading: false,
        error: ''
      }
    case types.DELETE_LECTION:
      _state.lections = _state.lections.filter((lection) => lection.id !== payload?.id)

      return {
        ..._state,
        loading: false,
        error: ''
      }
    case types.UPDATE_LECTION:
      const index = _state.lections.findIndex((lection) => lection.id === payload?.id)

      if (index !== -1) {
        _state.lections[index] = payload
      }
      return {
        ..._state,
        loading: false,
        error: ''
      }
    case types.GET_SINGLE_LECTION:
    case types.SET_CURRENT_LECTION:
      return {
        ...state,
        currentLection: payload
      }
    default: return state
  }
}
