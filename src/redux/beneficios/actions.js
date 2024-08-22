import {
	BENEFICIOS_MEP_LOAD,
	BENEFICIOS_CLEAN,
	BENEFICIOS_ERROR,
	BENEFICIOS_TIPOS_SUBSIDIOS,
	BENEFICIOS_DEPENDECIAS_SUBSIDIO,
	LOAD_SUBSIDY_EDITED
} from './types'

import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import { handleErrors } from '../../utils/handleErrors'

const loadMEP = payload => ({
	type: BENEFICIOS_MEP_LOAD,
	payload
})

const loadTypes = payload => ({
	type: BENEFICIOS_TIPOS_SUBSIDIOS,
	payload
})
const loadDependencias = payload => ({
	type: BENEFICIOS_DEPENDECIAS_SUBSIDIO,
	payload
})

const clean = payload => ({
	type: BENEFICIOS_CLEAN
})

const error = payload => ({
	type: BENEFICIOS_ERROR,
	payload
})
const loadEditedSubsidio = payload => ({
	type: LOAD_SUBSIDY_EDITED,
	payload
})
export const editSubsidio = (id, estado) => async dispatch => {
	try {
		const response = await axios.put(
			`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Subsidio/ActivareInactivar/${id}/${estado}`
		)
		if (response.data.error) {
			dispatch(error(response.data))
		} else {
			dispatch(loadEditedSubsidio(response.data))
		}
	} catch (e) {
		dispatch(error(e.message))
	}
}
export const GetTypes = () => async dispatch => {
	try {
		const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Subsidio/TiposDeSubsidio`
		)
		if (response.data.error) {
			dispatch(error(response.data))
		} else {
			dispatch(loadTypes(response.data))
		}
	} catch (e) {
		dispatch(error(e.message))
	}
}

export const GetDependencias = () => async dispatch => {
	try {
		const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Subsidio/DependenciasSubsidio`
		)
		if (response.data.error) {
			dispatch(error(response.data))
			return { error: true }
		} else {
			dispatch(loadDependencias(response.data))
			return { error: false, response: response.data }
		}
	} catch (e) {
		dispatch(error(e.message))
	}
}

export const GetSubsidiosMEP = (identidad, pagina, cantidad) => async dispatch => {
	try {
		const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Subsidio/paginated/${identidad}/${pagina}/${cantidad}`
		)
		if (response.data.error) {
			dispatch(error(response.data))
		} else {
			//TODO ELIMINAR JPBR
			debugger
			dispatch(loadMEP(response.data))
		}
	} catch (e) {
		dispatch(error(e.message))
	}
}

export const editSubsidioBody = data => async dispatch => {
	try {
		const response = await axios.put(`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Subsidio`, data)
		if (response.data.error) {
			dispatch(error(response.data))
			return { error: true, response: response.data }
		} else {
			dispatch(GetSubsidiosMEP(data.identidadesId, 1, 10))

			return { error: false }
		}
	} catch (e) {
		dispatch(error(handleErrors(e)))
		return { error: true }
	}
}

export const addSubsidio = data => async dispatch => {
	try {
		const response = await axios.post(`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Subsidio`, data)
		if (response.data.error) {
			dispatch(error(response.data))
			return { error: true }
		} else {
			dispatch(GetSubsidiosMEP(data.identidadesId, 1, 10))
			return { error: false }
		}
	} catch (e) {
		dispatch(error(handleErrors(e)))
		return { error: true }
	}
}

export const deleteSubsidio = (ids, identidadesId) => async dispatch => {
	try {
		const response = await axios.delete(`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Subsidio/`, {
			data: ids
		})
		if (response.data.error) {
			dispatch(error(response.data))
		} else {
			dispatch(GetSubsidiosMEP(identidadesId, 1, 10))
		}
	} catch (e) {
		dispatch(error(handleErrors(e)))
	}
}

export const GetSubsidiosFilterMEP = (identidad, filterText, pagina, cantidad) => async dispatch => {
	try {
		const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Subsidio/paginated/${identidad}/${pagina}/${cantidad}/${filterText}`
		)
		if (response.data.error) {
			dispatch(error(response.data))
		} else {
			dispatch(loadMEP(response.data))
		}
	} catch (e) {
		dispatch(error(e.message))
	}
}

export const cleanIdentity = () => dispatch => {
	dispatch(clean())
}
