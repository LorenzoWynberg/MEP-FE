import { SELECTS_LOAD_CATALOGS, SELECTS_LOAD_MULTICATALOGS } from './types'

const INITIAL_STATE = {
	sexoTypes: [],
	migrationTypes: [],
	etnias: [],
	lenguasIndigenas: [],
	territoriosIndigenas: [],
	estadosCiviles: [],
	idTypes: [],
	nationalities: [],
	lenguasMaternas: [],
	genderTypes: [],
	condicionLaboral: [],
	ocupaciones: [],
	escolaridades: [],
	discapacidades: [],
	relacionEstudiante: [],
	otrasCondiciones: [],
	tipoCE: [],
	tipoRecurso: [],
	tipoAsociacion: [],
	'Dirección de la pendiente': [],
	regionPlanifi: [],
	'Material Principal': [],
	tipoServicio: [],
	categoriaCE: [],
	valoracionPatri: [],
	'Puesto en Junta Educativa': [],
	organzacionEdif: [],
	componentesEdif: [],
	elementosMenores: [],
	elevacion: [],
	tratamientoDeAguas: [],
	estadosTratamientoDeAguas: [],
	motivosBloqueoCuentaoffice365: [],
	duenioRegistral: [],
	zona: [],
	indiceDesarrolloSocial: [],
	regionSocioEconomica: [],
	direccionDeLaPendiente: [],
	alturaRespectoNivelDeCalle: [],
	topografiaPredomiante: [],
	regionClimatica: [],
	climaPredomiante: [],
	caracteristicaAcceso: [],
	otrasAfectacionesTerreno: [],
	territorio: [],
	pisosEdificacion: [],
	valoracionPatrimonial: [],
	pisosMaterialPrincipal: [],
	paredesMaterialPrincipal: [],
	cielorasosMaterialPrincipal: [],
	techoMaterialPrincipal: [],
	canoasBajantesMaterialPrincipal: [],
	puertasVentanasMaterialPrincipal: [],
	estadosElementosMaterialPrincipal: [],
	cerramientoPerimetral: [],
	estadoCerramientoPerimetral: [],
	estacinamientos: [],
	casetaVigilancia: [],
	estado2: [],
	pasosTechados: [],
	numeroDe1A5: [],
	estadoGeneralMuros: [],
	estadoSistemaCamaraCircuito: [],
	proveedordelServicio: [],
	responsabledePago: [],
	tipoEvaluacion: [],
	estadoAsistencia: [],
	proveedoresDeServicios: [],
	apoyosRecibidos: [],
	apoyosNoRecibidos: [],
	tiposApoyos: [],
	tipoCondicionApoyo: [],
	tipoActivoInventarioTecnologico: [],
	estadoInventarioTecnologico: [],
	ubicacionInventarioTecnologico: [],
	fuenteInventarioTecnologico: [],
	talentos: [],
	estrategiasFlexibilidadCurricular: []
}

export default (state = INITIAL_STATE, { type, payload }) => {
	switch (type) {
		case SELECTS_LOAD_CATALOGS:
			return {
				...state,
				[payload.name]: payload.data
			}
		case SELECTS_LOAD_MULTICATALOGS:
			const newState = { ...state }
			payload.types.forEach(type => {
				if (type.name === 'componentesEdif') {
					newState[type.name] = payload.data
						.sort((a, b) => a.nombre.localeCompare(b.nombre))
						.filter(item => item.tiposCatalogo === type.id)
					return
				}
				newState[type.name] = payload.data.filter(
					item => item.tiposCatalogo === type.id
				)
			})
			return newState
		default:
			return state
	}
}
