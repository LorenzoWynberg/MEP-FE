import React, { useState, useEffect } from 'react'
import GenericSchedule from './GenericSchedule'
import styled from 'styled-components'
import {
  Col,
  Button
} from 'reactstrap'
import ReactToPrint from 'react-to-print'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { AsyncPaginate } from 'react-select-async-paginate'
import { useActions } from 'Hooks/useActions'
import { getAllStudentsByModelOffer } from 'Redux/grupos/actions'
import { useTranslation } from 'react-i18next'

const StudentSchedule = ({ days, currentOffer }) => {
  const { t } = useTranslation()
  const [printRef, setPrintRef] = useState<any>(null)
  const [print, setPrint] = useState(false)
  const { lections } = useSelector((state) => state.lecciones)
  const { lectionsSubjectGroup } = useSelector((state) => state.leccionAsignaturaGrupo)
  const [schedule, setSchedule] = useState<Array<Array<any>>>([])
  const [selectedStudent, setSelectedStudent] = useState<any>('')
  const { currentInstitution } = useSelector((state) => state.authUser)

  const createSchedule = () => {
    const aux = new Array(lections.length).fill(new Array(days.length).fill(0))
    const breakTimes = lections.filter((lection) => lection.esReceso)

    if (breakTimes.length > 0) {
      breakTimes.forEach((breakTime) => {
        const index = lections.findIndex((lection) => lection.id === breakTime.id)

        if (index !== -1) {
          aux[index] = new Array(days.length).fill(lections[index])
        }
      })
    }

    return aux
  }

  const loadOptions = async (searchQuery, loadedOptions, { page }) => {
    let response: any = {}
    if (!searchQuery) {
      response = await actions.getAllStudentsByModelOffer(
        currentInstitution?.id,
        '',
        currentOffer?.id,
        page,
        5
      )
    }

    if (searchQuery) {
      response = await actions.getAllStudentsByModelOffer(
        currentInstitution?.id,
        searchQuery,
        currentOffer?.id,
        page,
        5
      )
    }
    return {
      options: response?.options.sort(function (a, b) {
        if (a.estudianteNombre < b.estudianteNombre) { return -1 }
        if (a.estudianteNombre > b.estudianteNombre) { return 1 }
        return 0
      }) || [],
      hasMore: searchQuery.length > 0 ? false : response?.options?.length >= 1,
      additional: {
        page: searchQuery?.length > 0 ? page : page + 1
      }
    }
  }

  useEffect(() => {
    const newSchedule = JSON.parse(JSON.stringify(createSchedule()))
    setSchedule(newSchedule)
  }, [lections])

  useEffect(() => {
    if (selectedStudent?.identificacion) {
      const newSchedule = JSON.parse(JSON.stringify(createSchedule()))
      lections.forEach((lection, index) => {
        lectionsSubjectGroup[lection.id] &&
        lectionsSubjectGroup[lection.id].forEach((item) => {
          const ids = selectedStudent?.datosAsignaturaGrupo.map((el) => el?.asignaturaGrupoId)
          if (index !== -1 && ids.includes(item?.asignaturaGrupoid)) {
            newSchedule[index][item.diaSemana - 1] = item
          }
        })
      })

      setSchedule(newSchedule)
    }
  }, [selectedStudent, lectionsSubjectGroup])

  const actions = useActions({
    getAllStudentsByModelOffer
  })

  return (
    <Col>
      <Container ref={(ref) => setPrintRef(ref)}>
        <div className='d-flex justify-content-between w-100'>
          <div className='d-flex justify-content-between mb-3' style={{ width: '70%' }}>
            <div style={{ width: '40%' }}>
              <h6>{t('expediente_ce>horario>seleccione_estudiante','Seleccione un estudiante')}</h6>
              <AsyncPaginate
                key='async-students'
                placeholder={t('general>placeholder>selecciona_Estudiante','Selecciona un estudiante')}
                loadOptions={loadOptions}
                additional={{
                  page: 1
                }}
                onChange={(value) => {
                  setSelectedStudent(value)
                }}
                getOptionValue={(option) => option}
                getOptionLabel={(option) => `${option?.estudianteNombre} ${option?.estudianteprimerApellido} ${option?.estudiantesegundoApellido}`}
                styles={{
                  control: (styles) => ({
                    ...styles,
                    borderRadius: '20px',
                    border: '1px solid #000'
                  }),
                  indicatorSeparator: (styles) => ({ ...styles, display: 'none' })
                }}
                value={selectedStudent}
                cacheUniqs={[selectedStudent]}
              />
            </div>
          </div>
          <div className='d-flex'>
            {
              !print && (
                <>
                  <div>
                    <ReactToPrint
                      trigger={() => (
                        <Button color='primary'>
                          {t("estudiantes>indentidad_per>imp_doc>imprimir", "Imprimir")}
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
                </>
              )
            }
          </div>
        </div>
        <GenericSchedule
          firstColumnContent={lections}
          renderFirstColumnItem={(el) => <p style={{ margin: 0 }}>{el.orden === 0 ? '' : el.orden}</p>}
          schedule={lections}
          renderScheduleItem={(el) => <p style={{ margin: 0 }}>{moment(el.horaInicio).format('hh:mm A')} - {moment(el.horaFin).format('hh:mm A')}</p>}
          schedules={schedule}
          days={days}
          renderBodyItem={(el) => {
            return (
              <p
                style={{
                  width: '13.5rem',
                  backgroundColor: el.esReceso ? '#145388' : 'unset',
                  color: el.esReceso ? '#fff' : 'unset'
                }}
                className='generic-schedule__row-content'
              >
                {el?.nombreAsignatura}
              </p>
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

export default StudentSchedule
