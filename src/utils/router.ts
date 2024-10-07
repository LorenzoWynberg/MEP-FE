import React, { LazyExoticComponent } from 'react'

const BuscadorCentros = React.lazy(
	() => import('../views/app/director/Buscadores/BuscadorCentros')
)

const BuscadorPersonas = React.lazy(
	() => import('../views/app/director/Buscadores/BuscadorPersonas')
)
const BuscadorDirecciones = React.lazy(
	() => import('../views/app/director/Buscadores/BuscadorDirecciones')
)
const ExpedienteDireccionRegional = React.lazy(
	() =>
		import(
			'../views/app/director/ExpedienteDireccionesRegionales/ContenedorPrincipal'
		)
)
const FichaDirecciones = React.lazy(
	() =>
		import('../views/app/director/Configuracion/_partials/Direcciones/Ficha')
)
const ExpedienteEstudiante = React.lazy(
	() => import('../views/app/director/ExpedienteEstudiante/ContenedorPrincipal')
)

const FichaEstudiante = React.lazy(
	() => import('../views/app/director/ExpedienteEstudiante/FichaEstudiante')
)
const FichaCentro = React.lazy(
	() => import('../views/app/director/ExpedienteEstudiante/FichaCentro')
)

const ExpedienteCentro = React.lazy(
	() =>
		import(
			'../views/app/director/ExpedienteCentroEducativo/ContenedorPrincipal'
		)
)
// const ServicioComunal = React.lazy(
// 	() => import('../views/app/director/ExpedienteCentroEducativo/ServicioComunalEstudiantil')
// )
// const HistoricoExpediente = React.lazy(() => import('../views/app/director/Historico/HistoricoExpediente'))
// const ServicioComunalEdit = React.lazy(() => import('../views/app/director/Historico/ServicioComunalEdit'))

const MatricularEstudiantesBuscador = React.lazy(
	() => import('../views/app/director/MatricularEstudiantes/Buscador')
)
const MatricularEstudiantes = React.lazy(
	() =>
		import('../views/app/director/MatricularEstudiantes/ContenedorPrincipal')
)
const RegistroEstudiantes = React.lazy(
	() => import('../views/app/director/MatricularEstudiantes/registro/index')
)

const FormCreator = React.lazy(
	() => import('../views/app/creadorDeFormularios/index')
)

const FormCreatorV2 = React.lazy(() => import('../views/app/FormCreator'))

const FormRespuesta = React.lazy(
	() => import('../views/app/FormResponse/index')
)

const OutOfTime = React.lazy(() => import('../views/app/FormCreator/OutOfTime'))

const FormResponses = React.lazy(
	() => import('../views/app/FormCreator/Responses')
)

const FormThemes = React.lazy(
	() => import('../views/app/FormCreator/Themes/Edit')
)

const Comunidados = React.lazy(() => import('../views/app/Comunicados'))

/* Administrador */
const Admin = React.lazy(() => import('../views/app/admin/index'))
const AdminUsuarios = React.lazy(
	() => import('../views/app/admin/Usuarios/main')
)

const App = React.lazy(() => import('../views/app'))

const PrevisualiceJson = React.lazy(
	() => import('../views/app/creadorDeFormularios/PrevisualiceJson')
)

const AlertaTemprana = React.lazy(
	() => import('../views/app/director/AlertaTemprana/main')
)

const AlertaTempranaAdmin = React.lazy(
	() => import('../views/app/admin/AlertaTemprana/main')
)

const Configuracion = React.lazy(
	() => import('../views/app/director/Configuracion/Main')
)

const Identidad = React.lazy(
	() => import('../views/app/configuracion/Identidad/main')
)

const Groups = React.lazy(() => import('../views/app/director/Grupos/main'))

const GestorUsuarios = React.lazy(
	() => import('../views/app/director/GestorUsuarios/GestorUsuarios')
)
const GestorRoles = React.lazy(
	() => import('../views/app/director/GestorUsuarios/Roles/index')
)
const AnioEducativo = React.lazy(
	() => import('../views/app/admin/AnioEducativo/Main')
)

const Traslados = React.lazy(
	() => import('../views/app/director/Traslados/Main')
)

const AyudaDirector = React.lazy(() => import('../views/app/director/ayuda'))

const CensoIntermedio = React.lazy(
	() => import('../views/app/director/CensoIntermedio')
)

