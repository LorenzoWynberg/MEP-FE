import {
  INSTITUCION_LOAD,
  INSTITUCION_CLEAN,
  INSTITUCION_ADD,
  INSTITUCION_LOADING,
  INSTITUCIONES_LOAD,
  INSTITUCIONES_LOADING,
  INSTITUCION_EDIT,
  INSTITUCIONES_DELETE,
  INSTITUCION_ERROR,
  INSTITUTION_LOAD_SEDES,
  CLEAR_INSTITUTIONS,
  LOAD_INSTITUTIONS,
  SELECT_SHARED_RESOURCE,
  LOAD_SHARED_RESOURCES,
  DELETE_SHARED_RESOURCES,
  LOAD_DATOS_DIRECTOR,
  CLEAR_DATOS_DIRECTOR,
  LOAD_REGIONAL_LOCATION,
  INSTITUCION_LOAD_INFORMACION_PRESUPUESTARIA,
  INSTITUCION_LOAD_OFFERS,
  LOAD_CURRENT_MEMBER_DATA,
  LOAD_IDENTIDAD_MEMBER_DATA,
  LOAD_CURRENT_AUX_ORGANIZATION,
  LOADT_AUX_ORGANIZATION_MEMBERS,
  LOAD_CREATED_MEMBER,
  LOAD_UPDATED_MEMBER,
  LOAD_INSTITUTION_STATES,
  LOAD_CENTROS_BY_REGIONAL,
  LOAD_CENTROS_BY_CIRCUITO
} from './types'

import moment from 'moment'

