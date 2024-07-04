import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import { handleErrors } from '../../utils/handleErrors'
import {
  MATRICULA_LOAD_STUDENT,
  MATRICULA_UPDATE_INFORMACION_REGISTRAL,
  MATRICULA_CLEAR_STUDENT,
  MATRICULA_ADD_MEMBER,
  MATRICULA_REMOVE_MEMBER,
  MATRICULA_UPDATE_MEMBER,
  MATRICULA_CLEAR_MEMBER,
  MATRICULA_LOAD_MEMBERS,
  MATRICULA_LOAD_MEMBER,
  MATRICULA_UPDATE_IDENTIDAD,
  MATRICULA_UPDATE_RESIDENCIA,
  MATRICULA_UPDATE_ENCARGADOS,
  MATRICULA_UPDATE_APOYOS_EDUCATIVOS,
  MATRICULA_SET_WIZARD_ID,
  MATRICULA_SET_WIZARD_STEPS,
  MATRICULA_SET_WIZARD_ID_DATOS,
  MATRICULA_LOAD_NIVELES,
  MATRICULA_SET_ENTIDADMATRICULAID,
  MATRICULA_SAVE,
  MATRICULA_FILTER,
  MATRICULA_CLEAN_FILTER,
  MATRICULA_LOAD_DATOS_EDUCATIVOS,
  MATRICULA_ERROR,
  MATRICULA_UPDATE_DIRECCION,
  MATRICULA_GET_INFOANIOCURSOFECHAS,
  MATRICULA_LOAD_INFORMACIONREGISTRAL,
  MATRICULA_LOAD_ANIOSEDUCATIVOS,
  MATRICULA_LOAD_CURSOSLECTIVOS,
  MATRICULA_SELECT_ANIOEDUCATIVO,
  MATRICULA_SELECT_CURSOLECTIVO,
  MATRICULA_INFO
} from './types'

const getAniosEducativos = (payload) => ({
  type: MATRICULA_LOAD_ANIOSEDUCATIVOS,
  payload
})

const getInfoEntidadMatriculaDispatch = (payload) => ({
  type: MATRICULA_INFO,
  payload
})

const getCursosLectivos = (payload) => ({
  type: MATRICULA_LOAD_CURSOSLECTIVOS,
  payload
})

const getInfoAnioCursoMatricula = (payload) => ({
  type: MATRICULA_GET_INFOANIOCURSOFECHAS,
  payload
})

const updateDireccion = (payload) => ({
  type: MATRICULA_UPDATE_DIRECCION,
  payload
})
const loadDatosEducativos = (payload) => ({
  type: MATRICULA_LOAD_DATOS_EDUCATIVOS,
  payload
})

const setEntidadMatriculaId = (payload) => ({
  type: MATRICULA_SET_ENTIDADMATRICULAID,
  payload
})

const updateMatricula = (payload) => ({
  type: 'MATRICULA_UPDATE_NEW',
  payload
})

const saveMatricula = (payload) => ({
  type: MATRICULA_SAVE,
  payload
})

const addMember = (payload) => ({
  type: MATRICULA_ADD_MEMBER,
  payload
})

const removeMember = (payload) => ({
  type: MATRICULA_REMOVE_MEMBER,
  payload
})

const updateMember = (payload) => ({
  type: MATRICULA_UPDATE_MEMBER,
  payload
})

const clearMember = (payload) => ({
  type: MATRICULA_CLEAR_MEMBER,
  payload
})

const loadStudent = (payload) => ({
  type: MATRICULA_LOAD_STUDENT,
  payload
})

const loadInformacionRegistral = (payload) => ({
  type: MATRICULA_LOAD_INFORMACIONREGISTRAL,
  payload
})

const setInfoRegistral = (payload) => ({
  type: MATRICULA_UPDATE_INFORMACION_REGISTRAL,
  payload
})

const clearStudent = () => ({
  type: MATRICULA_CLEAR_STUDENT
})
const loadMembers = (payload) => ({
  type: MATRICULA_LOAD_MEMBERS,
  payload
})
const loadMember = (payload) => ({
  type: MATRICULA_LOAD_MEMBER,
  payload
})

const updateIdentidad = (payload) => ({
  type: MATRICULA_UPDATE_IDENTIDAD,
  payload
})

