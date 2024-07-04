import React from 'react'
import styled from 'styled-components'
import { TableReactImplementation } from 'Components/TableReactImplementation'

const Reporte = ({ innerRef, reportData, parameters }) => {
  const tableMetadata = React.useMemo(() => {
    const columns = [
      {
        Header: 'Características de acceso al terreno',
        accessor: 'nombre',
        label: '',
        column: ''
      },
      {
        Header: 'Descripción',
        accessor: 'descripcion',
        label: '',
        column: ''
      }
    ]
    const data = reportData.caracteristicasTerreno ? reportData.caracteristicasTerreno : []
    /* for (let i = 0; i < 2; i++) {
      data.push({
        caracteristica: 'TERRESTRE (PAVIMENTADO)',
        descripcion: 'Cuando hay carretera estable y pavimentada',
      })
    } */
    return {
      columns,
      data
    }
  }, [reportData.caracteristicasTerreno])

  const tableMetadata2 = React.useMemo(() => {
    const columns = [
      {
        Header: 'Afectaciones al terreno',
        accessor: 'nombre',
        label: '',
        column: ''
      },
      {
        Header: 'Descripción',
        accessor: 'descripcion',
        label: '',
        column: ''
      }
    ]

    const data = reportData.afectacionesTerreno ? reportData.afectacionesTerreno : []
    /* for (let i = 0; i < 2; i++) {
      data.push({
        afectacion: 'RIO O QUEBRADA',
        descripcion:
          'En el terreno o muy cerca hay presencia de ríos o quebradas',
      })
    } */
    return {
      columns,
      data
    }
  }, [reportData.afectacionesTerreno])

  return (
    <div ref={innerRef}>
      <Card>
        <h3>Reporte de información de acceso a centro educativo</h3>
        <p>AÑO EDUCATIVO: 2022</p>
        <p>DIRECCIÓN REGIONAL: {parameters.regionId.label}</p>
        <p>CIRCUITO: {parameters.circuitoId.label}</p>
        <p>CENTRO EDUCATIVO: {parameters.institucionId.label}</p>
        <Container>
          <div>
            <span>Características de acceso al terreno</span>
            <TableReactImplementation
              avoidSearch
              columns={tableMetadata.columns}
              data={tableMetadata.data}
            />
          </div>
          <div>
            <span>Otras afectaciones al terreno</span>
            <TableReactImplementation
              avoidSearch
              columns={tableMetadata2.columns}
              data={tableMetadata2.data}
            />
          </div>
        </Container>
      </Card>
    </div>
  )
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`

const Card = styled.div`
  border-radius: 15px;
  min-width: 100%;
  min-height: 100%;
  border-color: gray;
  background: white;
  padding: 15px;
`

export default Reporte
