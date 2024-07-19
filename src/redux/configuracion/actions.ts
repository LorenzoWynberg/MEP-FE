import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import { showProgress, hideProgress } from 'Utils/progress'
import {
	CONFIGURATION_LOAD_INSTITUTIONS,
	CONFIGURATION_ERROR,
	CONFIGURATION_LOAD_REGIONALES,
	CONFIGURATION_LOAD_ALL_REGIONALES,
	CONFIGURATION_LOAD_REGIONAL,
	CONFIGURATION_LOAD_CIRCUITOS,
	CONFIGURATION_LOAD_CIRCUITO,
	CONFIGURATION_LOAD_DIRECTORES,
	CONFIGURATION_LOAD_DIRECTOR,
	CONFIGURATION_LOAD_USERS,
	CONFIGURATION_LOAD_SEDES,
	CONFIGURATION_LOAD_PARENT_INTSTITUTIONS,
	CONfIGURATION_ERROR_DATA,
	CONFIGURATION_LOAD_CURRENT_CENTER,
	CONFIGURATION_CLEAN_INSTITUTIONS,
	LOAD_CURRENT_INSTITUTION_DIRECTOR,
	LOAD_LOCATION,
	CONFIGURATION_LOAD_ALL_CIRCUITOS,
	CONFIGURACION_LOAD_SEARCH_INSTITUTIONS,
	SEDES_DELETE,
	SET_EXPEDIENTE_REGIONAL,
	SET_EXPEDIENTE_SUPERVISION
} from './types'
import { handleErrors } from '../../utils/handleErrors'
import { CurrentRegional, CurrentCircuito } from '../../types/configuracion'

interface actionResponse {
	error: boolean | string
	options: any[]
}

const handleError = (e): string => {
	let response: string = ''
	if (e.response) {
		if (typeof e.response?.data?.error === 'string') {
			response = e.response.data.error
		} else {
			response = 'Oops, Algo ha salido mal'
		}
	} else {
		response = e.message || 'Oops, Algo ha salido mal'
	}
	return response
}

const loadInstitutions = payload => ({
	type: CONFIGURATION_LOAD_INSTITUTIONS,
	payload
})

const instClean = () => ({
	type: CONFIGURATION_CLEAN_INSTITUTIONS
})

const configError = payload => ({
	type: CONFIGURATION_ERROR,
	payload
})
const configErrorFeedback = payload => ({
	type: CONfIGURATION_ERROR_DATA,
	payload
})

const loadRegionales = payload => ({
	type: CONFIGURATION_LOAD_REGIONALES,
	payload
})

const loadAllRegionales = payload => ({
	type: CONFIGURATION_LOAD_ALL_REGIONALES,
	payload
})

const loadAllCircuitos = payload => ({
	type: CONFIGURATION_LOAD_ALL_CIRCUITOS,
	payload
})

const loadRegional = payload => ({
	type: CONFIGURATION_LOAD_REGIONAL,
	payload
})

const loadSearchInstitutions = payload => ({
	type: CONFIGURACION_LOAD_SEARCH_INSTITUTIONS,
	payload
})

const loadDatosDirector = payload => ({
	type: LOAD_CURRENT_INSTITUTION_DIRECTOR,
	payload
})

const loadCircuitos = payload => ({
	type: CONFIGURATION_LOAD_CIRCUITOS,
	payload
})

const loadCircuito = payload => ({
	type: CONFIGURATION_LOAD_CIRCUITO,
	payload
})

const loadDirectores = payload => ({
	type: CONFIGURATION_LOAD_DIRECTORES,
	payload
})

const loadDirector = payload => ({
	type: CONFIGURATION_LOAD_DIRECTOR,
	payload
})

const loadUsers = payload => ({
	type: CONFIGURATION_LOAD_USERS,
	payload
})

const loadSedes = payload => ({
	type: CONFIGURATION_LOAD_SEDES,
	payload
})

const loadDeleteSedes = payload => ({
	type: SEDES_DELETE,
	payload
})

const loadParentsInstitutions = payload => ({
	type: CONFIGURATION_LOAD_PARENT_INTSTITUTIONS,
	payload
})

const loadCurrentIntstitution = payload => ({
	type: CONFIGURATION_LOAD_CURRENT_CENTER,
	payload
})

const loadLocation = payload => ({
	type: LOAD_LOCATION,
	payload
})

export const setExpedienteRegional = data => async dispatch => {
	dispatch({
		type: SET_EXPEDIENTE_REGIONAL,
		payload: data
	})
}

