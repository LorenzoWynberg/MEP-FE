import React, { useState, useEffect } from 'react'
import Table from 'Components/Table-filter/Table'
import { Card, CardTitle, CardBody, Button } from 'reactstrap'
import { SearchComp } from '../../../../Componentes'
import ConfirmModal from 'Components/Modal/ConfirmModal'
import { Backup } from '@material-ui/icons'
import { AiFillEye } from 'react-icons/ai'

import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import { setAsistenciasEstudiante } from '../../../../../../../redux/VistasUsuarios/actions'
import moment from 'moment'

interface IModalProps {
  files: any[]
  addFile: Function
  show: boolean
  setShow: Function
}

const ModalAsistencia: React.FC<IModalProps> = (props) => {
  return (
    <ConfirmModal
      openDialog={props.show}
      onClose={() => props.setShow(false)}
      txtBtn='Justificar'
      btnCancel
      title='Justificar Incidencia'
    >
      <div>
        <Article>
          <span>Incidencia</span>
          <BasicTable>
            <thead>
              <th>Fecha</th>
              <th>Lección</th>
              <th>Tipo de Incidencia</th>
            </thead>
            <tbody />
          </BasicTable>
        </Article>
        <Article>
          <section>Observación</section>
          <textarea cols={50} rows={10} />
        </Article>
        <Article>
          <section>Archivo</section>
          <div style={{ display: 'flex' }}>
            <Backup
              style={{
                color: '#145388',
                fontSize: '3rem'
              }}
            />
            <label
              color='primary'
              className='btn btn-outline-primary'
              htmlFor='uploadIncidentFile'
              style={{ maxWidth: '110px', padding: '10px 20px 10px 20px' }}
            >
              <input
                color='primary'
                type='file'
                id='uploadIncidentFile'
                name='uploadIncidentFile'
                onChange={(e) => props.addFile(e.target.files[0])}
                style={{ display: 'none' }}
              />
              Subir un archivo
            </label>

            {props.files.length > 0 && (
              <Button color='primary'>
                Ver (
                {props.files?.length} archivo
                {props.files?.length > 1 && 's'}
                )
              </Button>
            )}
          </div>
        </Article>
      </div>
    </ConfirmModal>
  )
}

const Asistencia = () => {
  const [isModalActive, setModalActive] = React.useState(false)
  const [files, setFiles] = React.useState([])
  const [data, setData] = useState({})
  const [listData, setListData] = useState([])

  const actions = useActions({
    setAsistenciasEstudiante
  })
  const state = useSelector<any, any>((store) => {
    return {
      institution: store.authUser.currentInstitution,
      asistencias: store.VistasUsuarios.asistencias,
      estudianteSeleccionado: store.VistasUsuarios.estudianteSeleccionado
    }
  })

  const handleLoadAsistencias = async () => {
    if (!state.estudianteSeleccionado) return
    if (!state.estudianteSeleccionado?.academiaSeleccionada) return
    await actions.setAsistenciasEstudiante(state.estudianteSeleccionado.id, state.estudianteSeleccionado?.academiaSeleccionada.institucionId)
  }

  useEffect(() => {
    handleLoadAsistencias()
  }, [])

  useEffect(() => {
    if (state.asistencias) {
      setListData(state.asistencias)
    }
  }, [state.asistencias])

  const tableProps = React.useMemo(() => {
    const customCell = (value: any) => {
      return <span onClick={() => setModalActive(true)}>{value}</span>
    }

    const columns = [
      {
        Header: 'Fecha',
        accessor: 'fechaAsistencia',
        Cell: ({ value }) => customCell(moment(value).format('DD/MM/yyyy'))
      },
      {
        Header: 'Incidencia',
        accessor: 'nombreTipoAsistencia',
        Cell: ({ value }) => (
          <Span isWarning={value.toUpperCase() === 'AUSENCIA'}>
            {customCell(value.toUpperCase())}
          </Span>
        )
      },
      {
        Header: 'Asignatura y lección',
        accessor: 'nombreAsignatura',
        Cell: ({ value }) => customCell(value)
      },
      {
        Header: 'Docente',
        accessor: 'docente',
        Cell: ({ value }) => customCell(value)
      },
      {
        Header: 'Estado',
        accessor: 'estadoAsistencia',
        Cell: ({ value }) => (
          <Span
            isOpaque={value.toLowerCase() !== 'en revisión'}
            isWarning={value.toUpperCase() === 'INJUSTIFICADA'}
          >
            {customCell(value.toUpperCase())}
          </Span>
        )
      },
      {
        Header: ' ',
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
      <ModalAsistencia
        addFile={() => {}}
        files={files}
        setShow={setModalActive}
        show={isModalActive}
      />
      <h3>Registro de Asistencia</h3>
      <div style={{ margin: '2rem 0 2.5rem 0' }}>
        <SearchComp />
      </div>
      <Card>
        <CardBody>
          <CardTitle>
            <h3>Asistencia</h3>
          </CardTitle>
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

const borderColor = '#cdcdcd'
const primaryColor = '#145388'
const opaqueColor = '#145388'
const secondaryColor = '#448EF6'
const color2 = '#FF7272'

const Span = styled.span.attrs((props) => ({
  isWarning: props.isWarning === undefined ? false : props.isWarning,
  isOpaque: props.isOpaque === undefined ? true : props.isOpaque
}))`
  color: #fff;
  background: ${(props) => (props.isWarning ? color2 : primaryColor)}${(props) => (props.isOpaque ? 'FF' : '7F')};
  border-radius: 10px;
  display: flex;
  justify-content: center;
  width: 8rem;
`

const BasicTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0px;
  text-align: center;

  tbody tr {
    color: black;
    border: 1px solid ${borderColor};
    &:last-child td:first-child {
      border-bottom-left-radius: 10px;
    }
    &:last-child td:last-child {
      border-bottom-right-radius: 10px;
    }
    &:nth-child(5) {
      background-color: ${primaryColor};
      color: white;
    }
    td {
      padding: 0.5rem;
      border-right: 1px solid ${borderColor};
      border-left: 1px solid ${borderColor};
      border-bottom: 1px solid ${borderColor};
    }
  }
  thead th {
    color: white;
    border: solid 1px ${borderColor};
    padding: 0.5rem;
    background: ${primaryColor};
    &:last-child {
      border: 1px solid ${borderColor};
      border-radius: 0 10px 0 0;
      border-radius: 0 10px 0 0;
    }
    &:first-child {
      border: 1px solid ${borderColor};
      border-radius: 10px 0 0 0;
    }
  }
`
const Article = styled.article`
  margin-top: 10px;
`

export default Asistencia
