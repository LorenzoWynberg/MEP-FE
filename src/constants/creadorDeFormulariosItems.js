import React from 'react'
import NoteAddIcon from '@material-ui/icons/NoteAdd'
import DescriptionIcon from '@material-ui/icons/Description'
import StyleIcon from '@material-ui/icons/Style'

const data = [
  {
    id: 'inicioFormularios',
    icon: () => <><NoteAddIcon fontSize='large' /></>,
    label: 'Crear formulario',
    section: 'menuestudiantes',
    to: '/forms/creator'
  },
  {
    id: 'listaFormularios',
    icon: () => <><DescriptionIcon fontSize='large' /></>,
    label: 'Lista de formularios',
    section: 'menuestudiantes',
    to: '/forms/list'
  },
  {
    id: 'temasFormularios',
    icon: () => <><StyleIcon fontSize='large' /></>,
    label: 'Temas',
    section: 'menuestudiantes',
    to: '/forms/themes'
  }
]

export default data
