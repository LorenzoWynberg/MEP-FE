import React, { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import { format, parseISO } from 'date-fns'
import { getEstudiantesByNivelOferta } from 'Redux/grupos/actions'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import { Badge } from 'reactstrap'
import { useTranslation } from 'react-i18next'

const EstudiantesNivel = (props) => {
  const { t } = useTranslation()
  const state = useSelector((store: any) => {
    return {
      data: store.grupos.allGroupMembers
    }
  })
  const actions = useActions({
    getEstudiantesByNivelOferta
  })

  useEffect(() => {
    const fetch = async () => {
      await actions.getEstudiantesByNivelOferta(
        props.activeLvl.nivelOfertaId,
         "(1,3)"
      )
    }
    fetch()
  }, [])

  const columns = useMemo(() => {
    return [
      {
        Header: t("buscador_ce>ver_centro>datos_director>identificacion", "Identificación"),
        accessor: 'identificacion',
        label: '',
        column: ''
      },
      {
        Header: t("buscador_ce>ver_centro>datos_director>nombre", "Nombre completo"),
        accessor: 'nombreCompleto',
        label: '',
        column: ''
      },
      {
        Header: t("estudiantes>buscador_per>col_fecha_naci", "Fecha de nacimiento"),
        accessor: 'fechaNacimientoP',
        label: '',
        column: ''
      },
      {
        Header: t("estudiantes>buscador_per>info_gen>nacionalidad", "Nacionalidad"),
        accessor: 'nacionalidad',
        label: '',
        column: ''
      },
      {
        Header: t("estudiantes>matricula_estudiantil>matricular_estudiante>datos_educativos>condicion", "Condición"),
        accessor: 'condicion',
        label: '',
        column: '',
        Cell: ({ cell, row, data }) => {
          const _row = data[row.index]
          const color = { 1: 'success', 3: 'warning', 2: 'danger' }
          return (
            <Badge
              color={`${color[_row.condicionId] || 'success'}`}
              pill
              style={{ color: 'white !important' }}
            >
              {row.original.condicion}
            </Badge>
          )
        }
      }
    ]
  }, [state.data,t])

  return (
    <>
      {/* <h3>Estudiantes matriculados en nivel</h3> */}
      <TableReactImplementation
        orderOptions={[]}
        columns={columns}
        data={state.data.map((el) => {
				  return {
				    ...el,
				    image: el.img,
				    fechaNacimientoP: format(
				      parseISO(el.fechaNacimiento),
				      'dd/MM/yyyy'
				    ),
				    nacionalidad: el.nacionalidades ? el.nacionalidades[0].nacionalidad : ''
				  }
        })}
      />
    </>
  )
}

export default EstudiantesNivel