const updateResidencia = (payload) => ({
  type: MATRICULA_UPDATE_RESIDENCIA,
  payload
})

const updateEncargados = (payload) => ({
  type: MATRICULA_UPDATE_ENCARGADOS,
  payload
})

const updateApoyosEducativos = (payload) => ({
  type: MATRICULA_UPDATE_APOYOS_EDUCATIVOS,
  payload
})

const setId = (payload) => ({
  type: MATRICULA_SET_WIZARD_ID,
  payload
})

const setIdDatos = (payload) => ({
  type: MATRICULA_SET_WIZARD_ID_DATOS,
  payload
})

const setPasosMatriculaWizard = (payload, step) => ({
  type: MATRICULA_SET_WIZARD_STEPS,
  step,
  payload
})

const loadNiveles = (payload) => ({
  type: MATRICULA_LOAD_NIVELES,
  payload
})

const matriculaFilter = (payload) => ({
  type: MATRICULA_FILTER,
  payload
})

const cleanFilterData = (payload) => ({
  type: MATRICULA_CLEAN_FILTER,
  payload
})
const studentByGrupoCertificaciones = (payload) => ({
  type: 'StudentsByGroupId',
  payload
})
const studentByMatriculaId = (payload) => ({
  type: 'GET_STUDENT_MATRICULA',
  payload
})
const clearStudentByMatriculaId = () => ({
  type: 'CLEAR_STUDENT_MATRICULA'
})
const loadStudentsCenso = (payload) => ({
  type: 'GET_STUDENTS_CENSO',
  payload
})
const loadStudentsCensoFinal = (payload) => ({
  type: 'GET_STUDENTS_CENSO_FINAL',
  payload
})
const updateStudentsCensoFinal = (payload) => ({
  type: 'UPDATE_STUDENT_CENSO_FINAL',
  payload
})
const loadTiposCenso = (payload) => ({
  type: 'GET_TIPOS_CENSO',
  payload
})

const loadTiposCensoFinal = (payload) => ({
  type: 'GET_TIPOS_CENSO_FINAL',
  payload
})

const error = (payload) => ({
  type: MATRICULA_ERROR,
  payload
})

export const selectAnioEducativo = (data) => (dispatch) => {
  dispatch({ type: MATRICULA_SELECT_ANIOEDUCATIVO, payload: data })
}

export const selectCursoLectivo = (data) => (dispatch) => {
  dispatch({ type: MATRICULA_SELECT_CURSOLECTIVO, payload: data })
}

export const updateIdentidadDireccion = (data) => (dispatch) => {
  dispatch(updateDireccion(data))
}

export const updateDataIdentidad = (data) => (dispatch) => {
  dispatch(updateIdentidad(data))
}
export const selectEntidadMatriculaId = (data) => (dispatch) => {
  dispatch(setEntidadMatriculaId(data))
}

export const updateDataResidencia = (data) => (dispatch) => {
  dispatch(updateResidencia(data))
}

export const updateDataEncargados = (data) => (dispatch) => {
  dispatch(updateEncargados(data))
}

export const updateDataApoyosEducativos = (data) => (dispatch) => {
  dispatch(updateApoyosEducativos(data))
}

export const addMemberEncargado = (data) => (dispatch) => {
  dispatch(addMember(data))
}

export const removeMemberEncargado = (data) => (dispatch) => {
  dispatch(removeMember(data))
}

export const updateMemberEncargado = (data) => (dispatch) => {
  dispatch(updateMember(data))
}

export const clearMemberEncargado = () => (dispatch) => {
  dispatch(clearMember())
}

export const clearStudentsCenso = () => (dispatch) => {
  dispatch({ type: 'CLEAR_STUDENTS_CENSO' })
}

