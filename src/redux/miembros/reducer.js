import {
  MEMBER_LOAD,
  MEMBER_CLEAN,
  MEMBER_ADD,
  MEMBER_LOADING,
  MEMBERS_LOAD,
  MEMBERS_LOADING,
  MEMBER_EDIT,
  MEMBERS_DELETE,
  MEMBER_ERROR
} from './types'

const INITIAL_STATE = {
  members: [],
  currentMember: {},
  loading: false,
  loadedMember: false,
  error: false,
  errors: [],
  fields: []
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MEMBERS_LOADING:
      return {
        ...state,
        loading: !state.loading,
        error: false,
        errors: [],
        fields: []
      }
    case MEMBER_EDIT:
      const members = state.members.slice()
      members.forEach((item, i) => {
        if (item.id === [action.payload.miembroId]) {
          members[i] = action.payload
        }
      })
      return {
        ...state,
        members,
        loading: false,
        error: false,
        errors: [],
        fields: []
      }
    case MEMBERS_LOAD:
      return {
        ...state,
        members: action.payload,
        loading: false,
        error: false,
        errors: [],
        fields: []
      }
    case MEMBER_ADD:
      return {
        ...state,
        currentMember: action.payload,
        loading: false,
        error: false,
        errors: [],
        fields: []
      }
    case MEMBER_LOAD:
      console.log('action.payload', action.payload)
      return {
        ...state,
        currentMember: action.payload,
        loadedMember: true,
        loading: false,
        error: false,
        errors: [],
        fields: []
      }
    case MEMBER_LOADING:
      return {
        ...state,
        loading: true,
        error: false,
        errors: [],
        fields: []
      }
    case MEMBERS_DELETE:
      const _newMembers = state.members.slice()
      const deletedMembers = _newMembers.filter(
        (item) => !action.payload.includes(item.id)
      )
      return {
        ...state,
        members: deletedMembers,
        loading: false,
        error: false,
        errors: [],
        fields: []
      }
    case MEMBER_CLEAN:
      return {
        ...state,
        currentMember: {},
        loadedMember: false,
        loaded: true,
        errors: [],
        fields: []
      }
    case MEMBER_ERROR:
      return {
        ...state,
        loading: false,
        errors: action?.payload?.errors || [],
        fields: action?.payload?.fields || []
      }
    default:
      return state
  }
}
