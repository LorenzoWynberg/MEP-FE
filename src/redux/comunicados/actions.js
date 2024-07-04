import {
  COMUNICADOS_LOAD,
  COMUNICADOS_BANDEJACORREO_LOAD,
  COMUNICADOS_ERROR,
  COMUNICADOS_PLANTILLAS_lOAD,
  COMUNICADOS_ESTADOS_LOAD,
  COMUNICADOS_ETIQUETAS_LOAD,
  COMUNICADOS_LOADING,
  FORM_CREATE_COMUNICADO,
  COMUNICADOS_LOAD_ENTITY_LIST,
  COMUNICADOS_LOAD_SENT,
  COMUNICADOS_REMOVE_ENTITY_LIST,
  COMUNICADOS_LOAD_DIFFUSSION_ROLES,
  COMUNICADOS_LOAD_RECEIVERS,
  COMUNICADOS_FAVORITOS,
  COMUNICADOS_ETIQUETASPERSONALIZADAS_LOAD,
  COMUNICADOS_DATAETIQUETASPERSONALIZADAS_LOAD,
  COMUNICADOS_NUEVOS_TOTAL,
  COMUNICADOS_BANDEJACORREO_REALTIME_LOAD
} from './types'
import { envVariables } from 'Constants/enviroment'
import axios from 'axios'

const loadEtiquetasPersonalizadas = (payload) => ({
  type: COMUNICADOS_ETIQUETASPERSONALIZADAS_LOAD,
  payload
})

const loadNuevosTotal = (payload) => ({
  type: COMUNICADOS_NUEVOS_TOTAL,
  payload
})

const loadDataEtiquetasPersonalizadas = (payload) => ({
  type: COMUNICADOS_DATAETIQUETASPERSONALIZADAS_LOAD,
  payload
})

const loadReceivers = (payload) => ({
  type: COMUNICADOS_LOAD_RECEIVERS,
  payload
})
const loadFavoritos = (payload) => ({
  type: COMUNICADOS_FAVORITOS,
  payload
})

const loadSent = (payload) => ({
  type: COMUNICADOS_LOAD_SENT,
  payload
})

const loadEstados = (response) => ({
  type: COMUNICADOS_ESTADOS_LOAD,
  payload: response
})
const loadEtiquetas = (response) => ({
  type: COMUNICADOS_ETIQUETAS_LOAD,
  payload: response
})

const loadComunicado = (response) => {
  return {
    type: COMUNICADOS_BANDEJACORREO_LOAD,
    payload: response
  }
}

const loadComunicados = (response) => ({
  type: COMUNICADOS_LOAD,
  payload: response
})

const loadPlantillaComunicados = (response) => ({
  type: COMUNICADOS_PLANTILLAS_lOAD,
  payload: response
})

const error = (payload) => ({
  type: COMUNICADOS_ERROR,
  payload
})

const loadingComunicados = () => ({
  type: COMUNICADOS_LOADING
})

const createComunicado = (payload) => ({
  type: FORM_CREATE_COMUNICADO,
  payload
})

const loadEntityList = (payload) => ({
  type: COMUNICADOS_LOAD_ENTITY_LIST,
  payload
})

const removeComunicado = (payload) => ({
  type: COMUNICADOS_REMOVE_ENTITY_LIST,
  payload
})

const loadDiffusionRoles = (payload) => ({
  type: COMUNICADOS_LOAD_DIFFUSSION_ROLES,
  payload
})

const loadRealtimeBandejaCorreo = (response) => {
  return {
    type: COMUNICADOS_BANDEJACORREO_REALTIME_LOAD,
    payload: response
  }
}

export const AgregarFavoritos =
	(ComunicadoId, estadoId) => async (dispatch) => {
	  try {
	    const response = await axios.post(
				`${envVariables.BACKEND_URL}/api/Comunicado/${ComunicadoId}/Estado/${estadoId}`
	    )
	    if (response.data.error) {
	      return { error: true, mensaje: response.data, data: {} }
	    } else {
	      dispatch(
	        loadFavoritos({
	          tipo: 'favoritos',
	          id: ComunicadoId,
	          state: estadoId
	          // isCero: pagina < 1,
	        })
	      )
	      return { error: false, mensaje: '', data: response.data }
	    }
	  } catch (e) {
	    dispatch(error(e.message))
	    return { error: true, mensaje: e.message, data: 0 }
	  }
	}

