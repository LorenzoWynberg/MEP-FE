import React, { useState, useEffect } from 'react'
import { Card, CardBody, CardTitle } from 'reactstrap'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import moment from 'moment'

type Leccion = {
    leccionAsignaturaGrupo_Id: number,
    diaSemana: number,
    leccion_id: number,
    nombreLeccion: string,
    nombreAsignatura: string,
    horaInicio: string,
    horaFin: string
}
interface IProp {
    Lecciones?: Leccion[]
}

type Fila = {
    leccion: number,
    horario: string,
    lunes: string,
    martes:string,
    miercoles:string,
    jueves:string,
    viernes:string,
}

const Horario:React.FC<IProp> = (prop) => {
  const [state, setState] = useState<Fila[]>([])
  const columnas = [
    'Leccion',
    'Horario',
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes'
  ]
  const filas = [
    {
      leccion: 1,
      horario: '8:10 - 8:50',
      lunes: 'Matematica',
      martes: 'Educacion civica',
      miercoles: 'Matematicas',
      jueves: 'Ciencias',
      viernes: 'Ingles'
    },
    {
      leccion: 2,
      horario: '8:10 - 8:50',
      lunes: 'Matematica',
      martes: 'Educacion civica',
      miercoles: 'Matematicas',
      jueves: 'Ciencias',
      viernes: 'Ingles'
    },
    {
      leccion: 3,
      horario: '8:10 - 8:50',
      lunes: 'Matematica',
      martes: 'Educacion civica',
      miercoles: 'Matematicas',
      jueves: 'Ciencias',
      viernes: 'Ingles'
    },
    {
      leccion: 4,
      horario: '8:10 - 8:50',
      lunes: 'Matematica',
      martes: 'Educacion civica',
      miercoles: 'Matematicas',
      jueves: 'Ciencias',
      viernes: 'Ingles'
    },
    {
      leccion: 0,
      horario: '8:10 - 8:50',
      lunes: '',
      martes: '',
      miercoles: 'Receso',
      jueves: '',
      viernes: ''
    },
    {
      leccion: 5,
      horario: '8:10 - 8:50',
      lunes: 'Matematica',
      martes: 'Educacion civica',
      miercoles: 'Matematicas',
      jueves: 'Ciencias',
      viernes: 'Ingles'
    },
    {
      leccion: 6,
      horario: '8:10 - 8:50',
      lunes: 'Matematica',
      martes: 'Educacion civica',
      miercoles: 'Matematicas',
      jueves: 'Ciencias',
      viernes: 'Ingles'
    },
    {
      leccion: 7,
      horario: '8:10 - 8:50',
      lunes: 'Matematica',
      martes: 'Educacion civica',
      miercoles: 'Matematicas',
      jueves: 'Ciencias',
      viernes: 'Ingles'
    },
    {
      leccion: 8,
      horario: '8:10 - 8:50',
      lunes: 'Matematica',
      martes: 'Educacion civica',
      miercoles: 'Matematicas',
      jueves: 'Ciencias',
      viernes: 'Ingles'
    },
    {
      leccion: 9,
      horario: '8:10 - 8:50',
      lunes: 'Matematica',
      martes: 'Educacion civica',
      miercoles: 'Matematicas',
      jueves: 'Ciencias',
      viernes: 'Ingles'
    }
  ]
  const reduxState = useSelector<any, any>(store => {
    return {
      horario: store.VistasUsuarios.horario
    }
  })
  /*
    {
        "leccion": 1,
        "horario": "8:10 - 8:50",
        "lunes": "Matematica",
        "martes": "Educacion civica",
        "miercoles": "Matematicas",
        "jueves": "Ciencias",
        "viernes": "Ingles"
    } */
  /*
        {
            "leccionAsignaturaGrupo_Id": 0,
            "diaSemana": 1,
            "leccion_id": 0,
            "nombreLeccion": "Lección 1",
            "nombreAsignatura": "AGRICULTURA SOSTENIBLE",
            "horaInicio": "2021-12-28T08:00:00",
            "horaFin": "2021-12-28T08:40:00"
        }
    */
  const buildEstado = (response) => {
    const estado = []
    for (let i = 1; i < 7; i++) {
      estado.push({
        leccion: 'Lección ' + i,
        horario: null,
        lunes: null,
        martes: null,
        miercoles: null,
        jueves: null,
        viernes: null
      })
    }

    response.map(item => {
      const horaInicio = moment(item.horaInicio).format('hh:mm a')
      const horaFin = moment(item.horaFin).format('hh:mm a')
      const index = estado.findIndex(i => i.leccion == item.nombreLeccion)
      const keys = Object.keys(estado[index])
      estado[index].horario = horaInicio + ' - ' + horaFin
      estado[index][keys[item.diaSemana + 1]] = item.nombreAsignatura
    })

    setState(estado)
  }
  useEffect(() => {
    if (!prop.Lecciones || !Array.isArray(prop.Lecciones)) return

    buildEstado(prop.Lecciones)
  }, [prop.Lecciones])

  useEffect(() => {
    if (!reduxState.horario || !Array.isArray(reduxState.horario)) return

    buildEstado(reduxState.horario)
  }, [reduxState.horario])

  return (
    <>
      <h2>Horarios</h2>
      <Card>
        <CardBody>
          <CardTitle>Horario por estudiante</CardTitle>
          <Table>
            <thead>
              {columnas.map((item, index) => (
                <th key={index}>{item}</th>
              ))}
            </thead>
            <tbody>
              {state?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.leccion}</td>
                    <td>{item.horario}</td>
                    <td>{item.lunes}</td>
                    <td>{item.martes}</td>
                    <td>{item.miercoles}</td>
                    <td>{item.jueves}</td>
                    <td>{item.viernes}</td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </>
  )
}

const borderColor = '#cdcdcd'
const primaryColor = '#145388'

const Table = styled.table`
    width: 100%;
    border-collapse: separate;
    border-spacing: 0px;
    text-align: center;

    tbody tr {
        color: black;
        border: 1px solid ${borderColor};
        &:last-child td:first-child {
            border-bottom-left-radius: 10px;
        }
        &:last-child td:last-child {
            border-bottom-right-radius: 10px;
        }
        /*&:nth-child(5) {
            background-color: ${primaryColor};
            color: white;
        }*/
        td {
            padding: 0.5rem;
            border-right: 1px solid ${borderColor};
            border-left: 1px solid ${borderColor};
            border-bottom: 1px solid ${borderColor};
        }
    }
    thead th {
        color: white;
        border: solid 1px ${borderColor};
        padding: 0.5rem;
        background: ${primaryColor};
        &:last-child {
            border: 1px solid ${borderColor};
            border-radius: 0 10px 0 0;
            border-radius: 0 10px 0 0;
        }
        &:first-child {
            border: 1px solid ${borderColor};
            border-radius: 10px 0 0 0;
        }
    }
`

export default Horario
