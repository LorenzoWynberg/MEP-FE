import React from 'react'
import styled from 'styled-components'
import { TableReactImplementation } from 'Components/TableReactImplementation'

const Reporte = ({ innerRef, parameters, reportData }) => {
  const metadata = React.useMemo(() => {
    const columns = [
      {
        Header: 'Número de servicio',
        accessor: 'numero',
        label: '',
        column: ''
      },
      {
        Header: 'Servicio',
        accessor: 'servicio',
        label: '',
        column: ''
      },
      {
        Header: 'Tipo de servicio',
        accessor: 'tipoServicio',
        label: '',
        column: ''
      },
      {
        Header: 'Características de servicio',
        accessor: 'caracteristicaServicio',
        label: '',
        column: ''
      },
      {
        Header: 'Velocidad (mbps)',
        accessor: 'velocidad',
        label: '',
        column: ''
      },
      {
        Header: 'Proveedor del servicio',
        accessor: 'proveedorServicio',
        label: '',
        column: ''
      },
      {
        Header: 'Estado',
        accessor: 'estado',
        label: '',
        column: ''
      },
      {
        Header: 'Responsable de pago',
        accessor: 'responsable',
        label: '',
        column: ''
      }
    ]
    const mapeador = (item) => {
      return {
        numero: item.numeroServicio,
        servicio: item.servicio,
        tipoServicio: item.tipoServicio,
        caracteristicaServicio: item.caracteristica,
        velocidad: item.velocidad,
        proveedorServicio: item.proveedor,
        estado: item.estado == '1' ? 'Activo' : 'Inactivo',
        responsable: item.responsable
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
        <h3>Reporte de servicios públicos de centro educativo</h3>
        <p>AÑO EDUCATIVO: 2021</p>
        <p>DIRECCIÓN REGIONAL: {parameters.regionId.label}</p>
        <p>CIRCUITO: {parameters.circuitoId.label}</p>
        <TableReactImplementation
          avoidSearch
          columns={metadata.columns}
          data={metadata.data}
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