const CensoFinal = React.lazy(() => import('../views/app/director/CensoFinal'))

const PrintGroupStudents = React.lazy(
	() => import('../views/app/publicComponents/AllEstudentsPrint')
)

const GroupMembers = React.lazy(
	() =>
		import(
			'../views/app/director/ExpedienteCentroEducativo/_partials/ofertas/EstudiantesGrupo'
		)
)

const GestorFormulario = React.lazy(
	() => import('../views/app/gestorFormulario/index')
)

const GestorCatalogo = React.lazy(
	() => import('../views/app/director/GestorCatalogos/main')
)

const VistaEstudiante = React.lazy(
	() => import('../views/app/VistasUsuarios/Estudiante')
)

const VistaEncargado = React.lazy(
	() => import('../views/app/VistasUsuarios/Encargado')
)

const AreaCurricular = React.lazy(
	() => import('../views/app/VistasUsuarios/Estudiante/AreaCurricular')
)

const ExpedienteEstudianteParaExternos = React.lazy(
	() =>
		import(
			'../views/app/VistasUsuarios/Estudiante/ExpedienteEstudiante/ContenedorPrincipal'
		)
)

const BuscadorSupervisiones = React.lazy(
	() => import('../views/app/SupervisionesCircuitales/BuscadorSupervisiones')
)

const ExpedienteSupervision = React.lazy(
	() => import('../views/app/SupervisionesCircuitales/ExpedienteSupervision')
)

const EditUser = React.lazy(() => import('../views/app/EditUser'))

const BuscadorInstitucion = React.lazy(
	() => import('../views/app/BuscadorInstitucion')
)

const Reportes = React.lazy(() => import('../views/app/reportes'))

const GestionUsuarios = React.lazy(() => import('../views/app/GestionUsuarios'))
//const RecuperarContasenia = React.lazy(() => import('../views/app/RecoverPassword'))
const ThemeEditor = React.lazy(() => import('../views/app/ThemeEditor'))
const IdiomaEditor = React.lazy(() => import('../views/app/IdiomaEditor'))
const MapTest = React.lazy(() => import('../views/app/maptest'))
const SaberLogin = React.lazy(() => import('../views/user/login'))
interface Route {
	component: LazyExoticComponent<any>
	exact?: boolean
	route: string
	isAuthenticated?: boolean
	accessRoles?: Array<any>
	routeProps?: object
	section?: string
}