export const setExpedienteSupervision = data => async dispatch => {
	dispatch({
		type: SET_EXPEDIENTE_SUPERVISION,
		payload: data
	})
}

export const getInstitutionsPaginated = (page, qnt) => async dispatch => {
	try {
		const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Admin/Institucion/paginated/${page}/${qnt}`
		)
		dispatch(loadInstitutions(response.data))
		return { error: false }
	} catch (e) {
		dispatch(configError(e.message))
		return { error: e.message }
	}
}

export const searchCenter = text => async dispatch => {
	try {
		const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/Institucion/GetSearchLight/${text}/nombre`
		)
		dispatch(loadParentsInstitutions(response.data))
		return { error: false }
	} catch (e) {
		dispatch(configError(e.message))
		return { error: e.message }
	}
}

// ESTE ACTION RETORNA LA DATA... Se que es un pecado para redux pero para conservar el flujo sin refactorizar nada mucho mas grande se decicio colocarlo asi
export const searchCenterById = async id => {
	try {
		const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/Institucion/GetById/${id}`
		)
		return { error: false, data: response.data }
	} catch (e) {
		return { error: e.message }
	}
}

export const updateLocation = data => async dispatch => {
	dispatch(loadLocation(data))
}

export const filterInstitutionsPaginated =
	(
		publicos = false,
		page,
		qnt,
		filterType = '',
		filterText = '',
		orderBy = 'id',
		direction = 'ASC'
	) =>
		async dispatch => {
			try {
				const response: any = await axios.get(
					`${envVariables.BACKEND_URL
					}/api/Admin/Institucion/paginated?Pagina=${page}&Cantidad=${qnt}&FiltrarPor=${filterType}&Filtro=${filterText || ''
					}&OrdenarPor=${orderBy}&Direccion=${direction}${publicos ? '&TipoInstitucion=publico' : ''
					}`
				)
				dispatch(loadInstitutions(response.data))
				return { error: false, options: response.data.entityList }
			} catch (e) {
				dispatch(configError(e.message))
				return { error: e.message }
			}
		}

export const filterInBackendInstitutionsPaginated =
	(publicos = false, page = 1, qnt = 30, filterText = 'NULL') =>
		async dispatch => {
			try {
				const tipoInstitucion = publicos ? 'publico' : 'privado'
				const response: any = await axios.get(
					`${envVariables.BACKEND_URL}/api/Admin/Institucion/paginated/${page}/${qnt}/${filterText || 'NULL'
					}/${tipoInstitucion}`
				)
				dispatch(loadInstitutions(response.data))
				return { error: false, options: response.data.entityList }
			} catch (e) {
				dispatch(configError(e.message))
				return { error: e.message }
			}
		}

export const getInstitutionsPaginatedWithFilter =
	(page = '', size = '', filter = 'NULL') =>
		async dispatch => {
			try {
				const response: any = await axios.get(
					`${envVariables.BACKEND_URL}/api/Admin/Institucion/paginated/${page}/${size}/${filter}`
				)
				dispatch(loadSearchInstitutions(response.data))
				return { error: false, options: response.data.entityList }
			} catch (e) {
				dispatch(configError(e.message))
				return { error: e.message }
			}
		}

export const getInstitucion =
	(id: number): ((any) => Promise<actionResponse>) =>
		async (dispatch: any): Promise<actionResponse> => {
			try {
				const response: any = await axios.get(
					`${envVariables.BACKEND_URL}/api/Admin/Institucion/GetById/${id}`
				)
				dispatch(loadCurrentIntstitution(response.data))
				return { error: false, options: response.data.entityList }
			} catch (e) {
				dispatch(configError(e.message))
				return { error: e.message, options: [] }
			}
		}


export const getTablaEstudiantesServicioComunalById =
	(id: number): ((any) => Promise<actionResponse>) =>
		async (dispatch: any): Promise<actionResponse> => {
			try {
				const response: any = await axios.get(
					`${envVariables.BACKEND_URL}/api/ServicioComunal/GetServicioComunalByStudentId/${id}`
				)
				console.log('response getTablaEstudiantesServicioComunalById', response)
				return { error: false, options: response.data }
			} catch (e) {
				dispatch(configError(e.message))
				return { error: e.message, options: [] }
			}
		}

export const GetServicioComunalInfoById  =
	(id: number): ((any) => Promise<actionResponse>) =>
		async (dispatch: any): Promise<actionResponse> => {
			try {
				const response: any = await axios.get(
					`${envVariables.BACKEND_URL}/api/ServicioComunal/GetServicioComunalInfoById/${id}`
				)
				console.log('response', response)
				return { error: false, options: response.data }
			} catch (e) {
				dispatch(configError(e.message))
				return { error: e.message, options: [] }
			}
		}
export const GetServicioComunalByInstitucionId =
	(id: number): ((any) => Promise<actionResponse>) =>
		async (dispatch: any): Promise<actionResponse> => {
			try {
				const response: any = await axios.get(
					`${envVariables.BACKEND_URL}/api/ServicioComunal/GetServicioComunalByInstitucionId/${id}`
				)
				console.log('response', response)
				return { error: false, options: response.data }
			} catch (e) {
				dispatch(configError(e.message))
				return { error: e.message, options: [] }
			}
		}
export const getInstitucionesFinder =
	(publicos = false, filter = '', page = 1, size = 100, regionId, circuitoId, institucionId) =>
		async dispatch => {
			try {
				showProgress()
				const response: any = await axios.get(
					`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/GetInstituciones/`,
					{
						params: {
							publicos,
							filtro: filter || 'NULL',
							regionId,
							circuitoId,
							institucionId,
							pageNum: page,
							pageSize: size
						}
					}
				)
				const result = {
					entityList: response.data,
					pageNumber: 1,
					pageSize: 100,
					totalCount: 1,
					totalPages: 1
				}
				dispatch(loadInstitutions(result))

				hideProgress()
				return { error: false, options: response.data }
			} catch (e) {
				dispatch(configError(e.message))
				hideProgress()
				return { error: e.message }
			}
		}

export const getAllInstitucionesFinder =
	(filter = '', page = 1, size = 100, regionId, circuitoId, institucionId) =>
		async dispatch => {
			try {
				showProgress()
				const response: any = await axios.get(
					`${envVariables.BACKEND_URL}/api/Areas/GestorCatalogos/UsuarioCatalogo/GetAllInstituciones/`,
					{
						params: {
							filtro: filter || 'NULL',
							regionId,
							circuitoId,
							institucionId,
							pageNum: page,
							pageSize: size
						}
					}
				)
				const result = {
					entityList: response.data,
					pageNumber: 1,
					pageSize: 100,
					totalCount: 1,
					totalPages: 1
				}
				dispatch(loadInstitutions(result))

				hideProgress()
				return { error: false, options: response.data }
			} catch (e) {
				dispatch(configError(e.message))
				hideProgress()
				return { error: e.message }
			}
		}

export const advancedFilterInstitutionsPaginated =
	(page, qnt, filterType, filterText) => async dispatch => {
		try {
			const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/Admin/Institucion/paginated/${page}/${qnt}/${filterType}/${filterText}`
			)
			dispatch(loadInstitutions(response.data))
			return { error: false }
		} catch (e) {
			dispatch(configError(e.message))
			return { error: e.message }
		}
	}

	export const crearServicioComunal = (data) => async dispatch => {
		try {
			const response = await axios.post(`${envVariables.BACKEND_URL}/api/ServicioComunal/CrearServicioComunal`, data)
	
	
			return { error: false, response: response.data }
		} catch (e) {
			const backErrors = handleErrors(e)
			dispatch(configErrorFeedback({ ...backErrors, error: e.message }))
			return { error: e.message }
		}
	}

	export const actualizarServicioComunal = (data) => async dispatch => {
		try {
			const response = await axios.put(`${envVariables.BACKEND_URL}/api/ServicioComunal/ActualizarServicioComunal`, data)
	
	
			return { error: false, response: response.data }
		} catch (e) {
			const backErrors = handleErrors(e)
			dispatch(configErrorFeedback({ ...backErrors, error: e.message }))
			return { error: e.message }
		}
	}

