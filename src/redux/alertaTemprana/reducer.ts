import * as types from './types'

const INITIAL_STATE = {
	contextoInterno: 0,
	contextoExterno: 0,
	alerts: [],
	countAlerts: [],
	alertsEnrollment: [],
	observacionesAlerta: [],
	estadosAlertas: [],

	estudiantesConAlertas: [],
	alertasPorEstudiante: [],
	alertsPercent: [],
	alertsIncidents: [],
	alertStatistics: {
		entityList: []
	},
	alertsCatalog: [],
	alertsStudent: {
		entityList: []
	},
	alertsActives: {
		entityList: []
	},
	alertsSend: {
		entityList: []
	},
	alertsReceived: {
		entityList: []
	},
	alertsApproved: {
		entityList: []
	},
	alertsRejected: {
		entityList: []
	},
	globalSteps: [],
	currentAlert: {},
	currentAlertStudent: {},
	currentAlertStepStudent: {},
	currentStudent: {},
	alertsResponisble: [],
	alertsContext: [],
	alertsDimension: [],
	error: '',
	errors: [],
	fields: [],
	loading: false
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
		case types.GET_ESTUDIANTE_CON_ALERTA:
			return {
				...state,
				estudiantesConAlertas: action.payload
			}
		case types.GET_ESTADOS_CON_ALERTA:
			return {
				...state,
				estadosAlertas: action.payload
			}
		case types.GET_ALERTS_OBSERVACIONES:
			return {
				...state,
				observacionesAlerta: action.payload
			}
		case types.GET_ALERTAS_POR_ESTUDIANTE:
			return {
				...state,
				alertasPorEstudiante: action.payload
			}
		case types.EARLY_ALERT_FILTER:
			return {
				...state,
				alerts: action.payload,
				error: '',
				loading: false
			}
		case types.EARLY_ALERT_CLEAR:
			return {
				...state,
				alerts: [],
				error: '',
				loading: false
			}
		case types.ALERT_LOAD:
			return {
				...state,
				currentAlert: action.payload,
				error: '',
				loading: false
			}
		case types.ALERTS_STUDENT_STEPS_LOAD:
			return {
				...state,
				currentAlertStudent: action.payload,
				error: '',
				loading: false
			}
		case types.ALERTS_STUDENT_STEP_LOAD:
			return {
				...state,
				currentAlertStepStudent: action.payload,
				error: '',
				loading: false
			}
		case types.EARLY_ALERT_LOADING:
			return { ...state, loading: true, error: '' }
		case types.CONTEXTS_LOADING:
			return { ...state, loading: true, error: '' }
		case types.CONTEXTS_INTERNO_LOAD:
			return {
				...state,
				contextoInterno: action.payload,
				error: '',
				loading: false
			}
		case types.CONTEXTS_EXTERNO_LOAD:
			return {
				...state,
				contextoExterno: action.payload,
				error: '',
				loading: false
			}
		case types.STATISTICS_LOADING:
			return { ...state, loading: true, error: '' }
		case types.STATISTICS_ALERTS_LOAD:
			return {
				...state,
				countAlerts: action.payload,
				error: '',
				loading: false
			}
		case types.STATISTICS_ALERTS_ENROLLMENT_LOAD:
			return {
				...state,
				alertsEnrollment: action.payload,
				error: '',
				loading: false
			}
		case types.STATISTICS_ALERTS_PERCENT:
			return {
				...state,
				alertsPercent: action.payload,
				error: '',
				loading: false
			}
		case types.STATISTICS_ALERTS_INCIDENTS:
			return {
				...state,
				alertsIncidents: action.payload,
				error: '',
				loading: false
			}
		case types.ALERTS_CATALOG_LOAD:
			return {
				...state,
				alertsCatalog: action.payload,
				error: '',
				loading: false
			}
		case types.ALERTS_CATALOG_FAIL:
			return {
				...state,
				error: action.payload,
				loading: false
			}
		case types.ALERTS_CONTEXT_LOAD:
			return {
				...state,
				alertsContext: action.payload,
				error: '',
				loading: false
			}
		case types.ALERTS_DIMENSION_LOAD:
			return {
				...state,
				alertsDimension: action.payload,
				error: '',
				loading: false
			}
		case types.ALERTS_STATISTICS_LOAD:
			return {
				...state,
				alertStatistics: action.payload,
				error: '',
				loading: false
			}
		case types.ALERTS_RESPONSIBLE_LOADING:
			return {
				...state,
				error: '',
				loading: true
			}
		case types.ALERTS_RESPONSIBLE_LOAD:
			return {
				...state,
				alertsResponisble: action.payload,
				error: '',
				loading: false
			}
		case types.ALERTS_ERRROS:
			return {
				...state,
				error: 'error',
				loading: false,
				errors: action.payload
			}
		case types.ALERTS_STUDENTS_LOAD:
			return {
				...state,
				alertsStudent: action.payload,
				error: '',
				loading: false
			}
		case types.ALERTS_ACTIVES_LOAD:
			return {
				...state,
				alertsActives: action.payload,
				error: '',
				loading: false
			}
		// Solicitudes
		case types.ALERTS_REQUEST_LOADING:
			return {
				...state,
				loading: true
			}
		case types.ALERTS_REQUEST_SENT_LOAD:
			return {
				...state,
				alertsSend: action.payload,
				error: '',
				loading: false
			}
		case types.ALERTS_REQUEST_RECEIVED_LOAD:
			return {
				...state,
				alertsReceived: action.payload,
				error: '',
				loading: false
			}
		case types.ALERTS_REQUEST_APPROVED_LOAD:
			return {
				...state,
				alertsApproved: action.payload,
				error: '',
				loading: false
			}
		case types.ALERTS_REQUEST_REJECTED_LOAD:
			return {
				...state,
				alertsRejected: action.payload,
				error: '',
				loading: false
			}
		// Proceso
		case types.ALERTS_GLOBAL_STEPS_LOADING:
			return {
				...state,
				loading: true
			}
		case types.ALERTS_GLOBAL_STEPS_LOAD:
			return {
				...state,
				globalSteps: action.payload,
				error: '',
				loading: false
			}
		case types.ALERTS_STUDENT_DETAIL_LOAD:
			return {
				...state,
				currentStudent: action.payload,
				error: '',
				loading: false
			}
		case types.ALERTS_CLEAR:
			return { ...INITIAL_STATE }
		default:
			return state
  }
}
