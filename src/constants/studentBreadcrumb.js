import React from 'react'
import SearchIcon from '@material-ui/icons/Search'

const data = [
  {
    label: 'estudiantes>expediente>nav>inicio',
    to: '/director/expediente-estudiante/',
    active: false,
    icon: <SearchIcon />
  },
  {
    label: 'estudiantes>expediente>nav>inicio',
    to: '/director/expediente-estudiante/inicio',
    active: false
  },
  {
    label: 'estudiantes>expediente>nav>info_general',
    to: '/director/expediente-estudiante/general',
    active: false
  },
  {
    label: 'estudiantes>expediente>nav>contacto',
    to: '/director/expediente-estudiante/contacto',
    active: false
  },
  {
    label: 'estudiantes>expediente>nav>hogar',
    to: '/director/expediente-estudiante/hogar',
    active: false
  },
  {
    label: 'estudiantes>expediente>nav>beneficios',
    to: '/director/expediente-estudiante/beneficios',
    active: false,
  }, 
  {
    label: 'estudiantes>expediente>nav>apoyos_edu',
    to: '/director/expediente-estudiante/apoyos-educativos',
    active: false
  },
  {
    label: 'estudiantes>expediente>nav>area_curric',
    to: '/director/expediente-estudiante/area-curricular',
    active: false
  },
  {
    label: 'estudiantes>expediente>nav>salud',
    to: '/director/expediente-estudiante/salud',
    active: false
  },
  {
    label: 'estudiantes>expediente>nav>oferta_edu',
    to: '/director/expediente-estudiante/oferta',
    active: false
  },
  // {
  //   label: 'sinirube', //to use IntlMessages
  //   to: '/director/expediente-estudiante/sinirube',
  //   active: false,
  // },
    /* {
    label: 'email-account', //to use IntlMessages
    to: '/director/expediente-estudiante/cuenta-correo',
    active: false,
  }, */
   {
     label: 'estudiantes>expediente>nav>salud>user_account', //to use IntlMessages
     to: '/director/expediente-estudiante/cuenta-usuario',
     active: false,
   },
]

export default data
