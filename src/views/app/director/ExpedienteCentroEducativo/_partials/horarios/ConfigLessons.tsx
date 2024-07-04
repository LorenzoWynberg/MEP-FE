import React, { useEffect, useState } from 'react'
import { Card, CardBody, CustomInput, Button } from 'reactstrap'
import { Edit, Delete } from '@material-ui/icons'
import ModalsConfigLessons from './ModalsConfigLessons'
import moment from 'moment'
import useNotification from 'Hooks/useNotification'
import { useActions } from 'Hooks/useActions'
import { useSelector } from 'react-redux'
import { setCurrentLection } from '../../../../../../redux/lecciones/actions'
import ReactToPrint from 'react-to-print'
import { useTranslation } from 'react-i18next'

const ConfigLessons = ({ isWeekend, setIsWeekend, currentOffer }) => {
  const [openModal, setOpenModal] = useState<
		| 'editLection'
		| 'deleteLection'
		| 'addLection'
		| 'addBreakTime'
		| 'editBreakTime'
		| ''
	>('')
  const [selectedLection, setSelectedLection] = useState<any>(null)
  const [snackbar, handleClick] = useNotification()
  const [snackbarContent, setSnackbarContent] = useState({
    msg: '',
    variant: ''
  })
  const { currentSchedule } = useSelector((state) => state.horarios)
  const { lections, currentLection } = useSelector((state) => state.lecciones)
  const [printRef, setPrintRef] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [print, setPrint] = useState(false)
  const { t } = useTranslation()
  const calculateTime = (time1, time2) => {
    const timeStart = moment(time1)
    const timeEnd = moment(time2)
    const diff = timeEnd.diff(timeStart)
    const duration = moment.duration(diff)
    return `${duration.hours() ? `${duration.hours()} h` : ''} ${
			duration.minutes() ? `${duration.minutes()} min` : ''
		}`
  }
  const showSnackbar = (msg, variant) => {
    setSnackbarContent({ msg, variant })
    handleClick()
  }

  const actions = useActions({
    setCurrentLection
  })

  useEffect(() => {
    if (currentSchedule?.id) {
      setIsWeekend(currentSchedule?.finDeSemana || false)
    }
  }, [currentSchedule])

  return (
    <div>
      {snackbar(snackbarContent.variant, snackbarContent.msg)}
      <ModalsConfigLessons
        currentOffer={currentOffer}
        isWeekend={isWeekend}
        openModal={openModal}
        toggle={() => {
				  setOpenModal('')
				  setSelectedLection(null)
				  actions.setCurrentLection(null)
        }}
        onSubmit={async (data) => {
				  const startAt = moment(data.startAt, 'HH:mm').format('YYYY-MM-DD H:mm')
				  const endAt = moment(data.endAt, 'HH:mm').format('YYYY-MM-DD H:mm')
				  const breakTimeStartAt = moment(data.breakTimeStartAt, 'HH:mm').format('YYYY-MM-DD H:mm')
				  const breakTimeEndAt = moment(data.breakTimeEndAt, 'HH:mm').format('YYYY-MM-DD H:mm')
				  let editStartAt =
						moment(data.editStartAt).format('YYYY-MM-DD H:mm') !==
						'Invalid date'
						  ? moment(data.editStartAt).format('YYYY-MM-DD H:mm')
						  : moment(data.editStartAt, 'HH:mm').format(
						    'YYYY-MM-DD H:mm'
							  )
				  let editEndAt =
						moment(data.editEndAt).format('YYYY-MM-DD H:mm') !==
						'Invalid date'
						  ? moment(data.editEndAt).format('YYYY-MM-DD H:mm')
						  : moment(data.editEndAt, 'HH:mm').format(
						    'YYYY-MM-DD H:mm'
							  )

				  editStartAt = editStartAt !== 'Invalid date' ? editStartAt : data.editStartAt
				  editEndAt = editEndAt !== 'Invalid date' ? editEndAt : data.editEndAt
				  const setDateTime = (d: Date | string) => {
				    const oldDate = new Date(d)
				    const _date = new Date()
				    let newDate = null
				    newDate = new Date(
				      oldDate.setFullYear(_date.getFullYear())
				    )
				    newDate = new Date(newDate.setMonth(_date.getMonth()))
				    return new Date(newDate.setDate(_date.getDate()))
				  }
				  if (openModal === 'addLection') {
            let graterThanMaxDate = false
            lections.forEach((cur) => {
              const firstValidation = setDateTime(startAt) < setDateTime(cur.horaInicio) || setDateTime(startAt) < setDateTime(cur.horaFin)
              const secondValidation = setDateTime(endAt) > setDateTime(cur.horaInicio) || setDateTime(endAt) > setDateTime(cur.horaFin)
              if (firstValidation && secondValidation) {
                  graterThanMaxDate = true
                  return true
              }
            })
            if (graterThanMaxDate) {
              return
            }
				    if (
				      data.lection &&
							data.lectionName &&
							data.endAt &&
							data.startAt &&
							new Date(startAt) < new Date(endAt)
				    ) {
				      setOpenModal('')
				      setSelectedLection(null)
				      return true
				    }

				    if (
				      data.breakTimeName &&
							data.breakTimeStartAt &&
							data.breakTimeEndAt &&
							new Date(breakTimeStartAt) <
								new Date(breakTimeEndAt)
				    ) {
				      setOpenModal('')
				      setSelectedLection(null)
				      return true
				    }
				  }

				  if (
				    openModal === 'editLection' ||
						openModal === 'editBreakTime'
				  ) {
				    const index = lections.findIndex(
				      (el) => el.id === selectedLection.id
				    )
				    const dateStart = setDateTime(editStartAt)
				    const dateEnd = setDateTime(editEndAt)
            let graterThanMaxDate = false
            lections.forEach((cur) => {
              const firstValidation = setDateTime(editStartAt) < setDateTime(cur.horaInicio) || setDateTime(editStartAt) < setDateTime(cur.horaFin)
              const secondValidation = setDateTime(editEndAt) > setDateTime(cur.horaInicio) || setDateTime(editEndAt) > setDateTime(cur.horaFin)
              // debugger
              if (firstValidation && secondValidation) {
                  graterThanMaxDate = true
                  return true
              }
            })
            if (graterThanMaxDate) {
              return
            }
				    if (
				      index !== -1 &&
							data.editLection &&
							data.editLectionName &&
							data.editEndAt &&
							data.editStartAt &&
							new Date(dateStart) < new Date(dateEnd)
				    ) {
				      setOpenModal('')
				      setSelectedLection(null)
				      return true
				    }

				    if (
				      index !== -1 &&
							data.editLectionName &&
							openModal === 'editBreakTime' &&
							data.editEndAt &&
							data.editStartAt &&
							new Date(dateStart) < new Date(dateEnd)
				    ) {
				      setOpenModal('')
				      setSelectedLection(null)
				      return true
				    }
				  }

				  if (openModal === 'deleteLection') {
				    setOpenModal('')
				    setSelectedLection(null)
				    return true
				  }

				  if (openModal === 'addBreakTime') {
            let graterThanMaxDate = false
            lections.forEach((cur) => {
              const firstValidationBreakTime = setDateTime(breakTimeStartAt) < setDateTime(cur.horaInicio) || setDateTime(breakTimeStartAt) < setDateTime(cur.horaFin)
              const secondValidationBreakTime = setDateTime(breakTimeEndAt) > setDateTime(cur.horaInicio) || setDateTime(breakTimeEndAt) > setDateTime(cur.horaFin)
              if (firstValidationBreakTime && secondValidationBreakTime) {
                  graterThanMaxDate = true
                  return true
              }
            })
            if (graterThanMaxDate) {
              return
            }
				    if (
				      data.breakTimeName &&
							data.breakTimeStartAt &&
							data.breakTimeEndAt &&
							new Date(breakTimeStartAt) <
								new Date(breakTimeEndAt)
				    ) {
				      setOpenModal('')
				      setSelectedLection(null)
				      return true
				    }
				  }
        }}
      />
      <h2>
        {t(
				  'expediente_ce>horario>oferta',
				  'Configuración de lecciones'
        )}
      </h2>
      <div className='' ref={(ref) => setPrintRef(ref)}>
        <Card>
          <CardBody>
            <div
              style={{
							  display: 'flex',
							  justifyContent: 'space-between'
              }}
            >
              <CustomInput
                label={t(
								  'expediente_ce>horario>habilitar_s_d',
								  'Habilitar sábado y domingos'
                )}
                type='checkbox'
                checked={isWeekend}
                onClick={() =>
								  setIsWeekend((prevState) => !prevState)}
              />
              <div className='childSeparator'>
                <Button
                  color='primary'
                  onClick={() => setOpenModal('addLection')}
                >
                  {t(
									  'expediente_ce>horario>add_leccion',
									  'Agregar lección'
                  )}
                </Button>
                <Button
                  color='primary'
                  onClick={() => setOpenModal('addBreakTime')}
                >
                  {t(
									  'expediente_ce>horario>add_receso',
									  'Agregar receso'
                  )}
                </Button>
              </div>
            </div>
            <table
              className='mallasTable'
              style={{ width: '100%' }}
            >
              <thead>
                <tr>
                  <td scope='col' />
                  <td scope='col'>
                    {t(
										  'expediente_ce>horario>leccion',
										  'Lección'
                  )}
                  </td>
                  <td scope='col'>
                    {t(
										  'buscador_ce>buscador>columna_nombre',
										  'Nombre'
                  )}
                  </td>
                  <td scope='col'>
                    {t(
										  'supervision_circ>expediente>nav>inicio',
										  'Inicio'
                  )}
                  </td>
                  <td scope='col'>
                    {t(
										  'expediente_ce>horario>finaliza',
										  'Finaliza'
                  )}
                  </td>
                  <td scope='col'>
                    {t(
										  'expediente_ce>horario>tiempo',
										  'Tiempo'
                  )}
                  </td>
                  <td scope='col'>
                    {t('general>acciones', 'Acciones')}
                  </td>
                </tr>
              </thead>
              <tbody>
                {lections.map((item) => (
                  <tr key={item.id}>
                    <td
                    style={{
											  border: '1px solid #eaeaea'
                  }}
                  />
                    <td
                    style={{
											  border: '1px solid #eaeaea'
                  }}
                  >
                    {item.orden || '-'}
                  </td>
                    <td
                    style={{
											  border: '1px solid #eaeaea'
                  }}
                  >
                    {item.nombre}
                  </td>
                    <td
                    style={{
											  border: '1px solid #eaeaea'
                  }}
                  >
                    {moment(item.horaInicio).format(
											  'hh:mm A'
                  )}
                  </td>
                    <td
                    style={{
											  border: '1px solid #eaeaea'
                  }}
                  >
                    {moment(item.horaFin).format(
											  'hh:mm A'
                  )}
                  </td>
                    <td
                    style={{
											  border: '1px solid #eaeaea'
                  }}
                  >
                    {calculateTime(
											  item.horaInicio,
											  item.horaFin
                  )}
                  </td>
                    <td
                    style={{
											  border: '1px solid #eaeaea'
                  }}
                  >
                    <div className='d-flex justify-content-center align-items-center'>
                    <Edit
                    className='mr-2'
                    style={{
													  cursor: 'pointer'
                  }}
                    onClick={() => {
													  setOpenModal(
													    item.esReceso
													      ? 'editBreakTime'
													      : 'editLection'
													  )
													  setSelectedLection(item)
													  actions.setCurrentLection(
													    item
													  )
                  }}
                  />
                    <Delete
                    style={{
													  cursor: 'pointer'
                  }}
                    onClick={() => {
													  setOpenModal(
													    'deleteLection'
													  )
													  setSelectedLection(item)
													  actions.setCurrentLection(
													    item
													  )
                  }}
                  />
                  </div>
                  </td>
                  </tr>
                ))}
                {lections.length === 0 && (
                  <>
                    <tr>
                    <td />
                    <td />
                    <td />
                    <td />
                    <td />
                    <td />
                  </tr>
                  </>
                )}
              </tbody>
            </table>
            {!print && (
              <div className='mt-5'>
                <ReactToPrint
                  trigger={() => (
                    <Button color='primary'>
                    {t(
											  'estudiantes>indentidad_per>imp_doc>imprimir',
											  'Imprimir'
                  )}
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
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default ConfigLessons
