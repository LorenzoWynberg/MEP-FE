import React from 'react'
import colors from 'Assets/js/colors'
import styled from 'styled-components'
import { useSelector } from 'react-redux'

const test = [
  {
    nombre: 'Inglés',
    rubricas: [
      {
        nombre: 'Expresión oral',
        indicadores: [
          {
            nombre:
              'Comunica sus ideas con frases sencillas con apoyo de multiples recursos',
            nivel: 'Intermedio',
            descripcion:
              'Reconoce diferentes frases sencillas para comunicarse por medio de multiples recursos',
            observaciones: ''
          },
          {
            nombre:
              'Manifiesta de forma oral sentimientos y emociones por medio de diferentes recursos auditivos y visuales',
            nivel: 'Inicial',
            descripcion:
              'Expresa oraciones simples que le permita comunicarse de forma segura con otras personas',
            observaciones: ''
          },
          {
            nombre:
              'Manifiesta actitudes de seguridad, al comunicarse de forma natural con otras personas',
            nivel: 'Inicial',
            descripcion:
              'Expresa oraciones simples que le permita comunicarse de forma segura con otras personas',
            observaciones: ''
          }
        ]
      }
    ]
  },
  {
    nombre: 'Francés',
    rubricas: [
      {
        nombre: 'Expresión oral',
        indicadores: [
          {
            nombre:
              'Comunica sus ideas con frases sencillas con apoyo de multiples recursos',
            nivel: 'Intermedio',
            descripcion:
              'Reconoce diferentes frases sencillas para comunicarse por medio de multiples recursos',
            observaciones: ''
          },
          {
            nombre:
              'Manifiesta de forma oral sentimientos y emociones por medio de diferentes recursos auditivos y visuales',
            nivel: 'Inicial',
            descripcion:
              'Expresa oraciones simples que le permita comunicarse de forma segura con otras personas',
            observaciones: ''
          },
          {
            nombre:
              'Manifiesta actitudes de seguridad, al comunicarse de forma natural con otras personas',
            nivel: 'Inicial',
            descripcion:
              'Expresa oraciones simples que le permita comunicarse de forma segura con otras personas',
            observaciones: ''
          }
        ]
      }
    ]
  }
]
const LogrosAsignaturas = () => {
  const data = useSelector(
    (store: any) => store.certificaciones.asignaturasLogros
  )

  return (
    <ContentLogros>
      {data.map((asignatura) => {
        return (
          <TableStyled style={{}}>
            <HeaderAsignatura>
              <tr>
                <th colSpan={6} style={{ padding: '10px' }}>
                  ASIGNATURA: {asignatura.asignatura}
                </th>
              </tr>
            </HeaderAsignatura>
            {/* {asignatura.rubricas.map((rubrica) => {
              return ( */}
            <tbody>
              <HeaderIndicador>
                <th colSpan={6} style={{ padding: '10px' }}>
                  {asignatura.rubricas.nombre}
                </th>
              </HeaderIndicador>
              <tr>
                <HeaderColumn>Indicador de aprendizaje esperado</HeaderColumn>
                <NivelColumn>Nivel</NivelColumn>
                <HeaderColumn>Descripción del indicador </HeaderColumn>
                <ObservacionesColumn>Observaciones</ObservacionesColumn>
              </tr>
              {asignatura.rubricas.indicadores.map((indicador) => {
                return (
                  <tr>
                    <td>{indicador.nombre}</td>
                    <td>{indicador.nivel}</td>
                    <td>{indicador.descripcion}</td>
                    <td>{indicador.observaciones}</td>
                  </tr>
                )
              })}
            </tbody>
            {/* ) */}
            {/* })} */}
          </TableStyled>
        )
      })}
    </ContentLogros>
  )
}
const ContentLogros = styled.div`
  position: relative;
  width: 100%;
`
const TableStyled = styled.table`
  width: 100%;
  margin-bottom: 25px;
  border: 1px solid black;
  border-collapse: collapse;
  th,
  td {
    border: 1px solid black;
    border-collapse: collapse;
    padding: 10px;
  }
`
const HeaderAsignatura = styled.thead`
  background: ${colors.primary};
  text-align: center;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  text-transform: uppercase;
`
const HeaderIndicador = styled.tr`
  background: ${colors.opaqueGray};
  text-align: center;
  color: #000;
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
`
const HeaderColumn = styled.th`
  background: ${colors.gray};
  text-align: center;
  color: #000;
`
const NivelColumn = styled(HeaderColumn)`
  min-width: 150px;
  text-align: center;
`
const ObservacionesColumn = styled(HeaderColumn)`
  min-width: 200px;
`
export default LogrosAsignaturas
