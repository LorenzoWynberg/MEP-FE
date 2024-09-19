const data = [
  {
    id: 'tests',
    icon: 'iconsminds-fire-staion',
    label: 'menu>centro_educativo>centro_educativo',
    to: '/admin/instituciones',
    section: 'menuadministrador',
    subs: [
      {
        icon: 'iconsminds-the-white-house',
        label: 'menu>centro_educativo>centro_educativo',
        section: 'menuadministrador',
        to: '/admin/instituciones'
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
      },
      {
        icon: 'iconsminds-compass-1',
        label: 'menu>centro_educativo>supevision_circ',
        section: 'menuadministrador',
        to: '/admin/circuitos'

      },
      {
        icon: 'iconsminds-map2',
        label: 'menu>configuracion>direcciones_regionales',
        section: 'menuadministrador',
        to: '/admin/regionales'
      }
    ]
  },
  {
    id: 'periodos',
    icon: 'simple-icon-calendar',
    label: 'menu>configuracion>periodos',
    section: 'menuadministrador',
    to: '/admin/periodos'
  },
  {
    id: 'usuarios',
    icon: 'iconsminds-male-2',
    label: 'menu>usuarios>usuarios',
    section: 'menuadministrador',
    to: '/admin/usuarios',
    subs: [
      {
        icon: 'iconsminds-business-man-woman',
        label: 'menu>administradores-mep',
        section: 'menuadministrador',
        to: '/admin/usuarios'
      },
      {
        icon: 'simple-icon-user-following',
        label: 'menu>gestores-mep',
        section: 'menuadministrador',
        to: '/admin/usuarios'

      },
      {
        icon: 'iconsminds-suitcase',
        label: 'menu>directores-regionales',
        to: '/admin/usuarios'
      },
      {
        icon: 'simple-icon-magnifier',
        label: 'menu>supervisores-circuitos',
        section: 'menuadministrador',
        to: '/admin/usuarios'
      },
      {
        icon: 'simple-icon-key',
        label: 'menu>directores-centro',
        section: 'menuadministrador',
        to: '/admin/usuarios'
      },
      {
        icon: 'simple-icon-envelope-open',
        label: 'menu>invitaciones',
        section: 'menuadministrador',
        to: '/admin/invitaciones'
      }
    ]
  },
  {
    id: 'reportes',
    icon: 'iconsminds-notepad',
    label: 'menu>reportes',
    section: 'menuadministrador',
    to: '/admin/reportes'
  },
  {
    id: 'alerta',
    icon: 'iconsminds-megaphone',
    label: 'menu>alerta_temprana>alerta_temprana',
    section: 'menuadministrador',
    to: '/admin/alerta-temprana',
    subs: [
      {
        icon: 'simple-icon-pie-chart',
        label: 'menu>alerta-estadisticas',
        section: 'menuadministrador',
        to: '/admin/alerta-temprana'
      },
      {
        icon: 'simple-icon-book-open',
        label: 'menu>alerta-catalogo',
        section: 'menuadministrador',
        to: '/admin/alerta-catalogo'
      },
      {
        icon: 'simple-icon-volume-2',
        label: 'menu>alerta_temprana>alerta_estudiante',
        section: 'menuadministrador',
        to: '/admin/alerta-estudiantes'
      },
      {
        icon: 'iconsminds-idea-2',
        label: 'menu>activar-alerta',
        section: 'menuadministrador',
        to: '/admin/activar-alerta'
      },
      {
        icon: 'iconsminds-volume-up',
        label: 'menu>alerta-solicitud',
        section: 'menuadministrador',
        to: '/admin/alerta-solicitudes'
      },
      {
        icon: 'iconsminds-footprint',
        label: 'menu>alertas-configuracion',
        section: 'menuadministrador',
        to: '/admin/alerta-configuracion'
      }
    ]
  },
  {
    id: 'configuracion',
    icon: 'iconsminds-gears',
    label: 'menu>configuracion>configuracion',
    section: 'menuadministrador',
    to: '/admin/configuracion',
    subs: [
      {
        icon: 'iconsminds-building',
        label: 'menu>configuracion>especialidades',
        section: 'menuadministrador',
        to: '/admin/configuracion/especialidades'
      },
      {
        icon: 'iconsminds-venn-diagram',
        label: 'menu>configuracion>ofertas_educativas',
        section: 'menuadministrador',
        to: '/admin/configuracion/ofertas'
      },
      {
        id: 'modalities',
        icon: 'iconsminds-box-with-folders',
        label: 'menu>configuracion>modalidades',
        section: 'menuadministrador',
        to: '/admin/configuracion/modalidades'
      },
      {
        icon: 'iconsminds-building',
        label: 'menu>configuracion>niveles',
        section: 'menuadministrador',
        to: '/admin/configuracion/niveles'
      },
      {
        icon: 'iconsminds-folders',
        label: 'menu>configuracion>gruposNiveles',
        section: 'menuadministrador',
        to: '/admin/configuracion/gruposNiveles'
      },
      {
        icon: 'iconsminds-building',
        label: 'menu>configuracion>servicios',
        section: 'menuadministrador',
        to: '/admin/configuracion/servicios'
      },
      {
        icon: 'simple-icon-book-open',
        label: 'menu>configuracion>agrupaciones',
        section: 'menuadministrador',
        to: '/admin/configuracion/agrupaciones'
      },
     /*  {
        icon: 'simple-icon-book-open',
        label: 'menu>configuracion>gestorCatalogo',
        //section: 'menuadministrador',
        section: 'main',
        to: '/admin/GestorCatalogos/main'
      } */
    ]
  }
]

export default data
