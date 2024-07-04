import React from 'react'
import './funcionarios.css'
import TableIntegra from './TableIntegra'

const FuncionariosIntegra = () => {
  const title = [
    'Nombramientos',
    'Identificación',
    'Nombre completo',
    'Clase de puesto',
    'Especialidad',
    'Grupo profesional',
    'Condición',
    'Cantidad de lecciones'
  ]

  const data = [
    {
      btn: '',
      identification: '206570827',
      nombreCompleto: 'Graciela Solís',
      position: ['Clase de puesto 1 ', 'Clase de puesto 2'],
      speciality: ['Especialidad 1 ', 'Especialidad 2'],
      groupProfessional: ['Grupo profesional 1 ', 'Grupo profesional 2'],
      condition: 'Interino',
      cantleccion: '60'
    },
    {
      btn: '',
      identification: '206570828',
      nombreCompleto: 'Marta Delatorre',
      position: ['Clase de puesto 1'],
      speciality: ['Especialidad 2'],
      groupProfessional: ['Grupo profesional 2'],
      condition: 'Con plaza',
      cantleccion: '10'
    }
  ]

  const head = [
    'Administrativos',
    'Administrativos docentes',
    'Propiamente docentes'
  ]

  return (
    <div>
      <TableIntegra title={title} data={data} head={head[0]} />
      <TableIntegra title={title} data={data} head={head[1]} />
      <TableIntegra title={title} data={data} head={head[2]} />
    </div>
  )
}

export default FuncionariosIntegra
