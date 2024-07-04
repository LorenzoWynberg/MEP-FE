import {
  OFFERS_GET,
  OFFERS_ASSIGNED_GET,
  OFFERS_LOADING,
  OFFERS_LOAD_OPTIONS,
  OFFERS_SAVE,
  OFFERS_DELETE,
  OFFERS_EDIT,
  OFFERS_ERROR,
  OFFERS_ACTIVATE
} from './types.ts'

const INITIAL_STATE = {
  modelOffers: [],
  currentInstitutionModelOffers: [],
  modalidades: [],
  servicios: [],
  especialiddades: [],
  currentOffer: {},
  loading: false,
  loaded: false,
  error: false,
  errors: [],
  fields: [],
  offersAssigned: []
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case OFFERS_LOAD_OPTIONS:
      return {
        ...state,
        [action.payload.name]: action.payload.options
      }
    case OFFERS_ERROR:
      return {
        ...state,
        loading: false,
        errors: action.payload.errors || [],
        fields: action.payload.fields || []
      }
    case OFFERS_LOADING:
      return {
        ...state,
        loading: true,
        error: false,
        errors: [],
        fields: []
      }
    case OFFERS_GET:
      return {
        ...state,
        loading: false,
        error: false,
        errors: [],
        fields: [],
        loaded: true,
        currentInstitutionModelOffers: action.payload
      }
    case OFFERS_ASSIGNED_GET:
      return {
        ...state,
        loading: false,
        error: false,
        errors: [],
        fields: [],
        loaded: true,
        offersAssigned: action.payload
      }
    case OFFERS_SAVE:
      return {
        ...state,
        loading: false,
        error: false,
        errors: [],
        fields: [],
        currentInstitutionModelOffers: [...state.currentInstitutionModelOffers, action.payload]
      }
    case OFFERS_DELETE:
      let newOffersByInst = [...state.currentInstitutionModelOffers]
      newOffersByInst = newOffersByInst.map(item => {
        if (action.payload.includes(item.id)) {
          return { ...item, estado: false }
        }
        return item
      })
      return {
        ...state,
        loading: false,
        error: false,
        errors: [],
        fields: [],
        currentInstitutionModelOffers: newOffersByInst
      }
    case OFFERS_ACTIVATE:
      let _newOffersByInst = [...state.currentInstitutionModelOffers]
      _newOffersByInst = _newOffersByInst.map(item => {
        if (action.payload.includes(item.id)) {
          return { ...item, estado: true }
        }
        return item
      })
      return {
        ...state,
        loading: false,
        error: false,
        errors: [],
        fields: [],
        currentInstitutionModelOffers: _newOffersByInst
      }
    case OFFERS_EDIT:
      let newOffers = [...state.currentInstitutionModelOffers]
      newOffers = newOffers.map(offer => {
        if (action.payload.id === offer.id) {
          return action.payload
        }
        return offer
      })
      return {
        ...state,
        loading: false,
        error: false,
        errors: [],
        fields: [],
        currentInstitutionModelOffers: newOffers
      }
    default: return state
  }
}
