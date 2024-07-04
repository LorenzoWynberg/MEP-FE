import React from 'react'
import styled from 'styled-components'
import { TableReactImplementation } from 'Components/TableReactImplementation'

const Reporte = ({ reportData, innerRef }) => {
  const tableMetadata = React.useMemo(() => {
    const columns = [
      {
        Header: 'Modalidad',
        accessor: 'modalidad',
        label: '',
        column: ''
      },
      {
        Header: 'Nivel / Especialidades',
        accessor: 'especialidades',
        label: '',
        column: ''
      },
      {
        Header: 'Hombres',
        accessor: 'hombres',
        label: '',
        column: ''
      },
      {
        Header: 'Mujeres',
        accessor: 'mujeres',
        label: '',
        column: ''
      },
      {
        Header: 'Total',
        accessor: 'total',
        label: '',
        column: ''
      }
    ]
    const mapper = (item) => {
      return {
        ...item,
        institucion: item.institucion,
        tipoDireccion: item.tipoDireccion,
        ofertaEducativa: item.ofertaEducativa,
        modalidad: item.modalidad,
        especialidades: item.niveloEspecialidades,
        hombres: item.hombres,
        mujeres: item.mujeres,
        total: item.total
      }
    }
    const data = reportData ? reportData.map(mapper) : []
    return {
      columns,
      data
    }
  }, [reportData])
  return (
    <div ref={innerRef}>
      <Card>
        <h3>Reporte de matrícula actual</h3>
        <p>AÑO EDUCATIVO: 2021</p>
        {/* <p>DIRECCION REGIONAL: ALAJUELA</p>
				<p>CIRCUITO: 01</p>
				<p>INSTITUCION: 6800 - BILINGUE LLAMA DEL BOSQUE</p> */}
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
