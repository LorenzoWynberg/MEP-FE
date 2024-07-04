import React from 'react'
import styled from 'styled-components'
import ReportHeader from '../../_partials/ReportHeader'
import { getYearsOld } from '../../../../../utils/years'
import { useSelector } from 'react-redux'
import moment from 'moment'

const formatter = Intl.DateTimeFormat('es-ES', {
  dateStyle: 'full',
  timeStyle: 'short',
  hour12: true
})
const ReporteRegistroEstudiantes = ({ reportData, innerRef, parameters }) => {
  const state = useSelector<any, any>((store) => {
    return {
      user: store.authUser.authObject.user
    }
  })
  const tableData = React.useMemo(() => {
    const mapeador = (item) => {
      const shortDate = (date) =>
        moment(date, ['YYYYMMDD', 'DD/MM/YYYY', 'MM/DD/YYYY']).format(
          'DD/MM/YYYY'
        )
      return {
        identificacion: item.identificacion,
        tipoIdentificacion: item.tipoIdentificacion,
        nombre: item.nombre,
        primerApellido: item.primerApellido,
        segundoApellido: item.segundoApellido,
        fechaNacimiento: shortDate(item.fechaNacimiento),
        edad: getYearsOld(item.fechaNacimiento),
        genero: item.sexo,
        nacionalidad: item.nacionalidad,
        repitente: item.esRepitente == true ? 'SI' : 'NO',
        refugiado: item.esRefugiado == true ? 'SI' : 'NO',
        discapacidad: !item.discapacidad
          ? 'SIN DISCAPACIDAD'
          : item.discapacidad,
        especialidad: !item.especialidad
          ? 'SIN ESPECIALIDAD'
          : item.especialidad
      }
    }
    const data = reportData.map(mapeador) || []
    return {
      data
    }
  }, [])

  const Row = (key, item) => {
    return (
      <tr key={key}>
        <td>{key + 1}</td>
        <td>{item.identificacion}</td>
        <td>{item.tipoIdentificacion}</td>
        <td>{item.nombre}</td>
        <td>{item.primerApellido}</td>
        <td>{item.segundoApellido}</td>
        <td>{item.fechaNacimiento}</td>
        <td>{item.edad}</td>
        <td>{item.genero}</td>
        <td>{item.nacionalidad}</td>
        <td>{item.repitente}</td>
        <td>{item.refugiado}</td>
        <td>{item.discapacidad}</td>
        <td>{item.especialidad}</td>
      </tr>
    )
  }
  return (
    <div ref={innerRef}>
      <Card>
        <ReportHeader mostrarContactoInstitucion />
        <Seccion style={{ marginTop: '1rem' }}>
          <p>
            {parameters.nivelOfertaId.reportLabel}
            {/* EDUCACIÓN TÉCNICA / TÉCNICO DIURNO – INDUSTRIAL / SIN
						SERVICIO / DÉCIMO AÑO */}
          </p>
          <p>
            <b>Registro de estudiantes matriculados 2022</b>
          </p>
        </Seccion>
        <p>
          <Table>
            <thead>
              <th>N°</th>
              <th>Número de identificación</th>
              <th>Tipo de identificación</th>
              <th>Nombre</th>
              <th>Primer apellido</th>
              <th>Segundo apellido</th>
              <th>Fecha de nacimiento</th>
              <th>Edad</th>
              <th>Identidad de género</th>
              <th>Nacionalidad</th>
              <th>Repitente</th>
              <th>Refugiado</th>
              <th>Discapacidad</th>
              <th>Especialidad</th>
            </thead>
            <tbody>
              {tableData.data.map((item, index) => Row(index, item))}
            </tbody>
          </Table>
        </p>
        <p>
          <Linea />
        </p>
        <Seccion>
          <p>
            Reporte emitido por el usuario: {state.user.userName}, el{' '}
            {formatter.format(new Date(Date.now()))}
          </p>
        </Seccion>
      </Card>
    </div>
  )
}

const Table = styled.div`
  border-collapse: collapse;
  thead {
    font-width: bold;
    text-align: center;
  }
  th {
    border: solid 1px;
    padding: 2px;
  }
  td {
    text-align: center;
    border: solid 1px;
    padding: 2px;
  }
`

const Card = styled.div`
  border-radius: 15px;
  min-width: 100%;
  min-height: 100%;
  border-color: gray;
  background: white;
  padding: 15px;
`
const Linea = styled.hr`
  width: 100%;
  background-color: black;
  height: 1px;
  border: none;
  margin: 0;
`
const Seccion = styled.section`
  text-align: center;
`

export default ReporteRegistroEstudiantes
