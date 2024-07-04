import React, { useMemo } from 'react'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import { IoEyeSharp } from 'react-icons/io5'
import { HiDocumentSearch } from 'react-icons/hi'
import { Tooltip } from '@material-ui/core'
import { useSelector } from 'react-redux'

interface ITablaProp {
  rows:any
  setShowModal?:any
}

export const TablaRubricaAprendizaje: React.FC<ITablaProp> = (props) => {
  const { rows, setShowModal } = props

  const state = useSelector((store:any) => {
    return {
      institution: store.authUser.currentInstitution,
      calificaciones: store.VistasUsuarios.calificaciones,
      info_malla: store.VistasUsuarios.info_malla
    }
  })

  const getMallaAsignaturaInfo = (idMalla) => {
    if (!state.info_malla) return

    return state.info_malla.find(item => item.id === idMalla)
  }

  const tableMetadata = useMemo(() => {
    const columns = [
      {
        Header: ' ',
        id: 'expander',
        Cell: ({ row }) =>
          // Use the row.canExpand and row.getToggleRowExpandedProps prop getter
          // to build the toggle for expanding a row
          row.canExpand ? (
            <span
              {...row.getToggleRowExpandedProps({
                style: {
                  // We can even use the row.depth property
                  // and paddingLeft to indicate the depth
                  // of the row
                  paddingLeft: `${row.depth * 2}rem`
                }
              })}
            >
              {row.isExpanded
                ? (
                  <Tooltip title='Ver indicadores del aprendizaje esperado'>
                    <img
                      src='/assets/img/desplegable.svg'
                      alt=''
                      style={{ transform: 'rotate(-90deg)' }}
                    />
                  </Tooltip>
                  )
                : (
                  <Tooltip title='Ver indicadores del aprendizaje esperado'>
                    <img
                      src='/assets/img/desplegable.svg'
                      alt=''
                      style={{ transform: 'rotate(180deg)' }}
                    />
                  </Tooltip>
                  )}
            </span>
          ) : null
      },
      {
        Header: 'Contenido',
        accessor: 'contenido',
        id: 0,
        Cell: ({ value }) => <div>{value || <span> Contenido </span>}</div>
      },
      {
        Header: 'Nivel',
        id: 1,
        accessor: 'nivel',
        Cell: ({ value }) => <div>{value}</div>
      },
      {
        Header: 'Rúbrica',
        id: 2,
        Cell: ({ value }) => (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
              color: 'grey',
              fontSize: '25px',
              cursor: 'pointer'
            }}
          >
            <IoEyeSharp onClick={(e) => setShowModal ? setShowModal() : e.preventDefault()} />
          </div>
        )
      },
      {
        Header: 'Observaciones',
        id: 3,
        Cell: ({ value }) => (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
              color: 'grey',
              fontSize: '25px',
              cursor: 'pointer'
            }}
            onClick={setShowModal}
          >
            <HiDocumentSearch />
          </div>
        )
      }
    ]
    return {
      columns,
      listData: rows
    }
  }, [rows])

  return (
    <TableReactImplementation
      useExpanded
      columns={tableMetadata.columns}
      data={tableMetadata.listData}
      avoidFilter
      avoidCss
      avoidSearch
    />
  )
}

export const TablaComponenteCalificacion:React.FC<ITablaProp> = (props) => {
  const { rows, setShowModal } = props
  console.log(rows)
  const state = useSelector((store:any) => {
    return {
      institution: store.authUser.currentInstitution,
      calificaciones: store.VistasUsuarios.calificaciones,
      info_malla: store.VistasUsuarios.info_malla
    }
  })

  const getMallaAsignaturaInfo = (idMalla) => {
    if (!state.info_malla) return

    return state.info_malla.find(item => item.id === idMalla)
  }

  const tableMetadata = useMemo(() => {
    const columns = [
      {
        Header: ' ',
        id: 'expander',
        Cell: ({ row }) => {
          // Use the row.canExpand and row.getToggleRowExpandedProps prop getter
          // to build the toggle for expanding a row
          return row.canExpand ? (
            <span
              {...row.getToggleRowExpandedProps({
                style: {
                  // We can even use the row.depth property
                  // and paddingLeft to indicate the depth
                  // of the row
                  paddingLeft: `${row.depth * 2}rem`
                }
              })}
            >
              {row.isExpanded
                ? (
                  <Tooltip title='Ver desglose'>
                    <img
                      src='/assets/img/desplegable.svg'
                      alt=''
                      style={{ transform: 'rotate(-90deg)' }}
                    />
                  </Tooltip>
                  )
                : (
                  <Tooltip title='Ver desglose'>
                    <img
                      src='/assets/img/desplegable.svg'
                      alt=''
                      style={{ transform: 'rotate(180deg)' }}
                    />
                  </Tooltip>
                  )}
            </span>
          ) : null
        }
      },
      {
        Header: 'Componente',
        accessor: 'nombre',
        id: 0,
        Cell: ({ value }) => {
          // const fullRow = data[row.index]

          return <div>{value}</div>
        }
        // Cell: ({ value }) => <div>{getMallaAsignaturaInfo(value)?.actividadesEvaluacion}</div>,
      },
      {
        Header: 'Puntos',
        id: 1,
        accessor: 'puntos',
        Cell: ({ value }) => {
          // const fullRow = data[row.index]

          return <div>{value || ' - '}</div>
        }
      },,
      {
        Header: 'Porcentaje',
        id: 2,
        accessor: 'valor',
        Cell: ({ value }) => {
          // const fullRow = data[row.index]

          return <div>{value}</div>
        }
      },
      {
        Header: 'Rúbrica',
        accessor: 'rubricaAprendizaje',
        Cell: ({ value }) => (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
              color: 'grey',
              fontSize: '25px',
              cursor: 'pointer'
            }}
          >
            <IoEyeSharp />
          </div>
        )
      },
      {
        Header: 'Observaciones',
        id: 3,
        Cell: ({ value }) => (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
              color: 'grey',
              fontSize: '25px',
              cursor: 'pointer'
            }}
            onClick={setShowModal}
          >
            <HiDocumentSearch />
          </div>
        )
      }
    ]
    return {
      columns,
      listData: rows
    }
  }, [rows])
  return (
    <TableReactImplementation
      useExpanded
      columns={tableMetadata.columns}
      data={tableMetadata.listData}
      avoidFilter
      avoidCss
      avoidSearch
    />
  )
}
