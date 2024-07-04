import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import { DefinedNumberSchema } from 'yup/lib/number'
import {
  GROUPS_REFRESH,
  GROUPS_LOAD_MEMBERS_BY_LEVEL,
  GROUPS_LOAD,
  GROUPS_LOADING,
  GROUPS_LOAD_BY_INSTITUTION,
  GROUPS_LOAD_CENTER_OFFERS,
  PaginatedGroupMemberRequest,
  GROUPS_LOAD_MEMBERS,
  GROUPS_LOAD_ALL_MEMBERS,
  GROUPS_LOAD_MEMBERS_WITHOUT_GROUP,
  GROUPS_CONDITIONS_LOAD,
  GROUPS_ACTIVE_CALENDAR_LOAD,
  GROUPS_CURRENT_CONDITIONS,
  GROUPS_BY_OFFER_LOAD,
  GROUPS_LOAD_INCIDENTS,
  GROUPS_LOAD_INCIDENTS_TYPES,
  GROUPS_LOAD_MEMBERS_BY_SUBJECT_GROUP,
  GROUPS_LOAD_BLOQUES,
  GROUPS_LOAD_MEMBERS_BY_OFFER,
  GROUPS_LOAD_MEMBERS_BY_GROUP,
  GROUPS_LOAD_FILTERED_STUDENTS,
  GET_CENTER_OFFERS,
  GROUPS_LOAD_CENTER_OFFERS_SPECIALTY_BY_INSTITUTION,
  GROUPS_ERROR,
  GET_CENTER_OFFERS_FOR_TRASLADOS
} from './types'

const loadGroups = (payload) => ({
  type: GROUPS_LOAD,
  payload
})

const loadGroupByOffer = (payload) => ({
  type: GROUPS_BY_OFFER_LOAD,
  payload
})

const loadGroupByLevel = (payload) => ({
  type: GROUPS_BY_OFFER_LOAD,
  payload
})

const error = (payload) => ({
  type: GROUPS_ERROR,
  payload
})

const loading = () => ({
  type: GROUPS_LOADING
})

const loadGroupConditions = (payload) => ({
  type: GROUPS_CURRENT_CONDITIONS,
  payload
})

const loadCenterOffers = (payload) => ({
  type: GROUPS_LOAD_CENTER_OFFERS,
  payload
})

const getCenterOffers = (payload) => ({
  type: GET_CENTER_OFFERS,
  payload
})
const getCenterOffersForTraslados = (payload) => ({
  type: GET_CENTER_OFFERS_FOR_TRASLADOS,
  payload
})
const loadCenterOffersSpecialty = (payload) => ({
  type: 'GROUPS_LOAD_CENTER_OFFERS_SPECIALTY',
  payload
})
const getCenterOffersSpecialty = (payload) => ({
  type: GROUPS_LOAD_CENTER_OFFERS_SPECIALTY_BY_INSTITUTION,
  payload
})
const cleanCenterOffersSpecialty = () => ({
  type: 'GROUPS_CLEAN_CENTER_OFFERS_SPECIALTY'
})
const cleanCenterOffers = () => ({
  type: 'GROUPS_CLEAN_CENTER_OFFERS'
})

const loadGroupMembers = (payload) => ({
  type: GROUPS_LOAD_MEMBERS,
  payload
})

const loadAllGroupMembers = (payload) => ({
  type: GROUPS_LOAD_ALL_MEMBERS,
  payload
})
const loadAllMembersByGroup = (payload) => ({
  type: GROUPS_LOAD_MEMBERS_BY_GROUP,
  payload
})

const loadIncidentsTypes = (payload) => ({
  type: GROUPS_LOAD_INCIDENTS_TYPES,
  payload
})

const loadLevelMembersWithoutGroup = (payload) => ({
  type: GROUPS_LOAD_MEMBERS_WITHOUT_GROUP,
  payload
})

const loadLevelMembers = (payload) => ({
  type: GROUPS_LOAD_MEMBERS_BY_LEVEL,
  payload
})

