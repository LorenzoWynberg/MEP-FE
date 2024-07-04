import {
  GROUPS_LOAD_MEMBERS_BY_LEVEL,
  GROUPS_LOAD,
  GROUPS_LOAD_MEMBERS_WITHOUT_GROUP,
  GROUPS_LOADING,
  GROUPS_LOAD_BY_INSTITUTION,
  GROUPS_LOAD_CENTER_OFFERS,
  GROUPS_LOAD_MEMBERS,
  GROUPS_LOAD_ALL_MEMBERS,
  GROUPS_LOAD_MEMBERS_BY_GROUP,
  GROUPS_REFRESH,
  GROUPS_CONDITIONS_LOAD,
  GROUPS_ACTIVE_CALENDAR_LOAD,
  GROUPS_CURRENT_CONDITIONS,
  GROUPS_BY_OFFER_LOAD,
  GROUPS_LOAD_INCIDENTS,
  GROUPS_LOAD_INCIDENTS_TYPES,
  GROUPS_LOAD_MEMBERS_BY_SUBJECT_GROUP,
  GROUPS_LOAD_BLOQUES,
  GROUPS_LOAD_MEMBERS_BY_OFFER,
  GROUPS_LOAD_FILTERED_STUDENTS,
  GET_CENTER_OFFERS,
  GROUPS_LOAD_CENTER_OFFERS_SPECIALTY_BY_INSTITUTION,
  GROUPS_ERROR,
  GET_CENTER_OFFERS_FOR_TRASLADOS,
  GET_GRUPOS_BY_NIVEL_OFERTA_ID,
} from './types'

const INITIAL_STATE = {
  groups: [],
  condiciones: [],
  groupsByOffer: [],
  membersByOffer: [],
  reporteGroups: [],
  miembros: {
    entityList: [],
    pageNumber: null,
    pageSize: null,
    totalCount: null,
    totalPages: null
  },
  miembrosSinGrupo: {
    entityList: [],
    pageNumber: null,
    pageSize: null,
    totalCount: null,
    totalPages: null
  },
  levelMembers: {
    entityList: [],
    pageNumber: null,
    pageSize: null,
    totalCount: null,
    totalPages: null
  },
  allGroupMembers: [],
  GroupMembers: [],
  groupsByInstitution: [],
  centerOffers: [],
  centerOffersGrouped: [],
  centerOffersForTraslados: [],
  centerOffersSpecialty: [],
  errorFields: {},
  errorMessages: {},
  loading: false,
  loaded: false,
  loadedDataGroup: false,
  error: false,
  activeCalendar: {},
  currentConditions: [],
  groupIncidencias: [],
  tiposIncidencia: [],
  membersBySubjectGroup: [],
  membersWithoutGroup: [],
  bloques: [],
  filteredStudents: [],
  nivelesGruposYProyecciones: [],
  gruposSelectReportes: []
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'GROUPS_LOAD_NIVELES_GRUPOS_PROYECCIONES':
      return {
        ...state,
        nivelesGruposYProyecciones: action.payload
      }
    case GET_GRUPOS_BY_NIVEL_OFERTA_ID: 
      return {
        ...state,
        reporteGroups: action.payload
      }
    case GROUPS_LOAD_FILTERED_STUDENTS:
      return {
        ...state,
        filteredStudents: action.payload
      }
    case 'GROUPS_LOAD_SELECT_REPORTS':
      return {
        ...state,
        gruposSelectReportes: action.payload
      }
    case 'GROUPS_LOAD_CENTER_OFFERS_SPECIALTY':
      return {
        ...state,
        centerOffersSpecialty: action.payload
      }
    case GET_CENTER_OFFERS_FOR_TRASLADOS:
      return {
        ...state,
        centerOffersForTraslados: action.payload
      }
    case 'GROUPS_CLEAN_CENTER_OFFERS':
      return {
        ...state,
        centerOffers: []
      }
    case GROUPS_LOAD_CENTER_OFFERS_SPECIALTY_BY_INSTITUTION:
      return {
        ...state,
        centerOffersSpecialtyGrouped: action.payload
      }
    case GROUPS_LOAD_BLOQUES:
      return {
        ...state,
        bloques: action.payload
      }
    case GROUPS_LOAD_MEMBERS_BY_OFFER:
      return {
        ...state,
        membersByOffer: action.payload
      }
    case GROUPS_LOAD_MEMBERS_BY_SUBJECT_GROUP:
      return {
        ...state,
        membersBySubjectGroup: action.payload
      }
    case GROUPS_LOAD_INCIDENTS_TYPES:
      return {
        ...state,
        tiposIncidencia: action.payload
      }
    case GROUPS_LOAD_INCIDENTS:
      return {
        ...state,
        groupIncidencias: action.payload
      }
    case GROUPS_LOAD_ALL_MEMBERS:
      return {
        ...state,
        allGroupMembers: action.payload
      }
    case GROUPS_LOAD_MEMBERS_BY_GROUP:
      return {
        ...state,
        GroupMembers: action.payload
      }
    case GROUPS_CURRENT_CONDITIONS:
      return {
        ...state,
        currentConditions: action.payload
      }
    case GROUPS_ACTIVE_CALENDAR_LOAD:
      return {
        ...state,
        activeCalendar: action.payload
      }
    case GROUPS_CONDITIONS_LOAD:
      return {
        ...state,
        condiciones: action.payload
      }
    case GROUPS_REFRESH:
      return {
        ...state,
        loaded: !state.loaded
      }
    case GROUPS_LOAD_MEMBERS_BY_LEVEL:
      return {
        ...state,
        levelMembers: action.payload
      }
    case GROUPS_LOAD_MEMBERS_WITHOUT_GROUP:
      return {
        ...state,
        membersWithoutGroup: action.payload
      }
    case GROUPS_LOAD_MEMBERS:
      return {
        ...state,
        miembros: action.payload,
        loadedDataGroup: !state.loadedDataGroup
      }
    case GROUPS_LOAD_CENTER_OFFERS:
      return {
        ...state,
        centerOffers: action.payload
      }
    case GET_CENTER_OFFERS:
      return {
        ...state,
        centerOffersGrouped: action.payload
      }
    case GROUPS_LOAD_BY_INSTITUTION:
      return {
        ...state,
        groupsByInstitution: action.payload
      }
    case GROUPS_LOADING:
      return {
        ...state,
        loading: !state.loading,
        error: false
      }
    case GROUPS_BY_OFFER_LOAD:
      return {
        ...state,
        groupsByOffer: action.payload,
        loading: !state.loading,
        error: false
      }
    case GROUPS_LOAD:
      return {
        ...state,
        groups: action.payload,
        loading: false,
        error: false
      }
    case GROUPS_ERROR:
      return {
        ...state,
        loading: false,
        error: true
      }
    default:
      return state
  }
}
