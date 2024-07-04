import React from 'react'
import { BsPlusCircleFill } from 'react-icons/bs'
import styled from 'styled-components'
import Columna from './Columna'
import Fila from './Fila'
import { Th, DefButton, CenterDiv } from './Styles'
import colors from 'Assets/js/colors'
import useGrid from './useGrid'
import { useTranslation } from 'react-i18next'

/*
Contenidos:[
    {
      nombre:"",
      descripcion: "",
      puntos:false,
      columnas: [
        {
          nombre:"",
          color:"",
          puntos:""
        }
      ],
      filas: [
        {celdas: [{
          nombre:"",
          detalle: ""
        }]}
      ]
    }
  ]
*/
const Grid = ({ contenido, contenidoIndex }) => {
  const { t } = useTranslation()
  const { onAddRowEvent, onAddColumnEvent } = useGrid()
  return (
    <>
      <Malla>
        <thead>
          <Th style={{ padding: '20px' }}>
            <CenterDiv>
              <h6>{t('configuracion>mallas_curriculares>indicadores_aprendizaje>ver>fila>indicadores_aprendi', 'Indicador/Contenido/Criterio')}</h6>
            </CenterDiv>
          </Th>
          {contenido.columnas.map((col, index) => <Columna key={index} contenidoIndex={contenidoIndex} columnIndex={index} columna={col} contenido={contenido} />)}
          <Th style={{ padding: '20px' }}>
            <CenterDiv>
              <DefButton style={{ cursor: 'pointer' }} onClick={() => onAddColumnEvent(contenidoIndex)}>
                <BsPlusCircleFill
                  style={{ fontSize: '40px', color: '#fff' }}
                />
              </DefButton>
              <h4 style={{ textAlign: 'center' }}>{t('configuracion>mallas_curriculares>indicadores_aprendizaje>ver>fila>agregar_nivel_aprendi', 'Agregar nivel de aprendizaje')}</h4>
            </CenterDiv>
          </Th>
        </thead>
        <tbody>
          {contenido.filas.map((row, index) => <tr> <Fila key={index} fila={row} contenidoIndex={contenidoIndex} filaIndex={index} /> </tr>)}
        </tbody>
        <tfoot>
          <td style={{ border: 'none' }}>
            <CenterDiv style={{ padding: '15px', color: `${colors.primary}` }}>
              <DefButton style={{ color: `${colors.primary}`, cursor: 'pointer' }} onClick={() => onAddRowEvent(contenidoIndex)}>
                <BsPlusCircleFill
                  style={{
                    fontSize: '20px',
                    color: `${colors.primary}`,
                    marginRight: '5px'
                  }}
                />{' '}
                {t('configuracion>mallas_curriculares>indicadores_aprendizaje>ver>boton>agregar_indicador_aprendi', 'Agregar indicador de aprendizaje')}
              </DefButton>
            </CenterDiv>
          </td>
        </tfoot>
      </Malla>
    </>
  )
}

const Malla = styled.table`
    th, td {
        border:1px solid black;
    }
`

export default Grid
