import { combineReducers } from 'redux'
import settings from './settings/reducer'
// import menu from './menu/reducer'
import nacionalidades from './nacionalidades/reducer'
import roles from './roles/reducer'
import authUser from './auth/reducer'
import idTypes from './idTypes/reducer'
import provincias from './provincias/reducer'
import identification from './identificacion/reducer'
import cantones from './cantones/reducer'
import distritos from './distritos/reducer'
import poblados from './poblados/reducer'
import expedienteEstudiantil from './expedienteEstudiantil/reducer'
import informacionContacto from './expedienteEstudiante/informacionContacto/reducer'
import selects from './selects/reducer'
import miembro from './miembros/reducer'
import beneficios from './beneficios/reducer'
import apoyos from './apoyos/reducer'
import salud from './salud/reducer'
import direccion from './direccion/reducer'
import matricula from './matricula/reducer'
import identidad from './identidad/reducer'
import matriculaApoyos from './matricula/apoyos/reducer'
import institucion from './institucion/reducer'
import alertaTemprana from './alertaTemprana/reducer'
import adminInvitaciones from './Admin/Invitaciones/reducer.ts'
import usuarios from './Admin/Usuarios/reducer.ts'
import registro from './registro/reducer'
import configuracion from './configuracion/reducer'
import ofertasInstitucion from './ofertasInstitucion/reducer.ts'
import ofertas from './ofertas/reducer.ts'
import modalidades from './modalidades/reducer.ts'
import servicios from './servicios/reducer.ts'
import especialidades from './especialidades/reducer.ts'
import niveles from './niveles/reducer.ts'
import educationalYear from './anioEducativo/reducer'
import periodoLectivo from './periodoLectivo/reducer'
import expedienteCentro from './expedienteCentro/reducer'
import modelosOfertas from './modelosOferta/reducer'
import grupos from './grupos/reducer'
import cursoLectivo from './cursoLectivo/reducer'
import traslado from './traslado/reducer'
import alertaReportes from './alertaTemprana/reportes/reducer'
import office365 from './office365/reducer'
import creadorFormularios from './FormCreatorV2/reducer'
import temas from './Temas/reducer'
import comunicados from './comunicados/reducer'
import listaDifusion from './ListasDifusion/reducer'
import asignaturas from './asignaturas/reducer'
import componentesEvaluacion from './componentesEvaluacion/reducer'
import mallasCurriculares from './mallasCurriculares/reducer'
import periodos from './periodos/reducer'
import indicadorAprendizaje from './IndicadoresAprendizaje/reducer'
import lecciones from './lecciones/reducer.ts'
import leccionAsignaturaGrupo from './LeccionAsignaturaGrupo/reducer'
import horarios from './horarios/reducer.ts'
import asignaturaGrupo from './AsignaturaGrupo/reducer.ts'
import profesoresInstitucion from './ProfesoresInstitucion/reducer.ts'
import asistencias from './Asistencias/reducer.ts'
import funcionarios from './RecursosHumanos/reducer'
import catalogos from './catalogos/reducer'
import elementos from './elementos/reducer'
import estructuraCatalogos from './estructuraCatalogos/reducer'
import faltas from './NormativaInterna/reducer'
import calificaciones from './Calificaciones/reducer'
import plantillas from './plantillas/reducer'
import mensajes from './mensajes/reducer'
import VistasUsuarios from './VistasUsuarios/reducer'
import reportes from './reportes/reducer'
import certificaciones from './Certificaciones/reducer'
import usuarioCatalogos from './UsuarioCatalogos/reducer'
import bitacora from './Bitacora/reducer'
import tema from './tema/reducer'
import menu from './menu/reducer'
import idioma from './Idioma/reducer'
import ubicacionGeografica from './ubicacionGeografica/reducer.tsx'
import nombramientosProfesor from './NombramientosProfesor/reducer'

const reducers = combineReducers({
  configuracion,
  menu,
  settings,
  nacionalidades,
  identification,
  distritos,
  cantones,
  poblados,
  roles,
  authUser,
  idTypes,
  provincias,
  expedienteEstudiantil,
  informacionContacto,
  selects,
  miembro,
  beneficios,
  apoyos,
  salud,
  direccion,
  matricula,
  matriculaApoyos,
  institucion,
  alertaTemprana,
  registro,
  ofertasInstitucion,
  adminInvitaciones,
  usuarios,
  ofertas,
  identidad,
  modalidades,
  servicios,
  especialidades,
  niveles,
  educationalYear,
  periodoLectivo,
  expedienteCentro,
  modelosOfertas,
  grupos,
  cursoLectivo,
  traslado,
  alertaReportes,
  office365,
  creadorFormularios,
  temas,
  comunicados,
  listaDifusion,
  asignaturas,
  componentesEvaluacion,
  mallasCurriculares,
  indicadorAprendizaje,
  periodos,
  lecciones,
  horarios,
  leccionAsignaturaGrupo,
  asignaturaGrupo,
  asistencias,
  profesoresInstitucion,
  funcionarios,
  catalogos,
  elementos,
  estructuraCatalogos,
  faltas,
  calificaciones,
  plantillas,
  mensajes,
  VistasUsuarios,
  reportes,
  certificaciones,
  usuarioCatalogos,
  bitacora,
  tema,
  idioma,
  ubicacionGeografica,
  nombramientosProfesor
})

export default reducers
