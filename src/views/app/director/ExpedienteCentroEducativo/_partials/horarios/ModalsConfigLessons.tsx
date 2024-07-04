import React, { useState, useEffect } from 'react'
import {
  FormGroup,
  Input,
  Form,
  Label,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button
} from 'reactstrap'
import styled from 'styled-components'
import { useActions } from 'Hooks/useActions'
import {
  addLection,
  deleteLection,
  updateLection
} from '../../../../../../redux/lecciones/actions'
import { addSchedule } from '../../../../../../redux/horarios/actions'
import { useSelector } from 'react-redux'
import DateTime from 'react-datetime'
import moment from 'moment'

import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import TimePicker from '@mui/lab/TimePicker'
import { useTranslation } from 'react-i18next'
import Loader from 'Components/Loader.js'
import swal from 'sweetalert'

const ModalsConfigLessons = ({
  openModal,
  toggle,
  onSubmit,
  currentOffer,
  isWeekend
}) => {
  const { t } = useTranslation()
  const initialState = {
    lection: '',
    lectionName: '',
    startAt: null,
    endAt: null,
    editLection: '',
    editLectionName: '',
    editStartAt: new Date(),
    editEndAt: new Date(),
    breakTimeName: '',
    breakTimeStartAt: null,
    breakTimeEndAt: null,
    isBreakTime: false
  }
  const [data, setData] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const onChange = (e) => {
    if (errors) {
      if (Object.values(errors)?.includes('greaterThanStartAt')) {
        const key = Object.keys(errors).find((el) =>
          el.toLowerCase().includes('startat')
        )
        setErrors({
          ...errors,
          [key]: false
        })
        setData({ ...data, [e.target.name]: e.target.value })
        return
      }
    }
    setErrors({
      ...errors,
      [e.target.name]: false
    })
    setData({ ...data, [e.target.name]: e.target.value })
  }
  const [errors, setErrors] = useState(null)
  const { currentSchedule } = useSelector((state) => state.horarios)
  const { currentLection, lections } = useSelector((state) => state.lecciones)
  const actions = useActions({
    addLection,
    addSchedule,
    updateLection,
    deleteLection
  })

  useEffect(() => {
    if (currentLection?.nombre) {
      setData({
        ...data,
        editLection: currentLection.orden,
        editLectionName: currentLection.nombre,
        editStartAt: currentLection.horaInicio,
        editEndAt: currentLection.horaFin
      })
    }
    setLoading(false)
  }, [currentLection])

  const setDateTime = (d: Date | string) => {
    const oldDate = new Date(d)
    const _date = new Date()
    let newDate = null
    newDate = new Date(oldDate.setFullYear(_date.getFullYear()))
    newDate = new Date(newDate.setMonth(_date.getMonth()))
    return new Date(newDate.setDate(_date.getDate()))
  }

  const createLection = async () => {
    let res
    const startAt = moment(data.startAt, 'HH:mm').format('YYYY-MM-DD H:mm')
    const endAt = moment(data.endAt, 'HH:mm').format('YYYY-MM-DD H:mm')
    const breakTimeStartAt = moment(data.breakTimeStartAt, 'HH:mm').format(
      'YYYY-MM-DD H:mm'
    )
    const breakTimeEndAt = moment(data.breakTimeEndAt, 'HH:mm').format(
      'YYYY-MM-DD H:mm'
    )
    setLoading(true)
    if (new Date(startAt) > new Date(endAt)) {
      setErrors({
        startAt: 'greaterThanStartAt'
      })
      setLoading(false)
      return
    }
    if (new Date(breakTimeStartAt) > new Date(breakTimeEndAt)) {
      setErrors({
        breakTimeStartAt: 'greaterThanStartAt'
      })
      setLoading(false)
      return
    }

    if (
      (!data.lection ||
				!data.lectionName ||
				!data.endAt ||
				!data.startAt) &&
			openModal === 'addLection'
    ) {
      setErrors({
        lection: !data.lection,
        lectionName: !data.lectionName,
        endAt: !data.endAt,
        startAt: !data.startAt
      })
      setLoading(false)
      return
    }
    let graterThanMaxDate = false
    lections.forEach((cur) => {
      const firstValidation = setDateTime(startAt) < setDateTime(cur.horaInicio) || setDateTime(startAt) < setDateTime(cur.horaFin)
      const secondValidation = setDateTime(endAt) > setDateTime(cur.horaInicio) || setDateTime(endAt) > setDateTime(cur.horaFin)
      if (firstValidation && secondValidation) {
          setErrors({
            startAt: 'graterThanMaxDate'
          })
          graterThanMaxDate = true
          setLoading(false)
        return
      }
    })
    if (graterThanMaxDate) {
      return
    }
    if (!currentSchedule?.id) {
      res = await actions.addSchedule({
        ofertasPorInstitucionalidadId:
					currentOffer.ofertasPorInstitucionalidadId,
        finDeSemana: isWeekend
      })
    }
    if (!data.breakTimeName && openModal === 'addLection') {
      await actions.addLection({
        orden: data.lection,
        nombre: data.lectionName,
        horaInicio: startAt,
        horaFin: endAt,
        esReceso: false,
        horarioId: currentSchedule?.id || res?.data?.id
      })
      setLoading(false)
      setData(initialState)
      return
    }
    if (
      !data.breakTimeName ||
			!data.breakTimeStartAt ||
			!data.breakTimeEndAt
    ) {
      setErrors({
        breakTimeName: !data.breakTimeName,
        breakTimeStartAt: !data.breakTimeStartAt,
        breakTimeEndAt: !data.breakTimeEndAt
      })
      setLoading(false)
      return
    }
    lections.forEach((cur) => {
      const firstValidation = setDateTime(breakTimeStartAt) < setDateTime(cur.horaInicio) || setDateTime(breakTimeStartAt) < setDateTime(cur.horaFin)
      const secondValidation = setDateTime(breakTimeEndAt) > setDateTime(cur.horaInicio) || setDateTime(breakTimeEndAt) > setDateTime(cur.horaFin)
      if (firstValidation && secondValidation) {
          setErrors({
            breakTimeStartAt: 'graterThanMaxDate'
          })
          graterThanMaxDate = true
          setLoading(false)
        return
      }
    })
    if (graterThanMaxDate) {
      return
    }
    await actions.addLection({
      nombre: data.breakTimeName,
      orden: 0,
      horaInicio: moment(data.breakTimeStartAt, 'HH:mm').format(
        'YYYY-MM-DD H:mm'
      ),
      horaFin: moment(data.breakTimeEndAt, 'HH:mm').format(
        'YYYY-MM-DD H:mm'
      ),
      esReceso: true,
      horarioId: currentSchedule?.id || res?.data?.id
    })
    setLoading(false)
    setData(initialState)
  }

  const getDateValue = (val, widthFormat = true) => {
    let newVal =
			moment(val).format('YYYY-MM-DD H:mm') !== 'Invalid date'
			  ? moment(val).format('YYYY-MM-DD H:mm')
			  : moment(val, 'HH:mm').format('YYYY-MM-DD H:mm')
    newVal = newVal !== 'Invalid date' ? newVal : val
    return widthFormat ? moment(newVal).format('HH:mm') : newVal
  }

  const editLection = async () => {
    if (
      (!data.editLection ||
				!data.editLectionName ||
				!data.editEndAt ||
				!data.editStartAt) &&
			openModal === 'editLection'
    ) {
      setErrors({
        editLection: !data.editLection,
        editLectionName: !data.editLectionName,
        editEndAt: !data.editEndAt,
        editStartAt: !data.editStartAt
      })
      return
    }
    setLoading(true)
    const editStartAt = getDateValue(data.editStartAt, false)
    const editEndAt = getDateValue(data.editEndAt, false)
    const dateStart = setDateTime(editStartAt)
    const dateEnd = setDateTime(editEndAt)
    if (new Date(dateStart) > new Date(dateEnd)) {
      setErrors({
        ...errors,
        editStartAt: 'greaterThanStartAt'
      })
      return
    }
    let graterThanMaxDate = false
    lections.forEach((cur) => {
      const firstValidation = setDateTime(editStartAt) < setDateTime(cur.horaInicio) || setDateTime(editStartAt) < setDateTime(cur.horaFin)
      const secondValidation = setDateTime(editEndAt) > setDateTime(cur.horaInicio) || setDateTime(editEndAt) > setDateTime(cur.horaFin)
      if (firstValidation && secondValidation) {
          graterThanMaxDate = true
          setErrors({
            editStartAt: 'graterThanMaxDate'
          })
          setLoading(false)
        return
      }
    })

    if (graterThanMaxDate) {
      return
    }
    if (openModal === 'editBreakTime' && !data?.editLectionName) {
      setErrors({
        ...errors,
        editLectionName: !data.editLectionName
      })
      return
    }
    const req = {
      ...currentLection,
      nombre: data.editLectionName,
      horaInicio:
				moment(data?.editStartAt).format('YYYY-MM-DD H:mm') !==
				'Invalid date'
				  ? moment(data?.editStartAt).format('YYYY-MM-DD H:mm')
				  : data?.editStartAt,
      horaFin:
				moment(data?.editEndAt).format('YYYY-MM-DD H:mm') !==
				'Invalid date'
				  ? moment(data?.editEndAt).format('YYYY-MM-DD H:mm')
				  : data?.editEndAt
    }
    if (data.editLection) {
      req.orden = data.editLection
    }
    if (req.horaInicio > req.horaFin) {
      swal({
        title: 'Error',
        text: t(
          'key',
          'La hora inicial no puede ser mayor a la hora final'
        ),
        icon: 'warning',
        buttons: {
          ok: {
            text: 'Aceptar',
            value: true
          }
        }
      })
      return
    }
    actions.updateLection(req)
    setData(initialState)
  }

  const removeLection = () => {
    actions.deleteLection(currentLection.id)
  }
  const modals = {
    addLection: {
      title: t('expediente_ce>horario>add_leccion', 'Agregar lección'),
      btnTextConfirm: t('general>agregar', 'Agregar'),
      body: (
        <>
          <Form>
            <p>{t('expediente_ce>horario>leccion', 'Lección')}*</p>
            <FormGroup>
              <Input
                type='text'
                id='lection'
                name='lection'
                value={data.lection}
                invalid={errors?.lection}
                onChange={onChange}
                placeholder='4'
              />
              {errors?.lection && (
                <span style={{ color: 'red' }}>
                  {t(
									  'campo_requerido',
									  'Este campo es requerido'
                  )}
                </span>
              )}
            </FormGroup>
            <p>{t('dir_regionales>col_nombre', 'Nombre')}*</p>
            <FormGroup>
              <Input
                type='text'
                id='lectionName'
                name='lectionName'
                value={data.lectionName}
                onChange={onChange}
                invalid={errors?.lectionName}
                placeholder='Lección 4'
              />
              {errors?.lectionName && (
                <span style={{ color: 'red' }}>
                  {t(
									  'campo_requerido',
									  'Este campo es requerido'
                  )}
                </span>
              )}
            </FormGroup>
            <div className='d-flex justify-content-between'>
              <div style={{ fontSize: '0.9rem', width: '45%' }}>
                <Label>
                  {t(
									  'expediente_ce>horario>hora_inicio',
									  'Hora Inicio'
                  )}
                  *
                </Label>
                <Input
                  className='form-control'
                  value={data.startAt}
                  invalid={errors?.startAt}
                  onChange={(date) => {
									  onChange({
									    target: {
									      value: date.target.value,
									      name: 'startAt'
									    }
									  })
                  }}
                  type='time'
                  min='06:00'
                  max='20:00'
                />
                {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <Stack spacing={3}>
                        <TimePicker
                          label="Inicio*"
                          value={data['startAt']}
                          onChange={(date) => {
                            onChange({ target: { value: new Date(date), name: 'startAt' } })
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </Stack>
                    </LocalizationProvider> */}
              </div>
              <div style={{ fontSize: '0.9rem', width: '45%' }}>
                <Label>
                  {t(
									  'expediente_ce>horario>hora_fin',
									  'Hora fin'
                  )}
                  *
                </Label>
                <Input
                  className='form-control'
                  value={data.endAt}
                  onChange={(date) => {
									  onChange({
									    target: {
									      value: date.target.value,
									      name: 'endAt'
									    }
									  })
                  }}
                  invalid={errors?.endAt}
                  type='time'
                  min='06:00'
                  max='20:00'
                />
                {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <Stack spacing={3}>
                        <TimePicker
                          label="Fin*"
                          value={data['endAt']}
                          onChange={(date) => {
                            onChange({ target: { value: new Date(date), name: 'endAt' } })
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </Stack>
                    </LocalizationProvider> */}
              </div>
            </div>
            {((errors?.startAt &&
							typeof errors?.startAt !== 'string') ||
							errors?.endAt) && (
  <span style={{ color: 'red' }}>
    {t(
								  'expediente_ce>horario>nav>conf_lecciones>error>horasrequeridas',
								  'Por favor marque la hora de inicio y la hora final'
    )}
  </span>
            )}
            {errors?.startAt === 'greaterThanStartAt' && (
              <span style={{ color: 'red' }}>
                {t(
								  'expediente_ce>horario>nav>conf_lecciones>error>horainicio',
								  'La hora de inicio no puede ser mayor que la hora final'
                )}
              </span>
            )}
            {errors?.startAt === 'graterThanMaxDate' && (
              <span style={{ color: 'red' }}>
                {t(
								  'expediente_ce>horario>nav>conf_lecciones>error>rango',
								  'La hora de inicio esta en el rango de horas de las demás lecciones'
                )}
              </span>
            )}
          </Form>
        </>
      ),
      handleClick: createLection
    },
    editLection: {
      title: t('expediente_ce>horario>edit_leccion', 'Editar lección'),
      btnTextConfirm: t('general>guardar', 'Guardar'),
      body: (
        <>
          <Form>
            <p>{t('expediente_ce>horario>leccion', 'Lección')}*</p>
            <FormGroup>
              <Input
                type='text'
                id='editLection'
                name='editLection'
                value={data.editLection}
                invalid={errors?.editLection}
                onChange={onChange}
                placeholder='4'
              />
              {errors?.editLection && (
                <span style={{ color: 'red' }}>
                  {t(
									  'campo_requerido',
									  'Este campo es requerido'
                  )}
                </span>
              )}
            </FormGroup>
            <p>
              {t('buscador_ce>buscador>columna_nombre', 'Nombre')}
              *
            </p>
            <FormGroup>
              <Input
                type='text'
                id='editLectionName'
                name='editLectionName'
                value={data.editLectionName}
                invalid={errors?.editLectionName}
                onChange={onChange}
                placeholder='4'
              />
              {errors?.editLectionName && (
                <span style={{ color: 'red' }}>
                  {t(
									  'campo_requerido',
									  'Este campo es requerido'
                  )}
                </span>
              )}
            </FormGroup>
            <div className='d-flex justify-content-between'>
              <div style={{ fontSize: '0.9rem', width: '45%' }}>
                <Label>
                  {t(
									  'expediente_ce>horario>hora_inicio',
									  'Hora Inicio'
                  )}
                  *
                </Label>
                <Input
                  className='form-control'
                  value={getDateValue(data?.editStartAt)}
                  invalid={errors?.editStartAt}
                  onChange={(date) => {
									  onChange({
									    target: {
									      value: date.target.value,
									      name: 'editStartAt'
									    }
									  })
                  }}
                  type='time'
                  min='06:00'
                  max='20:00'
                />
              </div>
              <div style={{ fontSize: '0.9rem', width: '45%' }}>
                <Label>
                  {t(
									  'expediente_ce>horario>hora_fin',
									  'Hora fin'
                  )}
                  *
                </Label>
                <Input
                  className='form-control'
                  value={getDateValue(data?.editEndAt)}
                  invalid={errors?.editEndAt}
                  onChange={(date) => {
									  console.log(date.target.value)
									  onChange({
									    target: {
									      value: date.target.value,
									      name: 'editEndAt'
									    }
									  })
                  }}
                  type='time'
                  min='06:00'
                  max='20:00'
                />
              </div>
            </div>
            {((errors?.editStartAt &&
							typeof errors.editStartAt !== 'string') ||
							errors?.editEndAt) && (
  <span style={{ color: 'red' }}>
    {t(
								  'expediente_ce>horario>nav>conf_lecciones>error>horasrequeridas',
								  'Por favor marque la hora de inicio y la hora final'
    )}
  </span>
            )}
            {errors?.editStartAt === 'greaterThanStartAt' && (
              <span style={{ color: 'red' }}>
                {t(
								  'expediente_ce>horario>nav>conf_lecciones>error>horainicio',
								  'La hora de inicio no puede ser mayor que la hora final'
                )}
              </span>
            )}
            {errors?.editStartAt === 'graterThanMaxDate' && (
              <span style={{ color: 'red' }}>
                {t(
								  'expediente_ce>horario>nav>conf_lecciones>error>rango',
								  'La hora de inicio esta en el rango de horas de las demás lecciones'
                )}
              </span>
            )}
          </Form>
        </>
      ),
      handleClick: editLection
    },
    deleteLection: {
      title: t(
        'expediente_ce>horario>eliminar_leccion',
        'Eliminar lección'
      ),
      btnTextConfirm: t(
        'expediente_ce>horario>si_eliminar',
        'Sí, eliminar'
      ),
      body: (
        <>
          <p>
            {t(
						  'expediente_ce>horario>eliminar_leccion_msj',
						  '¿Está seguro que desea eliminar la lección?'
            )}
          </p>
        </>
      ),
      handleClick: removeLection
    },
    addBreakTime: {
      title: t('expediente_ce>horario>add_receso', 'Agregar receso'),
      btnTextConfirm: t('general>agregar', 'Agregar'),
      body: (
        <>
          <Form>
            <p>
              {t('buscador_ce>buscador>columna_nombre', 'Nombre')}
              *
            </p>
            <FormGroup>
              <Input
                type='text'
                id='breakTimeName'
                name='breakTimeName'
                value={data.breakTimeName}
                invalid={errors?.breakTimeName}
                onChange={onChange}
                placeholder='Receso'
              />
              {errors?.breakTimeName && (
                <span style={{ color: 'red' }}>
                  {t(
									  'campo_requerido',
									  'Este campo es requerido'
                  )}
                </span>
              )}
            </FormGroup>
            <div className='d-flex justify-content-between'>
              <div style={{ fontSize: '0.9rem', width: '45%' }}>
                <Label>
                  {t(
									  'expediente_ce>horario>hora_inicio',
									  'Hora Inicio'
                  )}
                  *
                </Label>
                <Input
                  className='form-control'
                  value={data.breakTimeStartAt}
                  onChange={(date) => {
									  console.log(date.target.value)
									  onChange({
									    target: {
									      value: date.target.value,
									      name: 'breakTimeStartAt'
									    }
									  })
                  }}
                  invalid={errors?.breakTimeStartAt}
                  type='time'
                  min='06:00'
                  max='20:00'
                />
              </div>
              <div style={{ fontSize: '0.9rem', width: '45%' }}>
                <Label>
                  {t(
									  'expediente_ce>horario>hora_fin',
									  'Hora fin'
                  )}
                  *
                </Label>
                <Input
                  className='form-control'
                  value={data.breakTimeEndAt}
                  invalid={errors?.breakTimeEndAt}
                  onChange={(date) => {
									  console.log(date.target.value)
									  onChange({
									    target: {
									      value: date.target.value,
									      name: 'breakTimeEndAt'
									    }
									  })
                  }}
                  type='time'
                  min='06:00'
                  max='20:00'
                />
              </div>
            </div>
            {((errors?.breakTimeStartAt &&
              typeof errors?.breakTimeStartAt !==
              'string') ||
              errors?.breakTimeEndAt) && (
                <span style={{ color: 'red' }}>
                  {t(
                    'expediente_ce>horario>nav>conf_lecciones>error>horasrequeridas',
                    'Por favor marque la hora de inicio y la hora final'
                  )}
                </span>
              )}
            {errors?.breakTimeStartAt === 'greaterThanStartAt' && (
              <span style={{ color: 'red' }}>
                {t(
                  'expediente_ce>horario>nav>conf_lecciones>error>horainicio',
                  'La hora de inicio no puede ser mayor que la hora final'
                )}
              </span>
            )}
            {errors?.breakTimeStartAt === 'graterThanMaxDate' && (
              <span style={{ color: 'red' }}>
                {t(
                  'expediente_ce>horario>nav>conf_lecciones>error>rango',
                  'La hora de inicio esta en el rango de horas de las demás lecciones'
                )}
              </span>
            )}
          </Form>
        </>
      ),
      handleClick: createLection
    },
    editBreakTime: {
      title: t('expediente_ce>horario>editar receso', 'Editar Receso'),
      btnTextConfirm: t('boton>general>confirmar', 'Confirmar'),
      body: (
        <>
          <Form>
            <p>
              {t('buscador_ce>buscador>columna_nombre', 'Nombre')}
            </p>
            <FormGroup>
              <Input
                type='text'
                id='editLectionName'
                name='editLectionName'
                value={data.editLectionName}
                invalid={errors?.editLectionName}
                onChange={onChange}
                placeholder='Receso'
              />
              {errors?.editLectionName && (
                <span style={{ color: 'red' }}>
                  {t(
									  'campo_requerido',
									  'Este campo es requerido'
                  )}
                </span>
              )}
            </FormGroup>
            <div className='d-flex justify-content-between'>
              <div style={{ fontSize: '0.9rem', width: '45%' }}>
                <label>
                  {t(
									  'expediente_ce>horario>hora_inicio',
									  'Hora Inicio'
                  )}
                  :
                </label>
                <Input
                  className='form-control'
                  value={getDateValue(data?.editStartAt)}
                  invalid={errors?.editStartAt}
                  onChange={(date) => {
									  // console.log(date.target.value)
									  onChange({
									    target: {
									      value: date.target.value,
									      name: 'editStartAt'
									    }
									  })
                  }}
                  type='time'
                  min='06:00'
                  max='20:00'
                />
              </div>

              <div style={{ fontSize: '0.9rem', width: '45%' }}>
                <label>
                  {t(
									  'expediente_ce>horario>hora_fin',
									  'Hora fin'
                  )}
                  :
                </label>
                <Input
                  className='form-control'
                  value={getDateValue(data?.editEndAt)}
                  invalid={errors?.editEndAt}
                  onChange={(date) => {
									  // console.log(date.target.value)
									  onChange({
									    target: {
									      value: date.target.value,
									      name: 'editEndAt'
									    }
									  })
                  }}
                  type='time'
                  min='06:00'
                  max='20:00'
                />
              </div>
            </div>
            {((errors?.editStartAt &&
              typeof errors?.editStartAt !==
              'string') ||
              errors?.editEndAt) && (
                <span style={{ color: 'red' }}>
                  {t(
                    'expediente_ce>horario>nav>conf_lecciones>error>horasrequeridas',
                    'Por favor marque la hora de inicio y la hora final'
                  )}
                </span>
              )}
            {errors?.editStartAt === 'greaterThanStartAt' && (
              <span style={{ color: 'red' }}>
                {t(
                  'expediente_ce>horario>nav>conf_lecciones>error>horainicio',
                  'La hora de inicio no puede ser mayor que la hora final'
                )}
              </span>
            )}
            {errors?.editStartAt === 'graterThanMaxDate' && (
              <span style={{ color: 'red' }}>
                {t(
                  'expediente_ce>horario>nav>conf_lecciones>error>rango',
                  'La hora de inicio esta en el rango de horas de las demás lecciones'
                )}
              </span>
            )}
          </Form>
        </>
      ),
      handleClick: editLection
    }
  }
  return (
    <div>
      <CustomModal
        isOpen={openModal.length > 0}
        toggle={() => {
				  toggle()
				  setData(initialState)
				  setErrors(null)
				  setLoading(false)
        }}
        size='md'
        style={{ borderRadius: '10px' }}
        centered='static'
      >
        {loading && (
          <div
            style={{
						  height: '100%',
						  width: '100%',
						  display: 'flex',
						  justifyContent: 'center',
						  alignItems: 'center',
						  backgroundColor: 'rgba(#000, #000, #000, 0.4)'
            }}
          >
            <Loader />
          </div>
        )}
        <ModalHeader>{modals[openModal]?.title}</ModalHeader>
        <ModalBody>{modals[openModal]?.body}</ModalBody>
        <ModalFooter>
          <div className='d-flex justify-content-center align-items-center w-100'>
            <Button
              color='outline-primary'
              className='mr-3'
              onClick={() => {
							  toggle()
							  setErrors(null)
							  setLoading(false)
                setData(initialState)
              }}
            >
              {t('general>cancelar', 'Cancelar')}
            </Button>
            <Button
              color='primary'
              disabled={loading}
              onClick={async () => {
							  await modals[openModal]?.handleClick()

							  const res = await onSubmit({
							    ...data,
							    id: currentLection?.id
							  })
							  if (res) {
							    setErrors(null)
							  }
							  setLoading(false)
              }}
            >
              {modals[openModal]?.btnTextConfirm}
            </Button>
          </div>
        </ModalFooter>
      </CustomModal>
    </div>
  )
}

const CustomModal = styled(Modal)`
	&.modal-dialog {
		box-shadow: unset !important;
	}
	& > div.modal-content {
		border-radius: 10px !important;
	}
`

const CustomDateTime = styled(DateTime)`
	color: #000;
	& > div {
		min-width: 100px;
		top: -40px;
		right: -90px;
	}
`

export default ModalsConfigLessons
