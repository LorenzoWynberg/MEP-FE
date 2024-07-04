import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import { Colxx } from 'Components/common/CustomBootstrap'
import AppLayout from 'Layout/AppLayout'
import directorItems from 'Constants/directorMenu'
import Select from 'react-select'
import useNotification from 'Hooks/useNotification'
import Typography from '@material-ui/core/Typography'
import SearchIcon from '@material-ui/icons/Search'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import { useTranslation } from 'react-i18next'

import {
  Row,
  Container,
  Button,
  Col,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  Input,
  Label,
  FormGroup
} from 'reactstrap'

import ModalRegistrarPersona from './ModalRegistrarPersona.tsx'

import {
  getDataFilter,
  cleanFilter,
  getInformacionMatriculaActual,
  cleanStudent,
  getAniosEducativosActivos,
  getCursosLectivosPorAnioEducativo,
  selectAnioEducativo,
  selectCursoLectivo
} from 'Redux/matricula/actions'
import moment from 'moment'
import HTMLTable from 'Components/HTMLTable'
import { Helmet } from 'react-helmet'

const Buscador = (props) => {
  const { t } = useTranslation()
  const [dataEstudiantes, setDataestudiantes] = useState([])
  const [loading, setLoading] = useState(false)
  const [registerNew, setRegisterNew] = useState(false)
  const [isDisabled, setIsDisabled] = useState(true)
  const [registarPersona, setRegistrarPersona] = useState(false)
  const [filterText, setFilterText] = useState('')
  const [snackbar, handleClick, handleClose] = useNotification()
  const [snackbarContent, setSnackbarContent] = useState({
    variant: 'error',
    msg: 'hubo un error'
  })

  const [anioEducativo, setAnioEducativo] = useState({ label: '', value: null })
  const [cursoLectivo, setCursoLectivo] = useState({ label: '', value: null })

  const actions = useActions({
    getDataFilter,
    cleanFilter,
    getInformacionMatriculaActual,
    cleanStudent,
    getAniosEducativosActivos,
    getCursosLectivosPorAnioEducativo,
    selectAnioEducativo,
    selectCursoLectivo
  })
  const stateProps = useSelector((store) => {
    return {
      dataFilter: store.matricula.dataFilter,
      matricula: store.matricula,
      informacionMatricula: store.matricula.informacionMatricula
    }
  })

  useEffect(() => {
    setAnioEducativo(stateProps.matricula.anioEducativo)

    if (stateProps.matricula.anioEducativo.value != null) {
      actions.getCursosLectivosPorAnioEducativo(
        stateProps.matricula.anioEducativo.value
      )
    }
  }, [stateProps.matricula.anioEducativo])

  useEffect(() => {
    setCursoLectivo(stateProps.matricula.cursoLectivo)
  }, [stateProps.matricula.cursoLectivo])

  useEffect(() => {
    if (
      stateProps.matricula.aniosEducativosActivos &&
      stateProps.matricula.aniosEducativosActivos.length > 0
    ) {
      const _first = stateProps.matricula.aniosEducativosActivos[0]
      actions.selectAnioEducativo({ label: _first.label, value: _first.value })
    }
  }, [stateProps.matricula.aniosEducativosActivos])

  useEffect(() => {
    if (
      stateProps.matricula.cursosLectivos &&
      stateProps.matricula.cursosLectivos.length > 0
    ) {
      const _first = stateProps.matricula.cursosLectivos[0]
      actions.selectCursoLectivo({ label: _first.label, value: _first.value })
    }
  }, [stateProps.matricula.cursosLectivos])

  useEffect(() => {
    actions.cleanStudent('')
    actions.cleanFilter()
  }, [])

  useEffect(() => {
    setDataestudiantes(stateProps.dataFilter)
  }, [stateProps.dataFilter])

  useEffect(() => {
    async function fetch () {
      await actions.getInformacionMatriculaActual()
      await actions.getAniosEducativosActivos()
    }
    fetch()
  }, [])

  useEffect(() => {
    if (cursoLectivo && cursoLectivo.value != null) {
      async function fetch () {
        await actions.getInformacionMatriculaActual(cursoLectivo.value)
      }
      fetch()
    }
  }, [cursoLectivo])

  const handlePagination = async (pagina, cantidadPagina) => {}

  const handleSearch = async (filterText, cantidadPagina, pagina) => {}
  const handleChangeText = async (e) => {
    setFilterText(e.target.value)
    if (e.target.value.length > 2) {
      setIsDisabled(false)
    }
    if (e.target.value.length === 0) {
      setRegisterNew(false)
      actions.cleanFilter()
    }
  }

  const handleKeyPress = (e) => {
    if (e.charCode === 13) {
      onSearch()
      return false
    }
  }

  const onSearch = async () => {
    if (cursoLectivo && cursoLectivo.value != null) {
    }
    setLoading(true)
    await actions.getDataFilter(filterText, cursoLectivo.value)
    setLoading(false)
    setRegisterNew(true)
  }

  const onRegistrarPersona = () => {
    props.history.push('/configuracion/identidad')
  }

  const columns = [
    {
      column: 'identificacion',
      label: t('estudiantes>matricula_estudiantil>columna_identificacion', 'Identificación'),
      width: 20,
      order: true
    },
    {
      column: 'nombreEstudiante',
      label: t('estudiantes>matricula_estudiantil>columna_nombre', 'Nombre completo'),
      width: 25,
      order: true
    },
    {
      column: 'fechaNacimiento',
      label: t('estudiantes>matricula_estudiantil>columna_fecha_nacimiento', 'Fecha nacimiento (Edad)'),
      width: 15,
      order: true
    },
    {
      column: 'fallecido',
      label: t('estudiantes>matricula_estudiantil>columna_fallecido', 'Fallecido'),
      order: true
    },
    {
      column: 'institucion',
      label: t('estudiantes>matricula_estudiantil>columna_centros_educativos', 'Centros educativos'),
      order: true
    }
  ]

  const actionRow = [
    {
      actionName: t('estudiantes>matricula_estudiantes>ficha_informativa', 'Ficha informativa'),
      actionFunction: (item) => {
        props.history.push(`/director/ficha-estudiante/${item.idEstudiante}`)
      },
      actionDisplay: () => true
    },
    {
      actionName: t('estudiantes>matricula_estudiantes>matricular_estudiante', 'Matricular estudiante'),
      actionFunction: (item) => {
        if (item.esFallecido) {
          setSnackbarContent({
            variant: 'error',
            msg: 'El estudiante se encuentra fallecido'
          })
          handleClick()
          return
        }
        props.history.push(
          `/director/matricular-estudiantes/${item.identificacion}`
        )
      },
      actionDisplay: () => true
    }
  ]
  return (
    <AppLayout items={directorItems}>
      <Helmet>
        <title>Matrícula</title>
      </Helmet>
      <div className='dashboard-wrapper'>
        {snackbar(snackbarContent.variant, snackbarContent.msg)}
        <Container>
          <Row>
            <Colxx xxs='9' className='mb-5'>
              <Typography variant='h5' gutterBottom>
                {t('estudiantes>matricula_estudiantil>matricula_estudiantes', 'Matrícula de estudiantes')}
              </Typography>
              <Typography variant='body1' gutterBottom>
                {t('estudiantes>matricula_estudiantil>texto', 'En esta sección puede buscar a la persona que desea matricular, debe tomar en cuenta:')}
                <br />
                {t('estudiantes>matricula_estudiantil>texto_1', '1. En esta sección solo se muestra información de personas registradas en el sistema.')}
                <br />
                {t('estudiantes>matricula_estudiantil>texto_2', '2. Las personas “Sin documentos” y que no están registradas en el sistema, deben registrarse antes de poder matricular, esto lo puede hacer desde la sección "Identidad de la persona", en el Menú de “Configuración”.')}
                <br />
                {t('estudiantes>matricula_estudiantil>texto_3', '3. El sistema verifica que el estudiante no se encuentre matriculado en otro centro educativo')}
              </Typography>
            </Colxx>
            <Colxx xxs='3' className='mb-5'>
              <p className='panel-info-matricula'>
                <b>{t('estudiantes>matricula_estudiantil>datos_matricula', 'Datos de Matrícula:')} </b> <br />
                {t('estudiantes>matricula_estudiantil>datos_matricula>inicio', 'Inicio:')} {' '}
                {stateProps.informacionMatricula.inicioMatricula
                  ? moment(
                    stateProps.informacionMatricula.inicioMatricula
                  ).format('DD/MM/YYYY')
                  : ''}
                <br />
                {t('estudiantes>matricula_estudiantil>datos_matricula>fin', 'Fin:')}{' '}
                {stateProps.informacionMatricula.finMatricula
                  ? moment(stateProps.informacionMatricula.finMatricula).format(
                    'DD/MM/YYYY'
                  )
                  : ''}
                <br />
                <b>{t('estudiantes>matricula_estudiantil>datos_matricula>datos_curso', 'Datos del curso lectivo:')} </b> <br />
                {t('estudiantes>matricula_estudiantil>datos_matricula>inicio', 'Inicio:')}{' '}
                {stateProps.informacionMatricula.inicioPeriodoLectivo
                  ? moment(
                    stateProps.informacionMatricula.inicioPeriodoLectivo
                  ).format('DD/MM/YYYY')
                  : ''}
                <br />
                {t('estudiantes>matricula_estudiantil>datos_matricula>fin', 'Fin:')}:{' '}
                {stateProps.informacionMatricula.finPeriodoLectivo
                  ? moment(
                    stateProps.informacionMatricula.finPeriodoLectivo
                  ).format('DD/MM/YYYY')
                  : ''}
              </p>
            </Colxx>
          </Row>
          <Col md='6' className='mb-5'>
            <Row>
              <Col sm='12' md='6'>
                <FormGroup>
                  <Label>{t('estudiantes>matricula_estudiantil>anio_educativo', 'Año Educativo')}</Label>

                  <Select
                    name='anioEducativo'
                    components={{ Input: CustomSelectInput }}
                    className='react-select'
                    classNamePrefix='react-select'
                    options={stateProps.matricula.aniosEducativosActivos}
                    placeholder=''
                    value={anioEducativo}
                    onChange={(data) => {
                      actions.selectAnioEducativo(data)
                    }}
                    isDisabled={false}
                  />
                </FormGroup>
              </Col>
              <Col sm='12' md='6'>
                <FormGroup>
                  <Label>{t('estudiantes>matricula_estudiantil>curso_lectivo', 'Curso Lectivo')} </Label>
                  <Select
                    name='cursoLectivo'
                    components={{ Input: CustomSelectInput }}
                    className='react-select'
                    classNamePrefix='react-select'
                    options={stateProps.matricula.cursosLectivos}
                    placeholder=''
                    value={cursoLectivo}
                    onChange={(data) => {
                      actions.selectCursoLectivo(data)
                    }}
                    isDisabled={false}
                  />
                </FormGroup>
              </Col>
            </Row>
          </Col>
          <Row>
            <Col sm='6'>
              <Row>
                <Col sm='10'>
                  <InputGroup size='lg' style={{ zIndex: 2 }}>
                    <InputGroupAddon
                      addonType='prepend'
                      className='prepend-search'
                    >
                      <InputGroupText
                        style={{ zIndex: 2 }}
                        className='icon-buscador-expediente-before'
                      >
                        <SearchIcon />
                      </InputGroupText>
                    </InputGroupAddon>
                    <InputSearch
                      style={{ zIndex: 0 }}
                      placeholder={t('estudiantes>matricula_estudiantes>buscar>placeholder', 'Escriba aquí las palabras claves que desea buscar...')}
                      value={filterText}
                      onChange={handleChangeText}
                      onKeyPress={handleKeyPress}
                    />
                  </InputGroup>
                </Col>
                <Col sm='2'>
                  <Button
                    color='primary'
                    disabled={isDisabled}
                    onClick={onSearch}
                  >
                    {t('general>buscar', 'Buscar')}
                  </Button>
                </Col>
              </Row>
            </Col>
            {registerNew && (
              <ColBTNRegistroSearch sm='6'>
                <div>
                  <Button
                    color='primary'
                    onClick={() => {
                      onRegistrarPersona()
                    }}
                  >
                    {t('estudiantes>matricula_estudiantil>registrar_estudiante', 'Registrar un nuevo estudiante')}
                  </Button>
                </div>
              </ColBTNRegistroSearch>
            )}

            <Col sm='12'>
              <HTMLTable
                columns={columns}
                selectDisplayMode='datalist'
                showHeaders
                data={dataEstudiantes}
                PageHeading={false}
                pageSize={false}
                actionRow={actionRow}
                toggleEditModal={(item) => {}}
                toggleModal={() => {}}
                modalOpen={false}
                selectedOrderOption={{
                  column: 'detalle',
                  label: 'Nombre Completo'
                }}
                editModalOpen={false}
                loading={loading}
                orderBy={false}
                totalRegistro={0}
                handlePagination={handlePagination}
                handleSearch={handleSearch}
                handleCardClick={() => {}}
                rollBackLabel={
                  t('estudiantes>matricula_estudiantil>sin_resultados_mensaje', 'No se encontraron resultados. Puede proceder con el registro del nuevo estudiante')
                }
              />
            </Col>
          </Row>
        </Container>
      </div>

      <ModalRegistrarPersona
        open={registarPersona}
        onClose={setRegistrarPersona}
        onRegistrarPersona={onRegistrarPersona}
      />
    </AppLayout>
  )
}

const InputSearch = styled(Input)`
  padding: 12px 60px !important;
  border-radius: 50px !important;
  font-size: 14px !important;
`
const ColBTNRegistroSearch = styled(Col)`
  display: flex;
  justify-content: flex-end;
`
export default withRouter(Buscador)
