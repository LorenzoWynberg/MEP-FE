import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import { FormGroup, Label, Button, Row, Col, Card, CardBody } from 'reactstrap'
import styled from 'styled-components'

import Typography from '@material-ui/core/Typography'
import { Colxx } from 'Components/common/CustomBootstrap'
import { useActions } from 'Hooks/useActions'
import { useSelector } from 'react-redux'
import { GetGruposByInstitucionAnioElectivo } from 'Redux/grupos/actions'
import { GetEstudiantesByGrupo } from 'Redux/matricula/actions'
import { getAllSubjectGroupByGroupId } from 'Redux/AsignaturaGrupo/actions'

interface IProps {
  typeCertification: any
  generarCertificado: Function
}
const FormFilterCertificaciones: React.FC<IProps> = (props) => {
  const [grupo, setGrupo] = useState()
  const [student, setStudent] = useState()
  const [asignatura, setAsignatura] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const actions = useActions({
    GetGruposByInstitucionAnioElectivo,
    GetEstudiantesByGrupo,
    getAllSubjectGroupByGroupId
  })

  const state = useSelector((store: any) => {
    return {
      selectedActiveYear: store.authUser.selectedActiveYear,
      currentInstitution: store.authUser.currentInstitution,
      students: store.matricula.estudiantesGrupoCertificaciones,
      subjects: store.asignaturaGrupo.subjectsGroupByGroup,
      grupos: store.grupos.gruposSelectReportes
    }
  })

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      await actions.GetGruposByInstitucionAnioElectivo(
        state.selectedActiveYear.id,
        state.currentInstitution.id
      )
      setLoading(false)
    }
    fetch()
  }, [state.currentInstitution, state.selectedActiveYear])

  const onChangeGroup = async (value) => {
    setGrupo(value)
    setStudent(null)
    setAsignatura(null)
    if (props.typeCertification.asignatura) {
      await actions.getAllSubjectGroupByGroupId(value.id)
    } else {
      await actions.GetEstudiantesByGrupo(value.id)
    }
  }
  const onChangeAsignatura = async (value) => {
    setAsignatura(value)
    if (value.id === 'all') {
      await actions.GetEstudiantesByGrupo(grupo.id)
    } else {
      await actions.GetEstudiantesByGrupo(grupo.id)
    }
  }

  const generarCertificado = async () => {
    if (!student && !grupo && !asignatura) {
      return
    }
    const data = {
      student,
      group: grupo,
      asignatura
    }
    props.generarCertificado(data)
  }

  return (
    <>
      <Row>
        <Col xs='6' style={{ margin: '0 auto' }}>
          <Card>
            <CardBody>
              <Typography gutterBottom variant='h6' className='mb-1'>
                {props.typeCertification?.title}
              </Typography>
              <Typography gutterBottom variant='body2' className='mb-3'>
                {props.typeCertification?.subTitle}
              </Typography>
              {!loading
                ? (
                  <>
                    <Colxx sm='12' xl='12' className='mb-2'>
                      <FormGroup>
                        <Label>Grupo</Label>

                        <Select
                          options={state.grupos}
                          value={grupo}
                          onChange={(data) => {
                            onChangeGroup(data)
                          }}
                          components={{ Input: CustomSelectInput }}
                          getOptionLabel={(option: any) => option.nombre}
                          getOptionValue={(option: any) => option.id}
                          className='react-select'
                          classNamePrefix='react-select'
                          placeholder=''
                          noOptionsMessage={() => 'Sin opciones'}
                        />
                      </FormGroup>
                    </Colxx>
                    {props.typeCertification.asignatura && (
                      <Colxx sm='12' xl='12'>
                        <FormGroup>
                          <Label>Asignatura</Label>

                          <Select
                            options={[
                              { nombre: 'TODAS LAS ASIGNATURAS', id: 'all' },
                              ...state.subjects.map((e) => {
                                return {
                                  ...e,
                                  nombre:
                                  e.datosMallaCurricularAsignaturaInstitucion
                                    .nombreAsignatura
                                }
                              })
                            ]}
                            value={asignatura}
                            onChange={(data) => {
                              onChangeAsignatura(data)
                            }}
                            components={{ Input: CustomSelectInput }}
                            getOptionLabel={(option: any) => option.nombre}
                            getOptionValue={(option: any) => option.id}
                            className='react-select'
                            classNamePrefix='react-select'
                            placeholder=''
                            noOptionsMessage={() => 'Sin opciones'}
                          />
                        </FormGroup>
                      </Colxx>
                    )}
                    <Colxx sm='12' xl='12'>
                      <FormGroup>
                        <Label>Persona estudiante</Label>

                        <Select
                          options={state.students}
                          value={student}
                          onChange={(data) => {
                            setStudent(data)
                          }}
                          components={{ Input: CustomSelectInput }}
                          getOptionLabel={(option: any) => option.nombre}
                          getOptionValue={(option: any) => option.id}
                          className='react-select'
                          classNamePrefix='react-select'
                          placeholder=''
                          noOptionsMessage={() => 'Sin opciones'}
                        />
                      </FormGroup>
                    </Colxx>
                    <Colxx sm='12' xl='12'>
                      <ContainerButton className='container-center my-4'>
                        <Button
                          color='primary'
                          size='lg'
                          className='top-right-button'
                          onClick={() => generarCertificado()}
                        >
                          Generar reporte
                        </Button>
                        {error && <MessageError>{error}</MessageError>}
                      </ContainerButton>
                    </Colxx>
                  </>
                  )
                : (
                  <div className='container-center'>
                    <div className='loading loading-form my-5' />
                  </div>
                  )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}

const ContainerButton = styled.div`
  flex-flow: column;
`
const MessageError = styled.div`
  color: #e00000;
  font-size: 12px;
  margin-top: 5px;
`

export default FormFilterCertificaciones
