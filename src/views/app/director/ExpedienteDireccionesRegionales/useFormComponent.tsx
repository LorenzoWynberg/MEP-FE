import React, { useEffect, useReducer } from 'react'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import { useSelector } from 'react-redux'

const defaultTipoIdentificacion = [
  { value: 1, label: 'CÉDULA' },
  { value: 3, label: 'DIMEX' },
  { value: 4, label: 'YÍS RÖ - IDENTIFICACIÓN MEP' }
  
]

const defaultRoles = [{ value: 90, label: 'ASESOR DE DIRECCIÓN REGIONAL' }]

enum TYPES {
	SET_FULLNAME,
	SET_TIPO_IDENTIFICACION_ID,
	SET_NUMERO_IDENTIFICACION,
	SET_EMAIL,
	SET_ROL_ID,
	SET_LOADING,
	SET_SHOW_REGISTER_MODAL,
	SET_REGIONAL
}

const initialState = {
  identidadId: null,
  tipoIdentificacionId: defaultTipoIdentificacion[0],
  numeroIdentificacion: null,
  fullname: '',
  email: null,
  tipoIdentificacionOptions: defaultTipoIdentificacion,
  rolesOptions: defaultRoles,
  rolId: defaultRoles[0],
  loading: false,
  encontrado: null,
  showRegisterModal: false,
  regionalId: null,
  usuarioId: null
}

interface ILocaleState {
	authUser: {
		authObject: {
			user: {
				rolesOrganizaciones: Array<{
					rolId: number
					rolNombre: string
					nivelAccesoId: number
					organizacionId: number
					organizacionNombre: string
				}>
			}
		}
		currentRoleOrganizacion: {
			accessRole: {
				rolId: number
				rolNombre: string
				nivelAccesoId: number
				organizacionId: number
				organizacionNombre: string
			}
			perfiles: Array<any>
		}
	}
}

const reducer = (state = initialState, action): typeof initialState => {
  const { type, payload } = action
  switch (type) {
    case TYPES.SET_FULLNAME: {
      const { identidadId, nombre, encontrado, email, usuarioId } =
				payload
      return {
        ...state,
        identidadId,
        fullname: nombre,
        encontrado,
        email,
        usuarioId
      }
    }
    case TYPES.SET_NUMERO_IDENTIFICACION: {
      return { ...state, numeroIdentificacion: payload }
    }
    case TYPES.SET_TIPO_IDENTIFICACION_ID: {
      return { ...state, tipoIdentificacionId: payload }
    }
    case TYPES.SET_LOADING: {
      return { ...state, loading: payload }
    }
    case TYPES.SET_SHOW_REGISTER_MODAL: {
      return { ...state, showRegisterModal: payload }
    }
    case TYPES.SET_EMAIL: {
      return { ...state, email: payload }
    }
    case TYPES.SET_ROL_ID: {
      return { ...state, rolId: payload }
    }
    case TYPES.SET_REGIONAL: {
      return { ...state, regionalId: payload }
    }
    default: {
      throw new Error('Error no existe el tipo ' + type)
    }
  }
}

