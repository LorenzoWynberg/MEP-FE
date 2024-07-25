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
        <h3>Reporte Historico Servicio Comunitario</h3>
        <p>AÑO EDUCATIVO: {new Date().getFullYear()}</p>
        {/* <p>DIRECCIÓN REGIONAL:{reportParameters.regionalId.label} </p>
        <p>CIRCUITO: {reportParameters.circuitoId.label}</p>
        <p>CENTRO EDUCATIVO: {reportParameters.institucionId.label}</p> */}
        <TableReactImplementation 
          columns={tableMetadata.columns}
          data={reportData}
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
