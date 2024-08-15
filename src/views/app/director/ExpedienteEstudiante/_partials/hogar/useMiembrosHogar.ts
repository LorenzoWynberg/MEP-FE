import React, { useReducer } from 'react'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import swal from 'sweetalert'
import { useSelector, useDispatch } from 'react-redux'
import { getDiscapacidades as getDiscapacidadesByIdentidad } from 'Redux/apoyos/actions'
import { getCatalogs } from 'Redux/selects/actions'
import * as yup from 'yup'
import moment from 'moment'
import { guidGenerator } from 'utils/GUIDGenerator'

type FILE_TYPE = {
	id?: number
	nombre?: string
	blob?: Blob
	src?: string
	action?: 'add' | 'remove' | null
}
enum TYPES {
	SET_TIPOIDENTIFICACION,
	SET_NACIONALIDAD,
	SET_IDENTIFICACION,
	SET_IMAGE,
	SET_NOMBRE,
	SET_PRIMER_APELLIDO,
	SET_SEGUNDO_APELLIDO,
	SET_SEXO,
	SET_FECHA_NACIMIENTO,
	SET_CONOCIDO_COMO,
	SET_IDENTIDAD_GENERO,
	SET_ESCOLARIDAD,
	SET_CONDICION_LABORAL,
	SET_DISCAPACIDADES,
	SET_RELACION_CON_ESTUDIANTE,
	SET_ES_ENCARGADO_ESTUDIANTE,
	SET_ES_REPRESENTANTE_LEGAL,
	SET_ES_AUTORIZADO,
	SET_VIVE_CON_ESTUDIANTE,
	SET_DEPENDE_ECONOMICAMENTE,
	SET_TELEFONO_PRINCIPAL,
	SET_TELEFONO_ALTERNATIVO,
	SET_EMAIL,
	SET_ROL,
	SET_TIPOIDENTIFICACION_CATALOG,
	SET_NACIONALIDAD_CATALOG,
	SET_SEXO_CATALOG,
	SET_ESCOLARIDAD_CATALOG,
	SET_CONDICIONLABORAL_CATALOG,
	SET_RELACIONCONESTUDIANTE_CATALOG,
	SET_ROL_CATALOG,
	SET_DISCAPACIDADES_CATALOG,
	SET_ALL_CATALOGS,
	TOGGLE_LOADING,
	TOGGLE_EDITABLE,
	TOGGLE_NUEVO,
	SET_DISCAPACIDADES_SELECCIONADAS,
	SET_IDENTIDAD_FORM_VALUES,
	ADD_REPRESENTANTE_LEGAL_DOC,
	ADD_ENCARGADO_DOC,
	REMOVE_REPRESENTANTE_LEGAL_DOC,
	REMOVE_ENCARGADO_DOC,
	TOGGLE_FORM,
	TOGGLE_MODAL_BUSQUEDA,
	SET_FULL_STATE,
	CLEAR_FORM
}

const TIPO_CATALOGO_DATOS_ADICIONALES = {
	TipoIdentificación: 1,
	Sexo: 3,
	Nacionalidad: 2,
	TipoDimex: 40,
	Genero: 4,
	EstadoMigratorio: 5,
	EtniaIndigena: 6,
	LenguaIndigena: 7,
	LenguaMaterna: 8,
	EstadoCivil: 9,
	RelacionEstudiante: 14,
	Escolaridad: 13,
	CondicionLaboral: 11,
	CondiciónDiscapacidad: 15
}

const initialState = {
	miembroId: null,
	identidadId: null,
	tipoIdentificacion: null,
	nacionalidad: null,
	identificacion: '',
	imagen: null,
	nombre: '',
	primerApellido: '',
	segundoApellido: '',
	sexo: null,
	fechaNacimiento: '',
	conocidoComo: '',
	identidadGenero: null,
	escolaridad: null,
	condicionLaboral: null,
	condicionDiscapacidad: [],
	condicionDiscapacidadSeleccionadas: [],
	documentosEncargado: [],
	documentosRepresentanteLegal: [],
	relacionConEstudiante: null,
	esEncargadoDelEstudiante: false,
	esRepresentanteLegalEstudiante: false,
	esAutorizado: false,
	viveConEstudiante: false,
	dependeEconomicamente: false,
	telefonoPrincipal: '',
	telefonoAlternativo: '',
	correo: '',
	rol: null,
	tipoIdentificacionCatalog: [],
	nacionalidadCatalog: [],
	sexoCatalog: [],
	escolaridadCatalog: [],
	condicionLaboralCatalog: [],
	relacionConEstudianteCatalog: [],
	identidadGeneroCatalog: [],
	discapacidadesCatalog: [],
	rolCatalog: [],
	loading: false,
	editable: false,
	showForm: false,
	showModalBusqueda: false,
	isNew: false
}