export const changeEntityList = (type, data) => (dispatch) => {
  dispatch(loadEntityList({ type, data }))
}

export const GetBandejaCorreoPaginadosFavoritos =
	(
	  estadoCodigos,
	  etiquetaCodigo,
	  pagina,
	  cantidadPagina,
	  tipo,
	  textoFiltro
	) =>
	  async (dispatch) => {
	    try {
	      const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/BandejaCorreo/Paginado/${estadoCodigos}/${etiquetaCodigo}/${pagina}/${cantidadPagina}/${textoFiltro}/Favoritos`
	      )
	      if (response.data.error) {
	        dispatch(error(response.data))
	        return { error: true, mensaje: response.data, data: {} }
	      } else {
	        dispatch(
	          loadComunicado({
	            data: response.data,
	            tipo: 'favoritos',
	            isCero: pagina < 1
	          })
	        )
	        return { error: false, mensaje: '', data: response.data }
	      }
	    } catch (e) {
	      dispatch(error(e.message))
	      return { error: true, mensaje: e.message, data: {} }
	    }
	  }
export const GetBandejaCorreoPaginados =
	(
	  estadoCodigos,
	  etiquetaCodigo,
	  pagina,
	  cantidadPagina,
	  tipo,
	  textoFiltro,
	  etiquetaPersonalizadaId = 0
	) =>
	  async (dispatch) => {
	    try {
	      const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/BandejaCorreo/Paginado/${textoFiltro}/${estadoCodigos}/${etiquetaCodigo}/${pagina}/${cantidadPagina}/${etiquetaPersonalizadaId}`
	      )
	      if (response.data.error) {
	        dispatch(error(response.data))
	        return { error: true, mensaje: response.data, data: {} }
	      } else {
	        dispatch(
	          loadComunicado({
	            data: response.data,
	            tipo,
	            isCero: pagina < 1,
	            codigoEtiqueta: etiquetaCodigo
	          })
	        )
	        return { error: false, mensaje: '', data: response.data }
	      }
	    } catch (e) {}
	  }

export const GetDataEtiquetasPersonalizadas =
	(
	  estadoCodigos,
	  etiquetaCodigo,
	  pagina,
	  cantidadPagina,
	  tipo,
	  textoFiltro,
	  etiquetaPersonalizadaId = 0
	) =>
	  async (dispatch) => {
	    if (textoFiltro === '') {
	      textoFiltro = '-'
	    }

	    try {
	      const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/BandejaCorreo/Paginado/${textoFiltro}/${estadoCodigos}/${etiquetaCodigo}/${pagina}/${cantidadPagina}/${etiquetaPersonalizadaId}`
	      )
	      if (response.data.error) {
	        dispatch(error(response.data))
	        return { error: true, mensaje: response.data, data: {} }
	      } else {
	        dispatch(
	          loadDataEtiquetasPersonalizadas({
	            data: response.data,
	            tipo,
	            isCero: pagina < 1
	          })
	        )
	        return { error: false, mensaje: '', data: response.data }
	      }
	    } catch (e) {
	      return { error: false, mensaje: e.message }
	    }
	  }

export const GetComunicadosPaginados =
	(estadoCodigos, pagina, cantidadPagina) => async (dispatch) => {
	  try {
	    const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/Comunicado/Paginado/${estadoCodigos}/${pagina}/${cantidadPagina}`
	    )
	    if (response.data.error) {
	      dispatch(error(response.data))
	      return { error: true, mensaje: response.data, data: {} }
	    } else {
	      dispatch(loadComunicados(response.data))
	      return { error: false, mensaje: '', data: response.data }
	    }
	  } catch (e) {
	    dispatch(error(e.message))
	    return { error: true, mensaje: e.message, data: {} }
	  }
	}