const refreshGroups = () => ({
  type: GROUPS_REFRESH
})

const loadCondiciones = (payload) => ({
  type: GROUPS_CONDITIONS_LOAD,
  payload
})

const loadCurrentCalendar = (payload) => ({
  type: GROUPS_ACTIVE_CALENDAR_LOAD,
  payload
})

const loadGroupIncidencias = (payload) => ({
  type: GROUPS_LOAD_INCIDENTS,
  payload
})

const loadMembersBySubjectGroup = (payload) => ({
  type: GROUPS_LOAD_MEMBERS_BY_SUBJECT_GROUP,
  payload
})

const loadBloques = (payload) => ({
  type: GROUPS_LOAD_BLOQUES,
  payload
})

const loadGroupsByInstitution = (payload) => ({
  type: GROUPS_LOAD_BY_INSTITUTION,
  payload
})

const loadStudentByOffer = (payload) => ({
  type: GROUPS_LOAD_MEMBERS_BY_OFFER,
  payload
})

const loadFilteredStudents = (payload) => ({
  type: GROUPS_LOAD_FILTERED_STUDENTS,
  payload
})
const loadGroupReports = (payload) => ({
  type: 'GROUPS_LOAD_SELECT_REPORTS',
  payload
})

const loadNivelesGruposyProyecciones = (payload) => ({
  type: 'GROUPS_LOAD_NIVELES_GRUPOS_PROYECCIONES',
  payload
})

export const getGroupsByLevel =
	(lvlId: number, instId: number) => async (dispatch, getState) => {
	  dispatch(loading())
	  
	  const anioId = getState().authUser.selectedActiveYear.id
	  try {
		
	    const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/GestionGrupo/GruposPorNivel?InstitucionId=${instId}&NivelId=${lvlId}&anio=${anioId}`
	    )
	    dispatch(loadNivelesGruposyProyecciones(response.data))
	    return { error: false }
	  } catch (e) {
	    return { error: e.message }
	  }
	}
export const getNivelesGruposByModeloOferta =
	(nivelOfertaId: number) => async (dispatch, getState) => {
	  const institutionId = getState().authUser.currentInstitution.id
	  const anioId = getState().authUser.selectedActiveYear.id

	  dispatch(loading())
	  try {
	    const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/GestionGrupo/GruposByInstitucionNivelAnio/${institutionId}/${nivelOfertaId}/${anioId}`
	    )
	    dispatch(loadGroups(response.data.data))
	    return { error: false, data: response.data.data }
	  } catch (e) {
	    return { error: e.message }
	  }
	}

