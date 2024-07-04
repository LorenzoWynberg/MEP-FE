import React from 'react'
import styled from 'styled-components'
import { TableReactImplementation } from 'Components/TableReactImplementation'

const Reporte = ({ reportData, parameters, innerRef }) => {
  const tableMetadata = React.useMemo(() => {
    const columns = [
      {
        Header: 'Centro educativo',
        accessor: 'institucion',
        label: '',
        column: ''
      },
      {
        Header: 'Tipo de dirección',
        accessor: 'tipoDireccion',
        label: '',
        column: ''
      },
      {
        Header: 'Oferta Educativa',
        accessor: 'ofertaEducativa',
        label: '',
        column: ''
      },
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

    const mapear = (item) => {
      return {
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
    const data = reportData ? reportData.map(mapear) : []

    return {
      columns,
      data
    }
  }, [reportData])
  return (
    <div ref={innerRef}>
      <Card>
        <h3>Reporte de matrícula</h3>
        <p>AÑO EDUCATIVO: 2022</p>
        <p>DIRECCIÓN REGIONAL: {parameters.regionId.label}</p>
        <p>CIRCUITO: {parameters.circuitoId.label}</p>
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
