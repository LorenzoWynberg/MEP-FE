import { isEmpty } from 'lodash'
import {
	IDENTIFICATION_LOAD,
	IDENTIFICATION_ADD_CATALOGS,
	IDENTIFICATION_CLEAN,
	IDENTIFICATION_LOADING,
	IDENTIFICATION_ERROR,
	IDENTIFICATION_LOAD_FICHA,
	IDENTIFICATION_LOAD_FICHA_DATOS_EDUCATIVOS,
	IDENTIFICATION_LOAD_FICHA_MEMBERS,
	CLEAN_FICHA,
	LOAD_MATRICULA_HISTORY
} from './types'

const INITIAL_STATE = {
	data: !isEmpty(localStorage.getItem('identificacion_load'))
		? JSON.parse(localStorage.getItem('identificacion_load'))
		: {},
	dataFicha: !isEmpty(localStorage.getItem('ficha_load')) ? JSON.parse(localStorage.getItem('ficha_load')) : {},
	loaded: false,
	loading: false,
	error: false,
	errorFields: {},
	errorMessages: {},
	miembrosFicha: [],
	datosEducativosFicha: [],
	matriculaHistory: !isEmpty(localStorage.getItem('matriculaHistory'))
		? JSON.parse(localStorage.getItem('matriculaHistory'))
		: []
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case LOAD_MATRICULA_HISTORY:
			localStorage.setItem('matriculaHistory', JSON.stringify(action.payload))
			return {
				...state,
				matriculaHistory: action.payload
			}
		case CLEAN_FICHA:
			return {
				...state,
				dataFicha: {},
				miembrosFicha: [],
				datosEducativosFicha: []
			}
		case IDENTIFICATION_LOAD_FICHA_MEMBERS:
			return {
				...state,
				loading: false,
				miembrosFicha: action.payload
			}
		case IDENTIFICATION_LOAD_FICHA_DATOS_EDUCATIVOS:
			return {
				...state,
				loading: false,
				datosEducativosFicha: action.payload
			}
		case IDENTIFICATION_LOAD_FICHA:
			localStorage.setItem('ficha_load', JSON.stringify(action.payload))
			return {
				...state,
				loading: false,
				dataFicha: action.payload,
				data: action.payload
			}
		case IDENTIFICATION_LOAD:
			localStorage.setItem('identificacion_load', JSON.stringify(action.payload))
			return {
				...state,
				data: action.payload,
				loaded: true,
				loading: false,
				error: false,
				errorFields: {},
				errorMessages: {}
			}
		case IDENTIFICATION_LOADING:
			return {
				...state,
				loading: true,
				error: false,
				errorFields: {},
				errorMessages: {}
			}
		case IDENTIFICATION_ADD_CATALOGS:
			return {
				...state,
				[action.payload.name]: action.payload.data,
				loaded: true,
				error: false
			}
		case IDENTIFICATION_CLEAN:
			return INITIAL_STATE
		case IDENTIFICATION_ERROR:
			return {
				...state,
				loading: false,
				errorFields: action.payload.fields,
				errorMessages: action.payload.errors
			}
		default:
			return state
	}
}
