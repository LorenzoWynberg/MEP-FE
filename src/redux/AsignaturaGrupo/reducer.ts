import types, { ISubjectGroup } from './types'
import qualifyTypes from '../Calificaciones/types'
import { cloneDeep } from 'lodash'

interface IState {
  subjectsGroupByGroup: Array<ISubjectGroup>;
  asignaturasGruposByNivelOferta: Array<ISubjectGroup>;
  loading: boolean;
  error: string;
  update: boolean;
  subjectsGroup: Array<any>;
}

const INITIAL_STATE: IState = {
  subjectsGroupByGroup: [],
  asignaturasGruposByNivelOferta: [],
  loading: false,
  error: '',
  update: false,
  subjectsGroup: []
}

export default (state: IState = INITIAL_STATE, { type, payload }) => {
  const _state = JSON.parse(JSON.stringify(state))
  switch (type) {
    case types.GET_ALL_ASIGNATURA_GRUPO_BY_NIVEL_OFERTA:
      return {
        ...state,
        asignaturasGruposByNivelOferta: payload
      }
    case types.GET_ALL_BY_MODEL_OFFER_ID:
      return {
        ...state,
        subjectsGroup: payload,
        error: '',
        loading: false
      }
    case types.GET_ALL_BY_GROUP_ID:
      return {
        ...state,
        loading: false,
        error: '',
        subjectsGroupByGroup: payload
      }
    case types.ADD_SUBJECT_GROUP:
      return {
        ...state,
        loading: false,
        error: '',
        subjectsGroupByGroup: [...state.subjectsGroupByGroup, payload]
      }
    case types.UPDATE_SUBJECT_GROUP:
      const index = _state.subjectsGroup.findIndex((subject) => subject.id === payload?.id)

      if (index !== -1) {
        _state.subjectsGroup[index] = payload
      }
      return {
        ...state,
        loading: false,
        error: '',
        subjectGroup: _state.subjectsGroup
      }
    case qualifyTypes.UPDATE_SUBJECT_GROUP_JSON:
      return {
        ...state,
        asignaturasGruposByNivelOferta: cloneDeep(payload.asignaturasGruposByNivelOferta),
        update: true
      }
    case types.REMOVE_SUBJECT_GROUP:
      return {
        ...state,
        loading: false,
        error: '',
        subjectsGroup: _state.subjectsGroup.filter((subject) => subject.id !== payload.id)
      }
    default: return state
  }
}
