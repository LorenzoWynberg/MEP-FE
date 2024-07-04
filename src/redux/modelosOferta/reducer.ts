import {
  LOAD_MODEL_LEVELS,
  LOAD_MODEL_SPECIALTIES,
  CLEAN_CURRENT_MODEL,
  LOAD_CURRENT_MODEL,
  CREATE_MODEL_OFFER,
  LOAD_MODEL_OFFERS,
  LOAD_EDITED_MODEL,
  DELETE_MODELS,
  LOAD_LEVEL_OFFERS,
  LOAD_LAST_ID,
  CLEAN_STATE_LEVELS_ESP
} from './types.ts'

const INITIAL_STATE = {
  currentOfferLevels: [],
  levelOffers: [],
  currentOfferSpecialties: [],
  currentModelOffer: {},
  modelOffers: [],
  loading: false,
  loaded: false,
  error: false,
  errors: [],
  fields: [],
  lastId: null
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CLEAN_STATE_LEVELS_ESP:
      return {
        ...state,
        currentOfferSpecialties: [],
        currentOfferLevels: []
      }
    case LOAD_LAST_ID:
      return {
        ...state,
        lastId: action.payload
      }
    case LOAD_LEVEL_OFFERS:
      return {
        ...state,
        levelOffers: action.payload
      }
    case DELETE_MODELS:
      return {
        ...state,
        modelOffers: state.modelOffers.filter(item => !action.payload.includes(item.id))
      }
    case LOAD_EDITED_MODEL:
      return {
        ...state,
        modelOffers: state.modelOffers.map(item => {
          if (item.id === action.payload.id) {
            return action.payload
          }
          return item
        })
      }
    case LOAD_MODEL_OFFERS:
      return {
        ...state,
        modelOffers: action.payload,
        loading: false
      }
    case CREATE_MODEL_OFFER:
      return {
        ...state,
        modelOffers: [...state.modelOffers, action.payload],
        loading: false
      }
    case LOAD_MODEL_LEVELS:
      const noDuplicatedLvlIds = []
      const noDuplicatedLvls = []
      action.payload.forEach(item => {
        if (!noDuplicatedLvlIds.includes(item.id)) {
          noDuplicatedLvlIds.push(item.id)
          noDuplicatedLvls.push(item)
        }
      })
      return {
        ...state,
        currentOfferLevels: noDuplicatedLvls
      }
    case LOAD_MODEL_SPECIALTIES:
      const noDuplicatedSpcIds = []
      const noDuplicatedSpcs = []
      action.payload.forEach(item => {
        if (!noDuplicatedSpcIds.includes(item.id)) {
          noDuplicatedSpcIds.push(item.id)
          noDuplicatedSpcs.push(item)
        }
      })
      return {
        ...state,
        currentOfferSpecialties: noDuplicatedSpcs
      }
    case LOAD_CURRENT_MODEL:
      return {
        ...state,
        currentModelOffer: action.payload
      }
    case CLEAN_CURRENT_MODEL:
      return {
        ...state,
        currentOfferLevels: [],
        currentOfferSpecialties: [],
        currentModelOffer: {}
      }
    default: return state
  }
}
