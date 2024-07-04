import types from './types'

interface IState {
  error: string | boolean;
  loading: boolean;
  matriculas: Array<any>;
}

const INITIAL_STATE: IState = {
  error: '',
  loading: false,
  matriculas: []
}

export default (state: IState = INITIAL_STATE, { type, payload }) => {
  const _state = JSON.parse(JSON.stringify(state))
  switch (type) {
    case types.UPDATE_SUBJECT_GROUP_ENROLLED_STUDENT:
      const i = state.matriculas.findIndex((el) => el?.id === payload?.id)
      if (i !== -1) {
        _state.matriculas[i] = payload
      }
      return {
        ..._state,
        error: '',
        loading: false
      }
    case types.CREATE_MULTIPLE_SUBJECT_GROUP_ENROLLED_STUDENT:
      return {
        matriculas: [...state.matriculas, ...payload],
        error: '',
        loading: false
      }
    default:
      return state
  }
}
