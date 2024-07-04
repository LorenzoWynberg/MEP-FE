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

import { envVariables } from 'Constants/enviroment'
import axios from 'axios'
import { handleErrors } from '../../utils/handleErrors'

const insittucionUrl = `${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/institucion/`

const cleanInstitucions = () => ({
  type: CLEAR_INSTITUTIONS
})

const loadCentrosByRegional = (payload) => {
  return {
    type: LOAD_CENTROS_BY_REGIONAL,
    payload
  }
}

const loadCentrosByCircuito = (payload) => {
  return {
    type: LOAD_CENTROS_BY_CIRCUITO,
    payload
  }
}

const loadAuxOrganization = (payload) => ({
  type: LOAD_CURRENT_AUX_ORGANIZATION,
  payload
})

const createInstitucion = (payload) => ({
  type: INSTITUCION_ADD,
  payload
})

const loadCreatedMember = (payload) => ({
  type: LOAD_CREATED_MEMBER,
  payload
})

const loadUpdatedMember = (payload) => ({
  type: LOAD_UPDATED_MEMBER,
  payload
})

const loadInstitutionStates = (payload) => ({
  type: LOAD_INSTITUTION_STATES,
  payload
})

const loadAuxOrganizationMembers = (payload) => ({
  type: LOADT_AUX_ORGANIZATION_MEMBERS,
  payload
})

const loadCurrentMemberData = (payload) => ({
  type: LOAD_CURRENT_MEMBER_DATA,
  payload
})

const loadIdentidadMemberData = (payload) => ({
  type: LOAD_IDENTIDAD_MEMBER_DATA,
  payload
})

const editInstitucion = (payload) => ({
  type: INSTITUCION_EDIT,
  payload
})

const deleteInstitucionesFromState = (payload) => ({
  type: INSTITUCIONES_DELETE,
  payload
})

const loadInstituciones = (payload) => ({
  type: INSTITUCIONES_LOAD,
  payload
})
const loadingInstituciones = () => ({
  type: INSTITUCIONES_LOADING
})

const loadInstitucion = (payload) => ({
  type: INSTITUCION_LOAD,
  payload
})
const loadInstitutionWithCircuitoRegional = (payload) => ({
  type: 'INSTITUCION_LOAD_WITH_CIRCUITO_REGIONAL',
  payload
})

const loading = () => ({
  type: INSTITUCION_LOADING
})

const errorDipatch = (payload) => ({
  type: INSTITUCION_ERROR,
  payload
})

const cleanInstitucion = () => ({
  type: INSTITUCION_CLEAN
})

const loadInstitutions = (payload) => ({
  type: LOAD_INSTITUTIONS,
  payload
})

const loadSharedResource = (payload) => ({
  type: SELECT_SHARED_RESOURCE,
  payload
})

const loadSharedResources = (payload) => ({
  type: LOAD_SHARED_RESOURCES,
  payload
})

const deleteSharedResourcesFromState = (ids) => ({
  type: DELETE_SHARED_RESOURCES,
  payload: ids
})

const loadDatosDirector = (payload) => ({
  type: LOAD_DATOS_DIRECTOR,
  payload
})

const loadBudgetaryInfo = (payload) => ({
  type: INSTITUCION_LOAD_INFORMACION_PRESUPUESTARIA,
  payload
})

const loadOffers = (payload) => ({
  type: INSTITUCION_LOAD_OFFERS,
  payload
})
const clearDatosDirectorFromState = () => ({
  type: CLEAR_DATOS_DIRECTOR
})

const loadRegistralInformation = (payload) => ({
  type: LOAD_REGIONAL_LOCATION,
  payload
})

