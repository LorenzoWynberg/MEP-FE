import React, { useState, useEffect } from 'react'
import Table from 'Components/Table-filter/Table'
import { Card, CardTitle, CardBody } from 'reactstrap'
import { SearchComp } from '../../../../Componentes'
import Observaciones from './modals/observaciones'
import { MdOutgoingMail } from 'react-icons/md'
import { AiFillEye } from 'react-icons/ai'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import { setIncidenciasEstudiante } from '../../../../../../../redux/VistasUsuarios/actions'
import moment from 'moment'

const Conducta = () => {
  const [openModal, setOpenModal] = useState<'' | 'see-obs' | ''>('')
  const [listData, setListData] = useState([])
  const toggleModal = (type: '' | 'see-obs') => {
    if (type !== '' && type === openModal) {
      setOpenModal('')
    } else {
      setOpenModal(type)
    }
  }

  const actions = useActions({
    setIncidenciasEstudiante
  })
  const state = useSelector<any, any>((store) => {
    return {
      institution: store.authUser.currentInstitution,
      incidencias: store.VistasUsuarios.incidencias,
      estudianteSeleccionado: store.VistasUsuarios.estudianteSeleccionado
    }
  })

  const handleLoadIncidencias = async () => {
    if (!state.estudianteSeleccionado) return
    if (!state.estudianteSeleccionado?.academiaSeleccionada) return
    await actions.setIncidenciasEstudiante(state.estudianteSeleccionado.id, state.estudianteSeleccionado?.academiaSeleccionada.institucionId)
  }

  useEffect(() => {
    handleLoadIncidencias()
  }, [])

  useEffect(() => {
    if (state.incidencias) {
      setListData(state.incidencias)
    }
  }, [state.incidencias])

  const tableProps = React.useMemo(() => {
    const customCell = (value: any) => {
      return <span style={{ cursor: 'pointer' }} onClick={() => toggleModal('see-obs')}>{value}</span>
    }

    const columns = [
      {
        Header: ' ',
        id: 1,
        width: '10px',
        Cell: ({ value }) => <MdOutgoingMail color='#145388' size='1.5rem' />
      },
      {
        Header: 'Fecha',
        accessor: 'fechaRatificacion',
        Cell: ({ value }) => customCell(moment(value).format('DD/MM/yyyy'))
      },
      {
        Header: 'Tipo de Falta',
        accessor: 'nombreIncidencia',
        Cell: ({ value }) => <Span isWarning={value.toUpperCase() === 'GRAVE' || value.toUpperCase() === 'GRAVÍSIMA'}>{customCell(value.toUpperCase())}</Span>
      },
      {
        Header: 'Tipo de Incumplimiento',
        accessor: 'tipoIncumplimiento',
        Cell: ({ value }) => customCell(value)
      },
      {
        Header: 'Puntaje',
        accessor: 'puntajeRatificado',
        Cell: ({ value }) => customCell(value)
      },
      {
        Header: 'Asignatura - Leccion',
        accessor: 'nombreAsignatura',
        Cell: ({ value }) => customCell(value)
      },
      {
        Header: 'Docente',
        accessor: 'docente',
        Cell: ({ value }) => customCell(value)
      },
      {
        Header: ' ',
        id: 2,
        width: '10px',
        Cell: ({ value }) => <AiFillEye color='gray' size='1.5rem' />
      }
    ]

    return {
      listData,
      columns
    }
  }, [listData])

  return (
    <>
      {' '}
      <h2>Registro de Conducta</h2>
      <div style={{ margin: '2rem 0 2.5rem 0' }}>
        <SearchComp />
      </div>
      <Card>
        <CardBody>
          <CardTitle>
            <h2>Conducta</h2>
          </CardTitle>
          <Observaciones
            openModal={openModal}
            toggleModal={toggleModal}
            data={tableProps.listData}
          />
          <Table
            columns={tableProps.columns}
            data={tableProps.listData}
            avoidFilter
            avoidCss
          />
        </CardBody>
      </Card>
    </>
  )
}

export default Conducta

const primaryColor = '#145388'
const color2 = '#FF7272'
const secondaryColor = '#448EF6'

const Span = styled.span.attrs(props => ({
  isWarning: props.isWarning === undefined ? false : props.isWarning
}))`
  color: #fff;
  background: ${props => props.isWarning ? color2 : primaryColor} ;
  border-radius: 10px;
  display:flex;
  justify-content:center;
  width:8rem;
`