export const createInstitution = (data, page, qnt, cb) => async dispatch => {
	try {
		const response = await axios.post(`${envVariables.BACKEND_URL}/api/Admin/Institucion`, data)
		dispatch(filterInstitutionsPaginated(page, qnt))
		dispatch(configErrorFeedback({}))
		if (cb) {
			cb(response.data)
		}
		return { error: false }
	} catch (e) {
		const backErrors = handleErrors(e)
		dispatch(configErrorFeedback({ ...backErrors, error: e.message }))
		return { error: e.message }
	}
}

export const loadCurrentInstitution = item => dispatch => {
	dispatch(loadCurrentIntstitution(item))
}

export const updateInstitution = (data, page, qnt) => async dispatch => {
	try {
		const response = await axios.put(`${envVariables.BACKEND_URL}/api/Admin/Institucion`, data)
		dispatch(getInstitutionsPaginated(page, qnt))
		dispatch(loadCurrentIntstitution(response.data))
		dispatch(configErrorFeedback({}))
		return { error: false, response: response.data }
	} catch (e) {
		const backErrors = handleErrors(e)
		dispatch(configErrorFeedback({ ...backErrors, error: e.message }))
		return {
			error: e.response?.data?.error || 'Debe completar la información de ubicación temporal'
		}
	}
}

