import React, { useState, useEffect } from 'react'
import GenericSchedule from './GenericSchedule'
import styled from 'styled-components'
import {
  Col,
  FormGroup,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Form,
  Label
} from 'reactstrap'
import ReactToPrint from 'react-to-print'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { useActions } from 'Hooks/useActions'
import { getAllSubjectGrupoByModelOffer } from 'Redux/AsignaturaGrupo/actions'
import { getAllAsignaturas } from 'Redux/asignaturas/actions'
import Select from 'react-select'
import { useTranslation } from 'react-i18next'

const SubjectSchedule = ({ days, currentOffer }) => {
  const { t } = useTranslation()
  const [selectedSubject, setSelectedSubject] = useState<any>({})
  const [openModal, setOpenModal] = useState(false)
  const [selectedLection, setSelectedLection] = useState<any>(null)
  const [printRef, setPrintRef] = useState<any>(null)
  const [print, setPrint] = useState(false)
  const { lections } = useSelector((state) => state.lecciones)
  const { lectionsSubjectGroup } = useSelector(
    (state) => state.leccionAsignaturaGrupo
  )
  const [asignaturas, setAsignaturas] = useState([])
  const { subjectsGroup } = useSelector((state) => state.asignaturaGrupo)
  const [schedule, setSchedule] = useState<Array<Array<any>>>([])

  const initialValues = {
    lection: '',
    name: '',
    startAt: '',
    endAt: ''
  }

  const actions = useActions({
    getAllSubjectGrupoByModelOffer,
    getAllAsignaturas
  })

  const [editInputValues, setEditInputValues] = useState(initialValues)

  useEffect(() => {
    actions.getAllSubjectGrupoByModelOffer(currentOffer?.id)
  }, [])

  useEffect(() => {
    if (subjectsGroup.length > 0) {
      const newAsignaturas = []
      subjectsGroup.forEach((el) => {
        if (
          newAsignaturas.findIndex(
            (item) =>
              item?.datosMallaCurricularAsignaturaInstitucion
                ?.sb_asignaturaId ===
              el?.datosMallaCurricularAsignaturaInstitucion?.sb_asignaturaId
          ) === -1
        ) {
          newAsignaturas.push(el)
        }
      })
      setAsignaturas(newAsignaturas)
    }
  }, [subjectsGroup])

  useEffect(() => {
    if (asignaturas.length > 0) {
      setSelectedSubject(asignaturas[0])
    }
  }, [asignaturas])

  const onChange = (e) => {
    setEditInputValues({
      ...editInputValues,
      [e.target.name]: e.target.value
    })
  }

  const createSchedule = () => {
    const aux = new Array(lections.length).fill(new Array(days.length).fill(0))
    const breakTimes = lections.filter((lection) => lection.esReceso)

    if (breakTimes.length > 0) {
      breakTimes.forEach((breakTime) => {
        const index = lections.findIndex(
          (lection) => lection.id === breakTime.id
        )

        if (index !== -1) {
          aux[index] = new Array(days.length).fill(lections[index])
        }
      })
    }
    return aux
  }

  useEffect(() => {
    const newSchedule = createSchedule()
    setSchedule(newSchedule)
  }, [lections])

  useEffect(() => {
    if (schedule.length > 0) {
      const newSchedule = JSON.parse(JSON.stringify(createSchedule()))
      lections.forEach((lection, index) => {
        lectionsSubjectGroup[lection.id] &&
          lectionsSubjectGroup[lection.id].forEach((item) => {
            if (
              index !== -1 &&
              item.asignaturaId ===
                selectedSubject?.datosMallaCurricularAsignaturaInstitucion
                  ?.sb_asignaturaId
            ) {
              if (!newSchedule[index][item.diaSemana - 1]) {
                newSchedule[index][item.diaSemana - 1] = []
              }
              newSchedule[index][item.diaSemana - 1].push(item)
            }
          })
      })
      setSchedule(newSchedule)
    }
  }, [lectionsSubjectGroup, selectedSubject])

  return (
    <Col>
      <CustomModal
        isOpen={openModal}
        toggle={() => setOpenModal((prevState) => !prevState)}
        size='md'
        style={{ borderRadius: '10px' }}
        centered='static'
      >
        <ModalHeader>{t("expediente_ce>horario>edit_leccion", "Editar lección")}</ModalHeader>
        <ModalBody>
          <Form>
            <p>{t("expediente_ce>horario>leccion", "Lección")}*</p>
            <FormGroup>
              <Input
                type='text'
                id='lection'
                name='lection'
                placeholder='4'
                onChange={onChange}
                value={editInputValues.lection}
              />
            </FormGroup>
            <p>{t(" dir_regionales>col_nombre", "Nombre")}</p>
            <FormGroup>
              <Input
                type='text'
                id='name'
                name='name'
                placeholder='4'
                onChange={onChange}
                value={editInputValues.name}
              />
            </FormGroup>
            <div className='d-flex justify-content-between'>
              <FormGroup>
                <Label>{t("centro_educativo>gestion_grupos>inicio", "Inicio")}*</Label>
                <Input
                  type='text'
                  id='startAt'
                  name='startAt'
                  placeholder='9:00'
                  onChange={onChange}
                  value={editInputValues.startAt}
                />
              </FormGroup>
              <FormGroup>
                <Label>{t('expediente_ce>horario>fin','Fin')}*</Label>
                <Input
                  type='text'
                  id='endAt'
                  name='endAt'
                  placeholder='10:00'
                  onChange={onChange}
                  value={editInputValues.endAt}
                />
              </FormGroup>
            </div>
          </Form>
        </ModalBody>
        <ModalFooter>
          <div className='d-flex justify-content-center align-items-center w-100'>
            <Button
              color='outline-primary'
              className='mr-3'
              onClick={() => {
                setOpenModal(false)
                setSelectedLection(null)
                setEditInputValues(initialValues)
              }}
            >
              {t("boton>general>cancelar", "Cancelar")}
            </Button>
            <Button
              color='primary'
              onClick={() => {
                setOpenModal(false)
                const index = lections.findIndex(
                  (el) => el.id === selectedLection.id
                )

                if (index !== -1) {
                  const copy = JSON.parse(JSON.stringify(lections))
                  copy[index] = {
                    ...selectedLection,
                    ...editInputValues
                  }
                  // setLections(copy)
                }
                setSelectedLection(null)
                setEditInputValues(initialValues)
              }}
            >
              {t("boton>general>confirmar", "Confirmar")}
            </Button>
          </div>
        </ModalFooter>
      </CustomModal>
      <Container ref={(ref) => setPrintRef(ref)}>
        <div className='d-flex justify-content-between w-100'>
          <div className=''>
            <h6>{t("expediente_ce>horario>seleccionar_asignatura_fin", "Selecciona la asignatura/figura afín")}</h6>
            {!print && (
              <FormGroup>
                <Select
                  placeholder={t('general>placeholder>seleccione_asignatura','Seleccione una asignatura')}
                  options={asignaturas
                    .sort(function (a, b) {
                      if (
                        a.datosMallaCurricularAsignaturaInstitucion?.nombreAsignatura?.toLowerCase() <
                        b.datosMallaCurricularAsignaturaInstitucion?.nombreAsignatura?.toLowerCase()
                      ) {
                        return -1
                      }
                      if (
                        a.datosMallaCurricularAsignaturaInstitucion?.nombreAsignatura?.toLowerCase() >
                        b.datosMallaCurricularAsignaturaInstitucion?.nombreAsignatura?.toLowerCase()
                      ) {
                        return 1
                      }
                      return 0
                    })
                    ?.map((el, i) => ({
                      value: JSON.stringify(el),
                      label:
                        el?.datosMallaCurricularAsignaturaInstitucion?.nombreAsignatura.toUpperCase()
                    }))}
                  styles={{
                    control: (styles) => ({
                      ...styles,
                      borderRadius: '20px',
                      border: '1px solid #000'
                    }),
                    indicatorSeparator: (styles) => ({
                      ...styles,
                      display: 'none'
                    })
                  }}
                  noOptionsMessage={() => t("general>no_opt", "Sin opciones")}
                  getOptionLabel={(option: any) => option.label}
                  getOptionValue={(option: any) => option.value}
                  onChange={(e) => setSelectedSubject(JSON.parse(e.value))}
                  value={selectedSubject
                    ? {
                        value: JSON.stringify(selectedSubject),
                        label:
                    selectedSubject?.datosMallaCurricularAsignaturaInstitucion?.nombreAsignatura.toUpperCase()
                      }
                    : null}
                />
              </FormGroup>
            )}
          </div>
          <div className='d-flex'>
            <div>
              <ReactToPrint
                trigger={() => (
                  <Button color='primary'>
                    <i className='simple-icon-printer mr-2' />
                    <span>{t("estudiantes>indentidad_per>imp_doc>imprimir", "Imprimir")}</span>
                  </Button>
                )}
                content={() => printRef}
                onAfterPrint={() => {
                  setPrint(false)
                }}
                onBeforeGetContent={() => {
                  setPrint(true)
                }}
              />
            </div>
          </div>
        </div>
        <GenericSchedule
          firstColumnContent={lections}
          renderFirstColumnItem={(el) => (
            <p style={{ margin: 0 }}>{el.orden === 0 ? '' : el.orden}</p>
          )}
          schedule={lections}
          renderScheduleItem={(el) => (
            <p style={{ margin: 0 }}>
              {moment(el.horaInicio).format('hh:mm A')} -{' '}
              {moment(el.horaFin).format('hh:mm A')}
            </p>
          )}
          schedules={schedule}
          days={days}
          renderBodyItem={(el) => {
            return (
              <div
                style={{
                  width: '13.5rem',
                  backgroundColor: el.esReceso ? '#145388' : 'unset',
                  color: el.esReceso ? '#fff' : 'unset',
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  padding: '0 1rem'
                }}
                className='generic-schedule__row-content'
              >
                {!Array.isArray(el)
                  ? ''
                  : el.map((item) => item?.nombreGrupo).join(', ')}
              </div>
            )
          }}
        />
      </Container>
    </Col>
  )
}

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  height: auto;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 10px;
  padding: 1rem;
  overflow: hidden;
`

const InputSelect = styled(Input)`
  border-radius: 2rem !important;
  border: 1px solid #000;
  width: 10rem !important;

  @media screen and (min-width: 726px) {
    width: 16rem !important;
  }
`

const CustomModal = styled(Modal)`
  &.modal-dialog {
    box-shadow: unset !important;
  }
  & > div.modal-content {
    border-radius: 10px !important;
  }
`

export default SubjectSchedule