export const GetTotalPorEstado =
	(estadoCodigos, bandeja) => async (dispatch) => {
	  try {
	    const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/BandejaCorreo/Contar/${estadoCodigos}`
	    )

	    if (response.data.error) {
	      dispatch(error(response.data))
	      return { error: true, mensaje: 'Error', data: 0 }
	    } else {
	      if (bandeja === 'recibidos') {
	        dispatch(loadNuevosTotal(response.data))
	      }
	      return { error: false, mensaje: '', data: response.data }
	    }
	  } catch (e) {
	    dispatch(error(e.message))
	    return { error: true, mensaje: e.message, data: 0 }
	  }
	}

export const CambiarEstadoComunicado =
	(id, newEstadoId, type) => async (dispatch) => {
	  try {
	    const response = await axios.post(
				`${envVariables.BACKEND_URL}/api/BandejaCorreo/${id}/Estado/${newEstadoId}`
	    )

	    return { error: false }
	  } catch (e) {
	    return { error: true, mensaje: e.message }
	  }
	}

export const getUserRolesTypes = () => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Destinatarios/Rol`
    )
    dispatch(loadDiffusionRoles(response.data))
    return { error: false }
  } catch (e) {
    return { error: true, mensaje: e.message }
  }
}

export const getTemplatesComunicados = () => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/ComunicadoPlantilla`
    )
    dispatch(loadPlantillaComunicados(response.data))
    return { error: false, mensaje: '', data: response.data }
  } catch (e) {
    dispatch(error(e.message))
    return { error: true, mensaje: e.message, data: {} }
  }
}

export const GetEtiquetasPersonalizadas = () => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/ComunicadoEtiqueta`
    )
    dispatch(loadEtiquetasPersonalizadas(response.data))
    return { error: false, mensaje: '', data: response.data }
  } catch (e) {
    dispatch(error(e.message))
    return { error: true, mensaje: e.message, data: {} }
  }
}

export const getEstadosComunicados = (id) => async (dispatch) => {
  try {
    const response = await axios.post(
			`${envVariables.BACKEND_URL}/api/Catalogo/List`,
			[id]
    )
    dispatch(loadEstados(response.data))
    return { error: false, mensaje: '', data: response.data }
  } catch (e) {
    dispatch(error(e.message))
    return { error: true, mensaje: e.message, data: {} }
  }
}

export const SaveEtiquetaPersonalizada = (nombre) => async (dispatch) => {
  try {
    const response = await axios.post(
			`${envVariables.BACKEND_URL}/api/ComunicadoEtiqueta`,
			{ nombre }
    )
    return { error: false, mensaje: '', data: response.data }
  } catch (e) {
    dispatch(error(e.message))
    return { error: true, mensaje: e.message, data: {} }
  }
}

export const DestacarMultiples = (data) => async (dispatch) => {
  try {
    const response = await axios.post(
			`${envVariables.BACKEND_URL}/api/BandejaCorreo/DestacarMultiples`,
			data
    )
    return { error: false, mensaje: '', data: response.data }
  } catch (e) {
    dispatch(error(e.message))
    return { error: true, mensaje: e.message, data: {} }
  }
}

export const UpdateEtiquetasMultiple = (data) => async (dispatch) => {
  try {
    const response = await axios.post(
			`${envVariables.BACKEND_URL}/api/BandejaCorreo/UpdateEtiquetasMultiple`,
			data
    )
    return { error: false, mensaje: '', data: response.data }
  } catch (e) {
    dispatch(error(e.message))
    return { error: true, mensaje: e.message, data: {} }
  }
}

export const UpdateEstadoMultiples = (data) => async (dispatch) => {
  try {
    const response = await axios.post(
			`${envVariables.BACKEND_URL}/api/BandejaCorreo/UpdateEstadoMultiples`,
			data
    )
    return { error: false, mensaje: '', data: response.data }
  } catch (e) {
    dispatch(error(e.message))
    return { error: true, mensaje: e.message, data: {} }
  }
}

export const eliminarMultiples = (ids) => async (dispatch) => {
  try {
    const response = await axios.post(
			`${envVariables.BACKEND_URL}/api/BandejaCorreo/deleteMultiple`,
			ids
    )
    return { error: false, mensaje: '', data: response.data }
  } catch (e) {
    dispatch(error(e.message))
    return { error: true, mensaje: e.message, data: {} }
  }
}