export const checkMatricula = institutionId => async () => {
	try {
		const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/Institucion/checkMatricula/${institutionId}`
		)

		return response.data
	} catch (e) {
		return { error: e.message }
	}
}

export const deleteInstitutions = (ids, page, qnt) => async dispatch => {
	try {
		const response = await axios.delete(`${envVariables.BACKEND_URL}/api/Admin/Institucion/`, {
			data: ids
		})
		dispatch(getInstitutionsPaginated(page, qnt))
		return { error: false }
	} catch (e) {
		dispatch(configError(e.message))
		return { error: e.message }
	}
}

export const getCircuitosPaginated = data => async dispatch => {
	try {
		const { pagina, cantidad, filterType = '', filterText = '' } = data
		const response: any = await axios.get(
			`${envVariables.BACKEND_URL}/api/Admin/Circuito/paginated?Pagina=${pagina}&Cantidad=${cantidad}&FiltrarPor=${filterType}&Filtro=${filterText}&OrdenarPor=fechaActualizacion&Direccion=DESC`
		)
		dispatch(loadCircuitos(response.data))
		return { error: false, options: response.data.entityList }
	} catch (error) {
		dispatch(configError(error.message))
		return { error: true }
	}
}

export const getCircuitosbyRegional = regional => async dispatch => {
	try {
		const response: any = await axios.get(
			`${envVariables.BACKEND_URL}/api/Admin/Circuito/GetByRegional/${regional}`
		)
		dispatch(loadCircuitos(response.data))
		return { error: false, options: response.data }
	} catch (error) {
		dispatch(configError(error.message))
		return { error: true }
	}
}

export const getCircuitosPaginatedByFilter = data => async dispatch => {
	try {
		const { pagina, cantidad, type, search } = data
		const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Admin/Circuito/paginated/${pagina}/${cantidad}/${search}`
		)
		dispatch(loadCircuitos(response.data))
		return { error: false }
	} catch (error) {
		dispatch(configError(error.message))
		return { error: true }
	}
}

export const getCircuitos = () => async dispatch => {
	try {
		const response = await axios.get(`${envVariables.BACKEND_URL}/api/Admin/Circuito`)
		dispatch(loadCircuitos(response.data))
		return { error: false }
	} catch (e) {
		dispatch(configError(e.message))
		return { error: e.message }
	}
}

export const getDatosDirector = id => async dispatch => {
	try {
		const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/institucion/GetDatosDirector/${id}`
		)
		dispatch(loadDatosDirector(response.data))
		return { error: false }
	} catch (e) {
		return { error: true, message: e.message }
	}
}

export const buscarDirectores = data => async dispatch => {
	try {
		const { pagina, cantidad, keyword } = data
		const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Admin/Users/paginated/${pagina}/${cantidad}/all/${keyword}`
		)
		dispatch(loadUsers(response.data))
		return { error: false, data: response.data }
	} catch (e) {
		dispatch(configError(e.message))
		return { error: e.message }
	}
}

export const getDirectores = data => async dispatch => {
	try {
		const { institucionId, pagina, cantidad, keyword } = data
		const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Admin/Institucion/${institucionId}/Directores/paginated/${pagina}/${cantidad}?filter=${keyword}`
		)
		dispatch(loadDirectores(response.data))
		return { error: false }
	} catch (e) {
		dispatch(configError(e.message))
		return { error: e.message }
	}
}

export const asignarDirector = data => async dispatch => {
	try {
		await axios.post(
			`${envVariables.BACKEND_URL}/api/Admin/Institucion/Directores/Asignar`,
			data
		)
		return { error: false }
	} catch (e) {
		dispatch(configError(e.message))
		return { error: e.message }
	}
}

export const getSedes = institucionId => async dispatch => {
	try {
		const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/Institucion/${institucionId}/sedes`
		)
		dispatch(loadSedes(response.data))
		return { error: false, response: response.data }
	} catch (e) {
		dispatch(configError(e.message))
		return { error: e.message }
	}
}