export const GetInstitucion = (id) => async (dispatch) => {
  try {
    const response = await axios.get(`${insittucionUrl}GetByIdJoin/${id}`)
    if (response.data.error) {
      dispatch(errorDipatch(response.data))
    } else {
      dispatch(loadInstitucion(response.data))
    }
  } catch (e) {
    dispatch(errorDipatch(e.message))
  }
}
export const GetInstitucionWithCircuitoRegional = (id) => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/Institucion/GetInstitucionalidadWithCircuitoandRegional/${id}`
    )

    dispatch(loadInstitutionWithCircuitoRegional(response.data))
  } catch (e) {
    dispatch(errorDipatch(e.message))
  }
}
export const GetInstitucionesPaginada =
	(pagina, numeroItems) => async (dispatch) => {
	  try {
	    const response = await axios.get(
				`${insittucionUrl}/paginated/${pagina}/${numeroItems}`
	    )
	    if (response.data.error) {
	      dispatch(errorDipatch(response.data))
	    } else {
	      dispatch(loadInstituciones(response.data))
	    }
	  } catch (e) {
	    dispatch(errorDipatch(e.message))
	  }
	}

export const addInstitucion = (data) => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.post(insittucionUrl, data)

    dispatch(createInstitucion(response.data))
    return { error: false }
  } catch (error) {
    if (error.response.status === 400) {
      dispatch(errorDipatch(handleErrors(error)))
    }
    return { error: error.response.data.error || error.message }
  }
}

export const updateInstitucion = (data) => async (dispatch) => {
  dispatch(loading())
  const _data = { ...data }
  try {
    const response = await axios.put(insittucionUrl, _data)

    dispatch(editInstitucion(response.data))
    return { error: false }
  } catch (error) {
    if (error.response.status === 400) {
      dispatch(errorDipatch(handleErrors(error)))
    }
    return { error: error.message }
  }
}

export const deleteInstituciones = (ids) => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.delete(insittucionUrl, { data: ids })
    if (response.data === ids.length) {
      dispatch(deleteInstitucionesFromState(ids))
    } else {
      throw new Error('Something happend')
    }
    return { error: false }
  } catch (error) {
    dispatch(errorDipatch())
    return { error: error.message }
  }
}

const loadSedes = (payload) => ({
  type: INSTITUTION_LOAD_SEDES,
  payload
})

export const getInstitutionSedes = () => async (dispatch, getState) => {
  const { authUser } = getState()
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/institucion/${authUser.currentInstitution.id}/sedes`
    )
    if (response.data.error) {
      return {
        data: { message: response.data.error.message, error: true }
      }
    } else {
      dispatch(loadSedes(response.data))
      return { data: { error: false } }
    }
  } catch (error) {
    return { data: { message: error.message, error: true } }
  }
}

export const findByCodeOrName = (search) => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/institucion/GetSearchLight/${search}`
    )
    dispatch(loadInstitutions(response.data))
    return { data: { error: false } }
  } catch (e) {
    return { data: { message: e.message, error: true } }
  }
}

export const cleanCurrentInstitucion = () => (dispatch) => {
  dispatch(cleanInstitucion())
}

export const clearInstitutions = () => (dispatch) => {
  dispatch(cleanInstitucions())
}

//* ****** Ubicacion administrativa ********//

export const getRegistralInformation = (institutionId) => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/institucion/GetUbicacionAdministrativa/${institutionId}`
    )
    dispatch(loadRegistralInformation(response.data))
    return { data: { error: false } }
  } catch (e) {
    return { data: { message: e.message, error: true } }
  }
}

//* ****** Comparte ********//

export const selectSharedResource = (item) => (dispatch) => {
  dispatch(loadSharedResource(item))
}

export const getSharedResources = () => async (dispatch, getState) => {
  const { authUser } = getState()
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/Comparte/GetAllByInstitucion/${authUser.currentInstitution.id}`
    )
    dispatch(loadSharedResources(response.data))
    return { error: false }
  } catch (e) {
    return { error: true, message: e.message }
  }
}

export const getSharedResource = (id) => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/Comparte/GetByIdJoin/${id}`
    )
    dispatch(loadSharedResource(response.data))
    return { error: false }
  } catch (e) {
    return { error: true, message: e.message }
  }
}

export const saveSharedResource = (data) => async (dispatch) => {
  try {
    const response = await axios.post(
			`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/Comparte`,
			data
    )
    dispatch(getSharedResources())
    return { error: false }
  } catch (e) {
    return {
      error: true,
      message: e.message,
      errors: e.response.data.errors
    }
  }
}

export const updateSaredResource = (data) => async (dispatch) => {
  try {
    const response = await axios.put(
			`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/Comparte`,
			data
    )
    dispatch(getSharedResources())
    return { error: false }
  } catch (e) {
    return {
      error: true,
      message: e.message,
      errors: e.response.data.errors
    }
  }
}

export const deleteSharedResources = (ids) => async (dispatch) => {
  try {
    const response = await axios.delete(
			`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/Comparte/`,
			{ data: ids }
    )
    dispatch(deleteSharedResourcesFromState(ids))
    return { error: false }
  } catch (e) {
    return { error: true, message: e.message }
  }
}

export const getDatosDirector = (id) => async (dispatch) => {
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

export const clearDatosDirector = () => async (dispatch) => {
  dispatch(clearDatosDirectorFromState())
}

export const getOffers = (id) => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/institucion/Ofertas/${id}`
    )
    dispatch(loadOffers(response.data))
    return { error: false }
  } catch (e) {
    return { error: true, message: e.message }
  }
}

export const getInfoPresupuesto = (id) => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/institucion/GetIdentificacionPresupuestaria/${id}`
    )
    dispatch(loadBudgetaryInfo(response.data))
    return { error: false }
  } catch (e) {
    return { error: true, message: e.message }
  }
}

