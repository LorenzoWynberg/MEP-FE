import React, { useMemo, useEffect } from 'react'
import axios from 'axios'
import { Label, Input } from 'reactstrap'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import styled from 'styled-components'

interface IProps {
	fetchAnios: Function
	fetchOfertas: Function
	onChangeAnioSelect: Function
	anios: any
	anioValue: any
	ofertasEducativasCatalog: any
}
const OfertasEducativas: React.FC<IProps> = (props) => {
  const {
    fetchAnios,
    anios,
    anioValue,
    onChangeAnioSelect,
    ofertasEducativasCatalog
  } = props

  useEffect(() => {
    fetchAnios()
  }, [])

  const aniosOptions = useMemo(() => {
    if (anios?.length > 0) {
      const anio = anios[0].nombre
      onChangeAnioSelect({ target: { value: anio } })
    }
    return anios.map((obj, index) => (
      <option key={index}>{obj.nombre}</option>
    ))
  }, [anios])

  const fontBold = (children) => {
    return <div style={{ fontWeight: 'bold' }}>{children}</div>
  }

  const memoizedData = useMemo(() => {
    const columnas = [
      {
        Header: 'Oferta educativa ',
        column: 'ofertaeducativa',
        accessor: 'ofertaeducativa',
        label: ''
      },
      {
        Header: 'Hombres',
        column: 'hombres',
        accessor: 'hombres',
        label: '',
        Cell: ({ cell, row, data }) => {
          const fullRow = data[row.index]
          if (fullRow.key === 'total') {
            return fontBold(cell.value)
          } else return cell.value
        }
      },
      {
        Header: 'Mujeres',
        column: 'mujeres',
        accessor: 'mujeres',
        label: '',
        Cell: ({ cell, row, data }) => {
          const fullRow = data[row.index]
          if (fullRow.key === 'total') {
            return fontBold(cell.value)
          } else return cell.value
        }
      },
      {
        Header: 'Total matrícula',
        column: 'totalMatricula',
        accessor: 'totalMatricula',
        label: '',
        Cell: ({ cell, row, data }) => {
          const fullRow = data[row.index]
          if (fullRow.key === 'total') {
            return fontBold(cell.value)
          } else return cell.value
        }
      }
    ]
    let filas =
			ofertasEducativasCatalog.map((i) => {
			  return {
			    ofertaeducativa: i.nombreOferta,
			    hombres: i.hombres,
			    mujeres: i.mujeres,
			    totalMatricula: i.total
			  }
			}) || []

    const totalMatriculas =
			ofertasEducativasCatalog.reduce((a, b) => {
			  return a + b.total
			}, 0) || 0

    const totalMatriculasHombres =
			ofertasEducativasCatalog.reduce((a, b) => {
			  return a + b.hombres
			}, 0) || 0

    const totalMatriculasMujeres =
			ofertasEducativasCatalog.reduce((a, b) => {
			  return a + b.mujeres
			}, 0) || 0

    filas = [
      ...filas,
      {
        key: 'total',
        ofertaeducativa: '',
        hombres: totalMatriculasHombres,
        mujeres: totalMatriculasMujeres,
        totalMatricula: totalMatriculas
      }
    ]
    return {
      columnas,
      filas,
      totalMatriculas
    }
  }, [ofertasEducativasCatalog])

  return (
    <div>
      <div style={{ marginTop: '1%' }}>
        <h5 style={{ fontWeight: 'bolder' }}>OFERTAS EDUCATIVAS</h5>
        <div
          style={{
					  display: 'flex',
					  justifyContent: 'space-between',
					  alignContent: 'center',
					  alignItems: 'center'
          }}
        >
          <div>
            <Label>Año educativo</Label>
            <Input
              style={{ width: '10rem' }}
              onChange={onChangeAnioSelect}
              type='select'
              placeholder='Selecciona'
            >
              {aniosOptions}
            </Input>
          </div>
          <span style={{ fontWeight: 'bolder' }}>
            Matricula total del centro educativo:{' '}
            {memoizedData.totalMatriculas}
          </span>
        </div>
        <TableReactImplementation
          data={memoizedData.filas}
          handleGetData={() => {}}
          columns={memoizedData.columnas}
          orderOptions={[]}
          avoidSearch
        />
      </div>
    </div>
  )
}

export default OfertasEducativas
