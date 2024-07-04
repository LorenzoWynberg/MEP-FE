const data = [
  {
    id: 'ofertas',
    icon: 'iconsminds-student-male-female',
    label: 'menu>estudiantes>estudiantes',
    to: '/director/',
    section: 'menuestudiantes',
    subs: [
      {
        icon: 'iconsminds-file-clipboard-file---text',
        label: 'menu>estudiantes>expediente_estudiante',
        section: 'moduloexpedienteestudiante',
        to: '/director/expediente-estudiante'
      },
      {
        icon: 'iconsminds-add',
        label: 'menu>estudiantes>registro_matricula',
        section: 'registromatricula',
        to: '/director/registro-estudiantil'
      },
      {
        icon: 'iconsminds-add',
        label: 'menu>estudiantes>matricula_estudiantil',
        section: 'modulomatriculaestudiantil',
        to: '/director/matricular-estudiantes'
      },
      {
        icon: 'iconsminds-sync',
        label: 'menu>estudiantes>traslados',
        section: 'traslados',
        to: '/director/traslados/inicio'
      },
      {
        icon: 'iconsminds-conference',
        label: 'menu>estudiantes>buscados_personas',
        section: 'buscadorpersona',
        to: '/director/buscador/estudiante'
      },
      {
        icon: 'iconsminds-id-card',
        label: 'menu>estudiantes>identidad_persona',
        section: 'identidadpersona',
        to: '/configuracion/identidad'
      }
    ]
  },
  {
    id: 'institucion',
    icon: 'iconsminds-the-white-house',
    label: 'menu>centro_educativo>centro_educativo',
    to: '/director/expediente-centro/',
    section: 'menucentroeducativo',
    subs: [
      {
        icon: 'iconsminds-museum',
        label: 'menu>centro_educativo>expediente_centro',
        section: 'moduloexpedientecentroeducativo',
        to: '/director/expediente-centro/'
      },
      {
        icon: 'iconsminds-student-male-female',
        label: 'menu>centro_educativo>gestion_grupos',
        section: 'modulogestiongrupos',
        to: '/director/grupos'
      },
      {
        icon: 'iconsminds-building',
        label: 'menu>centro_educativo>buscador_centros',
        section: 'buscadorinstitucion',
        to: '/director/buscador/centro'
      },
      {
        icon: 'iconsminds-notepad',
        label: 'menu>centro_educativo>censo_intermedio',
        section: 'censointermedio',
        to: '/director/censo-intermedio'
      },
      {
        icon: 'iconsminds-notepad',
        label: 'menu>centro_educativo>censo_final',
        section: 'censofinal',
        to: '/director/censo-final'
      }
    ]
  },
  {
    id: 'Supervision Circuital',
    icon: 'iconsminds-column',
    label: 'menu>centro_educativo>supevision_circ',
    section: 'menusupervisioncircuital',
    to: '/director/supervisiones',
    subs: [
      {
        icon: 'icon-Address-Book',
        label: 'menu>centro_educativo>exp_supervision_circuital',
        section: 'expedientesupervision',
        to: '/director/supervisiones/expediente-supervision'
      },
      {
        icon: 'icon-Folder-Search',
        label: 'menu>centro_educativo>buscador_sup_circ',
        section: 'buscadorsupervisiones',
        to: '/director/supervisiones/buscador-supervision'
      }
    ]
  },
  {
    id: 'comunicados',
    icon: 'iconsminds-speach-bubbles',
    label: 'menu>comunicado',
    section: 'menucomunicado',
    to: '/Comunicados'
  },
  {
    id: 'buscadorDireccionesRegionales',
    icon: 'iconsminds-lighthouse',
    label: 'menu>configuracion>direcciones_regionales',
    section: 'menudireccionesregionales', // menudireccionesregionales
    to: '/director/buscador/direcciones',
    subs: [
      {
        icon: 'icon-Address-Book',
        preferSubIcon: true,
        label: 'menu>centro_educativo>busc_direcciones_regionales',
        section: 'expedientedireccionesregionales', // menuexpediente
        to: '/director/expediente-direcciones'
      },
      {
        icon: 'icon-Folder-Search',
        preferSubIcon: true,
        label: 'dir_regionales>titulo',
        section: 'buscadordireccionesregionales',
        to: '/director/buscador/direcciones'
      }
    ]
  },
  {
    id: 'alerta',
    icon: 'iconsminds-megaphone',
    label: 'menu>alerta_temprana>alerta_temprana',
    to: '/director/alerta-temprana',
    section: 'menualertatemprana',
    subs: [
      {
        icon: 'simple-icon-volume-2',
        label: 'menu>alerta_temprana>alerta_estudiante',
        section: 'menualertatemprana',
        to: '/director/alerta-estudiantes'
      }
      
    ]
  },
  {
    id: 'reportes',
    icon: 'iconsminds-notepad',
    label: 'menu>reportes>reportes',
    section: 'menureporte',
    to: '/reportes'
  },

  {
    id: 'usuarios',
    icon: 'iconsminds-male-female',
    label: 'menu>usuarios>usuarios',
    to: '/director/usuarios',
    section: 'menuusuarios',
    subs: [
      {
        icon: 'iconsminds-male-female',
        label: 'menu>usuarios>usuarios',
        to: '/director/usuarios',
        section: 'menuusuarios'
      },  
        {
          icon: 'iconsminds-check',
          label: 'menu>gestionusuarios',
          to: '/view/gestionusuarios',
          section: 'menuusuarios',
        },
        {
          icon: 'iconsminds-check',
          label: 'menu>roles',
          to: '/director/usuarios/roles',
          section: 'menuroles',
        }
    ]
  },
  {
    id: 'configuration',
    icon: 'simple-icon-settings',
    label: 'menu>configuracion>configuracion',
    to: '/director/configuracion',
    section: 'menuconfiguracion',
    subs: [
      {
        icon: 'iconsminds-student-hat',
        label: 'menu>configuracion>ofertas_educativas',
        section: 'ofertaseducativas',
        to: '/director/configuracion/ofertas'
      },
      {
        icon: 'iconsminds-embassy',
        label: 'menu>configuracion>centro_educativo',
        section: 'configbuscadorinstituciones',
        to: '/director/configuracion/centro'
      },
      {
        icon: 'iconsminds-lighthouse',
        label: 'menu>configuracion>direcciones_regionales',
        section: 'direccionesregionales',
        to: '/director/configuracion/direcciones-regionales'
      },
      {
        icon: 'iconsminds-column',
        label: 'menu>configuracion>supervisiones_circuitales',
        section: 'supervisionescircuitales',
        to: '/director/configuracion/supervision-circuital'
      },
      {
        icon: 'iconsminds-calendar-4',
        label: 'menu>configuracion>anio_educativo',
        section: 'anioeducativo',
        to: '/director/configuracion/Año/años-educativos'
      },
      {
        icon: 'iconsminds-calendar-4',
        label: 'menu>configuracion>mallas',
        section: 'modulomallascurriculares',
        to: '/director/configuracion/mallaCurricular'
      },
      {
        icon: 'iconsminds-alarm-clock',
        label: 'menu>configuracion>periodos',
        section: 'menuperiodos',
        to: '/director/configuracion/periodos'
      },
      {
        icon: 'iconsminds-globe-2',
        label: 'menu>configuracion>idioma',
        section: 'modulomallascurriculares',
        to: '/idiomaeditor'
      }
      
    ]
  },
  {
    id: 'ayuda',
    icon: 'simple-icon-question',
    label: 'menu>ayuda>ayuda',
    to: '/director/ayuda',
    section: 'menuayuda'
  }
]

export default data