const INITIAL_STATE = {
  institutions: [],
  currentInstitution: {},
  loading: false,
  loadedInstitution: false,
  sharedResources: [],
  centrosByRegional: [],
  centrosByCircuito: [],
  currentSharedResource: {},
  regionalLocation: {},
  error: false,
  errors: [],
  fields: [],
  sedes: [],
  informacionPresupuestaria: [],
  institutionWithCircularRegional: {
    regional: [],
    circuito: [],
    tipoEstado: []
  },
  datosDirector: {},
  ofertas: [],
  currentMember: {},
  identidadMember: {},
  currentAuxOrganization: {},
  members: [],
  institutionStates: [],
  estadoCentro:[]
}

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case 'INSTITUCION_LOAD_WITH_CIRCUITO_REGIONAL':
      return {
        ...state,
        institutionWithCircularRegional: {
          ...payload,
          circuito: JSON.parse(payload.circuito),
          regional: JSON.parse(payload.regional),
          tipoEstado: JSON.parse(payload.estados)
        }
      }
    case LOAD_INSTITUTION_STATES:
      return {
        ...state,
        institutionStates: payload
      }
    case LOAD_CENTROS_BY_REGIONAL:
      return {
        ...state,
        centrosByRegional: payload
      }
    case LOAD_CENTROS_BY_CIRCUITO:
      return {
        ...state,
        centrosByCircuito: payload
      }
    case LOAD_UPDATED_MEMBER:
      const _members = [...state.members]
      const _newmembers = _members.map((member) => {
        if (member.id === payload.id) {
          return payload
        } else {
          return member
        }
      })

      return {
        ...state,
        members: _newmembers
      }
    case LOAD_CREATED_MEMBER:
      return {
        ...state,
        members: [...state.members, payload]
      }
    case LOADT_AUX_ORGANIZATION_MEMBERS:
      return {
        ...state,
        members: payload || []
      }
    case LOAD_CURRENT_AUX_ORGANIZATION:
      return {
        ...state,
        currentAuxOrganization: payload
      }
    case LOAD_CURRENT_MEMBER_DATA:
      return {
        ...state,
        currentMember: {
          ...payload,
          rige:
						payload.rige &&
						moment(payload.rige).format('YYYY-MM-DD'),
          vence:
						payload.vence &&
						moment(payload.vence).format('YYYY-MM-DD')
        }
      }
    case LOAD_IDENTIDAD_MEMBER_DATA:
      const _tipoIdentidad = payload.datos?.find((x) => x.catalogoId === 1)
      const _nacionalidad = payload.datos?.find((x) => x.catalogoId === 2)
      return {
        ...state,
        identidadMember: payload,
        currentMember: {
          ...state.currentMember,
          tipoIdentificacionId: _tipoIdentidad?.elementoId,
          nacionalidadId: _nacionalidad?.elementoId,
          identidadId: payload.id,
          identificacion: payload.identificacion,
          nombre: payload.nombre,
          primerApellido: payload.primerApellido,
          segundoApellido: payload.segundoApellido
        }
      }
    case INSTITUCION_LOAD_OFFERS:
      return {
        ...state,
        ofertas: payload.map((oferta) => {
          if (!oferta.servicio) {
            return {
              ...oferta,
              servicio: 'Sin servicio'
            }
          }
          return oferta
        })
      }
    case INSTITUCION_LOAD_INFORMACION_PRESUPUESTARIA:
      return {
        ...state,
        informacionPresupuestaria: payload
      }
    case LOAD_REGIONAL_LOCATION:
      return {
        ...state,
        regionalLocation: payload
      }
    case LOAD_DATOS_DIRECTOR:
      return {
        ...state,
        datosDirector: payload
      }
    case CLEAR_DATOS_DIRECTOR:
      return {
        ...state,
        datosDirector: {}
      }
    case DELETE_SHARED_RESOURCES:
      return {
        ...state,
        sharedResources: state.sharedResources.filter(
          (sR) => !payload.includes(sR.id)
        )
      }
    case LOAD_SHARED_RESOURCES:
      return {
        ...state,
        sharedResources: payload
      }
    case SELECT_SHARED_RESOURCE:
      return {
        ...state,
        currentSharedResource: payload
      }
    case LOAD_INSTITUTIONS:
      return {
        ...state,
        institutions: payload
      }
    case CLEAR_INSTITUTIONS:
      return {
        ...state,
        institutions: []
      }
    case INSTITUCIONES_LOADING:
      return {
        ...state,
        loading: !state.loading,
        error: false,
        errors: [],
        fields: []
      }
    case INSTITUCION_ADD:
      return {
        ...state,
        currentInstitution: payload,
        loading: false,
        error: false,
        errors: [],
        fields: []
      }
    case INSTITUTION_LOAD_SEDES:
      return {
        ...state,
        sedes: payload || []
      }
    case INSTITUCION_EDIT:
      const institutions = state.institutions.slice()
      institutions.forEach((item, i) => {
        if (item.id === [payload.id]) {
          institutions[i] = payload
        }
      })
      return {
        ...state,
        institutions,
        loading: false,
        error: false,
        errors: [],
        fields: []
      }
    case INSTITUCIONES_LOAD:
      return {
        ...state,
        institutions: payload,
        loading: false,
        error: false,
        errors: [],
        fields: []
      }

    case INSTITUCION_LOAD:
      return {
        ...state,
        currentInstitution: payload,
        loadedMember: true,
        loading: false,
        error: false,
        errors: [],
        fields: []
      }
    case INSTITUCION_LOADING:
      return {
        ...state,
        loading: true,
        error: false,
        errors: [],
        fields: []
      }
    case INSTITUCIONES_DELETE:
      const _newInstitutions = state.institutions.slice()
      const deletedInstitutions = _newInstitutions.filter(
        (item) => !payload.includes(item.id)
      )
      return {
        ...state,
        institutions: deletedInstitutions,
        loading: false,
        error: false,
        errors: [],
        fields: []
      }
    case INSTITUCION_CLEAN:
      return {
        ...state,
        currentInstitution: {},
        loadedMember: false,
        loaded: true,
        errors: [],
        fields: []
      }
    case INSTITUCION_ERROR:
      return {
        ...state,
        loading: false,
        errors: payload.errors || [],
        fields: payload.fields || []
      }
    default:
      return state
  }
}
