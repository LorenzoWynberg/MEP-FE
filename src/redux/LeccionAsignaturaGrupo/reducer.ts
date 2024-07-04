import types, { LectionSubjectGroup } from './types'

interface IState {
  lectionsSubjectGroup: {
    [key: number]: Array<LectionSubjectGroup>
  };
  loading: boolean;
  error: string;
}

const INITIAL_STATE: IState = {
  lectionsSubjectGroup: {},
  loading: false,
  error: ''
}

export default (state: IState = INITIAL_STATE, { type, payload }) => {
  const _state = JSON.parse(JSON.stringify(state))
  switch (type) {
    case types.GET_LECTIONS_SUBJECT_GROUP:
      return {
        ...state,
        loading: false,
        error: '',
        lectionsSubjectGroup: payload
      }
    case types.ADD_LECTIONS_SUBJECT_GROUP:
      return {
        ...state,
        loading: false,
        error: '',
        lectionsSubjectGroup: {
          [payload.subjectGroup]: [...state.lectionsSubjectGroup[payload.subjectGroup], payload.data]
        }
      }
    case types.ADD_LECTIONS_SUBJECT_GROUP_MULTIPLE:
      return {
        ...state,
        lectionsSubjectGroup: payload
      }
    case types.UPDATE_LECTIONS_SUBJECT_GROUP:
      const i = _state.lectionsSubjectGroup[payload.subjectGroup].findIndex((lection) => lection.id === payload?.id)

      if (i !== -1) {
        _state.lectionsSubjectGroup[payload.subjectGroup][i] = payload.data
      }
      return {
        ...state,
        loading: false,
        error: '',
        lectionsSubjectGroup: _state.lectionsSubjectGroup
      }
    case types.REMOVE_LECTIONS_SUBJECT_GROUP:
      return {
        ...state,
        loading: false,
        error: '',
        lectionsSubjectGroup: _state.lectionsSubjectGroup[payload.subjectGroup].filter(item => item.id !== payload?.id)
      }
    default: return state
  }
}
