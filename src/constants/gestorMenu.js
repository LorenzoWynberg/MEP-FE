const data = [
  {
    id: 'tests',
    icon: 'iconsminds-fire-staion',
    label: 'menu.instituciones',
    to: '/app/admin/instituciones',
    subs: [
      {
        icon: 'iconsminds-building',
        label: 'menu.instituciones',
        to: '/app/admin/instituciones'
      },
      {
        icon: 'iconsminds-compass-1',
        label: 'menu.circuitos',
        to: '/app/admin/circuitos'

      },
      {
        icon: 'iconsminds-map2',
        label: 'menu.regionales',
        to: '/app/admin/regionales'
      }
    ]
  },
  {
    id: 'usuarios',
    icon: 'iconsminds-male-2',
    label: 'menu.usuarios',
    to: '/app/admin/usuarios'
  },
  {
    id: 'reportes',
    icon: 'iconsminds-notepad',
    label: 'menu.reportes',
    to: '/app/admin/reportes'
  }
]

export default data
