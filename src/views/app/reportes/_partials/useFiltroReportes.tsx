import axios from 'axios'
import { useReducer, useState } from 'react'
import { envVariables } from 'Constants/enviroment'
import { useSelector } from 'react-redux'

const TYPES = {
  SET_SELECTS_ITEMS: 'SET_SELECTS_ITEMS',
  SET_INITIAL_STATE: 'SET_INITIAL_STATE'
}

const reducer = (state, action) => {
  const { type, payload } = action
  switch (type) {
    case TYPES.SET_SELECTS_ITEMS: {
      const newState = [...state]
      const { index, items, onChange } = payload
      const select = { ...newState[index] }
      select.items = items
      select.onChange = onChange
      newState[index] = select
      return newState
    }
    case TYPES.SET_INITIAL_STATE: {
      return payload
    }
    default:
      return state
  }
}

const useFiltroReportes = () => {
  const [state, dispatch] = useReducer(reducer, [])
  const [loader, setLoader] = useState(false)
  const { institucionId, circuitoId } = useSelector((store: any) => {
    const currentInstitution = store.authUser.currentInstitution
    return {
      institucionId: currentInstitution?.id,
      circuitoId: currentInstitution?.circuitosId
    }
  })
  const fetch = async (endpoint) => {
    setLoader(true)
    return axios
      .get<any>(endpoint)
      .then((response) => {
        setLoader(false)
        return response.data
      })
      .catch((e) => {
        setLoader(false)
      })
  }
  const getRegionales = () => {
    return fetch(
      `${envVariables.BACKEND_URL}/api/Areas/Reportes/ReportesGenerales/GetAllRegional`
    )
  }

  const getGrupos = async (nivelOfertaId = 0) => {
    setLoader(true)
    try {
      const response = await axios.get(
        `${envVariables.BACKEND_URL}/api/Grupo/GetByNivelOfertaInstitucionaidad?nivelOfertaId=${nivelOfertaId}`
      )
      setLoader(false)
      return response.data
    } catch (error) {
      setLoader(false)
    }
  }

  const getCircuitosByRegionalId = (regionalId) => {
    return fetch(
      `${envVariables.BACKEND_URL}/api/Areas/Reportes/ReportesGenerales/GetAllCircutiosByRegionalId?regionalId=${regionalId}`
    )
  }

  const getInstitucionByCircuitoId = (circuitoId) => {
    return fetch(
      `${envVariables.BACKEND_URL}/api/Areas/Reportes/ReportesGenerales/GetAllInstitucionByCircuitoId?circuitoId=${circuitoId}`
    )
  }

  const getGruposByInstitucionId = (institucionId) => {
    return fetch(
      `${envVariables.BACKEND_URL}/api/Areas/Reportes/ReportesGenerales/GetAllGruposByInstitucionId?institucionId=${institucionId}`
    )
  }

  const getRegionByCircuitoId = (circuitoId) => {
    return fetch(
      `${envVariables.BACKEND_URL}/api/Areas/Reportes/ReportesGenerales/GetRegionByCircuitoId?circuitoId=${circuitoId}`
    )
  }

  const getCurrentRegion = () => {
    return fetch(
      `${envVariables.BACKEND_URL}/api/Areas/Reportes/ReportesGenerales/GetRegionByCircuitoId?circuitoId=${circuitoId}`
    )
  }

  const getEstdiantesByGrupoId = (grupoId) => {
    return fetch(
      `${envVariables.BACKEND_URL}/api/Areas/Reportes/ReportesGenerales/GetEstudiantesByGrupoId?grupoId=${grupoId}`
    )
  }

  const setSelectItems = (index, items, onChange) => {
    dispatch({
      type: TYPES.SET_SELECTS_ITEMS,
      payload: { index, items, onChange }
    })
  }

  const setSelectInitialState = (initialState) => {
    dispatch({ type: TYPES.SET_INITIAL_STATE, payload: initialState })
  }

  const getAllInstitucionInfo = (institucionId) => {
    return fetch(
      `${envVariables.BACKEND_URL}/api/Areas/Reportes/ReportesGenerales/GetInstitucionInfoParaReportes?institucionId=${institucionId}`
    )
  }

  return {
    getRegionales,
    getCircuitosByRegionalId,
    getInstitucionByCircuitoId,
    getGruposByInstitucionId,
    getRegionByCircuitoId,
    getCurrentRegion,
    institucionId,
    circuitoId,
    setSelectItems,
    selects: state,
    setSelectInitialState,
    getEstdiantesByGrupoId,
    getAllInstitucionInfo,
    getGrupos,
    loader
  }
}

export default useFiltroReportes
