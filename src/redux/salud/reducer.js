import {
  SALUD_LOADING,
  LOAD_CURRENT_SALUD,
  CLEAN_CURRENT_SALUD,
  LOAD_SALUD_ITEMS,
  SALUD_ADD,
  SALUD_EDIT,
  SALUD_REMOVE,
  SALUD_FAILURE
} from './types'
import moment from 'moment'
import { orderBy } from 'lodash'

const INITIAL_STATE = {
  currentItem: {},
  items: [],
  loading: false,
  errorMessages: {},
  errorFields: {}
}

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case SALUD_LOADING:
      return {
        ...state,
        loading: true,
        errorFields: {},
        errorMessages: {}
      }
    case LOAD_SALUD_ITEMS:
      return {
        ...state,
        items: getItemsFull(payload),
        loading: false,
        errorFields: {},
        errorMessages: {}
      }
    case LOAD_CURRENT_SALUD:
      return {
        ...state,
        currentItem:
          payload === 0
            ? {
                seguroSocial: '',
                peso: null,
                talla: null,
                imc: null,
                identidadId: null
              }
            : { ...state.items.filter((item) => item.id === payload)[0] },
        loading: false,
        errorFields: {},
        errorMessages: {}
      }
    case CLEAN_CURRENT_SALUD:
      return {
        ...state,
        currentItem: {},
        loading: false,
        errorFields: {},
        errorMessages: {}
      }
    case SALUD_ADD:
      return {
        ...state,
        items: getItemsFull([...state.items, payload]),
        loading: false,
        errorFields: {},
        errorMessages: {}
      }
    case SALUD_EDIT:
      return {
        ...state,
        items: getItemsFull(
          state.items.map((item) => (item.id === payload.id ? payload : item))
        ),
        loading: false,
        errorFields: {},
        errorMessages: {}
      }
    case SALUD_REMOVE:
      return {
        ...state,
        items: getItemsFull(state.items.filter((item) => item.id !== payload)),
        loading: false,
        errorFields: {},
        errorMessages: {}
      }

    case SALUD_FAILURE:
      return {
        ...state,
        loading: false,
        errorFields: payload.fields,
        errorMessages: payload.errors
      }
    default:
      return state
  }
}

// date simple, year, last

const getItemsFull = (items) => {
  items = orderBy(
    items,
    function (o) {
      return new moment(o.fechaInsercion)
    },
    ['desc']
  )
  return items.map((item) => {
    item.date = moment(item.fechaInsercion).format('DD/MM/YYYY')
    item.year = moment(item.fechaInsercion).format('YYYY')
    item.showActionRow = item.id === items[0].id

    return item
  })
}
