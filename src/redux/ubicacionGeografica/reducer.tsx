import types from './types'

import { ICountry, IState, ICity } from 'types/ubicacionGeografica'

export interface IInitState {
    countries: Array<ICountry>
    states: Array<IState>
    cities: Array<ICity>
}

const initialState: IInitState = {
  countries: [],
  cities: [],
  states: []
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case types.GET_ALL_COUNTRIES:
      return {
        ...state,
        countries: payload
      }
    case types.GET_STATES_BY_COUNTRY_ID:
      return {
        ...state,
        states: payload
      }
    case types.GET_CITIES_BY_STATE_ID:
      return {
        ...state,
        cities: payload
      }
    default:
      return state
  }
}