export const getGroupsByLevelOfertaId =
	(lvlId: number, instId: number) => async (dispatch) => {
	  dispatch(loading())
	  try {
	    const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/GestionGrupo/GruposPorNivelOferta?InstitucionId=${instId}&NivelOfertaId=${lvlId}`
	    )
	    dispatch(loadGroups(response.data))
	    return { error: false }
	  } catch (e) {
	    return { error: e.message }
	  }
	}

export const getGroupsByOffers = (institutionId, offersId: number) => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/GestionGrupo/GrupobyOfertas/${offersId}/${institutionId}`
    )
		// const response = await axios.get(
		// 	`${envVariables.BACKEND_URL}/api/GestionGrupo/GrupobyOfertas/${offersId}`
    // )
    dispatch(loadGroupByOffer(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const getGroupsByLevelAnio =
	(lvlId: number, instId: number, anioId: number, especialidadId: number) =>
	  async (dispatch) => {
	    if (especialidadId == undefined) {
	      especialidadId = 0
	    }
	  //  console.log(lvlId, instId, anioId, especialidadId)
	    dispatch(loading())
	    try {
	      const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/GestionGrupo/GruposPorNivelAnio?InstitucionId=${instId}&NivelId=${lvlId}&AnioId=${anioId}&EspecialidadId=${especialidadId}`
	      )
	      dispatch(loadGroups(response.data))
	      return { error: false }
	    } catch (e) {
	      dispatch(error(e?.response?.message || e.message))
	      return { error: e.message }
	    }
	  }

export const createGroup = (data, instId, levelId) => async (dispatch) => {
  dispatch(loading())
  try {
    const response = await axios.post(
			`${envVariables.BACKEND_URL}/api/Grupo/${instId}`,
			data
    )
    return dispatch(getGroupsByLevel(levelId, instId))
  } catch (e) {
    return { error: e.message }
  }
}

export const editGroup =
	(data, instId, levelId, anioId) => async (dispatch) => {
	  dispatch(loading())
	  try {
	    const response = await axios.put(
				`${envVariables.BACKEND_URL}/api/Grupo/${instId}`,
				data
	    )
	    return dispatch(getGroupsByLevel(levelId, instId, anioId))
	  } catch (e) {
	    return { error: e.message }
	  }
	}

export const deleteGroup =
	(id, instId, levelId, anioId) => async (dispatch) => {
	  dispatch(loading())
	  try {
	    const response = await axios.delete(
				`${envVariables.BACKEND_URL}/api/Grupo/${id}`
	    )
	    // dispatch(getGroupsByLevel(levelId, instId, anioId))
	    dispatch(getGroupsByLevel(levelId, instId))
	    return response.data
	  } catch (e) {
	    return { error: e.message }
	  }
	}

/** GESTION DE GRUPOS  **/

export const getGroupsByIntitutionWithLevels =
	(instId: number) => async (dispatch) => {
	  try {
	    const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/GestionGrupo/GrupoOfertas?InstitucionId=${instId}`
	    )
	    dispatch(loadCenterOffers(response.data))
	  } catch (e) {}
	}

export const getGroupsByIntitution = (instId: number) => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/GestionGrupo/GrupoOfertasAgrupado?InstitucionId=${instId}`
    )
    dispatch(getCenterOffers(response.data))
  } catch (e) {}
}

export const getGroupsByIntitutionForTraslados =
	(instId: number) => async (dispatch) => {
	  try {
	    const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/GestionGrupo/GrupoOfertasAgrupado?InstitucionId=${instId}`
	    )
	    dispatch(getCenterOffersForTraslados(response.data))
	  } catch (e) {}
	}

export const clearGroupsByInstitutionWithLevels = () => async (dispatch) => {
  dispatch({
    type: CLEAR_CENTER_OFFERS
  })
}

export const getOfferForSpecialtyWithLevelsByInstitution =
	(instId: number, modeloOfertaId: number, nivelId: number) =>
	  async (dispatch) => {
	    try {
	      const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/GestionGrupo/GetGrupoOfertasEspecialidadesByModelosOfertaAndInstitucion/${instId}/${modeloOfertaId}/${nivelId}`
	      )
	      dispatch(loadCenterOffersSpecialty(response.data))
	    } catch (e) {}
	  }

export const getOfferForSpecialtyByInstitution =
	(instId: number, modeloOfertaId: number, nivelId: number) =>
	  async (dispatch) => {
	    try {
	      const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/GestionGrupo/GetGrupoOfertasEspecialidadesByModelosOfertaInstAgrupado/${instId}/${modeloOfertaId}/${nivelId}`
	      )
	      dispatch(getCenterOffersSpecialty(response.data))
	    } catch (e) {
	      return {
	        error: true
	      }
	    }
	  }

export const cleanCenterOfferSpecialty = () => async (dispatch) => {
  try {
    dispatch(cleanCenterOffersSpecialty())
  } catch (e) {}
}
export const cleanCenterOffer = () => async (dispatch) => {
  try {
    dispatch(cleanCenterOffers())
  } catch (e) {}
}