export const deleteSedes = (ids, institucionId) => async dispatch => {
	try {
		const response = await axios.delete(
			`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/Institucion/DeleteSedes/`,
			{ data: ids }
		)
		dispatch(loadDeleteSedes(ids))
		dispatch(getSedes(institucionId))
		return { error: false, response: response.data }
	} catch (e) {
		dispatch(configError(e.message))
		return { error: e.message }
	}
}

export const getRegionales = () => async dispatch => {
	try {
		const response = await axios.get(`${envVariables.BACKEND_URL}/api/Admin/Regional`)
		dispatch(loadAllRegionales(response.data))
		return { error: false }
	} catch (e) {
		dispatch(configError(e.message))
		return { error: e.message }
	}
}

export const getRegionalesPaginated = data => async dispatch => {
	try {
		const { pagina, cantidad, filterType = '', filterText = '' } = data
		const response: any = await axios.get(
			`${envVariables.BACKEND_URL}/api/Admin/Regional/paginated?Pagina=${pagina}&Cantidad=${cantidad}&FiltrarPor=${filterType}&Filtro=${filterText}&OrdenarPor=fechaActualizacion&Direccion=DESC`
		)
		dispatch(loadRegionales(response.data))
		return { error: false, options: response.data?.entityList }
	} catch (error) {
		dispatch(configError(error.message))
		return { error: true }
	}
}

export const getAllRegionales = () => async dispatch => {
	try {
		const response: any = await axios.get(`${envVariables.BACKEND_URL}/api/Admin/Regional`)
		dispatch(loadAllRegionales(response.data))
		return { error: false, options: response.data }
	} catch (error) {
		dispatch(configError(error.message))
		return { error: true }
	}
}

export const getAllCircuitos = () => async dispatch => {
	try {
		const response: any = await axios.get(`${envVariables.BACKEND_URL}/api/Admin/Circuito`)
		dispatch(loadAllCircuitos(response.data))
		return { error: false, options: response.data }
	} catch (error) {
		dispatch(configError(error.message))
		return { error: true }
	}
}

export const getRegionalesPaginatedByFilter = data => async dispatch => {
	try {
		const { pagina, cantidad, type, search } = data
		const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Admin/Regional/paginated/${pagina}/${cantidad}/${search}`
		)
		dispatch(loadRegionales(response.data))
		return { error: false }
	} catch (error) {
		dispatch(configError(error.message))
		return { error: true }
	}
}

export const createRegional = (data: CurrentRegional) => async dispatch => {
	try {
		const response = await axios.post(`${envVariables.BACKEND_URL}/api/Admin/Regional`, data)
		dispatch(loadRegional(response.data))
		return { error: false }
	} catch (e) {
		dispatch(configError(e.message))
		return {
			error: true,
			message: handleError(e),
			errors: [e.response.data?.error]
		}
	}
}

export const getRegionalById = (regionalId: string | number) => async dispatch => {
	try {
		const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Admin/Regional/GetById/${regionalId}`
		)
		dispatch(loadRegional(response.data))
		return { error: false }
	} catch (e) {
		dispatch(configError(e.message))
		return { error: e.message }
	}
}

