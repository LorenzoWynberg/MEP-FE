import React, { useEffect, useState } from 'react'
import { Col, DropdownToggle, Button } from 'reactstrap'
import styled from 'styled-components'
import Tooltip from '@mui/material/Tooltip'
import ReactToPrint from 'react-to-print'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import { getLevelsByOfertaModalServInCalendar } from 'Redux/niveles/actions'
import { getGroupsByLevel } from 'Redux/grupos/actions'
import Select from 'react-select'
import { useTranslation } from 'react-i18next'

const ScheduleGlobal = ({ days, currentOffer }) => {
  const { t } = useTranslation()
  const [dropdownToggle, setDropdownToggle] = useState<'level' | 'group' | ''>('')
  const [selectedLevel, setSelectedLevel] = useState(null)
  const [printRef, setPrintRef] = useState<any>(null)
  const [print, setPrint] = useState(false)
  const { currentInstitution } = useSelector((state) => state.authUser)
  const { lections } = useSelector((state) => state.lecciones)
  const { nivelesGruposYProyecciones: groups } = useSelector((state) => state.grupos)
  const { lectionsSubjectGroup } = useSelector((state) => state.leccionAsignaturaGrupo)
  const { nivelesByModelOffer: levels } = useSelector((state) => state.niveles)
  const [schedule, setSchedule] = useState([])
  const [filteredGroups, setFilteredGroups] = useState([])
  const toggle = (dropdown: 'level' | 'group') => {
    if (dropdown === dropdownToggle) {
      setDropdownToggle('')
      return
    }
    setDropdownToggle(dropdown)
  }

  const actions = useActions({
    getLevelsByOfertaModalServInCalendar,
    getGroupsByLevel
  })

  useEffect(() => {
    if (currentOffer?.id) {
      actions.getLevelsByOfertaModalServInCalendar(currentOffer?.id)
    }
  }, [currentOffer])

  useEffect(() => {
    setSelectedLevel(levels[0] || null)
  }, [levels])

  useEffect(() => {
    if (selectedLevel?.nivelId) {
      actions.getGroupsByLevel(selectedLevel?.nivelId, currentInstitution?.id)
    }
  }, [selectedLevel])

  useEffect(() => {
    setFilteredGroups(groups || [])
    // if (groups.length > 0) {
    // }
  }, [groups])

  useEffect(() => {
    const aux = new Array(days.length).fill(
      new Array(filteredGroups.length || 1).fill(
        new Array(lections.filter(item => !item.esReceso).length).fill(0)
      )
    )
    const copy = JSON.parse(JSON.stringify(aux))
    // NOTE: traverses all three depths of the array, if groupId, lectionId and day of week match assign it
    lections
      .filter((el) => !el.esReceso)
      .forEach((lection) => {
        lectionsSubjectGroup[lection.id] &&
        lectionsSubjectGroup[lection.id].forEach((item, index) => {
          aux[item.diaSemana - 1] &&
          aux[item.diaSemana - 1].forEach((group, groupIndex) => {
            group.forEach((_, lectionIndex) => {
              if (
                filteredGroups[groupIndex]?.grupoId === item.gruposId &&
                lections[lectionIndex]?.id === item?.leccion_id
              ) {
                copy[item.diaSemana - 1][groupIndex][lectionIndex] = item
              }
            })
          })
        })
      })

    setSchedule(copy)
  }, [filteredGroups, lections, lectionsSubjectGroup])

  return (
    <div ref={(el) => setPrintRef(el)}>
      <Col id='scheduleBody'>
        <h3>{t('expediente_ce>horario>horarios_globales','Horarios globales')}</h3>
        <div className='dropdown-container-width childSeparator' style={{ display: 'flex', opacity: print ? 0 : 1 }}>
          <div className='dropdown-container-item'>
            <span>{t("configuracion>ofertas_educativas>niveles>agregar>nivel", "Nivel")}</span>
            <div className='my-2' style={{ width: '15rem' }}>
              <Select
                placeholder={t('general>placeholder>selecciona_estudiante','Selecciona un nivel')}
                options={levels?.sort((a, b) => a.orden - b.orden).map((el) => ({ label: `${el?.nivelNombre} ${el?.especialidadNombre ? el?.especialidadNombre : ''}`, value: el }))}
                value={selectedLevel ? { label: `${selectedLevel?.nivelNombre} ${selectedLevel?.especialidadNombre ? selectedLevel?.especialidadNombre : ''}`, value: selectedLevel } : null}
                styles={{
                  control: (styles) => ({
                    ...styles,
                    borderRadius: '20px',
                    border: '1px solid #000'
                  }),
                  indicatorSeparator: (styles) => ({ ...styles, display: 'none' })
                }}
                onChange={({ value }) => {
                  setSelectedLevel(value)
                }}
              />
            </div>
          </div>
          <div className='dropdown-container-item'>
            <span>{t("estudiantes>expediente>header>grupo", "Grupo")}</span>
            <div className='my-2' style={{ width: '15rem' }}>
              <Select
                placeholder={t('general>placeholder>selecciona_grupo','Selecciona un grupo')}
                noOptionsMessage={() => t("general>no_opt", "Sin opciones")}
                options={groups.map((el) => ({ label: `${el?.grupo} ${el?.especialidadNombre ? el?.especialidadNombre : ''}`, value: el }))}
                value={filteredGroups[0]?.grupo ? { label: `${filteredGroups[0]?.grupo} ${filteredGroups[0]?.especialidadNombre ? filteredGroups[0]?.especialidadNombre : ''}`, value: filteredGroups[0] } : { label: '', value: null }}
                styles={{
                  control: (styles) => ({
                    ...styles,
                    borderRadius: '20px',
                    border: '1px solid #000'
                  }),
                  indicatorSeparator: (styles) => ({ ...styles, display: 'none' })
                }}
                onChange={({ value }) => {
                  setFilteredGroups([value])
                }}
              />
            </div>
          </div>
        </div>
        <Container>
          <div className='d-flex justify-content-between w-100 align-items-center my-3'>
            <h4>{t('expediente_ce>horario>detalle_horario_global','Detalle horario global')}</h4>
            <ReactToPrint
              trigger={() => (
                <Button
                  color='primary'
                >
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
          <div style={{ display: 'flex', width: '100%' }}>
            <div>
              <p className='generic-schedule__column-header'>
                {t( "estudiantes>expediente>header>grupo", "Grupo")}
              </p>
              <div style={{ height: '6rem', border: '1px solid #eaeaea' }} />
              {
                filteredGroups.map((el) => (
                  <p className='generic-schedule__row-content' key={el?.grupoId}>
                    {el.grupo}
                  </p>
                ))
              }
              {
                filteredGroups.length === 0 && (
                  <p className='generic-schedule__row-content' />
                )
              }
            </div>
            <div style={{ width: '100%', overflow: 'scroll' }}>
              <table style={{ minWidth: '50rem' }}>
                <thead>
                  <tr>
                    {
                          days.map((day) => (
                            <th key={day} className='generic-schedule__column-header'>
                              {day}
                            </th>
                          ))
                        }
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {
                            days.map((day, dayIndex) => (
                              <td style={{ padding: 0, height: 'auto' }} key={dayIndex}>
                                <ScheduleTable style={{ width: '100%' }}>
                                  <thead>
                                    <tr>
                                      {
                                      lections.filter(lection => !lection.esReceso).map((lection, index) => {
                                        return (
                                          <td scope='col' style={{ borderRadius: '0', height: 'auto', color: '#fff', textAlign: 'center' }} key={index}>
                                            {lection?.orden}
                                          </td>
                                        )
                                      })
                                    }
                                    </tr>
                                  </thead>
                                  <tbody style={{ width: '100%' }}>
                                    <tr>
                                      {
                                      lections.filter(lection => !lection.esReceso).map((lection, index) => (
                                        <td
                                          style={{ height: '2rem', padding: 0, textAlign: 'center', width: `${100 / lections.filter(lection => !lection.esReceso).length - 1}%` }}
                                          key={`${lection.orden}-${index}`}
                                        >
                                          <p style={{ margin: 0 }}>{moment(lection.horaInicio).format('HH:mm')}</p>
                                          <p style={{ margin: 0 }}>a</p>
                                          <p style={{ margin: 0 }}>{moment(lection.horaFin).format('HH:mm')}</p>
                                        </td>
                                      ))
                                    }
                                    </tr>
                                    {schedule[dayIndex] && schedule[dayIndex].map((group, groupIndex) => (
                                      <tr key={`${dayIndex}-${groupIndex}`} style={{ width: 'auto' }}>
                                        {group.map((item, lectionIndex) => {
                                          return item !== 0
                                            ? (
                                              <Tooltip
                                                title={(
                                                  <>
                                                    <p>{t("configuracion>mallas_curriculares>columna_asignatura_figura_afin", "Asignatura/figura afín")}: {item?.nombreAsignatura}</p>
                                                    <p>{t("estudiantes>expediente>header>grupo", "Grupo")}: {item?.nombreGrupo}</p>
                                                    <p>{t("expediente_ce>horario>docente_titular", "Docente titular")}: {item?.profesorNombre} {item?.profesorprimerApellido}</p>
                                                  </>
                                            )}
                                                key={`${dayIndex}-${lectionIndex}`}
                                              >
                                                <td
                                                  colSpan={item.columns}
                                                  className='text-center'
                                                  style={{ color: '#000', height: '3.5rem', border: '1px solid #eaeaea' }}
                                                >
                                                  {
                                                item?.asignaturAbreviatura ||
                                                item?.nombreAsignatura
                                              }
                                                </td>
                                              </Tooltip>
                                              )
                                            : <td style={{ color: '#000', height: '3.5rem', border: '1px solid #eaeaea' }} />
                                        })}
                                      </tr>
                                    ))}
                                  </tbody>
                                </ScheduleTable>
                              </td>
                            ))
                          }
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </Col>
    </div>
  )
}

const CustomDropdown = styled(DropdownToggle)`
  &:hover,
  &:active,
  &:focus {
    background-color: #145388 !important;
    color: #fff !important;
}`

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  height: auto;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  padding: 1rem;
  overflow: hidden;
`

const ScheduleTable = styled.table`
  border-collapse: collapse;

  & > thead > tr > td {
    background-color: #2A93D5;
    padding: .5rem 1.5rem;
  }
`

export default ScheduleGlobal