export const getGroupMembers =
	(paginatedRequest: PaginatedGroupMemberRequest) => async (dispatch) => {
	  const {
	    Pagina,
	    CantidadPagina,
	    TipoColumna,
	    Busqueda,
	    InstitucionId,
	    GrupoId
	  } = paginatedRequest

	  try {
	    const response = await axios.get(
				`${
					envVariables.BACKEND_URL
				}/api/GestionGrupo/EstudiantesMatriculados?Pagina=${Pagina}&CantidadPagina=${CantidadPagina}${
					TipoColumna ? `&TipoColumna=${TipoColumna}` : ''
				}${
					Busqueda ? `&Busqueda=${Busqueda}` : ''
				}&InstitucionId=${InstitucionId}&GrupoId=${GrupoId}`
	    )
	    dispatch(loadGroupMembers(response.data))
	  } catch (e) {}
	}

export const getLevelMembers =
	(paginatedRequest: PaginatedGroupMemberWithoutGroupRequest, conGrupo) =>
	  async (dispatch) => {
	    const {
	      Pagina,
	      CantidadPagina,
	      TipoColumna,
	      Busqueda,
	      InstitucionId,
	      NivelId,
	      GrupoId
	    } = paginatedRequest
	    try {
	      const response = await axios.get(
				`${
					envVariables.BACKEND_URL
				}/api/GestionGrupo/EstudiantesFullGrupo?InstitucionId=${InstitucionId}&NivelId=${NivelId}${
					conGrupo !== undefined ? `&ConGrupo=${conGrupo}` : ''
				}${
					Busqueda ? `&FiltroGlobal=${Busqueda}` : ''
				}&Pagina=${Pagina}&Cantidad=${CantidadPagina}${
					GrupoId ? `&GrupoId=${GrupoId}` : ''
				}&OrdenarPor=Identificacion&Direccion=DESC`
	      )
	      if (conGrupo === undefined) {
	        dispatch(loadLevelMembers(response.data))
	      } else if (conGrupo === true) {
	        dispatch(loadGroupMembers(response.data))
	      } else if (conGrupo === false) {
	        dispatch(loadLevelMembersWithoutGroup(response.data))
	      }
	      return { error: false }
	    } catch (e) {}
	  }

export const getCondiciones = () => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/CondicionEstudianteCurso`
    )
    dispatch(loadCondiciones(response.data))
    return { error: false, data: response.data }
  } catch (e) {}
}

export const trasladarMiembros = (ids, grupoId) => async (dispatch) => {
  try {
    const response = await axios.post(
			`${envVariables.BACKEND_URL}/api/GestionGrupo/Estudiante/Trasladar`,
			{
			  matriculasIds: ids,
			  grupoId
			}
    )
    dispatch(refreshGroups())
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const crearCuentasCorreo = (ids) => async (dispatch) => {
  try {
    const response = await axios.post(
			`${envVariables.BACKEND_URL}/api/cuenta/graphApi/multiple`,
			ids
    )

    return { error: false, data: response }
  } catch (e) {
    return { error: true, message: e.message }
  }
}

export const assignGroup = (ids, grupoId) => async (dispatch) => {
  try {
    const response = await axios.post(
			`${envVariables.BACKEND_URL}/api/GestionGrupo/Estudiante/Trasladar`,
			{
			  matriculasIds: ids,
			  grupoId
			}
    )
    dispatch(refreshGroups())
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const registrarCondicion =
	(matriculaId, condicionEstudianteId, condicionEstudianteFinalId) =>
	  async (dispatch) => {
	    try {
	      const response = await axios.post(
				`${envVariables.BACKEND_URL}/api/GestionGrupo/Estudiante/RegistrarCondicion`,
				{
				  matriculaId,
				  condicionEstudianteId,
				  condicionEstudianteFinalId
				}
	      )
	      return { error: false }
	    } catch (e) {
	      return {
	        error: true,
	        message: e.message,
	        errors: e.response.data.errors
	      }
	    }
	  }

export const getCurrentCalendar = () => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Calendario/UltimoActivo`
    )
    dispatch(loadCurrentCalendar(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const getCurrentGroupConditions = (id) => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Grupo/${id}/Condiciones`
    )
    dispatch(loadGroupConditions(response.data))
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const getAllStudentsByGroup =
	(groupId: number, nivelId: number, institucionId: number) =>
	  async (dispatch) => {
	    try {
	      const response = await axios.get(
				`${
					envVariables.BACKEND_URL
				}/api/GestionGrupo/EstudiantesFullGrupo/${institucionId}/${nivelId}/${
					groupId || ''
				}`
	      )
	      dispatch(loadAllMembersByGroup(response.data))
	      return response.data
	    } catch (e) {}
	  }

export const getAllStudentsWithoutGroup =
	(nivelId: number, institucionId: number) => async (dispatch) => {
	  try {
	    const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/GestionGrupo/EstudiantesFullGrupo/${institucionId}/${nivelId}/`
	    )
	    dispatch(loadLevelMembersWithoutGroup(response.data))
	  } catch (e) {}
	}