export const getCircuitoById = (circuitoId: string | number) => async dispatch => {
	try {
		const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Admin/Circuito/GetById/${circuitoId}`
		)
		dispatch(loadCircuito(response.data))
		return { error: false }
	} catch (e) {
		dispatch(configError(e.message))
		return { error: e.message }
	}
}

export const updateRegional = (data: CurrentRegional) => async dispatch => {
	try {
		const response = await axios.put(`${envVariables.BACKEND_URL}/api/Admin/Regional`, data)
		dispatch(loadRegional(response.data))
		return { error: false, data: response.data }
	} catch (e) {
		dispatch(configError(e.response.data?.error))

		return {
			error: true,
			message: handleError(e),
			errors: [e.response.data?.error]
		}
		// return {error: e.message}
	}
}

export const deleteRegional = (regionalId: number) => async dispatch => {
	try {
		await axios.delete(`${envVariables.BACKEND_URL}/api/Admin/Regional/${regionalId}`)
		dispatch(getRegionalesPaginated({ pagina: 1, cantidad: 10 }))
		return { error: false }
	} catch (e) {
		dispatch(configError(e.message))
		return {
			error: true,
			message: e.response.data.error || e.message,
			errors: e.response.data.errors
		}
	}
}

export const createCircuito = (data: CurrentCircuito) => async dispatch => {
	try {
		const response = await axios.post(`${envVariables.BACKEND_URL}/api/Admin/Circuito`, data)
		dispatch(loadCircuito(response.data))
		return { error: false }
	} catch (e) {
		dispatch(configError(e.message))
		return { error: true, message: e?.response?.data?.error || e.message }
	}
}

export const updateCircuito = (data: CurrentCircuito) => async dispatch => {
	try {
		const response = await axios.put(`${envVariables.BACKEND_URL}/api/Admin/Circuito`, data)
		dispatch(loadCircuito(response.data))
		return { error: false, response: response.data }
	} catch (e) {
		dispatch(configError(e.message))
		return {
			error: true,
			message: e.message,
			errors: e.response?.data?.errors
		}
	}
}

export const deleteCircuito = (circuitoId: number) => async dispatch => {
	try {
		await axios.delete(`${envVariables.BACKEND_URL}/api/Admin/Circuito/${circuitoId}`)
		dispatch(getCircuitosPaginated({ pagina: 1, cantidad: 10 }))
		return { error: false }
	} catch (e) {
		dispatch(configError(e.message))
		return { error: e.message }
	}
}

export const saveRegionalDirector = data => async dispatch => {
	try {
		const response = await axios.post(
			`${envVariables.BACKEND_URL}/api/Admin/Regional/Director`,
			data
		)
		dispatch(loadDirector(response.data))
		return { error: false }
	} catch (e) {
		return { error: true }
	}
}

export const getRegionalDirector = (regionalId: number) => async dispatch => {
	try {
		const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Admin/Regional/Director/${regionalId}`
		)
		dispatch(loadDirector(response.data))
		return { error: false, data: response.data }
	} catch (e) {
		return { error: true }
	}
}

export const saveCircuitoDirector = data => async dispatch => {
	try {
		const response = await axios.post(
			`${envVariables.BACKEND_URL}/api/Admin/Circuito/Director`,
			data
		)
		dispatch(loadDirector(response.data))
		return { error: false }
	} catch (e) {
		return { error: true }
	}
}

export const getCircuitoDirector = (circuitoId: number) => async dispatch => {
	try {
		const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Admin/Circuito/Director/${circuitoId}`
		)
		dispatch(loadDirector(response.data))
		return { error: false, data: response.data }
	} catch (e) {
		return { error: true }
	}
}

export const setRegional = data => async dispatch => {
	dispatch(loadRegional(data))
}

export const setCircuito = data => async dispatch => {
	dispatch(loadCircuito(data))
}

export const saveFormularioLocalizacion = async data => {
	try {
		const response = await axios.post(
			`${envVariables.BACKEND_URL}/api/Admin/FormularioLocalizacion`,
			data
		)
		return { error: false, data: response.data }
	} catch (e) {
		return { error: true }
	}
}

export const updateFormularioLocalizacion = async data => {
	try {
		const response = await axios.put(
			`${envVariables.BACKEND_URL}/api/Admin/FormularioLocalizacion`,
			data
		)
		return { error: false, data: response.data }
	} catch (e) {
		return { error: true }
	}
}

export const getFormByResource = (id: number) => async dispatch => {
	try {
		const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Admin/FormularioLocalizacion/GetById/${id}`
		)
		return response.data
	} catch (e) {
		return { error: e.message }
	}
}

export const getFormsByRegional = async (regionalId: number, formId: number) => {
	try {
		const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Admin/FormularioLocalizacion/Regional/${regionalId}?formularioId=${formId}`
		)
		return response.data
	} catch (e) {
		return { error: e.message }
	}
}

export const getFormsByCircuito = async (circuitoId: number, formId: number) => {
	try {
		const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Admin/FormularioLocalizacion/Circuito/${circuitoId}?formularioId=${formId}`
		)
		return response.data
	} catch (e) {
		return { error: e.message }
	}
}

export const DeleteFormResponses = async ids => {
	const response = await axios.delete(
		`${envVariables.BACKEND_URL}/api/Admin/FormularioLocalizacion`,
		{ data: ids }
	)
	return response.data
}

export const cleanInstitutions = () => dispatch => {
	dispatch(instClean())
}
