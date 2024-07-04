import types from './types'

interface IState {
  scores: Array<any>;
  loading: boolean;
  bitacora: any[];
  error: '';
}

const INITIAL_STATE: IState = {
  scores: [],
  loading: false,
  bitacora: [],
  error: ''
}

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case types.LOADING_SCORES:
      return {
        ...state,
        loading: true
      }
    case types.GET_SCORES:
      return {
        ...state,
        loading: false,
        scores: payload,
        error: ''
      }
    case types.QUALIFY_STUDENT:
      const newScores = state.scores || []
      newScores.push(payload)
      return {
        ...state,
        loading: false,
        scores: newScores,
        error: ''
      }
    case types.REMOVE_SCORES_BY_SUBJECT_GROUP:
      return {
        ...state,
        loading: false,
        scores: []
      }
    case types.LOAD_SCORES_BITACORA:
      return {
        ...state,
        bitacora: payload,
        loading: false,
        error: ''
      }
    case types.UPDATE_QUALIFY:
      const index = state.scores.findIndex((el) => el?.asignaturaGrupoEstudianteCalificaciones_Id === payload?.asignaturaGrupoEstudianteCalificaciones_Id)
      const _state = JSON.parse(JSON.stringify(state))
      if (index !== -1) {
        _state.scores[index] = payload
      }

      return {
        ...state,
        ..._state,
        loading: false,
        error: ''
      }
    default:
      return state
  }
}
