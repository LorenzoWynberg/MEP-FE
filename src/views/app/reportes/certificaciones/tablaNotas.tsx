import React from 'react'
import colors from 'Assets/js/colors'
import styled from 'styled-components'
import { meanBy } from 'lodash'
import { NumberAsString } from 'Utils/convertNumberToLetter.ts'
import moment from 'moment'
import 'moment/locale/es'
import { useSelector } from 'react-redux'

const TablaNotas = (props) => {
  const data = useSelector(
    (store: any) => store.certificaciones.asignaturasNotas
  )

  return (
    <ContentLogros>
      <div style={{ margin: '20px 0', fontSize: '14px' }}>
        Quien suscribe Directora en calidad de director/a del{' '}
        {props.institucion.nombre} código presupuestario{' '}
        {props.institucion.codigoPresupuestario}, hace constar que:{' '}
        {props.student.nombre} Cédula {props.student.identificacion} cursó y
        aprobó el {data[0]?.Nivel} de Educación Diversificada en el curso
        lectivo {data[0]?.CursoLectivo}. En correspondencia con las normas de
        promoción y repitencia vigentes, y de acuerdo a los registros del
        centro educativo obtiene las siguientes calificaciones
      </div>
      <TableStyled style={{ border: 'none' }}>
        <thead>
          <tr>
            <th style={{ border: 'none' }} />
            {!!data.length &&
              data[0].Promedios.map((e) => {
                return (
                  <SubHeaderColumnUpperCase>
                    {e.nombre}
                  </SubHeaderColumnUpperCase>
                )
              })}

            <th style={{ border: 'none' }} />
            <SubHeaderColumn colSpan={2}>Convocatoria</SubHeaderColumn>
            <th style={{ border: 'none' }} />
          </tr>

          <tr>
            <HeaderColumn>Asignatura</HeaderColumn>
            {data[0]?.Promedios.map((e) => {
              return <NivelColumnCenter>Promedio</NivelColumnCenter>
            })}
            <NivelColumnCenter>Promedio anual</NivelColumnCenter>
            <NivelColumnCenter>I</NivelColumnCenter>
            <NivelColumnCenter>II</NivelColumnCenter>
            <HeaderColumn>Condición</HeaderColumn>
          </tr>
        </thead>
        <tbody>
          {data.length
            ? (
                data.map((asignatura) => {
                  const average = meanBy(asignatura.Promedios, (e: any) => e.promedio)
                  return (
                    <tr>
                      <td>{asignatura.Asignatura}</td>
                      {asignatura.Promedios.map((periodo) => {
                        return (
                          <td style={{ textAlign: 'center' }}>
                            {periodo.promedio}
                          </td>
                        )
                      })}
                      <td style={{ textAlign: 'center' }}>{average}</td>
                      <td />
                      <td />
                      <td>
                        {average >= asignatura.notadepromocion
                          ? 'Aprobado'
                          : 'Reprobado'}
                      </td>
                    </tr>
                  )
                })
              )
            : (
              <td>No se encontraron notas registradas </td>
              )}
        </tbody>
      </TableStyled>

      <div style={{ margin: '20px 0', fontSize: '14px' }}>
        Es conforme dada en las oficinas del {props.institucion?.nombre}, a
        solicitud de la persona interesada, para efectos de trámite personal. El
        suscrito supervisor de centros educativos del{' '}
        {props.institucion?.circuito[0].nombre} de{' '}
        {props.institucion?.provincia}, avala que la firma corresponde a la
        director"a" del centro educativo. Dada en la cuidad de{' '}
        {props.institucion?.poblado} de {props.institucion?.provincia} a los{' '}
        {NumberAsString(moment().locale('es').format('D'))} días del mes de{' '}
        {moment().locale('es').format('MMMM')} del año{' '}
        {NumberAsString(moment().locale('es').format('YYYY'))}
      </div>
      <LastLine>
        ************************************* Última Línea
        *************************************
      </LastLine>
      <ContentDirector>
        <h6>Nombre directora</h6>
        <h6>props.institucion.nombre</h6>
      </ContentDirector>
    </ContentLogros>
  )
}
TablaNotas.defaultProps = {
  institucion: {},
  student: {}
}
const ContentDirector = styled.div``
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
const SubHeaderColumn = styled.th`
  background: ${colors.opaqueGray};
  color: #000;
  text-align: center;
  text-transform: uppercase;
`
const SubHeaderColumnUpperCase = styled(SubHeaderColumn)`
  text-transform: uppercase;
`
const HeaderColumn = styled.th`
  background: ${colors.gray};
  color: #000;
`
const NivelColumnCenter = styled(HeaderColumn)`
  text-align: center;
`
const LastLine = styled.div`
  text-align: center;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 30px;
`

export default TablaNotas