export const getIncidenciasByGroup = (groupId: number) => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/GestionGrupo/IncidenciasByGrupo/${groupId}`
    )
    dispatch(loadGroupIncidencias(response.data))
  } catch (e) {}
}

export const getStudentsByAsignaturaGrupo =
	(asignaturaGrupoId: number, institutionId: number) => async (dispatch) => {
	  try {
	    const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/GestionGrupo/EstudiantesAsignatura/${institutionId}/${asignaturaGrupoId}`
	    )
	    dispatch(loadAllGroupMembers(response.data)) // dispatch(loadAllGroupMembers(response.data))
	  } catch (e) {}
	}

export const getStudentsByLevelInstituion =
	(levelId: number, intitutionId: number) => async (dispatch) => {
	  try {
	    const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/NivelOfertas/GetEstudiantebyNivelInstitucion/${levelId}/${intitutionId}`
	    )
	    dispatch(loadGroupsByInstitution(response.data))
	    return { error: false }
	  } catch (e) {
	    return { error: e.message }
	  }
	}
export const getStudentsLevel =
	(levelId: number, institutionId: number) => async (dispatch) => {
	  try {
	    const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/GestionGrupo/EstudiantesNivel/${institutionId}/${levelId}`
	    )
	    dispatch(loadAllGroupMembers(response.data))
	    return { error: false }
	  } catch (e) {
	    return { error: e.message }
	  }
	}
export const getEstudiantesByNivelOferta =
	(nivelOfertaId: number, estadosMatricula:string) => async (dispatch, getState) => {
	  const institutionId = getState().authUser.currentInstitution.id

	  try {
		debugger
	    const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/GestionGrupo/EstudiantesNivelOferta/${nivelOfertaId}/${institutionId}/${estadosMatricula}`
	    )
	    dispatch(loadAllGroupMembers(response.data))
	    return { error: false }
	  } catch (e) {
	    return { error: e.message }
	  }
	}
export const getEstudiantesByNivelOfertaSinFallecidos =
	(nivelOfertaId: number) => async (dispatch, getState) => {
	  const institutionId = getState().authUser.currentInstitution.id

	  try {
	    const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/GestionGrupo/EstudiantesNivelOfertaSinFallecidos/${nivelOfertaId}/${institutionId}`
	    )
	    dispatch(loadAllGroupMembers(response.data))
	    return { error: false }
	  } catch (e) {
	    return { error: e.message }
	  }
	}
export const getStudentsByAsignaturaGrupoId =
	(id: number) => async (dispatch) => {
	  try {
	    const response: any = await axios.get(
				`${envVariables.BACKEND_URL}/api/AsignaturaGrupoEstudianteMatriculado/GetAllAEstudiantebyAsignaturaGrupoId/${id}`
	    )
	    dispatch(
	      loadMembersBySubjectGroup(
	        response.data.map((el) => ({
	          ...el,
	          nombreCompleto: `${el.datosIdentidadEstudiante?.nombre} ${el.datosIdentidadEstudiante?.primerApellido} ${el?.datosIdentidadEstudiante?.segundoApellido}`
	        }))
	      )
	    )
	    return { error: false }
	  } catch (e) {
	    return { error: e.message }
	  }
	}

