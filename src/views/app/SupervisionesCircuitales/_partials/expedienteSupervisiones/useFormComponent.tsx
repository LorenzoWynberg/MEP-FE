import React, { useReducer } from 'react'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import { useSelector } from 'react-redux'

const	defaultTipoIdentificacion = [
  { value: 1, label: 'CÉDULA' },
  { value: 3, label: 'DIMEX' },
  { value: 4, label: 'YÍS RÖ - IDENTIFICACIÓN MEP' }
]


const defaultRoles = [
  { value: 91, label: 'ASESOR DE SUPERVISIÓN' }
]

enum TYPES {
	SET_FULLNAME,
	SET_TIPO_IDENTIFICACION_ID,
	SET_NUMERO_IDENTIFICACION,
	SET_EMAIL,
	SET_ROL_ID,
	SET_LOADING,
	SET_SHOW_REGISTER_MODAL,
	SET_CIRCUITO,
	ADD_CIRCUITO,
	REMOVE_CIRCUITO,
	CLEAR_CIRCUITO
}

const initialState = {
  identidadId: null,
  tipoIdentificacionId: defaultTipoIdentificacion[0],
  numeroIdentificacion: null,
  fullname: '',
  email: '',
  tipoIdentificacionOptions: defaultTipoIdentificacion,
  rolesOptions: defaultRoles,
  rolId: defaultRoles[0],
  loading: false,
  encontrado: null,
  showRegisterModal: false,
  circuitoId: null,
  circuitosId: [],
  usuarioId: null
}

const reducer = (state = initialState, action): typeof initialState => {
  const { type, payload } = action
  switch (type) {
    case TYPES.SET_FULLNAME: {
      const { identidadId, nombre, encontrado, email, usuarioId } = payload
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
    case TYPES.SET_CIRCUITO:{
      return { ...state, circuitosId: payload }
    }
    case TYPES.ADD_CIRCUITO:{
      return { ...state, circuitosId: [...state.circuitosId, payload] }
    }
    case TYPES.REMOVE_CIRCUITO:{
      return { ...state, circuitosId: state.circuitosId.filter((el) => el.value != payload.value) }
    }
    case TYPES.CLEAR_CIRCUITO:{
      return { ...state, circuitosId: [] }
    }
    case TYPES.SET_ROL_ID: {
      return { ...state, rolId: payload }
    }
    default: {
      throw new Error('Error no existe el tipo ' + type)
    }
  }
}

const useFormComponent = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const toggleLoading = (loading?: boolean) => {
    dispatch({
      type: TYPES.SET_LOADING,
      payload:
				loading == undefined || loading == null
				  ? !state.loading
				  : loading
    })
  }

  const reduxState = useSelector((store) => ({
    circuitos: store.authUser.authObject?.user?.rolesOrganizaciones
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

  const fetchIdentidad = async (tipoId, identificacion) => {
    try {
      const url = `${envVariables.BACKEND_URL}/api/Identidad/Persona/GetByTipoIdAndId/${tipoId}_${identificacion}`
      const response = await axios.get<any>(url)
      if (response.data && response.data.id > 0) {
        const { id, nombre, primerApellido, segundoApellido, usuarioId } =
					response.data
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
  const reloadUserInfo = (identificacion, tipoIdenficacionObj) => {
    dispatch({ type: TYPES.SET_NUMERO_IDENTIFICACION, payload: identificacion })
    dispatch({ type: TYPES.SET_TIPO_IDENTIFICACION_ID, payload: tipoIdenficacionObj })
    toggleLoading(true)
    fetchIdentidad(tipoIdenficacionObj.value, identificacion).then((e) =>

      toggleLoading(false)
    ).catch(e => {
      dispatch({
        type: TYPES.SET_FULLNAME,
        payload: { nombre: '', encontrado: null }
      })
    })
  }
  const onChangeCircuito = (obj) => {
    // const { value } = obj
    dispatch({ type: TYPES.SET_CIRCUITO, payload: obj })
    // setViewState(value)
  }

  const addCircuito = (obj) => {
    dispatch({ type: TYPES.ADD_CIRCUITO, payload: obj })
  }

  const removeCircuito = (obj) => {
    dispatch({ type: TYPES.REMOVE_CIRCUITO, payload: obj })
  }

  const clearCircuito = () => {
    dispatch({ type: TYPES.CLEAR_CIRCUITO })
  }

  const onChangeMultiselectCircuitos = (value, actionMeta) => {
    switch (actionMeta.action) {
      case 'select-option':
        addCircuito(actionMeta.option)
        break
      case 'remove-value':
        removeCircuito(actionMeta.removedValue)
        break
      case 'clear':
        clearCircuito()
        break
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
    toggleRegisterModal,
    onConfirmRegisterModalCallback,
    loading: state.loading,
    identidadId: state.identidadId,
    usuarioId: state.usuarioId,
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
    reloadUserInfo
    /* circuitos: reduxState.circuitos?.map((el) => ({
            value: el?.organizacionId,
            label: el?.organizacionNombre,
        })),
        circuitoId: state.circuitosId ,
        onChangeMultiselectCircuitos: onChangeMultiselectCircuitos,
		onChangeCircuito: onChangeCircuito */
  }
}

export default useFormComponent
