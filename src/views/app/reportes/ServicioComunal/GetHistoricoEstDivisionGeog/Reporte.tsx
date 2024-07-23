import React from 'react'
import styled from 'styled-components'
import { TableReactImplementation } from 'Components/TableReactImplementation'

const Reporte = ({ innerRef, reportData, reportParameters }) => {
  const tableMetadata = React.useMemo(() => {
    
    /*
 "annoParticipacion": 0,
    "nombreAreaProyecto": "string",
    "descripcion": "string",
    "nombreProyecto": "string",
    "nombreModalidad": "string",
    "caracteristicas": "string",
    "nombreOrgContraparte": "string",
    "cedulaCount": 0,
    "dimexCount": 0,
    "yisRoCount": 0,
    "discapacidadCount": 0,
    "hombreCount": 0,
    "mujerCount": 0,
    "indigenaCount": 0,
    "refugiadoCount": 0,
    "totalEstudiantes": 0
    */
    const columns = [
      {
        Header: 'Nombre Regional',
        accessor: 'nombreRegional',
        label: '',
        column: ''
      },
      {
        Header: 'Nombre del circuito',
        accessor: 'nombreCircuito',
        label: '',
        column: ''
      },
      {
        Header: 'Nombre Oferta',
        accessor: 'nombreOferta',
        label: '',
        column: ''
      },
      {
        Header: 'Área del proyecto',
        accessor: 'nombreAreaProyecto',
        label: '',
        column: ''
      },
      {
        Header: 'Descripción',
        accessor: 'descripcion',
        label: '',
        column: ''
      },
      {
        Header: 'Nombre del proyecto',
        accessor: 'nombreProyecto',
        label: '',
        column: ''
      },
      {
        Header: 'Nombre de la modalidad',
        accessor: 'nombreModalidad',
        label: '',
        column: ''
      },
      {
        Header: 'Características',
        accessor: 'caracteristicas',
        label: '',
        column: ''
      },
      {
        Header: 'Nombre de la organización contraparte',
        accessor: 'nombreOrgContraparte',
        label: '',
        column: ''
      },
      {
        Header: 'Cantidad de cédulas',
        accessor: 'cedulaCount',
        label: '',
        column: ''
      },
      {
        Header: 'Cantidad de DIMEX',
        accessor: 'dimexCount',
        label: '',
        column: ''
      },
      {
        Header: 'Cantidad de YISRO',
        accessor: 'yisRoCount',
        label: '',
        column: ''
      },
      {
        Header: 'Cantidad de discapacitados',
        accessor: 'discapacidadCount',
        label: '',
        column: ''
      },
      {
        Header: 'Cantidad de hombres',
        accessor: 'hombreCount',
        label: '',
        column: ''
      },
      {
        Header: 'Cantidad de mujeres',
        accessor: 'mujerCount',
        label: '',
        column: ''
      },
      {
        Header: 'Cantidad de indígenas',
        accessor: 'indigenaCount',
        label: '',
        column: ''
      },
      {
        Header: 'Cantidad de refugiados',
        accessor: 'refugiadoCount',
        label: '',
        column: ''
      },
      {
        Header: 'Total de estudiantes',
        accessor: 'totalEstudiantes',
        label: '',
        column: ''
      }
    ]
    const mapeador = (item) => {
      return {
        cantidad: item.cantidad,
        componente: item.aula ? item.aula : '-',
        descripcion: item.descripcion
      }
    }
    const data = reportData ? reportData.map(mapeador) : []
    // console.log(reportParameters)
    return {
      columns,
      data
    }
  }, [])
  return (
    <div ref={innerRef}>
      <Card>
        <h3>Reporte de aulas de centro educativo</h3>
        <p>AÑO EDUCATIVO: 2022</p>
        {/* <p>DIRECCIÓN REGIONAL:{reportParameters.regionalId.label} </p>
        <p>CIRCUITO: {reportParameters.circuitoId.label}</p>
        <p>CENTRO EDUCATIVO: {reportParameters.institucionId.label}</p> */}
        <TableReactImplementation
          avoidSearch
          columns={tableMetadata.columns}
          data={tableMetadata.data}
        />
      </Card>
    </div>
  )
}

const Card = styled.div`
  border-radius: 15px;
  min-width: 100%;
  min-height: 100%;
  border-color: gray;
  background: white;
  padding: 15px;
`

export default Reporte
