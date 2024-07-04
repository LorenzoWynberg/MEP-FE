import React from 'react'
import styled from 'styled-components'
import { TableReactImplementation } from 'Components/TableReactImplementation'

const Reporte = ({ innerRef, reportData, reportParameters }) => {
  const tableMetadata = React.useMemo(() => {
    const columns = [
      {
        Header: 'Cantidad',
        accessor: 'cantidad',
        label: '',
        column: ''
      },
      {
        Header: 'Componente',
        accessor: 'componente',
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
        <p>DIRECCIÓN REGIONAL:{reportParameters.regionalId.label} </p>
        <p>CIRCUITO: {reportParameters.circuitoId.label}</p>
        <p>CENTRO EDUCATIVO: {reportParameters.institucionId.label}</p>
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