const useFormComponent = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  console.log('Estado', state)
  const toggleLoading = (loading?: boolean) => {
    console.log('El loading paso a', loading)
    dispatch({
      type: TYPES.SET_LOADING,
      payload:
				loading == undefined || loading == null
				  ? !state.loading
				  : loading
    })
  }
  const reduxState = useSelector((store: ILocaleState) => ({
    regionales: store.authUser.authObject?.user?.rolesOrganizaciones,
    currentRegional: store.authUser.currentRoleOrganizacion.accessRole
  }))
  const toggleRegisterModal = (show?: boolean) => {
    dispatch({
      type: TYPES.SET_SHOW_REGISTER_MODAL,
      payload:
				show == undefined || show == null
				  ? !state.showRegisterModal
				  : show
    })
  }

  useEffect(() => {
    onChangeRegional({
      label: reduxState?.currentRegional?.organizacionNombre,
      value: reduxState?.currentRegional?.organizacionId
    })
  }, [reduxState.currentRegional])

  const fetchIdentidad = async (tipoId, identificacion) => {
    try {
      const url = `${envVariables.BACKEND_URL}/api/Identidad/Persona/GetByTipoIdAndId/${tipoId}_${identificacion}`
      const response = await axios.get<any>(url)
      if (response.data && response.data.id > 0) {
        const {
          id,
          nombre,
          primerApellido,
          segundoApellido,
          usuarioId
        } = response.data
        const email = response.data?.identidadDatos?.email
        dispatch({
          type: TYPES.SET_FULLNAME,
          payload: {
            email,
            identidadId: id,
            nombre: `${nombre} ${primerApellido} ${segundoApellido}`,
            encontrado: true,
            usuarioId
          }
        })

        return response.data
      } else {
        dispatch({
          type: TYPES.SET_FULLNAME,
          payload: {
            email: null,
            identidadId: null,
            nombre: null,
            encontrado: false
          }
        })
      }
    } catch (e) {
      console.log(e)
    }
  }
  const onChangeSelectTipoIdentificacion = (obj) => {
    // const { value } = obj
    dispatch({ type: TYPES.SET_TIPO_IDENTIFICACION_ID, payload: obj })
  }
  const onChangeInputNumeroIdentificacion = (e) => {
    const value = e.target.value
    dispatch({ type: TYPES.SET_NUMERO_IDENTIFICACION, payload: value })

    if (value && value.length > 8 && state?.tipoIdentificacionId?.value) {
      toggleLoading(true)
      fetchIdentidad(state.tipoIdentificacionId.value, value).then((_) =>
        toggleLoading(false)
      )
    } else {
      dispatch({
        type: TYPES.SET_FULLNAME,
        payload: { nombre: '', encontrado: null }
      })
    }
  }
  const onChangeInputEmail = (e) => {
    const value = e.target.value
    dispatch({ type: TYPES.SET_EMAIL, payload: value })
  }
  const onChangeSelectRol = (obj) => {
    // const { value } = obj
    dispatch({ type: TYPES.SET_ROL_ID, payload: obj })
    // setViewState(value)
  }

  const onChangeRegional = (obj) => {
    // const { value } = obj
    dispatch({ type: TYPES.SET_REGIONAL, payload: obj })
    // setViewState(value)
  }
  const onConfirmRegisterModalCallback = (response) => {
    if (!response) return
    const tipoIdObject = response.datos.find((i) => i.catalogoId == 1)
    const tipoIdLocalObject = state.tipoIdentificacionOptions.find(
      (i) => i.value == tipoIdObject.elementoId
    )

    onChangeSelectTipoIdentificacion(tipoIdLocalObject)
    dispatch({
      type: TYPES.SET_NUMERO_IDENTIFICACION,
      payload: response.identificacion
    })
    fetchIdentidad(tipoIdObject.elementoId, response.identificacion)
    toggleRegisterModal(false)
  }
  return {
    onChangeSelectTipoIdentificacion,
    onChangeInputNumeroIdentificacion,
    onChangeInputEmail,
    onChangeSelectRol,
    usuarioId: state.usuarioId,
    toggleRegisterModal,
    onConfirmRegisterModalCallback,
    loading: state.loading,
    identidadId: state.identidadId,
    email: state.email,
    rolId: state.rolId,
    tipoIdentificacionOptions: state.tipoIdentificacionOptions,
    rolesOptions: state.rolesOptions,
    tipoIdentificacionId: state.tipoIdentificacionId,
    numeroIdentificacion: state.numeroIdentificacion,
    encontrado: state.encontrado,
    fullname: state.fullname,
    showRegisterModal: state.showRegisterModal,
    fetchIdentidad,
    regionales: reduxState.regionales?.map((el) => ({
      value: el?.organizacionId,
      label: el?.organizacionNombre
    })),
    regionalId: state.regionalId || {
      value: reduxState?.regionales[0]?.organizacionId,
      label: reduxState?.regionales[0]?.organizacionNombre
    },
    onChangeRegional
  }
}

export default useFormComponent
