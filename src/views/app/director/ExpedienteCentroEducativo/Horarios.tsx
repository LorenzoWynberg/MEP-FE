import React, { useState, useEffect } from 'react'
import HeaderTab from 'Components/Tab/Header'
import ContentTab from 'Components/Tab/Content'
import { Helmet } from 'react-helmet'
import ConfigLessons from './_partials/horarios/ConfigLessons'
import ConfigSchedules from './_partials/horarios/ConfigSchedules'
import ScheduleGlobal from './_partials/horarios/ScheduleGlobal'
import {
  DropdownToggle,
  Dropdown,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import styled from 'styled-components'
import ProfessorSchedule from './_partials/horarios/ProfessorSchedule'
import GroupSchedule from './_partials/horarios/GroupSchedule'
import SubjectSchedule from './_partials/horarios/SubjectSchedule'
import StudentSchedule from './_partials/horarios/StudentSchedule'
import { useActions } from 'Hooks/useActions'
import { useSelector } from 'react-redux'
import { getCenterOffersByYear } from '../../../../redux/expedienteCentro/actions'
import {
  addLection,
  getLectionsByOfertaInstitucionalidadId
} from '../../../../redux/lecciones/actions'
import {
  getSingleSchedule,
  addSchedule,
  setCurrentSchedule,
  updateSchedule
} from '../../../../redux/horarios/actions'
import { getModelosOfertasAssigned } from '../../../../redux/ofertasInstitucion/actions'
import { getGroupsByOffers } from '../../../../redux/grupos/actions'
import { getAllSubjectGroupByGroupId } from 'Redux/AsignaturaGrupo/actions'
import { getLectionsSubjectGroupByLectionsIds } from '../../../../redux/LeccionAsignaturaGrupo/actions'
import { useTranslation } from 'react-i18next'
interface IProps {}

const Horarios = (props: IProps) => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState(0)
  const [dropdownOpen, setDropDownOpen] = useState<'' | 'oferta'>('')
  const { currentInstitution } = useSelector((state) => state.authUser)
  const { currentSchedule } = useSelector((state) => state.horarios)
  const { offersAssigned } = useSelector((state) => state.ofertasInstitucion)
  const { lections } = useSelector((state) => state.lecciones)
  const [currentOffer, setCurrentOffer] = useState<any>({})
  const [isWeekend, setIsWeekend] = useState(false)

  const actions = useActions({
    getCenterOffersByYear,
    getLectionsByOfertaInstitucionalidadId,
    getSingleSchedule,
    addLection,
    addSchedule,
    getModelosOfertasAssigned,
    setCurrentSchedule,
    updateSchedule,
    getGroupsByOffers,
    getAllSubjectGroupByGroupId,
    getLectionsSubjectGroupByLectionsIds
  })

  const toggleDropdown = (dropdown: '' | 'oferta') => {
    if (dropdownOpen) {
      setDropDownOpen(null)
    } else {
      setDropDownOpen(dropdown)
    }
  }

  const optionsTab = [
    t('expediente_ce>horario>nav>conf_lecciones', 'Configuración de lecciones'),
    t('expediente_ce>horario>nav>conf_horarios', 'Configuración de horarios'),
    t('expediente_ce>horario>nav>horario_global', 'Horario global'),
    t('expediente_ce>horario>nav>horario_docente', 'Horario por docente'),
    t('expediente_ce>horario>nav>expediente_ce>horario>nav>horario_grupo', 'Horario por grupo'),
    t('expediente_ce>horario>nav>horario_asignatura', 'Horario por asignatura/figura afín'),
    t('expediente_ce>horario>nav>horario_estudiante', 'Horario por estudiante')
  ]

  const [days, setDays] = useState([
    t('expediente_ce>horario>dias>lunes', 'Lunes'),
    t('expediente_ce>horario>dias>martes', 'Martes'),
    t('expediente_ce>horario>dias>miercoles', 'Miércoles'),
    t('expediente_ce>horario>dias>jueves', 'Jueves'),
    t('expediente_ce>horario>dias>viernes', 'Viernes')
  ])

  useEffect(() => {
    if (isWeekend) {
      setDays([
        t('expediente_ce>horario>dias>lunes', 'Lunes'),
        t('expediente_ce>horario>dias>martes', 'Martes'),
        t('expediente_ce>horario>dias>miercoles', 'Miércoles'),
        t('expediente_ce>horario>dias>jueves', 'Jueves'),
        t('expediente_ce>horario>dias>viernes', 'Viernes'),
        t('expediente_ce>horario>dias>sabado', 'Sábado'),
        t('expediente_ce>horario>dias>domingo', 'Domingo')
      ])
    }

    if (!isWeekend) {
      setDays([
        t('expediente_ce>horario>dias>lunes', 'Lunes'),
        t('expediente_ce>horario>dias>martes', 'Martes'),
        t('expediente_ce>horario>dias>miercoles', 'Miércoles'),
        t('expediente_ce>horario>dias>jueves', 'Jueves'),
        t('expediente_ce>horario>dias>viernes', 'Viernes')
      ])
    }
  }, [isWeekend, t])

  useEffect(() => {
    if (currentInstitution?.id) {
      actions.getModelosOfertasAssigned(currentInstitution.id)
    }
  }, [currentInstitution])

  useEffect(() => {
    if (offersAssigned.length > 0) {
      setCurrentOffer(offersAssigned[0])
    }
  }, [offersAssigned])

  useEffect(() => {
    if (currentOffer?.ofertasPorInstitucionalidadId) {
      actions.getLectionsByOfertaInstitucionalidadId(
        currentOffer?.ofertasPorInstitucionalidadId
      )
      actions.getGroupsByOffers(currentInstitution?.id, currentOffer?.id)
    }
  }, [currentOffer, currentInstitution])

  useEffect(() => {
    if (lections.length > 0) {
      actions.getLectionsSubjectGroupByLectionsIds(
        lections.map((lection) => lection.id)
      )
      actions.getSingleSchedule(lections[0]?.horarioId)
    }
    if (lections.length === 0 && currentSchedule?.id) {
      actions.setCurrentSchedule(null)
    }
  }, [lections])

  useEffect(() => {
    if (currentSchedule?.id && currentSchedule.finDeSemana !== isWeekend) {
      actions.updateSchedule({
        ...currentSchedule,
        finDeSemana: isWeekend
      })
    }
  }, [isWeekend])

  return (
    <>
      <Helmet>
        <title>{t('expediente_ce>horario>titulo', 'Horarios')}</title>
      </Helmet>
      <br />

      <h2>{t('expediente_ce>horario>titulo', 'Horarios')}</h2>
      <div
        className='dropdown-container-width childSeparator'
        style={{ display: 'flex' }}
      >
        <div className='dropdown-container-item'>
          <span>{t('expediente_ce>horario>oferta', 'Oferta')}</span>
          <CustomDropdown
            isOpen={dropdownOpen === 'oferta'}
            toggle={() =>
              toggleDropdown(dropdownOpen === 'oferta' ? '' : 'oferta')}
          >
            <CustomDropdownToggle
              caret
              color='light'
              style={{
                border: '1px solid #8e9599',
                backgroundColor: 'transparent'
              }}
            >
              {currentOffer?.nombre || 'No elegido'}
            </CustomDropdownToggle>
            <DropdownMenu>
              {offersAssigned.map((offer) => (
                <DropdownItem
                  key={`oferta-${offer.id}`}
                  onClick={() => setCurrentOffer(offer)}
                >
                  {offer.nombre}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </CustomDropdown>
        </div>
      </div>
      <HeaderTab
        options={optionsTab}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <ContentTab activeTab={activeTab} numberId={activeTab}>
        {activeTab === 0 && (
          <ConfigLessons
            isWeekend={isWeekend}
            setIsWeekend={setIsWeekend}
            currentOffer={currentOffer}
          />
        )}
        {activeTab === 1 && <ConfigSchedules days={days} />}
        {activeTab === 2 && (
          <ScheduleGlobal days={days} currentOffer={currentOffer} />
        )}
        {activeTab === 3 && <ProfessorSchedule days={days} />}
        {activeTab === 4 && <GroupSchedule days={days} />}
        {activeTab === 5 && (
          <SubjectSchedule days={days} currentOffer={currentOffer} />
        )}
        {activeTab === 6 && (
          <StudentSchedule days={days} currentOffer={currentOffer} />
        )}
      </ContentTab>
    </>
  )
}

const CustomDropdownToggle = styled(DropdownToggle)`
  text-overflow: ellipsis;
  overflow-x: hidden;
  &:hover,
  &:active,
  &:focus {
    background-color: #145388 !important;
    color: #fff !important;
  }
`

const CustomDropdown = styled(Dropdown)`
  text-overflow: ellipsis;
`

export default Horarios