const reducer = (state = initialState, action): typeof initialState => {
	const { type, payload } = action
	switch (type) {
		case TYPES.SET_TIPOIDENTIFICACION:
			return { ...state, tipoIdentificacion: payload }
		case TYPES.SET_NACIONALIDAD:
			return { ...state, nacionalidad: payload }
		case TYPES.SET_IDENTIFICACION:
			return { ...state, identificacion: payload }
		case TYPES.SET_IMAGE:
			return { ...state, imagen: payload }
		case TYPES.SET_NOMBRE:
			return { ...state, nombre: payload }
		case TYPES.SET_PRIMER_APELLIDO:
			return { ...state, primerApellido: payload }
		case TYPES.SET_SEGUNDO_APELLIDO:
			return { ...state, segundoApellido: payload }
		case TYPES.SET_SEXO:
			return { ...state, sexo: payload }
		case TYPES.SET_FECHA_NACIMIENTO:
			return { ...state, fechaNacimiento: payload }
		case TYPES.SET_CONOCIDO_COMO:
			return { ...state, conocidoComo: payload }
		case TYPES.SET_IDENTIDAD_GENERO:
			return { ...state, identidadGenero: payload }
		case TYPES.SET_ESCOLARIDAD:
			return { ...state, escolaridad: payload }
		case TYPES.SET_CONDICION_LABORAL:
			return { ...state, condicionLaboral: payload }
		case TYPES.SET_DISCAPACIDADES:
			return { ...state, condicionDiscapacidad: payload }
		case TYPES.SET_RELACION_CON_ESTUDIANTE:
			return { ...state, relacionConEstudiante: payload }
		case TYPES.SET_ES_ENCARGADO_ESTUDIANTE:
			return { ...state, esEncargadoDelEstudiante: payload }
		case TYPES.SET_ES_REPRESENTANTE_LEGAL:
			return { ...state, esRepresentanteLegalEstudiante: payload }
		case TYPES.SET_ES_AUTORIZADO:
			return { ...state, esAutorizado: payload }
		case TYPES.SET_VIVE_CON_ESTUDIANTE:
			return { ...state, viveConEstudiante: payload }
		case TYPES.SET_DEPENDE_ECONOMICAMENTE:
			return { ...state, dependeEconomicamente: payload }
		case TYPES.SET_TELEFONO_PRINCIPAL:
			return { ...state, telefonoPrincipal: payload }
		case TYPES.SET_TELEFONO_ALTERNATIVO:
			return { ...state, telefonoAlternativo: payload }
		case TYPES.SET_EMAIL:
			return { ...state, correo: payload }
		case TYPES.SET_ROL:
			return { ...state, rol: payload }
		case TYPES.SET_TIPOIDENTIFICACION_CATALOG:
			return { ...state, tipoIdentificacionCatalog: payload }
		case TYPES.SET_NACIONALIDAD_CATALOG:
			return { ...state, nacionalidadCatalog: payload }
		case TYPES.SET_SEXO_CATALOG:
			return { ...state, sexoCatalog: payload }
		case TYPES.SET_ESCOLARIDAD_CATALOG:
			return { ...state, escolaridadCatalog: payload }
		case TYPES.SET_CONDICIONLABORAL_CATALOG:
			return { ...state, condicionLaboralCatalog: payload }
		case TYPES.SET_RELACIONCONESTUDIANTE_CATALOG:
			return { ...state, relacionConEstudianteCatalog: payload }
		case TYPES.SET_ROL_CATALOG:
			return { ...state, rolCatalog: payload }
		case TYPES.SET_DISCAPACIDADES_CATALOG:
			return { ...state, condicionDiscapacidadCatalog: payload }
		case TYPES.SET_ALL_CATALOGS:
			return {
				...state,
				tipoIdentificacionCatalog: payload.tipoIdentificacionCatalog,
				nacionalidadCatalog: payload.nacionalidadCatalog,
				sexoCatalog: payload.sexoCatalog,
				escolaridadCatalog: payload.escolaridadCatalog,
				condicionLaboralCatalog: payload.condicionLaboralCatalog,
				relacionConEstudianteCatalog: payload.relacionConEstudianteCatalog,
				rolCatalog: payload.rolCatalog,
				identidadGeneroCatalog: payload.identidadGeneroCatalog,
				discapacidadesCatalog: payload.discapacidadesCatalog
			}
		case TYPES.TOGGLE_LOADING:
			return { ...state, loading: payload || !state.loading }
		case TYPES.TOGGLE_FORM:
			return { ...state, showForm: payload || !state.showForm }
		case TYPES.TOGGLE_EDITABLE:
			return { ...state, editable: payload || !state.editable }
		case TYPES.SET_DISCAPACIDADES_SELECCIONADAS:
			return { ...state, condicionDiscapacidadSeleccionadas: payload }
		case TYPES.SET_FULL_STATE:
			return { ...state, ...payload }
		case TYPES.SET_IDENTIDAD_FORM_VALUES: {
			/* const {
                tipoIdentificacion,
                nacionalidad,
                imagen,
                nombre,
                primerApellido,
                segundoApellido,
                sexo,
                fechaNacimiento,
                conocidoComo,
                identidadGenero,
                telefonoPrincipal,
                telefonoAlternativo,
                correo
            } = payload */
			return { ...state, ...payload }
		}
		case TYPES.ADD_ENCARGADO_DOC: {
			return {
				...state,
				documentosEncargado: [...state.documentosEncargado, payload]
			}
		}
		case TYPES.ADD_REPRESENTANTE_LEGAL_DOC: {
			return {
				...state,
				documentosRepresentanteLegal: [...state.documentosRepresentanteLegal, payload]
			}
		}
		case TYPES.REMOVE_REPRESENTANTE_LEGAL_DOC: {
			let newArr = [...state.documentosRepresentanteLegal]
			const index = newArr.findIndex(i => i.id == payload.id)

			if (newArr[index].action == 'add') newArr = newArr.filter(i => i.id != payload.id)
			else newArr[index].action = 'remove'

			return {
				...state,
				documentosRepresentanteLegal: newArr
			}
		}
		case TYPES.REMOVE_ENCARGADO_DOC: {
			let newArr = [...state.documentosEncargado]
			const index = newArr.findIndex(i => i.id == payload.id)

			if (newArr[index].action == 'add') newArr = newArr.filter(i => i.id != payload.id)
			else newArr[index].action = 'remove'
			return {
				...state,
				documentosEncargado: newArr
			}
		}
		case TYPES.CLEAR_FORM: {
			return {
				...state,
				miembroId: null,
				identidadId: null,
				identificacion: null,
				correo: null,
				telefonoAlternativo: null,
				telefonoPrincipal: null,
				nombre: null,
				primerApellido: null,
				segundoApellido: null,
				fechaNacimiento: null,
				conocidoComo: null,
				esAutorizado: false,
				viveConEstudiante: false,
				esEncargadoDelEstudiante: false,
				dependeEconomicamente: false,
				esRepresentanteLegalEstudiante: false,
				imagen: null,
				documentosEncargado: [],
				documentosRepresentanteLegal: [],
				tipoIdentificacion: null,
				identidadGenero: null,
				nacionalidad: null,
				relacionConEstudiante: null,
				sexo: null,
				condicionDiscapacidad: [],
				escolaridad: null,
				condicionLaboral: null,
				rol: null
			}
		}
		case TYPES.TOGGLE_NUEVO: {
			return { ...state, isNew: payload || !state.editable }
		}
		case TYPES.TOGGLE_MODAL_BUSQUEDA: {
			return { ...state, showModalBusqueda: payload }
		}
		default:
			return state
	}
}