export const getEstudiantesCensoByNivelOferta =
	(nivelOfertaId) => async (dispatch, getState) => {
	  const institutionId = getState().authUser.currentInstitution.id

	  try {
	    const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/Matricula/EstudiantesCensoNivelOferta/${nivelOfertaId}/${institutionId}`
	    )
	    dispatch(loadStudentsCenso(response.data))
	    return { error: false }
	  } catch (e) {
	    return { error: e.message, data: e }
	  }
	}

export const getEstudiantesCensoFinalNivelOferta =
	(nivelOfertaId) => async (dispatch, getState) => {
	  const institutionId = getState().authUser.currentInstitution.id

	  try {
	    const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/Matricula/EstudiantesCensoFinalNivelOferta/${nivelOfertaId}/${institutionId}`
	    )
	    dispatch(loadStudentsCensoFinal(response.data))
	    return { error: false }
	  } catch (e) {
	    return { error: e.message, data: e }
	  }
	}

export const actualizarCensoFinalMatricula = (data) => async (dispatch) => {
  try {
    const response = await axios.put(
			`${envVariables.BACKEND_URL}/api/Matricula/ActualizarCensoFinalMatricula`,
			data
    )
    if (!response.data) {
      return {
        error: true,
        mensaje: 'Ha ocurrido un error al registrar el censo final.'
      }
    }
    dispatch(updateStudentsCensoFinal(response.data))
    return { error: false, mensaje: '', data }
  } catch (e) {
    if (e.response.status === 400) {
      dispatch(error(handleErrors(e)))
    }
    return {
      error: true,
      mensaje: 'Ha ocurrido un error al registrar el censo final.'
    }
  }
}

export const getInformacionMatriculaActual =
	(cursoLectivoId) => async (dispatch) => {
	  try {
	    const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/Matricula/GetInfoAnioCursoMatriculaFechas/${cursoLectivoId}`
	    )
	    dispatch(getInfoAnioCursoMatricula(response.data))
	    return { error: false }
	  } catch (e) {
	    return { error: true }
	  }
	}

export const getAniosEducativosActivos = () => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/AnioEducativo/Activos`
    )
    dispatch(getAniosEducativos(response.data))
    return { error: false }
  } catch (e) {
    return { error: true }
  }
}

export const getMatriculaInfo = (identidadesId) => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/EntidadMatricula/GetEntidadMatriculaByidentidadId/${identidadesId}`
    )
    dispatch(getInfoEntidadMatriculaDispatch(response.data))
    return { error: false }
  } catch (e) {
    return { error: true }
  }
}

export const trasladarEstudiantes =
	(matriculas = [], entidadMatriculaId) =>
	  async (dispatch) => {
	    try {
	      const response = await axios.post(
				`${envVariables.BACKEND_URL}/api/Matricula/Trasladar`,
				{
				  idsMatricula: matriculas,
				  entidadMatriculaId
				}
	      )
	      return { error: false }
	    } catch (e) {
	      return { error: true }
	    }
	  }

export const getCursosLectivosPorAnioEducativo = (id) => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/CursosLectivos/GetByEdYearId/${id}`
    )
    dispatch(getCursosLectivos(response.data))
    return { error: false }
  } catch (e) {
    return { error: true }
  }
}

export const getDatosEducativos = (id) => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Matricula/GetDatosEducativos/${id}`
    )
    dispatch(loadDatosEducativos(response.data))
    return { error: false }
  } catch (e) {
    return { error: true }
  }
}

export const getNiveles =
	(institucionId, cursoLectivoId) => async (dispatch) => {
	  try {
	    const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/NivelOfertas/GetNivelesOfertaByInstitucion/${institucionId}/${cursoLectivoId}`
	    )
	    dispatch(loadNiveles(response.data))
	    return { error: false }
	  } catch (e) {
	    return { error: true }
	  }
	}

export const updateOtrosDatos = (data) => async (dispatch) => {
  try {
    const response = await axios.put(
			`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Expediente/OtrosDatosAndIdentidadMatricula`,
			data
    )

    return { error: false, response }
  } catch (e) {
    return { error: true, response: e }
  }
}
export const updateContactoInfo = (data) => async (dispatch) => {
  try {
    const response = await axios.put(
			`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Expediente/ContactoInfoMatricula`,
			data
    )

    return { error: false, response }
  } catch (e) {
    return { error: true, response: e }
  }
}