export const getIncidenciasByAsignaturaGrupo =
	(asignaturaGrupoId: number) => async (dispatch) => {
	  try {
	    const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/GestionGrupo/IncidenciasByGrupoAsignatura/${asignaturaGrupoId}`
	    )
	    dispatch(loadGroupIncidencias(response.data))
	  } catch (e) {}
	}

export const getTiposIncidencias = () => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Conducta/GetAllTipoIncumplimiento`
    )
    dispatch(loadIncidentsTypes(response.data))
  } catch (e) {}
}

export const createIncidencia = (data) => async (dispatch) => {
  try {
    const response = await axios.post(
			`${envVariables.BACKEND_URL}/api/Conducta/CreateIncidencia`,
			data
    )
    return { error: false }
    // dispatch(loadIncidentsTypes(response.data))
  } catch (e) {
    return { error: e.message }
  }
}

export const updateIncidencia = (data) => async (dispatch) => {
  try {
    const response = await axios.put(
			`${envVariables.BACKEND_URL}/api/Conducta/UpdateIncidencia`,
			data
    )
    return { error: false }
    // dispatch(loadIncidentsTypes(response.data))
  } catch (e) {
    return { error: e.message }
  }
}

export const getAllStudentsByModelOffer =
	(
	  institutionId: number,
	  nombre: string = '',
	  modelOfferId: number,
	  page: number = 0,
	  size: number = 10
	) =>
	  async (dispatch, getState) => {
	    try {
	      const students = getState().grupos.membersByOffer
	      const response: any = await axios.get(
				`${envVariables.BACKEND_URL}/api/AsignaturaGrupoEstudianteMatriculado/GetAllAEstudiantebyModoOfertaIdPaginated`,
				{
				  params: {
				    institucionId: institutionId,
				    nombre,
				    modeloOfertaId: modelOfferId,
				    PageNum: page,
				    PageSize: size
				  }
				}
	      )

	      dispatch(
	        loadStudentByOffer(
	          page > 1 ? [...students, ...response.data] : response.data
	        )
	      )
	      return { error: false, options: response.data }
	    } catch (error) {
	      return { error: error.message, options: [] }
	    }
	  }

export const getBloquesByOffer =
	(nivelesModeloId, institucionId, anioEducativoId) => async (dispatch) => {
	  try {
	    const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/FechaPeriodoCalendario/GetBybloquebyOfertaId/${nivelesModeloId},${institucionId},${anioEducativoId}`
	    )
	    
	    dispatch(loadBloques(response.data))
	    return { error: false }
	  } catch (e) {
	    return { error: e.message }
	  }
	}

export const GetGruposByInstitucionAnioElectivo =
	(anioId, institucionId) => async (dispatch) => {
	  try {
	    const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/GestionGrupo/GruposInstitucion/${anioId}/${institucionId}`
	    )
	    dispatch(loadGroupReports(response.data))
	    return { error: false }
	  } catch (e) {
	    return { error: e.message }
	  }
	}

export const GetEstudiantesByNameFromInstitution =
	(
	  nombre: string,
	  institucionId: number,
	  callback: (options: any[]) => void,
	  enrrolledStudents
	): undefined =>
	  async (dispatch: any): any => {
	    try {
	      const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/AsignaturaGrupoEstudianteMatriculado/GetAllAEstudiantebyNombreandInstitucionIdPaginated/${institucionId}/${nombre}/-1/-1`
	      )
	      dispatch(loadFilteredStudents(response.data))
	      if (callback) {
	        const matriculas = enrrolledStudents.map(
	          (el) => el.matriculasId
	        )
	        callback(
	          enrrolledStudents
	            ? response.data.filter(
	              (el) => !matriculas.includes(el.matriculasId)
						  )
	            : response.data
	        )
	      }
	      return { error: false, data: response.data }
	    } catch (e) {
	      return { error: e.message }
	    }
	  }
