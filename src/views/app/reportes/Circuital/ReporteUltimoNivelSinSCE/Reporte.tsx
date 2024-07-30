import React from 'react'
import styled from 'styled-components'
import { TableReactImplementation } from 'Components/TableReactImplementation'

const Reporte = ({ reportData, innerRef, loader = false }) => {
  const tableMetadata = React.useMemo(() => {
    const columns = [
      {
        Header: 'ID',
        accessor: 'identificacion',
        label: '',
        column: ''
      },
      {
        Header: 'Nombre',
        accessor: 'nombreEstudiante',
        label: '',
        column: ''
      },
      {
        Header: 'Nivel',
        accessor: 'nombreNivel',
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
        <h3>Resumen de cantidad de estudiantes de último nivel que no han concluido el Servicio Comunal Estudiantil</h3>
        {/* <p>AÑO EDUCATIVO: 2022</p> */}
        {/* <p>DIRECCION REGIONAL: ALAJUELA</p>
				<p>CIRCUITO: 01</p>
				<p>INSTITUCION: 6800 - BILINGUE LLAMA DEL BOSQUE</p> */}
        {
            !loader && (
              <TableReactImplementation
                avoidSearch
                columns={tableMetadata.columns}
                data={tableMetadata.data}
              />
            )
          }
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
