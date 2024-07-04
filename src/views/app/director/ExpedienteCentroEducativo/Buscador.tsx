import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Colxx, Separator } from '../../../../components/common/CustomBootstrap'
import Breadcrumb from '../../../../containers/navs/Breadcrumb'
import { Row, Container } from 'reactstrap'
import { cleanIdentity } from '../../../../redux/identificacion/actions'
import {
  cleanStudentsFilter,
  getStudentDataFilter,
  changeColumn,
  changeFilterOption,
  loadStudent
} from '../../../../redux/expedienteEstudiantil/actions'
import BuscadorTable from '../../../../components/buscador-table'

const Buscador = (props) => {
  const {
    estudiantes,
    cleanIdentity,
    cleanStudentsFilter,
    buscador,
    changeColumn,
    changeFilterOption,
    loadStudent
  } = props
  const [dataestudiantes, setDataestudiantes] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    cleanIdentity()
    setDataestudiantes(estudiantes)
  }, [cleanIdentity, estudiantes])

  useEffect(() => {
    return () => {
      cleanStudentsFilter()
    }
  }, [cleanStudentsFilter])

  const getDataFilter = async (filterText: string, filterType: string) => {
    setLoading(true)
    await props.getStudentDataFilter(filterText, filterType)
    setLoading(false)
  }

  const onSelectRow = async (data: object) => {
    await loadStudent(data)
    props.history.push('/director/expediente-estudiante/inicio')
  }

  return (
    <Container>
      <Row>
        <Colxx xxs='12'>
          <Breadcrumb
            heading='Expediente del centro educativo'
            match={props.match}
            hidePath
          />
          <br />
          <Separator className='mb-4' />
        </Colxx>
        <BuscadorTable
          rows={dataestudiantes}
          columns={buscador.columns}
          filters={buscador.filters}
          changeColumn={changeColumn}
          changeFilterOption={changeFilterOption}
          getDataFilter={getDataFilter}
          cleanIdentity={cleanIdentity}
          cleanFilter={cleanStudentsFilter}
          onSelectRow={onSelectRow}
        />
      </Row>
    </Container>
  )
}

const mapStateToProps = (reducers) => {
  return {
    ...reducers.expedienteEstudiantil
  }
}

const mapActionsToProps = {
  getStudentDataFilter,
  cleanIdentity,
  cleanStudentsFilter,
  changeColumn,
  changeFilterOption,
  loadStudent
}

export default connect(mapStateToProps, mapActionsToProps)(Buscador)
