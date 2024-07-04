import React from 'react'
import styled from 'styled-components'
import { TableReactImplementation } from 'Components/TableReactImplementation'

const Reporte = ({ reportData, innerRef }) => {
  const tableMetadata = React.useMemo(() => {
    const columns = [
      {
        Header: 'Nivel',
        accessor: 'nivel',
        label: '',
        column: ''
      },
      {
        Header: 'Grupo',
        accessor: 'grupo',
        label: '',
        column: ''
      },
      {
        Header: 'Persona',
        accessor: 'persona',
        label: '',
        column: ''
      },
      {
        Header: 'Tipo de identificación',
        accessor: 'tipoId',
        label: '',
        column: ''
      },
      {
        Header: 'Número de identificación',
        accessor: 'numeroId',
        label: '',
        column: ''
      }
    ]
    /*
		{
			"nombreNivel": "AÑO 1",
			"nombreGrupo": "BI 11-A",
			"nombreEstudiante": "WILFRIDO JIMENEZ LEIVA",
			"tipoIdentificacion": "Cédula de identidad costarricense",
			"identificacion": "603100213",
			"nombreInstitucion": "LICEO DE BAGACES",
			"anioEducativo": "2022"
		} */
    const mapeador = (item) => {
      return {
        nivel: item?.nombreNivel,
        grupo: item?.nombreGrupo,
        persona: item?.nombreEstudiante,
        tipoId: item?.tipoIdentificacion,
        numeroId: item?.identificacion
      }
    }
    const data = reportData ? reportData.map(mapeador) : []
    /* for (let i = 0; i < 10; i++) {
			data.push({
				nivel:'PRIMER AÑO',
				grupo:'1-2',
				persona:'DANNY CHAVARRIA',
				tipoId:'Cédula Nacional',
				numeroId:'20.334.789',
			})
		} */
    return {
      columns,
      data
    }
  }, [])
  return (
    <div ref={innerRef}>
      <Card>
        <h3>LISTADO ESTUDIANTES POR CENTRO EDUCATIVO, NIVEL Y GRUPO</h3>
        <p>AÑO EDUCATIVO: 2022</p>
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