export const getEtiquetasComunicados = (id) => async (dispatch) => {
  try {
    const response = await axios.post(
			`${envVariables.BACKEND_URL}/api/Catalogo/List`,
			[id]
    )
    dispatch(loadEtiquetas(response.data))
    return { error: false, mensaje: '', data: response.data }
  } catch (e) {
    dispatch(error(e.message))
    return { error: true, mensaje: e.message, data: {} }
  }
}

export const createComunicados = (data) => async (dispatch) => {
  try {
    dispatch(loadingComunicados())
    const response = await axios.post(
			`${envVariables.BACKEND_URL}/api/Comunicado`,
			data
    )
    dispatch(createComunicado(response.data))
    return { error: false }
  } catch (err) {
    dispatch(error(err.message))
    return { error: err.message }
  }
}

export const GetSent = (page, textoFiltro) => async (dispatch) => {
  try {
    // dispatch(loadingComunicados())
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Comunicado/Sent/${page}/${textoFiltro}`
    )
    dispatch(loadSent({ data: response.data, isCero: page === 0 }))
    return { error: false, data: response.data }
  } catch (err) {
    dispatch(error(err.message))
    return { error: err.message }
  }
}

export const programarComunicado = (data) => async (dispatch) => {
  try {
    dispatch(loadingComunicados())
    const response = await axios.post(
			`${envVariables.BACKEND_URL}/api/Comunicado/Programar`,
			data
    )
    dispatch(createComunicado(response.data))
    return { error: false }
  } catch (err) {
    dispatch(error(err.message))
    return { error: err.message }
  }
}

export const eliminarComunicado = (id) => async (dispatch) => {
  dispatch(loadingComunicados())
  try {
    const response = await axios.delete(
			`${envVariables.BACKEND_URL}/api/BandejaCorreo/${id}`
    )
    return { error: false }
  } catch (e) {
    dispatch(error(e.message))
    return { error: e.message }
  }
}

export const DeleteEtiquetaPersonalizada = (id) => async (dispatch) => {
  try {
    const response = await axios.delete(
			`${envVariables.BACKEND_URL}/api/ComunicadoEtiqueta/${id}`
    )
    return { error: false, data: response.data }
  } catch (e) {
    return { error: true }
  }
}

export const borradorComunicado = (data) => async (dispatch) => {
  try {
    dispatch(loadingComunicados())
    const response = await axios.post(
			`${envVariables.BACKEND_URL}/api/Comunicado/Borrador`,
			data
    )
    dispatch(createComunicado(response.data))
    return { error: false, data: response.data }
  } catch (err) {
    dispatch(error(err.message))
    return { error: err.message }
  }
}

export const updateBorradorComunicado = (id, data) => async (dispatch) => {
  try {
    dispatch(loadingComunicados())
    const response = await axios.put(
			`${envVariables.BACKEND_URL}/api/Comunicado/${id}/Borrador`,
			data
    )
    dispatch(createComunicado(response.data))
    return { error: false, data: response.data }
  } catch (err) {
    dispatch(error(err.message))
    return { error: err.message }
  }
}

export const getDestinatariosFilter =
	(filter, tipoBusqueda) => async (dispatch) => {
	  try {
	    const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/Destinatarios?TipodifusionId=${tipoBusqueda}&TipoBusqueda=all&Filtro=${filter}`
	    )
	    let _data = []
	    if (response.data.destinatarios) {
	      _data = [..._data, ...response.data.destinatarios]
	    }
	    if (response.destinatariosCircuitos) {
	      _data = [..._data, ...response.destinatariosCircuitos]
	    }
	    if (response.destinatariosInstituciones) {
	      _data = [..._data, ...response.destinatariosInstituciones]
	    }
	    if (response.data.destinatariosRegionales) {
	      _data = [..._data, ...response.destinatariosRegionales]
	    }
	    dispatch(loadReceivers([..._data]))
	    return { error: false, data: response.data }
	  } catch (err) {
	    dispatch(error(err.message))
	    dispatch(loadReceivers([]))
	    return { error: err.message }
	  }
	}

export const getRealtimeComunicados = (message) => async (dispatch) => {
  dispatch(loadRealtimeBandejaCorreo(message))
}