const routes: Route[] = [
	{
		component: SaberLogin,
		route: '/user/login',
		exact: true,
		isAuthenticated: false
	},
	{
		component: MapTest,
		route: '/MapTest',
		exact: true,
		isAuthenticated: false,
		accessRoles: ['ADMIN']
	},
	{
		component: IdiomaEditor,
		route: '/idiomaeditor',
		exact: true,
		isAuthenticated: false,
		accessRoles: ['ADMIN'],
		routeProps: {
			active: 0
		}
	},
	{
		component: ThemeEditor,
		route: '/temaeditor',
		exact: true,
		isAuthenticated: false,
		accessRoles: ['ADMIN'],
		routeProps: {
			active: 0
		}
	},
	{
		component: BuscadorInstitucion,
		route: '/buscador',
		exact: true,
		isAuthenticated: false,
		accessRoles: ['ADMIN', 'GESTOR', 'ENCARGADO', 'ESTUDIANTE'],
		routeProps: {
			active: 0
		}
	},
	{
		component: VistaEstudiante,
		route: '/view/Estudiante/:id',
		exact: true,
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR', 'ENCARGADO', 'ESTUDIANTE'],
		routeProps: {
			active: 0
		}
	},
	{
		component: ExpedienteEstudianteParaExternos,
		route: '/view/expediente-estudiante',
		exact: true,
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR', 'ENCARGADO', 'ESTUDIANTE'],
		routeProps: {
			active: 1
		}
	},
	{
		component: ExpedienteEstudianteParaExternos,
		route: '/view/expediente-estudiante',
		exact: true,
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR', 'ENCARGADO', 'ESTUDIANTE'],
		routeProps: {
			active: 1
		}
	},
	{
		component: ExpedienteEstudianteParaExternos,
		route: '/view/expediente-estudiante/inicio',
		exact: true,
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR', 'ENCARGADO', 'ESTUDIANTE'],
		routeProps: {
			active: 1
		}
	},
	{
		component: ExpedienteEstudianteParaExternos,
		route: '/view/expediente-estudiante/general',
		exact: true,
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR', 'ENCARGADO', 'ESTUDIANTE'],
		routeProps: {
			active: 2
		}
	},
	{
		component: ExpedienteEstudianteParaExternos,
		route: '/view/expediente-estudiante/contacto',
		exact: true,
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR', 'ENCARGADO', 'ESTUDIANTE'],
		routeProps: {
			active: 3
		}
	},
	{
		component: ExpedienteEstudianteParaExternos,
		route: '/view/expediente-estudiante/hogar',
		exact: true,
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR', 'ENCARGADO', 'ESTUDIANTE'],
		routeProps: {
			active: 4
		}
	},
	{
		component: ExpedienteEstudianteParaExternos,
		route: '/view/expediente-estudiante/beneficios',
		exact: true,
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR', 'ENCARGADO', 'ESTUDIANTE'],
		routeProps: {
			active: 5
		}
	},
	{
		component: ExpedienteEstudianteParaExternos,
		route: '/view/expediente-estudiante/apoyos-educativos',
		exact: true,
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR', 'ENCARGADO', 'ESTUDIANTE'],
		routeProps: {
			active: 6
		}
	},
	{
		component: ExpedienteEstudianteParaExternos,
		route: '/view/expediente-estudiante/area-curricular',
		exact: true,
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR', 'ENCARGADO', 'ESTUDIANTE'],
		routeProps: {
			active: 7
		}
	},
	{
		component: ExpedienteEstudianteParaExternos,
		route: '/view/expediente-estudiante/salud',
		exact: true,
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR', 'ENCARGADO', 'ESTUDIANTE'],
		routeProps: {
			active: 8
		}
	},
	{
		component: ExpedienteEstudianteParaExternos,
		route: '/view/expediente-estudiante/oferta',
		exact: true,
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR', 'ENCARGADO', 'ESTUDIANTE'],
		routeProps: {
			active: 9
		}
	},
	/* {
    component: ExpedienteEstudianteParaExternos,
    route: '/view/expediente-estudiante/sinirube',
    exact: true,
    isAuthenticated: true,
    accessRoles: ['ADMIN', 'GESTOR', 'ENCARGADO', 'ESTUDIANTE'],
    routeProps: {
      active: 10
    }
  },*/
	{
		component: ExpedienteEstudianteParaExternos,
		route: '/view/expediente-estudiante/cuenta-correo',
		exact: true,
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR', 'ENCARGADO', 'ESTUDIANTE'],
		routeProps: {
			active: 10
		}
	},

	{
		component: AreaCurricular,
		route: '/view/areacurricular',
		exact: true,
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR', 'ENCARGADO', 'ESTUDIANTE'],
		routeProps: {
			active: 0
		}
	},
	{
		component: AreaCurricular,
		route: '/view/areacurricular/horarios',
		exact: true,
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR', 'ENCARGADO', 'ESTUDIANTE'],
		routeProps: {
			active: 1
		}
	},
	{
		component: AreaCurricular,
		route: '/view/areacurricular/apoyoeducativo',
		exact: true,
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR', 'ENCARGADO', 'ESTUDIANTE'],
		routeProps: {
			active: 2
		}
	},
	{
		component: AreaCurricular,
		route: '/view/areacurricular/ofertaeducativa',
		exact: true,
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR', 'ENCARGADO', 'ESTUDIANTE'],
		routeProps: {
			active: 3
		}
	},
	{
		component: VistaEncargado,
		route: '/view/Encargado',
		exact: true,
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR', 'ENCARGADO', 'ESTUDIANTE'],
		routeProps: {
			active: 0
		}
	},
	{
		component: App,
		route: '/app',
		exact: true,
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR']
	},
	{
		component: ExpedienteEstudiante,
		exact: true,
		route: '/director/',
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 0
		}
	},
	{
		component: ExpedienteEstudiante,
		exact: true,
		route: '/director/expediente-estudiante/',
		section: 'moduloexpedienteestudiante',
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 0
		}
	},

	{
		component: ExpedienteEstudiante,
		exact: true,
		route: '/director/expediente-estudiante/inicio/:idEstudiante',
		section: 'moduloexpedienteestudiante',
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 0
		}
	},

	{
		component: ExpedienteEstudiante,
		exact: true,
		route: '/director/expediente-estudiante/inicio/',
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 1
		}
	},

	{
		component: ExpedienteEstudiante,
		exact: true,
		route: '/director/expediente-estudiante/general',
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 2
		}
	},
	{
		component: ExpedienteEstudiante,
		exact: true,
		route: '/director/expediente-estudiante/contacto',
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 3
		}
	},
	{
		component: ExpedienteEstudiante,
		exact: true,
		route: '/director/expediente-estudiante/hogar',
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 4
		}
	},
	{
		component: ExpedienteEstudiante,
		exact: true,
		route: '/director/expediente-estudiante/beneficios',
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 5
		}
	},
	{
		component: ExpedienteEstudiante,
		exact: true,
		route: '/director/expediente-estudiante/apoyos-educativos',
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 6,
			apoyo:1
		}
	},

	{
		component: ExpedienteEstudiante,
		exact: true,
		route: '/director/expediente-estudiante/apoyos-educativos/curriculares',
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 6,
			apoyo:0
		}
	},

	{
		component: ExpedienteEstudiante,
		exact: true,
		route: '/director/expediente-estudiante/apoyos-educativos/personales',
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 6,
			apoyo:1
		}
	},

	{
		component: ExpedienteEstudiante,
		exact: true,
		route: '/director/expediente-estudiante/apoyos-educativos/organizativos',
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 6,
			apoyo:2
		}
	},

	{
		component: ExpedienteEstudiante,
		exact: true,
		route: '/director/expediente-estudiante/apoyos-educativos/alto-potencial',
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 6,
			apoyo:3
		}
	},

	{
		component: ExpedienteEstudiante,
		exact: true,
		route: '/director/expediente-estudiante/apoyos-educativos/condicion-discapacidad',
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 6,
			apoyo:4
		}
	},

	{
		component: ExpedienteEstudiante,
		exact: true,
		route: '/director/expediente-estudiante/apoyos-educativos/otras-condiciones',
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 6,
			apoyo:5
		}
	},

	{
		component: ExpedienteEstudiante,
		exact: true,
		route: '/director/expediente-estudiante/apoyos-educativos',
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 6
		}
	},
	// {
	// 	component: ExpedienteEstudiante,
	// 	exact: true,
	// 	route: '/director/expediente-estudiante/area-curricular',
	// 	isAuthenticated: true,
	// 	accessRoles: ['ADMIN', 'GESTOR'],
	// 	routeProps: {
	// 		active: 7
	// 	}
	// },
	{
		component: ExpedienteEstudiante,
		exact: true,
		route: '/director/expediente-estudiante/salud',
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 7
		}
	},
	{
		component: ExpedienteEstudiante,
		exact: true,
		route: '/director/expediente-estudiante/oferta',
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 8
		}
	},
	/*{
    component: ExpedienteEstudiante,
    exact: true,
    route: '/director/expediente-estudiante/sinirube',
    isAuthenticated: true,
    accessRoles: ['ADMIN', 'GESTOR'],
    routeProps: {
      active: 10
    }
  },*/
	/*{
    component: ExpedienteEstudiante,
    exact: true,
    route: '/director/expediente-estudiante/cuenta-correo',
    isAuthenticated: true,
    accessRoles: ['ADMIN', 'GESTOR'],
    routeProps: {
      active: 10
    }
  },*/
	{
		component: ExpedienteEstudiante,
		exact: true,
		route: '/director/expediente-estudiante/cuenta-usuario',
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 9
		}
	},
	{
		component: ExpedienteEstudiante,
		exact: true,
		route: '/director/expediente-estudiante/sce',
		isAuthenticated: true,
		routeProps: {
			active: 10
		}
	},
	{
		component: ExpedienteEstudiante,
		exact: true,
		route: '/director/expediente-estudiante/BitacoraExpediente',
		isAuthenticated: true,
		routeProps: {
			active: 11
		}
	},
	{
		component: AlertaTemprana,
		exact: true,
		route: '/director/alerta-estudiantes',
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 0
		}
	},
	{
		component: AlertaTempranaAdmin,
		exact: true,
		route: '/admin/alertaestudiantes',
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 0
		}
	},
	{
		component: MatricularEstudiantesBuscador,
		exact: true,
		section: 'modulomatriculaestudiantil',
		route: '/director/matricular-estudiantes',
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 0
		}
	},
	{
		component: MatricularEstudiantes,
		exact: true,
		route: '/director/matricular-estudiantes/:idStudent',
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 0
		}
	},
	{
		component: RegistroEstudiantes,
		exact: true,
		section: 'registromatricula',
		route: '/director/registro-estudiantil',
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 0
		}
	},
	{
		component: RegistroEstudiantes,
		exact: true,
		route: '/director/registro-estudiantil/:nivelOfertaId',
		isAuthenticated: true,
		section: 'registromatricula',
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 1
		}
	},
	{
		component: ExpedienteCentro,
		exact: true,
		route: '/director/expediente-centro',
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 0
		}
	},
	{
		component: ExpedienteCentro,
		exact: true,
		route: '/director/expediente-centro/inicio',
		section: 'moduloexpedientecentroeducativo',
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 0
		}
	},
	{
		component: ExpedienteCentro,
		exact: true,
		route: '/director/expediente-centro/estadistica',
		section: 'moduloexpedientecentroeducativo',
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 7
		}
	},
	{
		component: ExpedienteCentro,
		exact: true,
		route: '/director/expediente-centro/general',
		section: 'moduloexpedientecentroeducativo',
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 1
		}
	},
	{
		component: ExpedienteCentro,
		exact: true,
		route: '/director/expediente-centro/ofertas',
		section: 'moduloexpedientecentroeducativo',
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 2
		}
	},
	{
		component: ExpedienteCentro,
		exact: true,
		route: '/director/expediente-centro/recurso-humano',
		section: 'moduloexpedientecentroeducativo',
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 3
		}
	},
	{
		component: ExpedienteCentro,
		exact: true,
		route: '/director/expediente-centro/horarios',
		section: 'moduloexpedientecentroeducativo',
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 4
		}
	},
	{
		component: ExpedienteCentro,
		exact: true,
		route: '/director/expediente-centro/infraestructura',
		// section: 'moduloexpedientecentroeducativo',
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 5
		}
	},
	{
		component: ExpedienteCentro,
		exact: true,
		route: '/director/expediente-centro/organizacion-auxiliar',
		section: 'moduloexpedientecentroeducativo',
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 6
		}
	},
	{
		component: ExpedienteCentro,
		exact: true,
		route: '/director/expediente-centro/gruposProyecciones',
		section: 'moduloexpedientecentroeducativo',
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 8
		}
	},
	{
		component: ExpedienteCentro,
		exact: true,
		route: '/director/expediente-centro/horarios',
		section: 'moduloexpedientecentroeducativo',
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 4
		}
	},
	{
		component: ExpedienteCentro,
		exact: true,
		route: '/director/expediente-centro/normativaInterna',
		section: 'moduloexpedientecentroeducativo',
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 9
		}
	},
	{
		component: ExpedienteCentro,
		exact: true,
		route: '/director/expediente-centro/sce',
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 10,
			activeTab: 0
		}
	},
	{
		component: ExpedienteCentro,
		isAuthenticated: true,
		route: '/director/expediente-centro/sce/registro',
		exact: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 10,
			activeTab: 1
		}
	},
	{
		component: ExpedienteCentro,
		isAuthenticated: true,
		route: '/director/expediente-centro/sce/editar/:id',
		exact: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 10,
			activeTab: 1
		}
	},
	{
		component: ExpedienteCentro,
		isAuthenticated: true,
		route: '/director/expediente-centro/sce/actas',
		exact: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 10,
			activeTab: 2
		}
	},
	{
		component: ExpedienteCentro,
		isAuthenticated: true,
		route: '/director/expediente-centro/sce/certificados',
		exact: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 10,
			activeTab: 3
		}
	},
	{
		component: Admin,
		exact: true,
		route: '/admin/',
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 0
		}
	},
	{
		component: Admin,
		exact: true,
		route: '/admin/roles',
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 0
		}
	},
	{
		component: AdminUsuarios,
		exact: true,
		route: '/admin/invitaciones',
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		routeProps: {
			active: 5
		}
	},
	{
		component: FormCreator,
		exact: true,
		route: '/creador',
		isAuthenticated: true,
		accessRoles: ['ADMIN'],
		routeProps: {
			active: 0
		}
	},
	{
		component: Configuracion, // to use IntlMessages
		isAuthenticated: true,
		exact: true,
		route: '/director/configuracion/centro',
		section: 'configbuscadorinstituciones',
		routeProps: {
			active: 0,
			activeTab: 0
		}
	},
	{
		component: Configuracion, // to use IntlMessages
		isAuthenticated: true,
		exact: true,
		route: '/director/configuracion/centro/:centroId',
		section: 'configbuscadorinstituciones',
		routeProps: {
			active: 0,
			activeTab: 1
		}
	},
	{
		component: Configuracion, // to use IntlMessages
		isAuthenticated: true,
		route: '/director/configuracion/ofertas',
		section: 'ofertaseducativas',
		routeProps: {
			active: 1
		}
	},
	{
		component: Configuracion, // to use IntlMessages
		isAuthenticated: true,
		route: '/director/configuracion/periodos',
		section: 'menuperiodos',
		routeProps: {
			active: 5
		}
	},
	{
		component: GestorRoles,
		isAuthenticated: true,
		route: '/director/usuarios/roles/:rolId',
		section: 'menuusuarios',
		routeProps: {
			active: 0
		}
	},
	{
		component: GestorRoles,
		isAuthenticated: true,
		route: '/director/usuarios/roles',
		section: 'menuusuarios',
		routeProps: {
			active: 0
		}
	},

	{
		component: GestorUsuarios,
		isAuthenticated: true,
		route: '/director/usuarios',
		section: 'menuusuarios',
		routeProps: {
			active: 0
		}
	},
	{
		component: Configuracion, // to use IntlMessages
		isAuthenticated: true,
		route: '/director/configuracion/direcciones-regionales',
		section: 'direccionesregionales',
		routeProps: {
			active: 2
		}
	},
	{
		component: Configuracion, // to use IntlMessages
		isAuthenticated: true,
		route: '/director/configuracion/supervision-circuital',
		section: 'supervisionescircuitales',
		routeProps: {
			active: 3
		}
	},
	{
		component: Configuracion, // to use IntlMessages
		isAuthenticated: true,
		route: '/director/configuracion/mallaCurricular',
		section: 'modulomallascurriculares',
		routeProps: {
			active: 4
		}
	},
	{
		component: BuscadorSupervisiones,
		isAuthenticated: true,
		route: '/director/supervisiones',
		section: 'menusupervisioncircuital',
		routeProps: {
			active: 1
		},
		exact: true
	},
	{
		component: ExpedienteSupervision,
		isAuthenticated: true,
		route: '/director/supervisiones/expediente-supervision',
		section: 'expedientesupervision',
		routeProps: {
			active: 2
		},
		exact: true
	},
	{
		component: BuscadorSupervisiones,
		isAuthenticated: true,
		route: '/director/supervisiones/buscador-supervision',
		section: 'buscadorsupervisiones',
		routeProps: {
			active: 3
		},
		exact: true
	},
	{
		component: GestorCatalogo, //  to use IntlMessages
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		route: '/director/GestorCatalogos',
		section: 'gestioncatalogos',
		routeProps: {
			active: 1
		},
		exact: true
	},
	{
		component: GroupMembers, // to use IntlMessages
		isAuthenticated: true,
		route: '/director/expediente-centro/mibel/:lvlId/grupo/:grupoId'
	},
	{
		component: Identidad, // to use IntlMessages
		isAuthenticated: true,
		route: '/configuracion/identidad',
		section: 'identidadpersona',
		routeProps: {
			active: 4
		}
	},
	/*{
    component: ErrorScreen,
    route: '/admin/error',
    isAuthenticated: true,
    routeProps: {
      active: 0
    }
  },
  {
    component: ErrorScreen,
    route: '/director/error',
    routeProps: {
      active: 0
    }
  },*/
	{
		component: PrevisualiceJson,
		route: '/creador/previsualizar/:stringForm',
		exact: true
	},
	{
		component: Groups,
		isAuthenticated: true,
		section: 'modulogestiongrupos',
		route: '/director/grupos',
		exact: true
	},
	{
		component: FichaEstudiante,
		isAuthenticated: true,
		route: '/director/ficha-estudiante/:studentId',
		exact: true
	},
	{
		component: FichaCentro,
		isAuthenticated: true,
		route: '/director/ficha-centro/:centroId',
		exact: true
	},
	{
		component: AnioEducativo,
		isAuthenticated: true,
		route: '/director/configuracion/Año/años-educativos',
		section: 'anioeducativo',
		routeProps: {
			active: 0
		},
		exact: true
	},
	{
		component: AnioEducativo,
		isAuthenticated: true,
		route: '/director/configuracion/Año/ofertas',
		section: 'menuconfiguracion',
		routeProps: {
			active: 1
		},
		exact: true
	},
	{
		component: BuscadorPersonas,
		isAuthenticated: true,
		route: '/director/buscador/estudiante',
		section: 'buscadorpersona',
		routeProps: {
			active: 1
		},
		exact: true
	},
	{
		component: BuscadorCentros,
		isAuthenticated: true,
		route: '/director/buscador/centro',
		section: 'buscadorinstitucion',
		routeProps: {
			active: 1
		},
		exact: true
	},
	{
		component: ExpedienteDireccionRegional,
		isAuthenticated: true,
		route: '/director/expediente-direcciones',
		section: 'expedientedireccionesregionales',
		routeProps: {
			active: 0
		},
		exact: true
	},
	{
		component: ExpedienteDireccionRegional,
		isAuthenticated: true,
		route: '/director/expediente-direcciones/inicio',
		section: 'expedientedireccionesregionales',
		routeProps: {
			active: 0
		},
		exact: true
	},
	{
		component: ExpedienteDireccionRegional,
		isAuthenticated: true,
		route: '/director/expediente-direcciones/general',
		section: 'expedientedireccionesregionales',
		routeProps: {
			active: 1
		},
		exact: true
	},
	{
		component: ExpedienteDireccionRegional,
		isAuthenticated: true,
		route: '/director/expediente-direcciones/director',
		section: 'expedientedireccionesregionales',
		routeProps: {
			active: 2
		},
		exact: true
	},
	{
		component: ExpedienteDireccionRegional,
		isAuthenticated: true,
		route: '/director/expediente-direcciones/contacto',
		section: 'expedientedireccionesregionales',
		routeProps: {
			active: 3
		},
		exact: true
	},
	{
		component: ExpedienteDireccionRegional,
		isAuthenticated: true,
		route: '/director/expediente-direcciones/ubicacion',
		section: 'expedientedireccionesregionales',
		routeProps: {
			active: 4
		},
		exact: true
	},
	{
		component: ExpedienteDireccionRegional,
		isAuthenticated: true,
		route: '/director/expediente-direcciones/recursos-humanos',
		section: 'expedientedireccionesregionales',
		routeProps: {
			active: 5
		},
		exact: true
	},
	{
		component: ExpedienteDireccionRegional,
		isAuthenticated: true,
		route: '/director/expediente-direcciones/supervisiones-circuitales',
		section: 'expedientedireccionesregionales',
		routeProps: {
			active: 6
		},
		exact: true
	},
	{
		component: ExpedienteDireccionRegional,
		isAuthenticated: true,
		route: '/director/expediente-direcciones/centros',
		section: 'expedientedireccionesregionales',
		routeProps: {
			active: 7
		},
		exact: true
	},
	{
		component: BuscadorDirecciones,
		isAuthenticated: true,
		route: '/director/buscador/direcciones',
		section: 'buscadordireccionesregionales',
		routeProps: {
			active: 1
		},
		exact: true
	},
	{
		component: FichaDirecciones,
		isAuthenticated: true,
		route: '/director/direcciones/ficha',
		section: 'fichadirecciones',
		routeProps: {
			active: 1
		},
		exact: true
	},
	{
		component: Traslados,
		isAuthenticated: true,
		route: '/director/traslados/:section',
		section: 'traslados',
		routeProps: {
			active: 1
		}
	},

	{
		component: CensoIntermedio,
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		route: '/director/censo-intermedio/:nivelOfertaId',
		section: 'censointermedio',
		routeProps: {
			active: 0
		},
		exact: true
	},
	{
		component: CensoIntermedio,
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		route: '/director/censo-intermedio',
		section: 'censointermedio',
		routeProps: {
			active: 1
		},
		exact: true
	},
	{
		component: CensoFinal,
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		route: '/director/censo-final/:nivelOfertaId',
		section: 'censofinal',
		routeProps: {
			active: 1
		},
		exact: true
	},
	{
		component: CensoFinal,
		isAuthenticated: true,
		accessRoles: ['ADMIN', 'GESTOR'],
		route: '/director/censo-final',
		section: 'censofinal',
		routeProps: {
			active: 0
		},
		exact: true
	},

	{
		component: AyudaDirector,
		isAuthenticated: true,
		route: '/director/ayuda',
		section: 'menuayuda'
	},
	{
		component: PrintGroupStudents,
		isAuthenticated: false,
		route:
			'/print/institucion/:institucion/ofertaNivel/:ofertaNivel/grupo/:grupo'
	},
	{
		component: FormCreatorV2,
		isAuthenticated: true,
		exact: true,
		route: '/forms/'
	},
	{
		component: FormCreatorV2,
		isAuthenticated: true,
		exact: true,
		route: '/forms/:section'
	},
	{
		component: FormResponses,
		isAuthenticated: true,
		exact: true,
		route: '/forms/responses/:formId'
	},
	{
		component: FormCreatorV2,
		isAuthenticated: true,
		exact: true,
		route: '/forms/edit/:formId/'
	},
	{
		component: FormCreatorV2,
		isAuthenticated: true,
		exact: true,
		route: '/forms/edit/:formId/:manual'
	},
	{
		component: FormRespuesta,
		exact: true,
		route: '/forms/:formId/response'
	},
	{
		component: FormRespuesta,
		exact: true,
		routeProps: {
			open: 1
		},
		route: '/forms/response/:response/:formId'
	},
	{
		component: FormRespuesta,
		isAuthenticated: true,
		exact: true,
		routeProps: {
			preview: true,
			print: false
		},
		route: '/forms/:formId/preview'
	},
	{
		component: FormRespuesta,
		isAuthenticated: true,
		exact: true,
		routeProps: {
			preview: true,
			print: false
		},
		route: '/forms/:formId/preview/:print/print'
	},
	{
		component: FormThemes,
		isAuthenticated: true,
		exact: true,
		route: '/forms/themes/edit/:themeId'
	},
	{
		component: FormThemes,
		isAuthenticated: true,
		exact: true,
		routeProps: {
			create: true
		},
		route: '/forms/themes/create'
	},
	{
		component: Comunidados,
		isAuthenticated: true,
		exact: true,
		route: '/Comunicados/index'
	},
	{
		component: Comunidados,
		isAuthenticated: true,
		exact: true,
		route: '/Comunicados'
	},
	{
		component: Comunidados,
		isAuthenticated: true,
		exact: true,
		route: '/Comunicados/:menu'
	},
	{
		component: Comunidados,
		isAuthenticated: true,
		exact: true,
		route: '/Comunicados/:menu/:submenu'
	},
	{
		component: GestorFormulario,
		exact: true,
		route: '/gestor'
	},
	{
		component: Reportes,
		exact: true,
		isAuthenticated: true,
		route: '/reportes',
		section: 'menureporte',
		routeProps: {
			activeTab: 0
		}
	},
	{
		component: Reportes,
		exact: true,
		isAuthenticated: true,
		section: 'menureporte',
		route: '/reportes/tablero',
		routeProps: {
			activeTab: 0
		}
	},

	{
		component: Reportes,
		exact: true,
		isAuthenticated: true,
		section: 'menureporte',
		route: '/reportes/sce',
		routeProps: {
			activeTab: 0,
			tipo: 'sce'
		}
	},

	{
		component: Reportes,
		exact: true,
		isAuthenticated: true,
		section: 'menureporte',
		route: '/reportes/matricula',
		routeProps: {
			activeTab: 0,
			tipo: 'matricula'
		}
	},
	{
		component: Reportes,
		exact: true,
		isAuthenticated: true,
		route: '/reportes/reportes',
		section: 'menureporte',
		routeProps: {
			activeTab: 1
		}
	},
	{
		component: Reportes,
		exact: true,
		isAuthenticated: true,
		route: '/reportes/certificaciones',
		section: 'menureporte',
		routeProps: {
			activeTab: 2
		}
	},
	{
		component: EditUser,
		route: '/user/edit/:id',
		exact: true,
		isAuthenticated: true
	},
	{
		component: GestionUsuarios,
		route: '/view/gestionusuarios',
		exact: true,
		isAuthenticated: false,
		accessRoles: ['ADMIN'],
		routeProps: {
			active: 0
		}
	}
]

export { routes }