const api = {
	createMiembroHogarRequest: async (formBody: FormData) => {
		const url = `${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Miembro/CreateMiembroHogar`
		const response = await axios.post(url, formBody)
		return response.data
	},
	editMiembroHogarRequest: async (formBody: FormData) => {
		const url = `${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Miembro/UpdateMiembroHogarDetail`
		const response = await axios.put(url, formBody)
		return response.data
	},
	deleteMiembroHogarRequest: async id => {
		const url = `${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Miembro/DeleteMiembroHogarDetail`
		const response = await axios.delete(url, {
			params: {
				miembroId: id
			}
		})
		return response.data
	},
	findIndentidadByIdentificacion: async identificacion => {
		try {
			const url = `${envVariables.BACKEND_URL}/api/Identidad/GetByIdentification/${identificacion}`
			const response = await axios.get(url)
			return response.data
		} catch (e) {
			throw e
		}
	},
	getMiembroHogarInfoById: async miembroId => {
		const url = `${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Miembro/GetMiembroHogarDetail`
		const response = await axios.get(url, {
			params: { miembroId }
		})
		return response.data
	}
}
const getBase64FromFile = data => {
	const reader = new FileReader()

	return new Promise((resolve, reject) => {
		reader.onload = () => resolve(reader.result)
		reader.onerror = reject
		reader.readAsDataURL(data)
	})
}
const useMiembrosHogar = ({ setSnackbarContent, handleClick }) => {
	const [state, dispatch] = useReducer(reducer, initialState)
	// const { t } = useTranslation()
	const reduxDispatch = useDispatch()
	const reduxState = useSelector((store: any) => {
		return {
			discapacidadesIdentidad: store.apoyos.discapacidadesIdentidad,
			nacionalidades: store.selects.nationalities,
			sexo: store.selects.sexoTypes,
			relacionEstudiante: store.selects.relacionEstudiante,
			escolaridades: store.selects.escolaridades,
			tipoIdentificacion: store.selects.idTypes,
			condicionLaboral: store.selects.condicionLaboral,
			identidadGenero: store.selects.genderTypes,
			discapacidades: store.selects.discapacidades,
			roles: store.roles.roles,
			estudianteId: store.expedienteEstudiantil.currentStudent.idEstudiante
		}
	})
	const clearForm = () => {
		dispatch({ type: TYPES.CLEAR_FORM })
	}
	const toggleNuevo = (value = null) => {
		dispatch({ type: TYPES.TOGGLE_NUEVO, payload: value })
	}
	const loadCatalogs = async () => {
		const mapeador = obj => {
			return { ...obj, label: obj.nombre, value: obj.id }
		}
		// catalogos de Relacion con Estudiante y Discapacidades cargado
		const { data: relacionConEstudiante } = await getCatalogs(14)(reduxDispatch)
		const { data: discapacidades } = await getCatalogs(15)(reduxDispatch)
		const { data: condicionesLaborales } = await getCatalogs(TIPO_CATALOGO_DATOS_ADICIONALES.CondicionLaboral)(
			reduxDispatch
		)
		const { data: escolaridades } = await getCatalogs(TIPO_CATALOGO_DATOS_ADICIONALES.Escolaridad)(reduxDispatch)
		const payload = {
			tipoIdentificacionCatalog: reduxState.tipoIdentificacion.map(mapeador),
			nacionalidadCatalog: reduxState.nacionalidades.map(mapeador),
			sexoCatalog: reduxState.sexo.map(mapeador),
			escolaridadCatalog: escolaridades.map(mapeador),
			condicionLaboralCatalog: condicionesLaborales.map(mapeador),
			relacionConEstudianteCatalog: reduxState.relacionEstudiante
				? relacionConEstudiante.map(mapeador)
				: reduxState.relacionEstudiante.map(mapeador),
			rolCatalog: reduxState.roles.map(mapeador).filter(i => i.sB_TipoRolId === 2),
			condicionDiscapacidadCatalog: reduxState.discapacidades,
			identidadGeneroCatalog: reduxState.identidadGenero.map(mapeador),
			discapacidadesCatalog: reduxState.discapacidades
				? discapacidades.map(mapeador)
				: reduxState.discapacidades.map(mapeador)
		}
		dispatch({
			type: TYPES.SET_ALL_CATALOGS,
			payload
		})
		return payload
	}
	React.useEffect(() => {
		loadCatalogs()
	}, [])
	const {
		tipoIdentificacionCatalog,
		nacionalidadCatalog,
		sexoCatalog,
		escolaridadCatalog,
		condicionLaboralCatalog,
		relacionConEstudianteCatalog,
		rolCatalog,
		identidadGeneroCatalog,
		discapacidadesCatalog,
		condicionDiscapacidadSeleccionadas,
		tipoIdentificacion,
		nacionalidad,
		identificacion,
		imagen,
		nombre,
		primerApellido,
		segundoApellido,
		sexo,
		fechaNacimiento,
		conocidoComo,
		identidadGenero,
		escolaridad,
		condicionLaboral,
		condicionDiscapacidad,
		relacionConEstudiante,
		esEncargadoDelEstudiante,
		esRepresentanteLegalEstudiante,
		esAutorizado,
		viveConEstudiante,
		dependeEconomicamente,
		telefonoPrincipal,
		telefonoAlternativo,
		correo,
		rol,
		editable,
		documentosEncargado,
		documentosRepresentanteLegal,
		loading,
		showForm,
		showModalBusqueda,
		miembroId,
		isNew
	} = state
	const errorToast = msg => {
		setSnackbarContent({ msg, variant: 'error' })
		handleClick()
	}
	const infoToast = msg => {
		setSnackbarContent({ msg, variant: 'info' })
		handleClick()
	}
	const toggleLoading = (value = null) => {
		dispatch({ type: TYPES.TOGGLE_LOADING, payload: value })
	}

	const toggleShowModalBusqueda = (value = false) => {
		dispatch({ type: TYPES.TOGGLE_MODAL_BUSQUEDA, payload: value })
	}

	const toggleEditable = (value = null) => {
		dispatch({ type: TYPES.TOGGLE_EDITABLE, payload: value })
	}
	const setIdentidadFormValues = obj => {
		const payload: any = {}
		const findCatalogObj = (datosObj, tipoCatalogoId, catalogoArr) => {
			const dato = datosObj.find(i => i.catalogoId == tipoCatalogoId)
			if (!dato) {
				return null
			}
			return catalogoArr.find(i => i.id == dato.elementoId)
		}

		payload.identidadId = obj.id
		payload.tipoIdentificacion = findCatalogObj(obj.datos, 1, state.tipoIdentificacionCatalog)
		payload.nacionalidad = findCatalogObj(obj.datos, 2, state.nacionalidadCatalog)
		payload.imagen = obj.fotografiaUrl
		payload.nombre = obj.nombre
		payload.primerApellido = obj.primerApellido
		payload.segundoApellido = obj.segundoApellido
		payload.sexo = findCatalogObj(obj.datos, 3, state.sexoCatalog)
		payload.fechaNacimiento = obj.fechaNacimiento
		payload.conocidoComo = obj.conocidoComo
		payload.identidadGenero = findCatalogObj(obj.datos, 4, state.identidadGeneroCatalog)
		payload.telefonoPrincipal = obj.telefono
		payload.telefonoAlternativo = obj.telefonoSecundario
		payload.correo = obj.email

		dispatch({ type: TYPES.SET_IDENTIDAD_FORM_VALUES, payload })
	}
	const onDiscapacidadesSeleccionadasClick = obj => {
		const index = state.condicionDiscapacidadSeleccionadas.findIndex(i => i.id == obj.id)
		let newState = [...state.condicionDiscapacidadSeleccionadas]
		if (index == -1) {
			newState = [...state.condicionDiscapacidadSeleccionadas, obj]
		} else {
			newState.splice(index, 1)
		}
		dispatch({
			type: TYPES.SET_DISCAPACIDADES_SELECCIONADAS,
			payload: newState
		})
	}
	const onDiscapacidadesGuardarClick = () => {
		dispatch({
			type: TYPES.SET_DISCAPACIDADES,
			payload: state.condicionDiscapacidadSeleccionadas
		})
		dispatch({ type: TYPES.SET_DISCAPACIDADES_SELECCIONADAS, payload: [] })
	}
	const onDiscapacidadesClick = () => {
		// dispatch({type: TYPES.SET_DISCAPACIDADES, payload: state.condicionDiscapacidad})
		dispatch({
			type: TYPES.SET_DISCAPACIDADES_SELECCIONADAS,
			payload: state.condicionDiscapacidad
		})
	}
	const onTipoIdentificacionChange = e => {
		dispatch({ type: TYPES.SET_TIPOIDENTIFICACION, payload: e })
	}

	const addMiembroFromModal = identificacion => {
		dispatch({ type: TYPES.SET_IDENTIFICACION, payload: identificacion })

		if (identificacion.length >= 9) {
			toggleLoading(true)
			api.findIndentidadByIdentificacion(identificacion)
				.then(r => {
					setIdentidadFormValues(r)
					toggleLoading(false)
				})
				.catch(_ => {
					toggleLoading(false)
				})
		}
	}

	const onIdentificacionChange = e => {
		dispatch({ type: TYPES.SET_IDENTIFICACION, payload: e.target.value })

		if (e.target.value.length >= 9) {
			toggleLoading(true)
			api.findIndentidadByIdentificacion(e.target.value)
				.then(r => {
					if (!r) {
						toggleShowModalBusqueda(true)
						return
					}

					console.log('Identificacion response', r)
					setIdentidadFormValues(r)
					toggleLoading(false)
				})
				.catch(_ => {
					toggleLoading(false)
					toggleShowModalBusqueda(false)
				})
		}
	}
	const onNacionalidadChange = e => {
		dispatch({ type: TYPES.SET_NACIONALIDAD, payload: e })
	}
	const onImagenChange = e => {
		if (!e.target.files) return
		const obj: FILE_TYPE = {
			id: guidGenerator(),
			nombre: e.target.files[0].name,
			blob: e.target.files[0],
			action: 'add'
		}
		getBase64FromFile(e.target.files[0])
			.then((src: string) => {
				obj.src = src
				dispatch({ type: TYPES.SET_IMAGE, payload: obj })
			})
			.catch(err => console.log(err))
	}
	const onNombreChange = e => {
		dispatch({ type: TYPES.SET_NOMBRE, payload: e.target.value })
	}
	const onPrimerApellidoChange = e => {
		dispatch({ type: TYPES.SET_PRIMER_APELLIDO, payload: e.target.value })
	}
	const onSegundoApellidoChange = e => {
		dispatch({ type: TYPES.SET_SEGUNDO_APELLIDO, payload: e.target.value })
	}
	const onSexoChange = e => {
		dispatch({ type: TYPES.SET_SEXO, payload: e })
	}
	const onFechaNacimientoChange = e => {
		dispatch({ type: TYPES.SET_FECHA_NACIMIENTO, payload: e })
	}
	const onConocidoComoChange = e => {
		dispatch({ type: TYPES.SET_CONOCIDO_COMO, payload: e.target.value })
	}
	const onIdentidadGeneroChange = e => {
		dispatch({ type: TYPES.SET_IDENTIDAD_GENERO, payload: e })
	}
	const onEscolaridadChange = e => {
		dispatch({ type: TYPES.SET_ESCOLARIDAD, payload: e })
	}
	const onCondicionLaboralChange = e => {
		dispatch({ type: TYPES.SET_CONDICION_LABORAL, payload: e })
	}
	const onCondicionDiscapacidadChange = e => {
		dispatch({ type: TYPES.SET_CONDICION_LABORAL, payload: e })
	}
	const onRelacionConEstudianteChange = e => {
		dispatch({ type: TYPES.SET_RELACION_CON_ESTUDIANTE, payload: e })
	}
	const onEsEncargadoDelEstudianteChange = e => {
		dispatch({
			type: TYPES.SET_ES_ENCARGADO_ESTUDIANTE,
			payload: e.target.value === 'true'
		})
	}
	const onEsRepresentanteLegalEstudianteChange = e => {
		dispatch({
			type: TYPES.SET_ES_REPRESENTANTE_LEGAL,
			payload: e.target.value === 'true'
		})
	}
	const onEsAutorizadoChange = e => {
		dispatch({
			type: TYPES.SET_ES_AUTORIZADO,
			payload: e.target.value === 'true'
		})
	}
	const onViveConEstudianteChange = e => {
		dispatch({
			type: TYPES.SET_VIVE_CON_ESTUDIANTE,
			payload: e.target.value === 'true'
		})
	}
	const onDependeEconomicamenteChange = e => {
		dispatch({
			type: TYPES.SET_DEPENDE_ECONOMICAMENTE,
			payload: e.target.value === 'true'
		})
	}
	const onTelefonoPrincipalChange = e => {
		dispatch({
			type: TYPES.SET_TELEFONO_PRINCIPAL,
			payload: e.target.value
		})
	}
	const onTelefonoAlternativoChange = e => {
		dispatch({
			type: TYPES.SET_TELEFONO_ALTERNATIVO,
			payload: e.target.value
		})
	}
	const onCorreoChange = e => {
		dispatch({ type: TYPES.SET_EMAIL, payload: e.target.value })
	}
	const onRolChange = e => {
		dispatch({ type: TYPES.SET_ROL, payload: e })
	}
	const onDocumentoEncargadoChange = e => {
		if (!e.target.files) return
		const obj: FILE_TYPE = {
			id: guidGenerator(),
			nombre: e.target.files[0].name,
			blob: e.target.files[0],
			action: 'add'
		}
		getBase64FromFile(e.target.files[0])
			.then((src: string) => {
				obj.src = src
				dispatch({ type: TYPES.ADD_ENCARGADO_DOC, payload: obj })
			})
			.catch(e => console.log(e))
	}
	const onDocumentoRepresentanteLegalChange = e => {
		if (!e.target.files) return
		const obj: FILE_TYPE = {
			id: guidGenerator(),
			nombre: e.target.files[0].name,
			blob: e.target.files[0],
			action: 'add'
		}
		getBase64FromFile(e.target.files[0])
			.then((src: string) => {
				obj.src = src
				dispatch({
					type: TYPES.ADD_REPRESENTANTE_LEGAL_DOC,
					payload: obj
				})
			})
			.catch(err => console.log(err))
	}
	const onDocumentoEncargadoRemove = obj => {
		dispatch({ type: TYPES.REMOVE_ENCARGADO_DOC, payload: obj })
	}
	const onDocumentoRepresentanteLegalRemove = obj => {
		dispatch({ type: TYPES.REMOVE_REPRESENTANTE_LEGAL_DOC, payload: obj })
	}
	const getRequest = (type: 'create' | 'update' = 'create') => {
		const formBody = new FormData()
		formBody.append('viveHogar', state.viveConEstudiante?.toString() || 'false')
		formBody.append('esEncargado', state.esEncargadoDelEstudiante?.toString() || 'false')
		formBody.append('esRepresentanteLegal', state.esRepresentanteLegalEstudiante?.toString() || 'false')
		formBody.append('emergencia', 'false')
		formBody.append('estudianteId', reduxState.estudianteId)
		formBody.append('esAutorizado', state.esAutorizado?.toString() || 'false')
		formBody.append('dependenciaEconomica', state.dependeEconomicamente?.toString() || 'false')
		formBody.append('nombre', state.nombre)
		formBody.append('primerApellido', state.primerApellido)
		formBody.append('segundoApellido', state.segundoApellido)
		formBody.append('conocidoComo', state.conocidoComo)
		formBody.append('fechaNacimiento', state.fechaNacimiento)
		formBody.append('telefono', state.telefonoPrincipal)
		formBody.append('telefonoSecundario', state.telefonoAlternativo)
		formBody.append('email', state.correo)
		formBody.append('identificacion', state.identificacion)
		formBody.append('idIdentidad', state.identidadId)
		formBody.append('relacionId', state.relacionConEstudiante?.id)
		formBody.append('tipoIdentificacionId', state.tipoIdentificacion?.id)
		formBody.append('nacionalidadId', state.nacionalidad?.id)
		formBody.append('sexoId', state.sexo?.id)
		formBody.append('condicionLaboralId', state.condicionLaboral?.id)
		formBody.append('escolaridadId', state.escolaridad?.id)
		formBody.append('parentescoId', state.relacionConEstudiante?.id)
		formBody.append('roleId', state.rol?.id)
		state.condicionDiscapacidad.forEach(i => {
			formBody.append('discapacidadesId', i.id)
		})
		if (state.imagen) {
			formBody.append('fotoPerfil', state.imagen.blob)
		}
		state.documentosEncargado[0]
		state.documentosEncargado
			.filter(el => el?.action !== 'remove')
			.forEach(i => {
				formBody.append('documentosEncargado', i.blob)
			})
		state.documentosRepresentanteLegal
			.filter(el => el?.action !== 'remove')
			.forEach(i => {
				formBody.append('documentosRepresentanteLegal', i.blob)
			})
		if (type === 'update') {
			state.documentosEncargado
				.filter(el => el?.action === 'remove')
				.forEach(i => {
					formBody.append('documentosEncargadoToDelete', i.id)
				})
			state.documentosRepresentanteLegal
				.filter(el => el?.action === 'remove')
				.forEach(i => {
					formBody.append('documentosRepresentanteLegalToDelete', i.id)
				})
			formBody.append('miembroId', state.miembroId)
		}
		/*state.condicionDiscapacidad.forEach((i)=>{
      formBody.append('discapacidadesId',i.id)
    })*/

		try {
			// schema.validateSync(request)
			// Object.keys(request).forEach(i=>{
			//     formBody.append(i,request[i])
			// })

			return formBody
		} catch (e) {
			errorToast(e.message)
			return null
		}
	}
	const onGuardarClick = () => {
		if (
			!state.condicionLaboral?.id ||
			!state.escolaridad?.id ||
			!state.relacionConEstudiante?.id ||
			!state.telefonoPrincipal ||
			!state.correo ||
			!state.identificacion
		) {
			errorToast('Faltan rellenar campos obligatorios')
			return
		}
		if (state.isNew) {
			const request = getRequest()
			api.createMiembroHogarRequest(request)
				.then(_ => {
					toggleEditable(false)
					infoToast('Guardado correctamente')
				})
				.catch(e => {
					console.error(e)
					errorToast('Se ha producido un error')
				})
		} else {
			onUpdateClick()
		}
	}
	const onUpdateClick = () => {
		const request = getRequest('update')
		api.editMiembroHogarRequest(request)
			.then(_ => {
				toggleEditable(false)
				infoToast('Editado correctamente')
			})
			.catch(e => {
				console.error(e)
				errorToast('Se ha producido un error')
			})
	}

	const onDeleteClick = async id => {
		const res = await api.deleteMiembroHogarRequest(id)
		if (!res.error) {
			infoToast('Eliminado correctamente')
			return
		}
		errorToast('Se ha producido un error')
	}
	const toggleShowForm = (e = null) => {
		dispatch({ type: TYPES.TOGGLE_FORM, payload: e })
	}
	const setFormValuesFromRequest = (result, catalogos) => {
		const { identidad, miembro, recursoRepresentanteLegal, recursosEncargado, usuario, discapacidades } = result
		const imgPerfil: FILE_TYPE = {
			src: identidad.identidad.fotografiaUrl
		}
		const mapDocumentos = arr => {
			return arr.map(i => {
				return {
					src: i.recurso.url,
					nombre: i.recurso.titulo,
					id: i.recursoMiembro.id
				}
			})
		}

		const objDatoIdentidad = (tipoCatalogoId, arr) => {
			let catalog = []
			switch (tipoCatalogoId) {
				case TIPO_CATALOGO_DATOS_ADICIONALES.TipoIdentificación:
					catalog = catalogos.tipoIdentificacionCatalog
					break
				case TIPO_CATALOGO_DATOS_ADICIONALES.Nacionalidad:
					catalog = catalogos.nacionalidadCatalog
					break
				case TIPO_CATALOGO_DATOS_ADICIONALES.Sexo:
					catalog = catalogos.sexoCatalog
					break
				case TIPO_CATALOGO_DATOS_ADICIONALES.Genero:
					catalog = catalogos.identidadGeneroCatalog
					break
				case TIPO_CATALOGO_DATOS_ADICIONALES.RelacionEstudiante:
					catalog = catalogos.relacionConEstudianteCatalog
					break
				case TIPO_CATALOGO_DATOS_ADICIONALES.Escolaridad:
					catalog = catalogos.escolaridadCatalog
					break
				case TIPO_CATALOGO_DATOS_ADICIONALES.CondicionLaboral:
					catalog = catalogos.condicionLaboralCatalog
					break
			}
			const datoAdicional = arr.find(i => i.catalogoId == tipoCatalogoId)

			return catalog.find(i => i.value == datoAdicional?.elementoId)
		}
		const getRoleUsuario = (usuarioRoles, catalogoRoles) => {
			if (!usuarioRoles) return

			const rolesUsuario = JSON.parse(usuarioRoles)
			if (!rolesUsuario) return

			return catalogoRoles.find(i => rolesUsuario.find(j => i.id == j.rolId))
		}

		const newState: typeof initialState = {
			identidadId: identidad.identidad.id,
			identificacion: identidad.identidad.identificacion,
			correo: identidad.identidad.email,
			telefonoAlternativo: identidad.identidad.telefono,
			telefonoPrincipal: identidad.identidad.telefonoSecundario,
			nombre: identidad.identidad.nombre,
			primerApellido: identidad.identidad.primerApellido,
			segundoApellido: identidad.identidad.segundoApellido,
			fechaNacimiento: identidad.identidad.fechaNacimiento,
			conocidoComo: identidad.identidad.conocidoComo,
			esAutorizado: miembro.esAutorizado,
			viveConEstudiante: miembro.viveHogar,
			esEncargadoDelEstudiante: miembro.encargado,
			dependeEconomicamente: miembro.dependenciaEconomica,
			esRepresentanteLegalEstudiante: miembro.representanteLegal,
			imagen: imgPerfil,
			documentosEncargado: mapDocumentos(recursosEncargado),
			documentosRepresentanteLegal: mapDocumentos(recursoRepresentanteLegal),
			tipoIdentificacion: objDatoIdentidad(TIPO_CATALOGO_DATOS_ADICIONALES.TipoIdentificación, identidad.datos),
			identidadGenero: objDatoIdentidad(TIPO_CATALOGO_DATOS_ADICIONALES.Genero, identidad.datos),
			nacionalidad: objDatoIdentidad(TIPO_CATALOGO_DATOS_ADICIONALES.Nacionalidad, identidad.datos),
			relacionConEstudiante: catalogos.relacionConEstudianteCatalog.find(
				i => i.value == miembro.sb_elementosCatalogoId
			),
			sexo: objDatoIdentidad(TIPO_CATALOGO_DATOS_ADICIONALES.Sexo, identidad.datos),
			escolaridad: objDatoIdentidad(TIPO_CATALOGO_DATOS_ADICIONALES.Escolaridad, identidad.datos),
			condicionLaboral: objDatoIdentidad(TIPO_CATALOGO_DATOS_ADICIONALES.CondicionLaboral, identidad.datos),
			condicionDiscapacidad: discapacidades,
			miembroId: miembro.id,
			rol: getRoleUsuario(usuario.roles, catalogos.rolCatalog)
		}
		dispatch({ type: TYPES.SET_FULL_STATE, payload: newState })
	}
	const onEditarClick = id => {
		loadCatalogs().then(catalogs => {
			api.getMiembroHogarInfoById(id)
				.then(response => {
					console.log(response)
					setFormValuesFromRequest(response.data, catalogs)
					toggleShowForm(true)
					toggleEditable(true)
					toggleNuevo(false)
				})
				.catch(e => {
					console.log(e)
				})
		})
	}
	return {
		formData: {
			tipoIdentificacion,
			nacionalidad,
			identificacion,
			imagen,
			nombre,
			primerApellido,
			segundoApellido,
			sexo,
			fechaNacimiento,
			conocidoComo,
			identidadGenero,
			escolaridad,
			condicionLaboral,
			condicionDiscapacidad,
			relacionConEstudiante,
			esEncargadoDelEstudiante,
			esRepresentanteLegalEstudiante,
			esAutorizado,
			viveConEstudiante,
			dependeEconomicamente,
			telefonoPrincipal,
			telefonoAlternativo,
			correo,
			rol,
			editable,
			condicionDiscapacidadSeleccionadas,
			documentosEncargado: documentosEncargado.filter(i => i.action != 'remove'),
			documentosRepresentanteLegal: documentosRepresentanteLegal.filter(i => i.action != 'remove'),
			showForm,
			showModalBusqueda,
			loading,
			miembroId,
			isNew
		},
		catalogs: {
			tipoIdentificacionCatalog,
			nacionalidadCatalog,
			sexoCatalog,
			escolaridadCatalog,
			condicionLaboralCatalog,
			relacionConEstudianteCatalog,
			rolCatalog,
			identidadGeneroCatalog,
			discapacidadesCatalog
		},
		events: {
			onTipoIdentificacionChange,
			onIdentificacionChange,
			onNacionalidadChange,
			onImagenChange,
			onNombreChange,
			onPrimerApellidoChange,
			onSegundoApellidoChange,
			onSexoChange,
			onFechaNacimientoChange,
			onConocidoComoChange,
			onIdentidadGeneroChange,
			onEscolaridadChange,
			onCondicionLaboralChange,
			onCondicionDiscapacidadChange,
			onRelacionConEstudianteChange,
			onEsEncargadoDelEstudianteChange,
			onEsRepresentanteLegalEstudianteChange,
			onEsAutorizadoChange,
			onViveConEstudianteChange,
			onDependeEconomicamenteChange,
			onTelefonoPrincipalChange,
			onTelefonoAlternativoChange,
			onCorreoChange,
			onRolChange,
			toggleEditable,
			onGuardarClick,
			onUpdateClick,
			onDiscapacidadesGuardarClick,
			onDiscapacidadesSeleccionadasClick,
			onDiscapacidadesClick,
			onDocumentoEncargadoChange,
			onDocumentoRepresentanteLegalChange,
			onDocumentoEncargadoRemove,
			onDocumentoRepresentanteLegalRemove,
			onEditarClick,
			toggleShowForm,
			toggleShowModalBusqueda,
			loadCatalogs,
			toggleNuevo,
			onDeleteClick,
			clearForm,
			addMiembroFromModal
		},
		api
	}
}

export default useMiembrosHogar