export const getMemberData = (identification) => async (dispatch) => {
  try {
    let tseRes, _data
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Identidad/GetByIdentification/${identification}`
    )
    if (!response.data) {
      tseRes = await axios.get(
				`${envVariables.BACKEND_URL}/api/TSEIdentidad/GetOneByCedula/${identification}`
      )
      _data = tseRes.data
    } else {
      _data = response.data
    }

    await dispatch(loadIdentidadMemberData(_data))
    return { error: false, data: _data }
  } catch (e) {
    return { error: e.message }
  }
}

export const setMemberData = (data) => async (dispatch) => {
  dispatch(loadIdentidadMemberData(data))
}

export const createAuxOrganization =
	(data, instId = null, isPrivate = false) =>
	  async (dispatch, getState) => {
	    const { authUser } = getState()
	    const { id, esPrivado } = authUser.currentInstitution
	    data = {
	      ...data,
	      esPrivado: isPrivate || esPrivado,
	      institucionId: instId || id
	    }

	    try {
	      const response = await axios.post(
				`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/OrganizacionAuxiliar`,
				data
	      )
	      dispatch(loadAuxOrganization(response.data))
	      return { error: false, response: response.data }
	    } catch (e) {
	      return {
	        error: true,
	        message: e.message,
	        errors: e.response.data.errors
	      }
	    }
	  }

export const updateAuxOrganization =
	(data, isPrivate) => async (dispatch, getState) => {
	  const { authUser } = getState()
	  const { esPrivado } = authUser.currentInstitution

	  data = {
	    ...data,
	    esPrivado: isPrivate || esPrivado
	  }
	  try {
	    const response = await axios.put(
				`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/OrganizacionAuxiliar`,
				data
	    )
	    dispatch(loadAuxOrganization(response.data))
	    return { error: false, response: response.data }
	  } catch (e) {
	    return { error: true, message: e.message }
	  }
	}

export const getAuxOrganizationByInstitution =
	(id, incluyeInactivos = false) =>
	  async (dispatch) => {
	    try {
	      const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/OrganizacionAuxiliar/GetByInstitucionId/${id}/${incluyeInactivos}`
	      )
	      dispatch(loadAuxOrganization(response.data))
	      dispatch(loadAuxOrganizationMembers(response.data.miembros))

	      return { error: false }
	    } catch (e) {
	      return { error: e.message }
	    }
	  }

export const getMembers = (id) => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/OrganizacionAuxiliar/GetMiembrosByOrganizacionId/${id}`
    )
    dispatch(loadAuxOrganizationMembers(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const getMember = (id) => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/OrganizacionAuxiliar/GetMiembroById/${id}`
    )
    dispatch(loadCurrentMemberData(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const setMember = (data) => async (dispatch) => {
  dispatch(loadCurrentMemberData(data))
}

export const createMember = (data) => async (dispatch) => {
  try {
    const response = await axios.post(
			`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/OrganizacionAuxiliar/Miembro`,
			data
    )
    dispatch(loadCreatedMember(response.data))
    return { error: false }
  } catch (e) {
    return {
      error: true,
      errors:
				e?.response?.errors || e?.errors || e?.response?.data?.errors,
      message: e.response?.data ? e.response?.data.error : e.message
    }
  }
}

export const updateMember = (data) => async (dispatch) => {
  try {
    const response = await axios.put(
			`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/OrganizacionAuxiliar/Miembro`,
			data
    )

    dispatch(loadUpdatedMember(response.data))
    return { error: false }
  } catch (e) {
    if (e.response) {
      return {
        error: true,
        message: e.response.data.puestoId || e.message
      }
    }
    return {
      error: true,
      message: e.response?.data ? e.response?.data.error : e.message
    }
  }
}

export const getCentrosByRegional = (regionalId) => async (dispatch) => {
  try {
    const res = await axios.get(
			`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/Institucion/GetByRegional/${regionalId}`
    )
    dispatch(loadCentrosByRegional(res.data))
    return { error: false }
  } catch (error) {
    return { error: e.message }
  }
}

export const getCentrosByCircuito = (circuitoId) => async (dispatch) => {
  try {
    const res = await axios.get(
			`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/Institucion/GetByCircuito/${circuitoId}`
    )
    dispatch(loadCentrosByCircuito(res.data))
    return { error: false }
  } catch (error) {
    return { error: e.message }
  }
}

export const activarInactivarMiembro =
	(ids, estadoMiembroId, esPrivado = false) =>
	  async (dispatch, getState) => {
	    try {
	      const response = await axios.put(
				`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/OrganizacionAuxiliar/CambiarEstadoMiembro`,
				{
				  ids,
				  estadoMiembroId,
				  esPrivado
				}
	      )
	      return { error: false }
	    } catch (e) {
	      return {
	        error: true,
	        errors:
					e?.response?.errors ||
					e?.errors ||
					e?.response?.data?.errors,
	        message: e.response?.data ? e.response?.data.error : e.message
	      }
	    }
	  }

export const getInstitutionStates = () => async (dispatch, getState) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/ExpedienteCentroEducativo/EstadoInstitucion`
    )
    dispatch(loadInstitutionStates(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}