export const createMatricula = (data) => async (dispatch) => {
  try {
    const response = await axios.post(
			`${envVariables.BACKEND_URL}/api/Matricula`,
			data
    )

    if (response.data.error) {
      return { error: true, mensaje: response.data.mensaje }
    }
    dispatch(saveMatricula(response.data))

    return { error: false, message: '' }
  } catch (e) {
    if (e.response.status === 400) {
      dispatch(error(handleErrors(e)))
    }
    return {
      error: true,
      mensaje: 'Ha ocurrido un error al crear la matrícula.'
    }
  }
}

export const actualizarEstadoMatricula = (data) => async (dispatch) => {
  try {
    const response = await axios.post(
			`${envVariables.BACKEND_URL}/api/Matricula/ActualizarEstadoMatricula`,
			data
    )
    return { error: false, mensaje: '', data: response.data }
  } catch (e) {
    if (e.response.status === 400) {
      dispatch(error(handleErrors(e)))
    }
    return {
      error: true,
      mensaje:
				'Ha ocurrido un error al actualizar el estado de la matrícula.'
    }
  }
}

export const createMatriculaWithAdditionalData = (data) => async (dispatch) => {
  try {
    debugger
    const response = await axios.post(
			`${envVariables.BACKEND_URL}/api/Matricula/WithDiscapacidades`,
			data
    )

    if (response.data.error) {
      return {
        error: true,
        mensaje: response.data.mensaje,
        tipoError: response.data.tipoError
      }
    }
    dispatch(saveMatricula(response.data))

    return { error: false, message: '' }
  } catch (e) {
    if (e.response.status === 400) {
      dispatch(error(handleErrors(e)))
    }
    return {
      error: true,
      mensaje: 'Ha ocurrido un error al crear la matrícula.'
    }
  }
}
export const updateMatriculaWithAdditionalData = (data) => async (dispatch) => {
  try {
    debugger
    const response = await axios.put(
			`${envVariables.BACKEND_URL}/api/Matricula/actualizarDatosMatricula`,
			data
    )

    if (!response.data?.id) {
      return { error: true, mensaje: response.data.mensaje }
    }
    dispatch(updateMatricula(response.data))

    return { error: false, message: '' }
  } catch (e) {
    return {
      error: true,
      mensaje: 'Ha ocurrido un error al crear la matrícula.'
    }
  }
}

export const getStudentByIdentification = (id) => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Identidad/GetByIdentification/${id}`
    )

    dispatch(loadStudent(response.data))
    return { error: false }
  } catch (e) {
    return { error: true }
  }
}

export const getInformacionRegistral = (id) => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/TSEIdentidad/GetOneByCedula/${id}`
    )
    dispatch(loadInformacionRegistral(response.data))
    return { error: false }
  } catch (e) {
    return { error: true }
  }
}

export const getFamilyMembers = (user) => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Miembro/GetMiembrosByStudent/${user}`
    )
    dispatch(loadMembers(response.data))
    return { error: false }
  } catch (error) {
    return { error: 'Uno o mas errores han ocurrido' }
  }
}
export const getDataFilter =
	(textFilter, cursoLectivoId) => async (dispatch) => {
	  try {
	    const response = await axios.get(
				`${envVariables.BACKEND_URL}/api/Matricula/GetByFilter/${textFilter}/default/${cursoLectivoId}`
	    )
	    dispatch(matriculaFilter(response.data))
	    return { error: false }
	  } catch (error) {
	    return { error: 'Uno o mas errores han ocurrido' }
	  }
	}
export const GetEstudiantesByGrupo = (grupoId) => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Matricula/GetEstudiantesByGrupoId/${grupoId}`
    )
    dispatch(studentByGrupoCertificaciones(response.data))
    return { error: false }
  } catch (error) {
    return { error: 'Uno o mas errores han ocurrido' }
  }
}

export const removerEstudianteMatricula = (id) => async (dispatch) => {
  try {
    await axios.delete(
			`${envVariables.BACKEND_URL}/api/Matricula/removerEstudiante/${id}`
    )
    // dispatch(studentByGrupoCertificaciones(response.data))
    return { error: false }
  } catch (error) {
    return { error: 'Uno o mas errores han ocurrido' }
  }
}
export const getEstudianteMatricula = (matriculaId) => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/Matricula/GetEstudianteMatriculado/${matriculaId}`
    )
    dispatch(studentByMatriculaId(response.data))
    return { error: false, data: response.data }
  } catch (e) {
    return { error: true, data: null }
  }
}
export const clearEstudianteMatricula = () => async (dispatch) => {
  try {
    dispatch(clearStudentByMatriculaId())
    return { error: false, data: true }
  } catch (e) {
    return { error: true, data: null }
  }
}
export const createCenso = (data) => async (dispatch, getState) => {
  try {
    const state = getState()
    data.TipoCenso = state.matricula.tiposCenso?.find(
      (e) => e.codigo === 'INTERMEDIO'
    ).id
    if (!data.TipoCenso) {
      return { error: false }
    }
    await axios.post(
			`${envVariables.BACKEND_URL}/api/Matricula/CensoMatricula`,
			data
    )
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const createCensoMatriculaAlertas =
	(data) => async (dispatch, getState) => {
	  try {
	    const state = getState()
	    data.TipoCenso = state.matricula.tiposCenso?.find(
	      (e) => e.codigo === 'INTERMEDIO'
	    ).id
	    if (!data.TipoCenso) {
	      return { error: false }
	    }
	    await axios.post(
				`${envVariables.BACKEND_URL}/api/Matricula/CensoMatriculaAlertas`,
				data
	    )
	    return { error: false }
	  } catch (e) {
	    return { error: e.message }
	  }
	}

export const updateCenso = (data, id) => async (dispatch, getState) => {
  try {
    const state = getState()
    
    data.TipoCenso = state.matricula.tiposCenso?.find(
      (e) => e.codigo === 'INTERMEDIO'
    ).id
    
    if (!data.TipoCenso) {
      
      return { error: false }
    }
    
    await axios.put(
			`${envVariables.BACKEND_URL}/api/Matricula/CensoMatricula/${id}`,
			data
    )
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const updateCensoMatriculaAlertas =
	(data, id) => async (dispatch, getState) => {
	  try {
	    const state = getState()
	    data.TipoCenso = state.matricula.tiposCenso?.find(
	      (e) => e.codigo === 'INTERMEDIO'
	    ).id
	    if (!data.TipoCenso) {
	      return { error: false }
	    }
	    await axios.put(
				`${envVariables.BACKEND_URL}/api/Matricula/CensoMatriculaAlertas/${id}`,
				data
	    )
	    return { error: false }
	  } catch (e) {
	    return { error: e.message }
	  }
	}

export const updateEstadoMatriculaWithAlertas = (data) => async (dispatch) => {
  try {
    await axios.put(
			`${envVariables.BACKEND_URL}/api/Matricula/ActualizarEstadoMatriculaWithAlertas`,
			data
    )
    return { error: false }
  } catch (e) {
    return { error: e.message }
  }
}

export const getTiposCenso = () => async (dispatch) => {
  try {
    const response = await axios.get(		
      `${envVariables.BACKEND_URL}/api/matricula/GetTiposCensos`
    )
    dispatch(loadTiposCenso(response.data))

    return { error: false, data: response.data }
  } catch (e) {
    return { error: e.message }
  }
}


export const getTiposCensoCensoFinal = () => async (dispatch) => {
  try {
    const response = await axios.get(
			`${envVariables.BACKEND_URL}/api/CondicionEstudianteCurso`
    )
    dispatch(loadTiposCensoFinal(response.data))

    return { error: false, data: response.data }
  } catch (e) {
    return { error: e.message }
  }
}

export const getFamilyMember = (memberId) => (dispatch) => {
  dispatch(loadMember(memberId))
}
export const loadCurrentMember = (data) => (dispatch) => {
  dispatch(loadMember(data))
}
export const setInformacionRegistral = (data) => async (dispatch) => {
  dispatch(setInfoRegistral(data))
}

export const cleanFilter = () => async (dispatch) => {
  dispatch(cleanFilterData())
}

export const cleanStudent = (id) => async (dispatch) => {
  dispatch(clearStudent())
}

export const setMatriculaWizardIdentidad = (data) => async (dispatch) => {
  dispatch(setId(data))
}
export const setMatriculaWizardIdentidadDatos = (data) => async (dispatch) => {
  dispatch(setIdDatos(data))
}

export const setMatriculaWizardPasos = (data, step) => async (dispatch) => {
  dispatch(setPasosMatriculaWizard(data, step))
}
